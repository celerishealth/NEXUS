"use strict";

const fs=require("fs");
const path=require("path");
const crypto=require("crypto");

const {
  runOwnerControlledReviewEntry,
}=require("./owner-controlled-ai-workforce-review-entry.cjs");

const SNAPSHOT_SCHEMA=
  "nexus.autonomy.owner-controlled-ai-workforce-review-snapshot.v1";

function isRecord(value){
  return (
    value!==null &&
    typeof value==="object" &&
    !Array.isArray(value)
  );
}

function isInside(root,target){
  const resolvedRoot=path.resolve(root);
  const resolvedTarget=path.resolve(target);
  const relative=path.relative(resolvedRoot,resolvedTarget);

  return (
    relative==="" ||
    (
      !relative.startsWith(".."+path.sep) &&
      relative!==".." &&
      !path.isAbsolute(relative)
    )
  );
}

function assertDestinationAllowed(input){
  const {
    repoRoot,
    queueRoot,
    snapshotPath,
  }=input;

  if(
    typeof repoRoot!=="string" ||
    repoRoot.length===0
  ){
    throw new TypeError("REVIEW_SNAPSHOT_REPO_ROOT_INVALID");
  }

  if(
    typeof queueRoot!=="string" ||
    queueRoot.length===0
  ){
    throw new TypeError("REVIEW_SNAPSHOT_QUEUE_ROOT_INVALID");
  }

  if(
    typeof snapshotPath!=="string" ||
    snapshotPath.length===0
  ){
    throw new TypeError("REVIEW_SNAPSHOT_PATH_INVALID");
  }

  if(isInside(repoRoot,snapshotPath)){
    throw new Error("REVIEW_SNAPSHOT_PRIMARY_REPOSITORY_FORBIDDEN");
  }

  if(isInside(queueRoot,snapshotPath)){
    throw new Error("REVIEW_SNAPSHOT_QUEUE_MUTATION_FORBIDDEN");
  }
}

function stableSnapshotJson(snapshot){
  return `${JSON.stringify(snapshot,null,2)}\n`;
}

function sha256Bytes(bytes){
  return crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");
}

function writeOwnerControlledReviewSnapshot(input){
  if(!isRecord(input)){
    throw new TypeError("REVIEW_SNAPSHOT_INPUT_INVALID");
  }

  const {
    repoRoot,
    queueRoot,
    currentHead,
    snapshotPath,
  }=input;

  if(
    typeof currentHead!=="string" ||
    currentHead.length===0
  ){
    throw new TypeError("REVIEW_SNAPSHOT_CURRENT_HEAD_INVALID");
  }

  assertDestinationAllowed({
    repoRoot,
    queueRoot,
    snapshotPath,
  });

  const review=
    runOwnerControlledReviewEntry({
      queueRoot,
      currentHead,
    });

  const generatedAt=
    input.generatedAt===undefined
      ? new Date().toISOString()
      : input.generatedAt;

  if(
    typeof generatedAt!=="string" ||
    generatedAt.length===0
  ){
    throw new TypeError("REVIEW_SNAPSHOT_GENERATED_AT_INVALID");
  }

  const snapshot=Object.freeze({
    schema:SNAPSHOT_SCHEMA,
    generatedAt,
    currentHead:review.currentHead,
    totalPatchReadyArtifacts:
      review.totalPatchReadyArtifacts,
    actionableCount:review.actionableCount,
    rejectedCount:review.rejectedCount,
    classificationCounts:
      review.classificationCounts,
    actionable:review.actionable,
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

  const text=stableSnapshotJson(snapshot);
  const bytes=Buffer.from(text,"utf8");

  const directory=path.dirname(path.resolve(snapshotPath));
  fs.mkdirSync(directory,{recursive:true});

  const tempPath=path.join(
    directory,
    `.${path.basename(snapshotPath)}.${process.pid}.${crypto.randomBytes(8).toString("hex")}.tmp`,
  );

  let tempCreated=false;

  try{
    const fd=fs.openSync(tempPath,"wx",0o600);
    tempCreated=true;

    try{
      fs.writeFileSync(fd,bytes);
      fs.fsyncSync(fd);
    }
    finally{
      fs.closeSync(fd);
    }

    fs.renameSync(tempPath,path.resolve(snapshotPath));
    tempCreated=false;

    return Object.freeze({
      schema:SNAPSHOT_SCHEMA,
      snapshotPath:path.resolve(snapshotPath),
      snapshotSha256:sha256Bytes(bytes),
      generatedAt,
      currentHead,
      actionableCount:review.actionableCount,
      rejectedCount:review.rejectedCount,
      published:true,
      authority:snapshot.authority,
    });
  }
  finally{
    if(tempCreated && fs.existsSync(tempPath)){
      fs.rmSync(tempPath,{force:true});
    }
  }
}

module.exports=Object.freeze({
  SNAPSHOT_SCHEMA,
  writeOwnerControlledReviewSnapshot,
});
