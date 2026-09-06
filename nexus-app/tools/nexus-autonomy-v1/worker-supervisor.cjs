"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

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

function fail(reason){
  throw new Error(reason);
}

function validateQueueRoot(value){
  if(
    typeof value !== "string" ||
    !path.isAbsolute(value)
  ){
    fail(
      "QUEUE_ROOT_INVALID"
    );
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

function shaBytes(bytes){
  return crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");
}

function safeJson(file){
  try{
    return {
      ok:true,
      bytes:
        fs.readFileSync(file),
      value:
        JSON.parse(
          fs.readFileSync(
            file,
            "utf8"
          )
        )
    };
  }
  catch(error){
    return {
      ok:false,
      error:
        String(
          error?.message ||
          error
        )
    };
  }
}

function processLiveness(pid){
  if(
    !Number.isInteger(pid) ||
    pid <= 0
  ){
    return "UNKNOWN";
  }

  try{
    process.kill(pid,0);
    return "ALIVE";
  }
  catch(error){
    if(error?.code === "ESRCH"){
      return "DEAD";
    }

    return "UNKNOWN";
  }
}

function inspect(queueRoot){
  const root =
    validateQueueRoot(queueRoot);

  const lockPath =
    path.join(
      root,
      ".continuous-worker.lock"
    );

  const stopPath =
    path.join(
      root,
      ".continuous-worker.stop"
    );

  const leasePaths = [
    path.join(
      root,
      ".continuous-worker.lease-a"
    ),
    path.join(
      root,
      ".continuous-worker.lease-b"
    )
  ];

  if(!fs.existsSync(lockPath)){
    return Object.freeze({
      status:"NO_LOCK",
      root
    });
  }

  if(fs.existsSync(stopPath)){
    return Object.freeze({
      status:"OWNER_STOP_PRESENT",
      root
    });
  }

  const lock =
    safeJson(lockPath);

  if(
    !lock.ok ||
    lock.value?.schema !==
      "nexus.autonomy.worker-lock.v2" ||
    typeof lock.value.token !== "string" ||
    !Number.isInteger(lock.value.pid) ||
    !Number.isInteger(
      lock.value.leaseTimeoutMs
    )
  ){
    return Object.freeze({
      status:"MALFORMED_LOCK",
      root
    });
  }

  const liveness =
    processLiveness(
      lock.value.pid
    );

  if(liveness === "ALIVE"){
    return Object.freeze({
      status:"ACTIVE_PID",
      root,
      pid:lock.value.pid
    });
  }

  if(liveness !== "DEAD"){
    return Object.freeze({
      status:"PID_LIVENESS_UNKNOWN",
      root,
      pid:lock.value.pid
    });
  }

  const validLeases=[];

  for(
    const file
    of leasePaths
  ){
    if(!fs.existsSync(file)){
      continue;
    }

    const lease =
      safeJson(file);

    if(
      !lease.ok ||
      lease.value?.schema !==
        "nexus.autonomy.worker-lease.v1" ||
      lease.value.token !==
        lock.value.token ||
      lease.value.pid !==
        lock.value.pid ||
      !Number.isInteger(
        lease.value.sequence
      ) ||
      typeof lease.value.heartbeatAt !==
        "string"
    ){
      continue;
    }

    const time =
      Date.parse(
        lease.value.heartbeatAt
      );

    if(!Number.isFinite(time)){
      continue;
    }

    validLeases.push({
      file,
      bytes:lease.bytes,
      value:lease.value,
      time
    });
  }

  if(validLeases.length === 0){
    return Object.freeze({
      status:"LEASE_UNVERIFIABLE",
      root
    });
  }

  validLeases.sort(
    (a,b) =>
      b.value.sequence -
      a.value.sequence
  );

  const latest =
    validLeases[0];

  const ageMs =
    Date.now() -
    latest.time;

  if(ageMs < 0){
    return Object.freeze({
      status:"LEASE_TIME_IN_FUTURE",
      root,
      ageMs
    });
  }

  if(
    ageMs <
      lock.value.leaseTimeoutMs
  ){
    return Object.freeze({
      status:"LEASE_NOT_EXPIRED",
      root,
      ageMs,
      leaseTimeoutMs:
        lock.value.leaseTimeoutMs
    });
  }

  return Object.freeze({
    status:"RECOVERABLE_STALE_LOCK",
    root,
    ageMs,
    leaseTimeoutMs:
      lock.value.leaseTimeoutMs
  });
}

function recoverStaleLock(queueRoot){
  const initial =
    inspect(queueRoot);

  if(
    initial.status !==
      "RECOVERABLE_STALE_LOCK"
  ){
    return initial;
  }

  const root =
    initial.root;

  /*
    Reinspect immediately before mutation.
  */
  const confirm =
    inspect(root);

  if(
    confirm.status !==
      "RECOVERABLE_STALE_LOCK"
  ){
    return Object.freeze({
      status:
        "RECOVERY_RECHECK_DENIED",
      observed:
        confirm.status
    });
  }

  const lockPath =
    path.join(
      root,
      ".continuous-worker.lock"
    );

  const leaseA =
    path.join(
      root,
      ".continuous-worker.lease-a"
    );

  const leaseB =
    path.join(
      root,
      ".continuous-worker.lease-b"
    );

  const quarantineRoot =
    path.join(
      root,
      ".recovery-quarantine"
    );

  fs.mkdirSync(
    quarantineRoot,
    {recursive:true}
  );

  const recoveryId =
    "recovery-" +
    Date.now() +
    "-" +
    crypto.randomBytes(8)
      .toString("hex");

  const destination =
    path.join(
      quarantineRoot,
      recoveryId
    );

  fs.mkdirSync(
    destination,
    {recursive:false}
  );

  const moved=[];

  for(
    const file
    of [
      lockPath,
      leaseA,
      leaseB
    ]
  ){
    if(!fs.existsSync(file)){
      continue;
    }

    const bytes =
      fs.readFileSync(file);

    const target =
      path.join(
        destination,
        path.basename(file)
      );

    fs.renameSync(
      file,
      target
    );

    moved.push({
      name:path.basename(file),
      sha256:shaBytes(bytes)
    });
  }

  if(
    fs.existsSync(lockPath)
  ){
    fail(
      "RECOVERY_LOCK_MOVE_FAILED"
    );
  }

  const record = {
    schema:
      "nexus.autonomy.stale-lock-recovery.v1",

    recoveredAt:
      new Date().toISOString(),

    priorStatus:
      confirm.status,

    ageMs:
      confirm.ageMs,

    leaseTimeoutMs:
      confirm.leaseTimeoutMs,

    moved
  };

  fs.writeFileSync(
    path.join(
      destination,
      "recovery-record.json"
    ),
    JSON.stringify(
      record,
      null,
      2
    ) + "\n",
    {
      encoding:"utf8",
      flag:"wx"
    }
  );

  return Object.freeze({
    status:
      "RECOVERED_STALE_LOCK",

    quarantinePath:
      destination,

    moved
  });
}

module.exports = Object.freeze({
  QUEUE_PARENT,
  inspect,
  recoverStaleLock
});
