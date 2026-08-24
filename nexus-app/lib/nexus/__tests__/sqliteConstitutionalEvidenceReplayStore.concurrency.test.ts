import {
  existsSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";
import {
  SQLiteConstitutionalEvidenceReplayStore,
} from "../sqliteConstitutionalEvidenceReplayStore";

const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForFiles(
  paths: readonly string[],
  timeoutMilliseconds: number,
): Promise<void> {
  const deadline = Date.now() + timeoutMilliseconds;

  while (!paths.every((path) => existsSync(path))) {
    if (Date.now() >= deadline) {
      throw new Error(
        "Timed out waiting for independent replay workers.",
      );
    }

    await sleep(10);
  }
}

function launchWorker(
  tsxCliPath: string,
  workerPath: string,
  databasePath: string,
  readyPath: string,
  releasePath: string,
) {
  const child = spawn(
    process.execPath,
    [
      tsxCliPath,
      workerPath,
      databasePath,
      readyPath,
      releasePath,
    ],
    {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );

  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (chunk: Buffer) => {
    stdout += chunk.toString("utf8");
  });

  child.stderr.on("data", (chunk: Buffer) => {
    stderr += chunk.toString("utf8");
  });

  const completion = new Promise<{
    code: number | null;
    stdout: string;
    stderr: string;
  }>((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code) => {
      resolve({
        code,
        stdout,
        stderr,
      });
    });
  });

  return {
    child,
    completion,
  };
}

function readOutcome(stdout: string): string {
  const outcomes = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) =>
      [
        "RESERVED",
        "ALREADY_USED",
        "UNAVAILABLE",
      ].includes(line),
    );

  if (outcomes.length !== 1) {
    throw new Error(
      `Expected exactly one replay outcome, received ${JSON.stringify(outcomes)}.`,
    );
  }

  return outcomes[0];
}

describe("SQLite constitutional evidence replay store — independent-process atomicity", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const root of tempRoots.splice(0)) {
      rmSync(root, {
        recursive: true,
        force: true,
      });
    }
  });

  it("allows exactly one RESERVED winner for concurrent identical nonce scope", async () => {
    const root = mkdtempSync(
      join(tmpdir(), "nexus-constitutional-replay-race-"),
    );
    tempRoots.push(root);

    const databasePath = join(
      root,
      "constitutional-replay.sqlite",
    );

    const initializer =
      new SQLiteConstitutionalEvidenceReplayStore(
        databasePath,
      );
    initializer.close();

    const readyOne = join(root, "worker-1.ready");
    const readyTwo = join(root, "worker-2.ready");
    const releasePath = join(root, "release");
    const tsxCliPath = join(
      process.cwd(),
      "node_modules",
      "tsx",
      "dist",
      "cli.mjs",
    );
    const workerPath = join(
      process.cwd(),
      "lib",
      "nexus",
      "__tests__",
      "fixtures",
      "sqliteConstitutionalEvidenceReplayWorker.ts",
    );

    expect(existsSync(tsxCliPath)).toBe(true);
    expect(existsSync(workerPath)).toBe(true);

    const first = launchWorker(
      tsxCliPath,
      workerPath,
      databasePath,
      readyOne,
      releasePath,
    );
    const second = launchWorker(
      tsxCliPath,
      workerPath,
      databasePath,
      readyTwo,
      releasePath,
    );

    try {
      await waitForFiles(
        [readyOne, readyTwo],
        10_000,
      );

      writeFileSync(releasePath, "RELEASE", {
        encoding: "utf8",
        flag: "wx",
      });

      const results = await Promise.all([
        first.completion,
        second.completion,
      ]);

      for (const result of results) {
        if (result.code !== 0) {
          throw new Error(
            `Replay worker failed with code ${String(result.code)}: ${result.stderr}`,
          );
        }
      }

      const outcomes = results
        .map((result) => readOutcome(result.stdout))
        .sort();

      expect(outcomes).toEqual([
        "ALREADY_USED",
        "RESERVED",
      ]);
    } finally {
      if (first.child.exitCode === null) {
        first.child.kill();
      }

      if (second.child.exitCode === null) {
        second.child.kill();
      }

      await Promise.allSettled([
        first.completion,
        second.completion,
      ]);
    }
  }, 20_000);
});