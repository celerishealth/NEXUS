"use strict";

const {
  buildOwnerControlledReviewBundle,
}=require("./owner-controlled-ai-workforce-review-bundle.cjs");

const REVIEW_ENTRY_SCHEMA=
  "nexus.autonomy.owner-controlled-ai-workforce-review-entry.v1";

function isRecord(value){
  return (
    value!==null &&
    typeof value==="object" &&
    !Array.isArray(value)
  );
}

function runOwnerControlledReviewEntry(input){
  if(!isRecord(input)){
    throw new TypeError("REVIEW_ENTRY_INPUT_INVALID");
  }

  const {
    queueRoot,
    currentHead,
  }=input;

  const bundle=
    buildOwnerControlledReviewBundle({
      queueRoot,
      currentHead,
    });

  const actionable=
    bundle.actionable.map(
      (item)=>Object.freeze({
        queueName:item.queueName,
        taskId:item.taskId,
        baseHead:item.baseHead,
        patchSha256:item.patchSha256,
        mutationCount:item.mutationCount,
        checkCount:item.checkCount,
        mutations:item.mutations,
        checks:item.checks,
      }),
    );

  return Object.freeze({
    schema:REVIEW_ENTRY_SCHEMA,
    currentHead:bundle.currentHead,
    totalPatchReadyArtifacts:
      bundle.totalPatchReadyArtifacts,
    actionableCount:bundle.actionableCount,
    rejectedCount:bundle.rejectedCount,
    classificationCounts:
      bundle.classificationCounts,
    actionable:Object.freeze(actionable),
    authority:Object.freeze({
      mayApplyPatch:false,
      mayMutatePrimaryWorktree:false,
      mayCommit:false,
      mayMerge:false,
      mayPush:false,
      mayTouchDatabase:false,
      mayTouchProduction:false,
      ownerDecisionRequired:true,
    }),
  });
}

function formatOwnerReviewSummary(result){
  if(!isRecord(result)){
    throw new TypeError("REVIEW_ENTRY_RESULT_INVALID");
  }

  const lines=[
    `REVIEW_SCHEMA=${result.schema}`,
    `CURRENT_HEAD=${result.currentHead}`,
    `TOTAL_PATCH_READY=${result.totalPatchReadyArtifacts}`,
    `ACTIONABLE=${result.actionableCount}`,
    `REJECTED=${result.rejectedCount}`,
    `CLASSIFICATIONS=${JSON.stringify(result.classificationCounts)}`,
    `MAY_APPLY_PATCH=${result.authority.mayApplyPatch}`,
    `MAY_COMMIT=${result.authority.mayCommit}`,
    `MAY_TOUCH_DATABASE=${result.authority.mayTouchDatabase}`,
    `MAY_TOUCH_PRODUCTION=${result.authority.mayTouchProduction}`,
    `OWNER_DECISION_REQUIRED=${result.authority.ownerDecisionRequired}`,
  ];

  for(let i=0;i<result.actionable.length;i+=1){
    const item=result.actionable[i];

    lines.push(
      `ACTIONABLE_${i+1}_TASK=${item.taskId}`,
      `ACTIONABLE_${i+1}_QUEUE=${item.queueName}`,
      `ACTIONABLE_${i+1}_PATCH_SHA256=${item.patchSha256}`,
      `ACTIONABLE_${i+1}_MUTATIONS=${item.mutationCount}`,
      `ACTIONABLE_${i+1}_CHECKS=${item.checkCount}`,
    );
  }

  return `${lines.join("\n")}\n`;
}

module.exports=Object.freeze({
  REVIEW_ENTRY_SCHEMA,
  runOwnerControlledReviewEntry,
  formatOwnerReviewSummary,
});
