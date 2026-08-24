import {
  existsSync,
  writeFileSync,
} from "node:fs";
import {
  createConstitutionalTrustContextLifecycleAuditRecord,
} from "../../aiWorkforceConstitutionalTrustContextLifecycleAudit";
import {
  SQLiteConstitutionalTrustContextLifecycleAuditStore,
} from "../../sqliteConstitutionalTrustContextLifecycleAuditStore";

const sleep = (
  milliseconds: number,
): Promise<void> =>
  new Promise((resolve) =>
    setTimeout(
      resolve,
      milliseconds,
    ),
  );

async function main(): Promise<void> {
  const [
    databasePath,
    readyPath,
    releasePath,
  ] = process.argv.slice(2);

  if (
    !databasePath ||
    !readyPath ||
    !releasePath
  ) {
    throw new Error(
      "Lifecycle-audit worker arguments are incomplete.",
    );
  }

  const store =
    new SQLiteConstitutionalTrustContextLifecycleAuditStore(
      databasePath,
    );

  try {
    writeFileSync(
      readyPath,
      "READY",
      {
        encoding: "utf8",
        flag: "wx",
      },
    );

    const deadline =
      Date.now() + 10_000;

    while (
      !existsSync(releasePath)
    ) {
      if (
        Date.now() >= deadline
      ) {
        throw new Error(
          "Timed out waiting for lifecycle-audit release barrier.",
        );
      }

      await sleep(10);
    }

    const record =
      createConstitutionalTrustContextLifecycleAuditRecord({
        lifecycleId:
          "lifecycle-concurrency",
        eventId:
          "event-concurrency",
        sequence: 1,
        event: "ACTIVATED",
        trustContextDigest:
          "e".repeat(64),
        previousRecordDigest: null,
        observedAt:
          "2026-08-23T00:00:00.000Z",
        reason:
          "Concurrent lifecycle observation.",
      });

    const result =
      await store.append(record);

    process.stdout.write(
      `${result}\n`,
    );
  } finally {
    store.close();
  }
}

main().catch(
  (error: unknown) => {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown lifecycle-audit worker failure.";

    process.stderr.write(
      `TRUST_LIFECYCLE_AUDIT_WORKER_ERROR:${message}\n`,
    );

    process.exitCode = 2;
  },
);