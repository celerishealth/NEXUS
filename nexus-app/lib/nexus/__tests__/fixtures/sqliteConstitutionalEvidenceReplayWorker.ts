import {
  existsSync,
  writeFileSync,
} from "node:fs";
import {
  SQLiteConstitutionalEvidenceReplayStore,
} from "../../sqliteConstitutionalEvidenceReplayStore";

const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function main(): Promise<void> {
  const [
    databasePath,
    readyPath,
    releasePath,
  ] = process.argv.slice(2);

  if (!databasePath || !readyPath || !releasePath) {
    throw new Error("Worker arguments are incomplete.");
  }

  const store =
    new SQLiteConstitutionalEvidenceReplayStore(
      databasePath,
    );

  try {
    writeFileSync(readyPath, "READY", {
      encoding: "utf8",
      flag: "wx",
    });

    const deadline = Date.now() + 10_000;

    while (!existsSync(releasePath)) {
      if (Date.now() >= deadline) {
        throw new Error(
          "Timed out waiting for concurrency release barrier.",
        );
      }

      await sleep(10);
    }

    const result =
      await store.reserveReplayNonceScope({
        tenantId: "tenant-concurrency",
        evidenceIssuerId: "issuer-concurrency",
        evidenceIssuerKeyId: "issuer-key-concurrency",
        nonce: "nonce-concurrency",
      });

    process.stdout.write(`${result}\n`);
  } finally {
    store.close();
  }
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : "Unknown worker failure.";

  process.stderr.write(
    `CONSTITUTIONAL_REPLAY_WORKER_ERROR:${message}\n`,
  );
  process.exitCode = 2;
});