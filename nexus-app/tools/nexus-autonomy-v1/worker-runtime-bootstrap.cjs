"use strict";
const cp=require("node:child_process");
const path=require("node:path");

const ROOT="C:\\ProgramData\\NEXUS\\owner-worker-v1";

function buildWorkerEnv(baseEnv=process.env){
  return Object.freeze({
    ...baseEnv,
    LOCALAPPDATA:path.join(ROOT,"worker-runtime-localappdata"),
    GIT_CONFIG_COUNT:"1",
    GIT_CONFIG_KEY_0:"safe.directory",
    GIT_CONFIG_VALUE_0:"C:/PROJECTS/NEXUS 1",
    NEXUS_QWEN_ASSET_ROOT:path.join(ROOT,"worker-model-assets"),
    NEXUS_QWEN_STATE_ROOT:path.join(
      ROOT,"worker-model-state","staging","local-reasoning-v1"
    )
  });
}

function main(){
  const result=cp.spawnSync(
    process.execPath,
    [path.join(__dirname,"continuous-launch-wrapper.cjs")],
    {
      stdio:"inherit",
      shell:false,
      windowsHide:true,
      env:buildWorkerEnv()
    }
  );
  if(result.error) throw result.error;
  process.exitCode=Number.isInteger(result.status) ? result.status : 25;
}

module.exports=Object.freeze({ROOT,buildWorkerEnv,main});

if(require.main===module){main();}