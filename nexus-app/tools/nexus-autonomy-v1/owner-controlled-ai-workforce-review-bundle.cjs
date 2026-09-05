"use strict";

const fs=require("fs");
const path=require("path");
const crypto=require("crypto");

const REVIEW_BUNDLE_SCHEMA=
  "nexus.autonomy.owner-controlled-ai-workforce-review-bundle.v1";

const EVIDENCE_SCHEMA=
  "nexus.autonomy.execution-evidence.v1";

function record(v){
  return v!==null && typeof v==="object" && !Array.isArray(v);
}

function sha256(file){
  return crypto.createHash("sha256")
    .update(fs.readFileSync(file))
    .digest("hex");
}

function json(file){
  return JSON.parse(fs.readFileSync(file,"utf8"));
}

function jsonFiles(dir){
  if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir,{withFileTypes:true})
    .filter(x=>x.isFile() && x.name.endsWith(".json"))
    .map(x=>path.join(dir,x.name))
    .sort();
}

function reject(classification,reason,extra={}){
  return Object.freeze({
    actionable:false,
    classification,
    reason,
    ...extra,
  });
}

function classify(patchFile,evidenceDir,currentHead){
  let patch;

  try{ patch=json(patchFile); }
  catch{
    return reject(
      "MALFORMED_PATCH_READY",
      "PATCH_READY_JSON_INVALID",
      {patchFile},
    );
  }

  if(
    !record(patch) ||
    typeof patch.taskId!=="string" ||
    patch.taskId.length===0 ||
    typeof patch.baseHead!=="string" ||
    patch.baseHead.length===0 ||
    !Array.isArray(patch.mutations) ||
    !Array.isArray(patch.checks)
  ){
    return reject(
      "MALFORMED_PATCH_READY",
      "PATCH_READY_CONTRACT_INVALID",
      {
        patchFile,
        taskId:
          typeof patch?.taskId==="string"
            ? patch.taskId
            : null,
      },
    );
  }

  const patchSha256=sha256(patchFile);
  const evidenceFile=
    path.join(evidenceDir,`${patch.taskId}.json`);

  const base={
    patchFile,
    patchSha256,
    evidenceFile,
    taskId:patch.taskId,
    baseHead:patch.baseHead,
    mutationCount:patch.mutations.length,
    checkCount:patch.checks.length,
  };

  if(!fs.existsSync(evidenceFile)){
    return reject(
      "EVIDENCE_MISSING",
      "MATCHING_EVIDENCE_MISSING",
      base,
    );
  }

  let evidence;

  try{ evidence=json(evidenceFile); }
  catch{
    return reject(
      "MALFORMED_EVIDENCE",
      "EVIDENCE_JSON_INVALID",
      base,
    );
  }

  if(
    !record(evidence) ||
    evidence.schema!==EVIDENCE_SCHEMA ||
    evidence.status!=="PATCH_READY" ||
    evidence.taskId!==patch.taskId ||
    typeof evidence.inputSha256!=="string"
  ){
    return reject(
      "EVIDENCE_CONTRACT_REJECTED",
      "EVIDENCE_CONTRACT_INVALID",
      base,
    );
  }

  if(evidence.inputSha256!==patchSha256){
    return reject(
      "EVIDENCE_BINDING_MISMATCH",
      "EVIDENCE_INPUT_SHA256_MISMATCH",
      base,
    );
  }

  if(
    typeof evidence.baseHead==="string" &&
    evidence.baseHead.length>0 &&
    evidence.baseHead!==patch.baseHead
  ){
    return reject(
      "HEAD_BINDING_MISMATCH",
      "PATCH_AND_EVIDENCE_HEAD_MISMATCH",
      base,
    );
  }

  if(patch.baseHead!==currentHead){
    return reject(
      "STALE_HEAD",
      "PATCH_READY_BASE_HEAD_IS_NOT_CURRENT_HEAD",
      base,
    );
  }

  if(patch.mutations.length<1){
    return reject(
      "NO_MUTATIONS",
      "PATCH_READY_HAS_NO_MUTATIONS",
      base,
    );
  }

  if(patch.checks.length<1){
    return reject(
      "NO_CHECKS",
      "PATCH_READY_HAS_NO_CHECKS",
      base,
    );
  }

  const mutations=patch.mutations.map(m=>({
    op:record(m) && typeof m.op==="string" ? m.op : null,
    path:record(m) && typeof m.path==="string" ? m.path : null,
  }));

  if(
    mutations.some(
      m=>m.op!=="write_existing_file" ||
         typeof m.path!=="string" ||
         m.path.length===0
    )
  ){
    return reject(
      "MUTATION_SCOPE_REJECTED",
      "UNSUPPORTED_OR_INVALID_MUTATION_SCOPE",
      base,
    );
  }

  const checks=patch.checks.map(c=>({
    type:record(c) && typeof c.type==="string" ? c.type : null,
    path:record(c) && typeof c.path==="string" ? c.path : null,
  }));

  if(
    checks.some(
      c=>typeof c.type!=="string" ||
         c.type.length===0 ||
         typeof c.path!=="string" ||
         c.path.length===0
    )
  ){
    return reject(
      "CHECK_SCOPE_REJECTED",
      "INVALID_CHECK_SCOPE",
      base,
    );
  }

  return Object.freeze({
    actionable:true,
    classification:"ACTIONABLE",
    reason:null,
    ...base,
    mutations:Object.freeze(mutations),
    checks:Object.freeze(checks),
  });
}

function buildOwnerControlledReviewBundle(input){
  if(!record(input)) throw new TypeError("REVIEW_BUNDLE_INPUT_INVALID");

  const {queueRoot,currentHead}=input;

  if(typeof queueRoot!=="string" || queueRoot.length===0)
    throw new TypeError("REVIEW_BUNDLE_QUEUE_ROOT_INVALID");

  if(typeof currentHead!=="string" || currentHead.length===0)
    throw new TypeError("REVIEW_BUNDLE_CURRENT_HEAD_INVALID");

  if(!fs.existsSync(queueRoot))
    throw new Error("REVIEW_BUNDLE_QUEUE_ROOT_MISSING");

  const items=[];

  const queues=fs.readdirSync(queueRoot,{withFileTypes:true})
    .filter(x=>x.isDirectory())
    .map(x=>path.join(queueRoot,x.name))
    .sort();

  for(const queue of queues){
    const evidenceDir=path.join(queue,"evidence");

    for(const patchFile of jsonFiles(path.join(queue,"patch-ready"))){
      items.push(Object.freeze({
        queueName:path.basename(queue),
        ...classify(patchFile,evidenceDir,currentHead),
      }));
    }
  }

  const actionable=items.filter(x=>x.actionable===true);
  const rejected=items.filter(x=>x.actionable!==true);
  const classificationCounts={};

  for(const item of items){
    classificationCounts[item.classification]=
      (classificationCounts[item.classification]||0)+1;
  }

  return Object.freeze({
    schema:REVIEW_BUNDLE_SCHEMA,
    currentHead,
    totalPatchReadyArtifacts:items.length,
    actionableCount:actionable.length,
    rejectedCount:rejected.length,
    classificationCounts:Object.freeze({...classificationCounts}),
    actionable:Object.freeze(actionable),
    rejected:Object.freeze(rejected),
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

module.exports=Object.freeze({
  REVIEW_BUNDLE_SCHEMA,
  EVIDENCE_SCHEMA,
  buildOwnerControlledReviewBundle,
});
