"use strict";

const path=require("path");

const {
  writeOwnerControlledReviewSnapshot,
}=require("./owner-controlled-ai-workforce-review-snapshot.cjs");

const SIDECAR_SCHEMA=
  "nexus.autonomy.owner-controlled-ai-workforce-review-snapshot-sidecar.v1";

function isRecord(value){
  return (
    value!==null &&
    typeof value==="object" &&
    !Array.isArray(value)
  );
}

function resolveDefaultReviewSnapshotPath(localAppData){
  if(
    typeof localAppData!=="string" ||
    localAppData.trim().length===0
  ){
    throw new Error("REVIEW_SNAPSHOT_LOCALAPPDATA_UNAVAILABLE");
  }

  return path.join(
    localAppData,
    "NEXUS",
    "autonomy-v1",
    "owner-review",
    "latest-review-snapshot.json",
  );
}

function startOwnerControlledReviewSnapshotSidecar(input){
  if(!isRecord(input)){
    throw new TypeError("REVIEW_SIDECAR_INPUT_INVALID");
  }

  const {
    repoRoot,
    queueRoot,
    currentHead,
    intervalMs,
  }=input;

  if(
    typeof repoRoot!=="string" ||
    repoRoot.length===0
  ){
    throw new TypeError("REVIEW_SIDECAR_REPO_ROOT_INVALID");
  }

  if(
    typeof queueRoot!=="string" ||
    queueRoot.length===0
  ){
    throw new TypeError("REVIEW_SIDECAR_QUEUE_ROOT_INVALID");
  }

  if(
    typeof currentHead!=="string" ||
    currentHead.length===0
  ){
    throw new TypeError("REVIEW_SIDECAR_CURRENT_HEAD_INVALID");
  }

  if(
    !Number.isInteger(intervalMs) ||
    intervalMs<1
  ){
    throw new TypeError("REVIEW_SIDECAR_INTERVAL_INVALID");
  }

  const snapshotPath=
    input.snapshotPath===undefined
      ? resolveDefaultReviewSnapshotPath(
          process.env.LOCALAPPDATA,
        )
      : input.snapshotPath;

  if(
    typeof snapshotPath!=="string" ||
    snapshotPath.length===0
  ){
    throw new TypeError("REVIEW_SIDECAR_SNAPSHOT_PATH_INVALID");
  }

  let stopped=false;
  let running=false;
  let timer=null;

  const state={
    publicationAttempts:0,
    publicationSuccesses:0,
    publicationFailures:0,
    lastPublishedAt:null,
    lastSnapshotSha256:null,
    lastError:null,
  };

  function publish(){
    if(stopped || running){
      return null;
    }

    running=true;
    state.publicationAttempts+=1;

    try{
      const result=
        writeOwnerControlledReviewSnapshot({
          repoRoot,
          queueRoot,
          currentHead,
          snapshotPath,
        });

      state.publicationSuccesses+=1;
      state.lastPublishedAt=result.generatedAt;
      state.lastSnapshotSha256=
        result.snapshotSha256;
      state.lastError=null;

      return result;
    }
    catch(error){
      state.publicationFailures+=1;
      state.lastError=String(
        error?.message || error,
      );

      return null;
    }
    finally{
      running=false;
    }
  }

  publish();

  timer=setInterval(
    ()=>{
      publish();
    },
    intervalMs,
  );

  function stop(){
    if(stopped){
      return false;
    }

    stopped=true;

    if(timer!==null){
      clearInterval(timer);
      timer=null;
    }

    return true;
  }

  function getState(){
    return Object.freeze({
      schema:SIDECAR_SCHEMA,
      stopped,
      running,
      snapshotPath:path.resolve(snapshotPath),
      intervalMs,
      publicationAttempts:
        state.publicationAttempts,
      publicationSuccesses:
        state.publicationSuccesses,
      publicationFailures:
        state.publicationFailures,
      lastPublishedAt:
        state.lastPublishedAt,
      lastSnapshotSha256:
        state.lastSnapshotSha256,
      lastError:
        state.lastError,
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

  return Object.freeze({
    schema:SIDECAR_SCHEMA,
    snapshotPath:path.resolve(snapshotPath),
    publish,
    stop,
    getState,
  });
}

module.exports=Object.freeze({
  SIDECAR_SCHEMA,
  resolveDefaultReviewSnapshotPath,
  startOwnerControlledReviewSnapshotSidecar,
});
