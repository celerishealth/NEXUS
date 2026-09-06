
"use strict";

const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const cp=require("node:child_process");

const {
  validatePlannerProposal,
}=require("./planner-boundary.cjs");

const {
  TASK_SCHEMA,
  validateTask,
}=require("./task-contract.cjs");

const FEEDER_SCHEMA=
  "nexus.autonomy.task-feeder.v2";

const ALLOWED_QUEUE_PARENT=
  path.resolve(
    process.env.LOCALAPPDATA,
    "NEXUS",
    "autonomy-v1",
    "queues"
  );

const LIFECYCLE_DIRS=Object.freeze([
  "pending",
  "processing",
  "patch-ready",
  "waiting-owner",
  "stopped",
]);

function stop(reason,extra={}){
  return Object.freeze({
    schema:FEEDER_SCHEMA,
    status:"STOP",
    queued:false,
    reason,
    ...extra,
  });
}

function duplicate(
  reason,
  taskId,
  extra={}
){
  return Object.freeze({
    schema:FEEDER_SCHEMA,
    status:"DUPLICATE_TASK_ID",
    queued:false,
    reason,
    taskId,
    ...extra,
  });
}

function sha256(value){
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");
}

function taskKey(taskId){
  return sha256(
    Buffer.from(
      taskId,
      "utf8"
    )
  );
}

function canonicalTaskText(task){
  return JSON.stringify(
    task,
    null,
    2
  )+"\n";
}

function resolveQueueRoot(queueRoot){

  if(
    typeof queueRoot!=="string" ||
    queueRoot.length<1 ||
    !path.isAbsolute(queueRoot)
  ){
    return null;
  }

  const absolute=
    path.resolve(queueRoot);

  const relative=
    path.relative(
      ALLOWED_QUEUE_PARENT,
      absolute
    );

  if(
    !relative ||
    path.isAbsolute(relative) ||
    relative===".." ||
    relative.startsWith(
      ".."+path.sep
    )
  ){
    return null;
  }

  return absolute;
}

function ensureDirectoryNoSymlink(dir){

  /*
    Concurrent callers may race while creating
    the same fresh queue directory.

    Attempt mkdir directly. EEXIST alone is not
    trusted; the resulting path is freshly lstat'd
    and must be a real directory, never a symlink.
  */
  try{

    fs.mkdirSync(
      dir,
      {recursive:false}
    );
  }
  catch(error){

    if(
      !error ||
      error.code!=="EEXIST"
    ){
      throw error;
    }
  }

  const stat=
    fs.lstatSync(dir);

  if(
    stat.isSymbolicLink() ||
    !stat.isDirectory()
  ){
    throw new Error(
      "FEEDER_DIRECTORY_UNSAFE"
    );
  }
}

function ensureTrustedQueueTree(queueRoot){

  fs.mkdirSync(
    ALLOWED_QUEUE_PARENT,
    {recursive:true}
  );

  const parentStat=
    fs.lstatSync(
      ALLOWED_QUEUE_PARENT
    );

  if(
    parentStat.isSymbolicLink() ||
    !parentStat.isDirectory()
  ){
    throw new Error(
      "FEEDER_QUEUE_PARENT_UNSAFE"
    );
  }

  const relative=
    path.relative(
      ALLOWED_QUEUE_PARENT,
      queueRoot
    );

  const parts=
    relative.split(path.sep)
      .filter(Boolean);

  let cursor=
    ALLOWED_QUEUE_PARENT;

  for(const part of parts){

    cursor=
      path.join(
        cursor,
        part
      );

    ensureDirectoryNoSymlink(
      cursor
    );
  }
}

function currentHead(repoRoot){

  if(
    typeof repoRoot!=="string" ||
    repoRoot.length<1 ||
    !path.isAbsolute(repoRoot)
  ){
    throw new Error(
      "FEEDER_REPO_ROOT_INVALID"
    );
  }

  const r=cp.spawnSync(
    "git",
    [
      "-C",
      path.resolve(repoRoot),
      "rev-parse",
      "HEAD",
    ],
    {
      encoding:"utf8",
      shell:false,
      windowsHide:true,
      timeout:30000,
    }
  );

  if(
    r.error ||
    r.status!==0
  ){
    throw new Error(
      "FEEDER_GIT_HEAD_UNRESOLVED"
    );
  }

  const head=
    String(r.stdout||"")
      .trim()
      .toLowerCase();

  if(
    !/^[0-9a-f]{40}$/.test(head)
  ){
    throw new Error(
      "FEEDER_GIT_HEAD_INVALID"
    );
  }

  return head;
}

function writeFsyncExclusive(
  file,
  text
){

  const fd=
    fs.openSync(
      file,
      "wx"
    );

  try{

    fs.writeFileSync(
      fd,
      text,
      {
        encoding:"utf8"
      }
    );

    fs.fsyncSync(fd);
  }
  finally{
    fs.closeSync(fd);
  }
}

/*
  Atomic non-executable publication:

  complete bytes -> fsync -> hard-link final
*/
function atomicPublishBytesNew(
  stagingDir,
  finalFile,
  text
){

  const temp=
    path.join(
      stagingDir,
      "."+
      path.basename(finalFile)+
      "."+
      process.pid+
      "."+
      crypto.randomBytes(16)
        .toString("hex")+
      ".staged"
    );

  try{

    writeFsyncExclusive(
      temp,
      text
    );

    fs.linkSync(
      temp,
      finalFile
    );
  }
  finally{

    try{
      fs.rmSync(
        temp,
        {force:true}
      );
    }
    catch{}
  }
}

function readCanonicalClaim(
  claimPath
){

  const stat=
    fs.lstatSync(
      claimPath
    );

  if(
    stat.isSymbolicLink() ||
    !stat.isFile()
  ){
    throw new Error(
      "FEEDER_DURABLE_CLAIM_UNSAFE"
    );
  }

  const bytes=
    fs.readFileSync(
      claimPath
    );

  let parsed;

  try{
    parsed=
      JSON.parse(
        bytes.toString("utf8")
      );
  }
  catch{
    throw new Error(
      "FEEDER_DURABLE_CLAIM_INVALID"
    );
  }

  let validated;

  try{
    validated=
      validateTask(parsed);
  }
  catch{
    throw new Error(
      "FEEDER_DURABLE_CLAIM_INVALID"
    );
  }

  const canonical=
    canonicalTaskText(
      validated
    );

  if(
    !bytes.equals(
      Buffer.from(
        canonical,
        "utf8"
      )
    )
  ){
    throw new Error(
      "FEEDER_DURABLE_CLAIM_NONCANONICAL"
    );
  }

  return Object.freeze({
    task:validated,
    text:canonical,
    bytes,
    stat,
  });
}

function lifecycleArtifact(
  queueRoot,
  name,
  claimBytes
){

  let found=null;

  for(
    const dirName of
    LIFECYCLE_DIRS
  ){

    const candidate=
      path.join(
        queueRoot,
        dirName,
        name
      );

    if(
      !fs.existsSync(candidate)
    ){
      continue;
    }

    if(found){
      throw new Error(
        "FEEDER_MULTIPLE_LIFECYCLE_ARTIFACTS"
      );
    }

    const stat=
      fs.lstatSync(
        candidate
      );

    if(
      stat.isSymbolicLink() ||
      !stat.isFile()
    ){
      throw new Error(
        "FEEDER_LIFECYCLE_ARTIFACT_UNSAFE"
      );
    }

    const bytes=
      fs.readFileSync(
        candidate
      );

    if(
      !bytes.equals(
        claimBytes
      )
    ){
      throw new Error(
        "FEEDER_LIFECYCLE_TASK_BYTES_MISMATCH"
      );
    }

    found=Object.freeze({
      dirName,
      path:candidate,
      stat,
    });
  }

  return found;
}


function freshLifecycleArtifact({
  queueRoot,
  name,
  claimPath,
  claimBytes,
}){

  let artifact;

  try{
    artifact=
      lifecycleArtifact(
        queueRoot,
        name,
        claimBytes
      );
  }
  catch(error){
    throw error;
  }

  if(!artifact){
    return null;
  }

  let claimStat;
  let artifactStat;
  let currentClaimBytes;
  let currentArtifactBytes;

  try{

    /*
      Critical R2 rule:

      NEVER use the old claim.stat snapshot
      captured before a competing recovery.

      Once a matching lifecycle artifact is
      visible, both sides are freshly observed.
    */
    claimStat=
      fs.lstatSync(
        claimPath
      );

    artifactStat=
      fs.lstatSync(
        artifact.path
      );

    currentClaimBytes=
      fs.readFileSync(
        claimPath
      );

    currentArtifactBytes=
      fs.readFileSync(
        artifact.path
      );
  }
  catch(error){

    if(
      error &&
      error.code==="ENOENT"
    ){
      return Object.freeze({
        retry:true
      });
    }

    throw error;
  }

  if(
    claimStat.isSymbolicLink() ||
    !claimStat.isFile()
  ){
    throw new Error(
      "FEEDER_DURABLE_CLAIM_UNSAFE"
    );
  }

  if(
    artifactStat.isSymbolicLink() ||
    !artifactStat.isFile()
  ){
    throw new Error(
      "FEEDER_LIFECYCLE_ARTIFACT_UNSAFE"
    );
  }

  if(
    !currentClaimBytes.equals(
      claimBytes
    ) ||
    !currentArtifactBytes.equals(
      claimBytes
    )
  ){
    throw new Error(
      "FEEDER_LIFECYCLE_TASK_BYTES_MISMATCH"
    );
  }

  if(
    claimStat.nlink<2 ||
    artifactStat.nlink<2
  ){
    throw new Error(
      "FEEDER_LIFECYCLE_HARDLINK_INVARIANT_BROKEN"
    );
  }

  return Object.freeze({
    retry:false,
    artifact,
    claimStat,
    artifactStat,
  });
}

function reconcileExistingClaim({
  claimPath,
  pendingPath,
  queueRoot,
  name,
  task,
}){

  let claim;

  try{
    claim=
      readCanonicalClaim(
        claimPath
      );
  }
  catch(error){
    return stop(
      String(
        error?.message ||
        "FEEDER_DURABLE_CLAIM_INVALID"
      )
    );
  }

  const expected=
    canonicalTaskText(
      task
    );

  if(
    claim.task.taskId!==
      task.taskId ||

    claim.text!==
      expected
  ){
    return stop(
      "FEEDER_TASK_ID_COLLISION_DIFFERENT_TASK"
    );
  }

  /*
    First search for a lifecycle artifact.

    If found, freshLifecycleArtifact()
    MUST re-stat both durable claim and
    lifecycle artifact after observation.
  */
  for(
    let attempt=0;
    attempt<3;
    attempt++
  ){

    let fresh;

    try{
      fresh=
        freshLifecycleArtifact({
          queueRoot,
          name,
          claimPath,
          claimBytes:
            claim.bytes,
        });
    }
    catch(error){
      return stop(
        String(
          error?.message ||
          "FEEDER_LIFECYCLE_RECONCILIATION_FAILURE"
        )
      );
    }

    if(
      fresh &&
      fresh.retry===true
    ){
      continue;
    }

    if(
      fresh &&
      fresh.artifact
    ){
      return duplicate(
        "FEEDER_TASK_ALREADY_IN_LIFECYCLE",
        task.taskId,
        {
          lifecycle:
            fresh.artifact.dirName
        }
      );
    }

    break;
  }

  /*
    No matching lifecycle artifact was
    observed.

    Re-stat the durable claim NOW rather
    than relying on readCanonicalClaim()'s
    earlier snapshot.
  */
  let freshClaimStat;
  let freshClaimBytes;

  try{

    freshClaimStat=
      fs.lstatSync(
        claimPath
      );

    freshClaimBytes=
      fs.readFileSync(
        claimPath
      );
  }
  catch(error){
    return stop(
      "FEEDER_DURABLE_CLAIM_RESTAT_FAILURE"
    );
  }

  if(
    freshClaimStat.isSymbolicLink() ||
    !freshClaimStat.isFile()
  ){
    return stop(
      "FEEDER_DURABLE_CLAIM_UNSAFE"
    );
  }

  if(
    !freshClaimBytes.equals(
      claim.bytes
    )
  ){
    return stop(
      "FEEDER_DURABLE_CLAIM_BYTES_CHANGED"
    );
  }

  /*
    If nlink is already >1, another process
    may have published/moved the lifecycle
    hard-link after our first scan.

    Re-scan using fresh evidence before
    classifying the state as ambiguous.
  */
  if(
    freshClaimStat.nlink!==1
  ){

    for(
      let attempt=0;
      attempt<3;
      attempt++
    ){

      let fresh;

      try{
        fresh=
          freshLifecycleArtifact({
            queueRoot,
            name,
            claimPath,
            claimBytes:
              claim.bytes,
          });
      }
      catch(error){
        return stop(
          String(
            error?.message ||
            "FEEDER_LIFECYCLE_RESCAN_FAILURE"
          )
        );
      }

      if(
        fresh &&
        fresh.retry===true
      ){
        continue;
      }

      if(
        fresh &&
        fresh.artifact
      ){
        return duplicate(
          "FEEDER_TASK_ALREADY_IN_LIFECYCLE",
          task.taskId,
          {
            lifecycle:
              fresh.artifact.dirName
          }
        );
      }

      break;
    }

    return stop(
      "FEEDER_CLAIM_LINK_STATE_AMBIGUOUS"
    );
  }

  /*
    Exact proven orphan state:
      complete canonical claim,
      current nlink == 1,
      no lifecycle artifact.

    Race-safe publication:
      exactly one fs.linkSync succeeds.
  */
  try{

    fs.linkSync(
      claimPath,
      pendingPath
    );
  }
  catch(error){

    if(
      error &&
      error.code==="EEXIST"
    ){

      try{

        const pendingStat=
          fs.lstatSync(
            pendingPath
          );

        const pendingBytes=
          fs.readFileSync(
            pendingPath
          );

        const claimStatAfterEexist=
          fs.lstatSync(
            claimPath
          );

        const claimBytesAfterEexist=
          fs.readFileSync(
            claimPath
          );

        if(
          !pendingStat.isSymbolicLink() &&
          pendingStat.isFile() &&
          !claimStatAfterEexist.isSymbolicLink() &&
          claimStatAfterEexist.isFile() &&
          pendingBytes.equals(
            claim.bytes
          ) &&
          claimBytesAfterEexist.equals(
            claim.bytes
          ) &&
          pendingStat.nlink>=2 &&
          claimStatAfterEexist.nlink>=2
        ){
          return duplicate(
            "FEEDER_PENDING_ALREADY_PUBLISHED",
            task.taskId,
            {
              lifecycle:"pending"
            }
          );
        }
      }
      catch{}

      return stop(
        "FEEDER_PENDING_COLLISION_MISMATCH"
      );
    }

    return stop(
      "FEEDER_ORPHAN_REPUBLISH_FAILURE"
    );
  }

  /*
    Verify publication itself with fresh
    post-link observations.
  */
  try{

    const claimStatAfter=
      fs.lstatSync(
        claimPath
      );

    const pendingStatAfter=
      fs.lstatSync(
        pendingPath
      );

    const pendingBytesAfter=
      fs.readFileSync(
        pendingPath
      );

    if(
      claimStatAfter.nlink<2 ||
      pendingStatAfter.nlink<2 ||
      !pendingBytesAfter.equals(
        claim.bytes
      )
    ){
      return stop(
        "FEEDER_RECOVERY_PUBLICATION_INVARIANT_BROKEN"
      );
    }
  }
  catch{
    return stop(
      "FEEDER_RECOVERY_PUBLICATION_VERIFY_FAILURE"
    );
  }

  return Object.freeze({
    schema:FEEDER_SCHEMA,
    status:"ENQUEUED",
    queued:true,
    recovered:true,
    reason:
      "FEEDER_ORPHAN_CLAIM_RECOVERED",
    taskId:
      task.taskId,
    pendingFile:name,
  });
}

function feedPlannerProposal(input){

  if(
    !input ||
    typeof input!=="object" ||
    Array.isArray(input)
  ){
    return stop(
      "FEEDER_INPUT_INVALID"
    );
  }

  const queueRoot=
    resolveQueueRoot(
      input.queueRoot
    );

  if(!queueRoot){
    return stop(
      "FEEDER_QUEUE_ROOT_DENIED"
    );
  }

  let baseHead;

  try{
    baseHead=
      currentHead(
        input.repoRoot
      );
  }
  catch(error){
    return stop(
      String(
        error?.message ||
        "FEEDER_HEAD_FAILURE"
      )
    );
  }

  const plannerResult=
    validatePlannerProposal(
      input.proposal,
      Object.freeze({
        baseHead,
      })
    );

  if(
    !plannerResult ||
    typeof plannerResult!=="object"
  ){
    return stop(
      "FEEDER_PLANNER_RESULT_INVALID"
    );
  }

  if(
    plannerResult.status===
      "WAIT_OWNER"
  ){
    return Object.freeze({
      schema:FEEDER_SCHEMA,
      status:"WAIT_OWNER",
      queued:false,
      reason:
        plannerResult.reason,
      plannerResult,
    });
  }

  if(
    plannerResult.status!==
      "QUEUEABLE" ||
    plannerResult.queueable!==
      true
  ){
    return Object.freeze({
      schema:FEEDER_SCHEMA,
      status:"STOP",
      queued:false,
      reason:
        plannerResult.reason ||
        "FEEDER_PLANNER_NOT_QUEUEABLE",
      plannerResult,
    });
  }

  let task;

  try{
    task=
      validateTask(
        plannerResult.task
      );
  }
  catch(error){
    return stop(
      "FEEDER_SECONDARY_TASK_VALIDATION_REJECTED:"+
      String(
        error?.message ||
        error
      )
    );
  }

  if(
    task.schema!==TASK_SCHEMA ||
    task.baseHead!==baseHead
  ){
    return stop(
      "FEEDER_VALIDATED_TASK_CONTEXT_MISMATCH"
    );
  }

  const key=
    taskKey(
      task.taskId
    );

  const name=
    key+".json";

  const claimDir=
    path.join(
      queueRoot,
      ".autonomous-feeder-dedupe"
    );

  const stagingDir=
    path.join(
      queueRoot,
      ".autonomous-feeder-staging"
    );

  const pendingDir=
    path.join(
      queueRoot,
      "pending"
    );

  try{

    ensureTrustedQueueTree(
      queueRoot
    );

    ensureDirectoryNoSymlink(
      claimDir
    );

    ensureDirectoryNoSymlink(
      stagingDir
    );

    ensureDirectoryNoSymlink(
      pendingDir
    );
  }
  catch(error){
    return stop(
      String(
        error?.message ||
        "FEEDER_QUEUE_INIT_FAILURE"
      )
    );
  }

  const claimPath=
    path.join(
      claimDir,
      name
    );

  const pendingPath=
    path.join(
      pendingDir,
      name
    );

  const taskText=
    canonicalTaskText(
      task
    );

  /*
    First durable transaction:
      canonical validated task bytes become
      the dedupe/recovery claim.

    Claim name is not executable.
  */
  try{

    atomicPublishBytesNew(
      stagingDir,
      claimPath,
      taskText
    );
  }
  catch(error){

    if(
      error &&
      error.code==="EEXIST"
    ){
      return reconcileExistingClaim({
        claimPath,
        pendingPath,
        queueRoot,
        name,
        task,
      });
    }

    return stop(
      "FEEDER_DURABLE_CLAIM_CREATE_FAILURE"
    );
  }

  /*
    Second transaction:
      publish SAME inode into executable
      pending directory.

    Crash between these transactions leaves
    a complete nlink=1 claim recoverable on
    retry.
  */
  try{

    fs.linkSync(
      claimPath,
      pendingPath
    );
  }
  catch(error){

    if(
      error &&
      error.code==="EEXIST"
    ){
      return reconcileExistingClaim({
        claimPath,
        pendingPath,
        queueRoot,
        name,
        task,
      });
    }

    /*
      Claim deliberately remains durable.
      A later identical retry can recover it.
    */
    return stop(
      "FEEDER_PENDING_PUBLICATION_INTERRUPTED_RECOVERABLE"
    );
  }

  return Object.freeze({
    schema:FEEDER_SCHEMA,
    status:"ENQUEUED",
    queued:true,
    recovered:false,
    reason:
      "FEEDER_NEW_TASK_PUBLISHED",
    taskId:
      task.taskId,
    pendingFile:name,
    baseHead,
  });
}

module.exports=Object.freeze({
  FEEDER_SCHEMA,
  feedPlannerProposal,
});
