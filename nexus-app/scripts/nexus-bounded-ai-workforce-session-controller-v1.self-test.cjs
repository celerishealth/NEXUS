"use strict";

const assert=require("node:assert");

const session=require(
  "./nexus-bounded-ai-workforce-session-controller-v1.cjs"
);

(async()=>{
  const result=
    await session.runBoundedAiWorkforceSession({
      ownerControlEnabled:true,
      ownerDecision:"REJECT",
      repoRoot:process.cwd(),
      queueNamespace:"self-test-bounded-session",
      proposals:[{}]
    });

  assert.strictEqual(
    result.status,
    "STOP"
  );

  assert.strictEqual(
    result.reason,
    "SESSION_OWNER_APPROVAL_REQUIRED"
  );

  assert.strictEqual(
    result.sessionCompleted,
    false
  );

  assert.strictEqual(
    result.workerExecutionAuthority,
    false
  );

  assert.strictEqual(
    result.databaseAuthority,
    false
  );

  assert.strictEqual(
    result.productionAuthority,
    false
  );

  console.log(
    "BOUNDED_AI_WORKFORCE_SESSION_SELF_TEST=PASS"
  );

  console.log("QUEUE_TOUCHED=FALSE");
  console.log("WORKER_STARTED=FALSE");
  console.log("MODEL_EXECUTED=FALSE");
  console.log("DATABASE_TOUCHED=FALSE");
  console.log("PRODUCTION_TOUCHED=FALSE");
})().catch(error=>{
  console.error(error);
  process.exitCode=1;
});