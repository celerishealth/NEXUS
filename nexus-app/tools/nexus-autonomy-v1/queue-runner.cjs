
"use strict";

const fs =
  require("node:fs");

const path =
  require("node:path");

const crypto =
  require("node:crypto");

const {
  executeTask,
} = require("./orchestrator.cjs");

function sha256Bytes(bytes) {
  return crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");
}

function ensureQueue(root) {
  for (const name of [
    "pending",
    "processing",
    "patch-ready",
    "waiting-owner",
    "stopped",
    "evidence",
    "patches",
  ]) {
    fs.mkdirSync(
      path.join(root, name),
      {recursive: true}
    );
  }
}

function atomicJson(
  file,
  value
) {
  const candidate =
    file + ".candidate";

  const bytes =
    Buffer.from(
      JSON.stringify(
        value,
        null,
        2
      ) + "\n",
      "utf8"
    );

  fs.writeFileSync(
    candidate,
    bytes,
    {
      flag: "wx",
    }
  );

  fs.renameSync(
    candidate,
    file
  );

  return sha256Bytes(bytes);
}

function runOne(
  repoRoot,
  queueRoot
) {
  ensureQueue(queueRoot);

  const pendingDir =
    path.join(
      queueRoot,
      "pending"
    );

  const candidates =
    fs.readdirSync(pendingDir)
      .filter(
        x => x.endsWith(".json")
      )
      .sort();

  if (candidates.length === 0) {
    return {
      status: "IDLE",
    };
  }

  const name = candidates[0];

  if (
    !/^[a-zA-Z0-9._-]+\.json$/
      .test(name)
  ) {
    throw new Error(
      "QUEUE_FILENAME_INVALID"
    );
  }

  const pending =
    path.join(
      pendingDir,
      name
    );

  const processing =
    path.join(
      queueRoot,
      "processing",
      name
    );

  fs.renameSync(
    pending,
    processing
  );

  let task = null;
  let result;

  try {
    const raw =
      fs.readFileSync(
        processing
      );

    const inputSha256 =
      sha256Bytes(raw);

    task =
      JSON.parse(
        raw.toString("utf8")
      );

    result =
      executeTask(
        repoRoot,
        task
      );

    let destinationDir;

    if (
      result.status
      === "PATCH_READY"
    ) {
      destinationDir =
        "patch-ready";

      const patchFile =
        path.join(
          queueRoot,
          "patches",
          task.taskId + ".patch"
        );

      fs.writeFileSync(
        patchFile,
        result.patch,
        {
          encoding: "utf8",
          flag: "wx",
        }
      );
    }
    else if (
      result.status
      === "WAIT_OWNER"
    ) {
      destinationDir =
        "waiting-owner";
    }
    else {
      destinationDir =
        "stopped";
    }

    const evidence = {
      schema:
        "nexus.autonomy.execution-evidence.v1",

      taskId:
        task.taskId,

      inputSha256,

      status:
        result.status,

      reason:
        result.reason || null,

      taskFingerprint:
        result.taskFingerprint || null,

      baseHead:
        result.baseHead || null,

      changedPaths:
        result.changedPaths || [],

      tara:
        result.tara || [],

      patchSha256:
        result.patchSha256 || null,

      primaryStatusPreserved:
        result.primaryStatusPreserved
        ?? true,

      worktreeMetadataPreserved:
        result.worktreeMetadataPreserved
        ?? true,

      commitCreated: false,
      mergePerformed: false,
      pushPerformed: false,
      databaseTouched: false,
      productionTouched: false,
    };

    const evidenceFile =
      path.join(
        queueRoot,
        "evidence",
        task.taskId + ".json"
      );

    const evidenceSha256 =
      atomicJson(
        evidenceFile,
        evidence
      );

    fs.renameSync(
      processing,
      path.join(
        queueRoot,
        destinationDir,
        name
      )
    );

    return {
      status:
        result.status,

      taskId:
        task.taskId,

      reason:
        result.reason || null,

      evidenceSha256,

      patchSha256:
        result.patchSha256 || null,

      destination:
        destinationDir,
    };

  }
  catch (error) {

    const taskId =
      task
      && typeof task.taskId === "string"
        ? task.taskId
        : "unknown";

    const stopEvidence = {
      schema:
        "nexus.autonomy.execution-evidence.v1",

      taskId,

      status: "STOP",

      reason:
        error.message,

      commitCreated: false,
      mergePerformed: false,
      pushPerformed: false,
      databaseTouched: false,
      productionTouched: false,
    };

    const evidenceFile =
      path.join(
        queueRoot,
        "evidence",
        taskId
        + "-"
        + Date.now()
        + ".json"
      );

    atomicJson(
      evidenceFile,
      stopEvidence
    );

    if (
      fs.existsSync(processing)
    ) {
      fs.renameSync(
        processing,
        path.join(
          queueRoot,
          "stopped",
          name
        )
      );
    }

    return {
      status: "STOP",
      taskId,
      reason:
        error.message,
    };
  }
}

module.exports = Object.freeze({
  runOne,
});
