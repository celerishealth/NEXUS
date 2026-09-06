"use strict";

const assert=require("assert");

const bridge=require(
  "./nexus-owner-controlled-bounded-worker-start-bridge-v1.cjs"
);

(async()=>{
  const base={
    activationToken:"synthetic-non-executing-test-token",
    ownerControlEnabled:true,
    ownerDecision:"REJECT",
    queueRoot:"C:\\definitely-not-used",
    workerOptions:{}
  };

  const rejected=
    await bridge.runOwnerControlledBoundedWorkerStart(base);

  assert.strictEqual(rejected.status,"STOP");
  assert.strictEqual(rejected.workerStarted,false);
  assert.strictEqual(rejected.workerExecutionAuthority,false);
  assert.strictEqual(rejected.databaseAuthority,false);
  assert.strictEqual(rejected.productionAuthority,false);

  const badShape=
    await bridge.runOwnerControlledBoundedWorkerStart({
      ...base,
      ownerDecision:"APPROVE",
      extra:true
    });

  assert.strictEqual(badShape.status,"STOP");
  assert.strictEqual(badShape.workerStarted,false);

  console.log(
    "BOUNDED_WORKER_START_BRIDGE_SELF_TEST=PASS"
  );
  console.log("WORKER_INVOKED=FALSE");
  console.log("QUEUE_TOUCHED=FALSE");
  console.log("MODEL_EXECUTED=FALSE");
  console.log("DATABASE_TOUCHED=FALSE");
  console.log("PRODUCTION_TOUCHED=FALSE");
})().catch(error=>{
  console.error(error);
  process.exitCode=1;
});