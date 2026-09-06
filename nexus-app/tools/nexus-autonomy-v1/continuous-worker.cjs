"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const {
  runOne
} = require("./queue-runner.cjs");

const RUNTIME =
  path.join(
    process.env.LOCALAPPDATA || "",
    "NEXUS",
    "autonomy-v1"
  );

const QUEUE_PARENT =
  path.join(
    RUNTIME,
    "queues"
  );

const CONTINUOUS_ACTIVATION_TOKEN =
  "OWNER_APPROVED_CONTINUOUS_AUTONOMY_V1";

const KNOWN_RESULTS =
  new Set([
    "IDLE",
    "PATCH_READY",
    "WAIT_OWNER",
    "STOP"
  ]);

function fail(reason){
  throw new Error(reason);
}

function sleep(ms){
  return new Promise(
    resolve =>
      setTimeout(resolve,ms)
  );
}

function validateQueueRoot(value){
  if(
    typeof value !== "string" ||
    value.length === 0 ||
    !path.isAbsolute(value)
  ){
    fail("QUEUE_ROOT_INVALID");
  }

  const parent =
    path.resolve(QUEUE_PARENT);

  const root =
    path.resolve(value);

  const rel =
    path.relative(parent,root);

  if(
    rel.length === 0 ||
    rel.startsWith("..") ||
    path.isAbsolute(rel)
  ){
    fail(
      "QUEUE_ROOT_OUTSIDE_RUNTIME_BOUNDARY"
    );
  }

  return root;
}

function validateOptions(options){
  if(
    !options ||
    typeof options !== "object" ||
    Array.isArray(options)
  ){
    fail(
      "WORKER_OPTIONS_INVALID"
    );
  }

  if(
    typeof options.repoRoot !== "string" ||
    !path.isAbsolute(options.repoRoot)
  ){
    fail(
      "REPO_ROOT_INVALID"
    );
  }

  const queueRoot =
    validateQueueRoot(
      options.queueRoot
    );

  if(
    !Number.isInteger(options.intervalMs) ||
    options.intervalMs < 250 ||
    options.intervalMs > 300000
  ){
    fail(
      "WORKER_INTERVAL_INVALID"
    );
  }

  if(
    !Number.isInteger(options.heartbeatMs) ||
    options.heartbeatMs < 100 ||
    options.heartbeatMs > 60000
  ){
    fail(
      "WORKER_HEARTBEAT_INVALID"
    );
  }

  if(
    !Number.isInteger(options.leaseTimeoutMs) ||
    options.leaseTimeoutMs <
      options.heartbeatMs * 3 ||
    options.leaseTimeoutMs >
      600000
  ){
    fail(
      "WORKER_LEASE_TIMEOUT_INVALID"
    );
  }

  if(options.stopOnTaskStop !== true){
    fail(
      "STOP_ON_TASK_STOP_REQUIRED"
    );
  }

  if(
    options.mode !== "bounded" &&
    options.mode !== "continuous"
  ){
    fail(
      "WORKER_MODE_INVALID"
    );
  }

  if(options.mode === "bounded"){
    if(
      !Number.isInteger(options.maxCycles) ||
      options.maxCycles < 1 ||
      options.maxCycles > 1000
    ){
      fail(
        "BOUNDED_MAX_CYCLES_INVALID"
      );
    }
  }

  if(options.mode === "continuous"){
    if(
      options.activationToken !==
        CONTINUOUS_ACTIVATION_TOKEN
    ){
      fail(
        "CONTINUOUS_ACTIVATION_TOKEN_REQUIRED"
      );
    }

    if(
      options.maxCycles !== undefined
    ){
      fail(
        "CONTINUOUS_MAX_CYCLES_FORBIDDEN"
      );
    }
  }

  return Object.freeze({
    repoRoot:
      path.resolve(options.repoRoot),

    queueRoot,

    intervalMs:
      options.intervalMs,

    heartbeatMs:
      options.heartbeatMs,

    leaseTimeoutMs:
      options.leaseTimeoutMs,

    stopOnTaskStop:true,

    mode:
      options.mode,

    maxCycles:
      options.mode === "bounded"
        ? options.maxCycles
        : null
  });
}

function lockPaths(queueRoot){
  return {
    lock:
      path.join(
        queueRoot,
        ".continuous-worker.lock"
      ),

    leaseA:
      path.join(
        queueRoot,
        ".continuous-worker.lease-a"
      ),

    leaseB:
      path.join(
        queueRoot,
        ".continuous-worker.lease-b"
      )
  };
}

function writeLeaseSlot(
  file,
  record
){
  const candidate =
    file +
    "." +
    record.token +
    ".candidate";

  fs.writeFileSync(
    candidate,
    JSON.stringify(record) + "\n",
    {
      encoding:"utf8",
      flag:"wx"
    }
  );

  if(fs.existsSync(file)){
    fs.rmSync(
      file,
      {force:false}
    );
  }

  fs.renameSync(
    candidate,
    file
  );
}

function acquireLock(
  queueRoot,
  leaseTimeoutMs
){
  fs.mkdirSync(
    queueRoot,
    {recursive:true}
  );

  const paths =
    lockPaths(queueRoot);

  const token =
    crypto.randomBytes(24)
      .toString("hex");

  const createdAt =
    new Date().toISOString();

  let fd;

  try{
    fd =
      fs.openSync(
        paths.lock,
        "wx"
      );
  }
  catch(error){
    if(error?.code === "EEXIST"){
      fail(
        "WORKER_LOCK_EXISTS"
      );
    }

    throw error;
  }

  try{
    fs.writeFileSync(
      fd,
      JSON.stringify({
        schema:
          "nexus.autonomy.worker-lock.v2",

        token,
        pid:process.pid,
        createdAt,
        leaseTimeoutMs
      }) + "\n",
      "utf8"
    );
  }
  finally{
    fs.closeSync(fd);
  }

  return {
    ...paths,
    token,
    pid:process.pid,
    sequence:0,
    leaseTimeoutMs
  };
}

function heartbeat(lock){
  lock.sequence++;

  const record = {
    schema:
      "nexus.autonomy.worker-lease.v1",

    token:
      lock.token,

    pid:
      lock.pid,

    sequence:
      lock.sequence,

    heartbeatAt:
      new Date().toISOString()
  };

  const target =
    lock.sequence % 2 === 0
      ? lock.leaseA
      : lock.leaseB;

  writeLeaseSlot(
    target,
    record
  );
}

function releaseLock(lock){
  if(!lock){
    return;
  }

  if(fs.existsSync(lock.lock)){
    const record =
      JSON.parse(
        fs.readFileSync(
          lock.lock,
          "utf8"
        )
      );

    if(record.token !== lock.token){
      fail(
        "WORKER_LOCK_OWNERSHIP_LOST"
      );
    }

    fs.rmSync(
      lock.lock,
      {force:false}
    );
  }

  for(
    const file
    of [
      lock.leaseA,
      lock.leaseB
    ]
  ){
    if(fs.existsSync(file)){
      fs.rmSync(
        file,
        {force:false}
      );
    }
  }
}

async function runWorker(options){
  const cfg =
    validateOptions(options);

  const stopPath =
    path.join(
      cfg.queueRoot,
      ".continuous-worker.stop"
    );

  const lock =
    acquireLock(
      cfg.queueRoot,
      cfg.leaseTimeoutMs
    );

  let cycles=0;
  let lastResult=null;
  let stopReason=null;
  let heartbeatError=null;

  heartbeat(lock);

  const timer =
    setInterval(
      () => {
        try{
          heartbeat(lock);
        }
        catch(error){
          heartbeatError =
            error;
        }
      },
      cfg.heartbeatMs
    );

  timer.unref?.();

  try{
    while(true){
      if(heartbeatError){
        throw heartbeatError;
      }

      if(fs.existsSync(stopPath)){
        stopReason =
          "STOP_REQUESTED";
        break;
      }

      const result =
        runOne(
          cfg.repoRoot,
          cfg.queueRoot
        );

      if(
        !result ||
        typeof result.status !== "string" ||
        !KNOWN_RESULTS.has(result.status)
      ){
        stopReason =
          "UNKNOWN_QUEUE_RESULT";
        break;
      }

      cycles++;
      lastResult=result;

      if(
        result.status === "STOP" &&
        cfg.stopOnTaskStop
      ){
        stopReason =
          "TASK_STOP";
        break;
      }

      if(
        cfg.mode === "bounded" &&
        cycles >= cfg.maxCycles
      ){
        stopReason =
          "BOUNDED_COMPLETE";
        break;
      }

      await sleep(
        cfg.intervalMs
      );
    }

    return Object.freeze({
      status:"WORKER_STOPPED",
      mode:cfg.mode,
      cycles,
      stopReason,
      lastResult
    });
  }
  finally{
    clearInterval(timer);
    releaseLock(lock);
  }
}

module.exports = Object.freeze({
  CONTINUOUS_ACTIVATION_TOKEN,
  QUEUE_PARENT,
  runWorker
});
