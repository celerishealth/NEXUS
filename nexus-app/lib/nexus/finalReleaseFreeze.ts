
import { createHash } from "node:crypto";

export const FINAL_RELEASE_FREEZE_VERSION =
  "nexus-final-release-freeze-v1" as const;

export const EXPECTED_RELEASE_FREEZE_SOURCE_COMMIT =
  "0c94153" as const;

export const REQUIRED_FINAL_RELEASE_FREEZE_GATES = [
  "day781FinalCompletionRegression",
  "day809SourceCommitAncestor",
  "day809AuthorizationRegression",
  "criticalVitestSuite",
  "fullAuthenticatedNodeSuite",
  "projectTypecheck",
  "releaseFreezeLint",
  "productionBuild",
  "realBrowserEmergencyRehearsal",
  "originMainSync",
  "workingTreeClean",
  "productionDatabaseUntouched",
  "productionDeploymentUnmodified",
  "liveProviderExecutionBlocked",
] as const;

export type FinalReleaseFreezeGate =
  (typeof REQUIRED_FINAL_RELEASE_FREEZE_GATES)[number];

export type FinalReleaseFreezeEvidence = Readonly<
  Record<FinalReleaseFreezeGate, boolean>
>;

export type FinalReleaseFreezeStatus =
  | "DAY_810_RELEASE_FROZEN"
  | "NOT_FROZEN";

export interface FinalReleaseFreezeInput {
  readonly sourceCommit: string;
  readonly freezeCommit: string;
  readonly evidence: FinalReleaseFreezeEvidence;
}

export interface FinalReleaseFreezeReport {
  readonly version:
    typeof FINAL_RELEASE_FREEZE_VERSION;
  readonly checkpointId: "day-810";
  readonly sourceCommit: string;
  readonly freezeCommit: string;
  readonly status: FinalReleaseFreezeStatus;
  readonly releaseFreezeSatisfied: boolean;
  readonly failedGates:
    readonly FinalReleaseFreezeGate[];
  readonly evidence: FinalReleaseFreezeEvidence;
  readonly evidenceDigest: string;
  readonly safetyBoundary: Readonly<{
    ownerApprovalRequired: true;
    productionDatabaseMutationAuthorized: false;
    productionDeploymentAuthorized: false;
    liveProviderExecutionAuthorized: false;
    customerMessageDeliveryAuthorized: false;
    paymentExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly finalStatement:
    | "NEXUS_DAY_810_RELEASE_FROZEN_PUBLIC_LAUNCH_BLOCKED"
    | "NEXUS_DAY_810_NOT_FROZEN_RESOLVE_FAILED_GATES";
  readonly reportDigest: string;
}

const COMMIT_PATTERN =
  /^[0-9a-f]{7,40}$/;

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) => stableStringify(item))
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            JSON.stringify(key) +
            ":" +
            stableStringify(record[key]),
        )
        .join(",") +
      "}"
    );
  }

  const primitive = JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported value in deterministic release-freeze report.",
    );
  }

  return primitive;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(stableStringify(value), "utf8")
    .digest("hex");
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    for (
      const propertyName of
      Object.getOwnPropertyNames(value)
    ) {
      const child =
        (value as Record<string, unknown>)[
          propertyName
        ];

      if (
        child !== null &&
        typeof child === "object"
      ) {
        deepFreeze(child);
      }
    }

    Object.freeze(value);
  }

  return value as Readonly<T>;
}

function assertExactEvidenceShape(
  evidence: FinalReleaseFreezeEvidence,
): void {
  if (
    evidence === null ||
    typeof evidence !== "object" ||
    Array.isArray(evidence)
  ) {
    throw new Error(
      "Final release-freeze evidence must be an object.",
    );
  }

  const actualKeys =
    Object.keys(evidence).sort();

  const expectedKeys =
    [...REQUIRED_FINAL_RELEASE_FREEZE_GATES]
      .sort();

  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some(
      (key, index) =>
        key !== expectedKeys[index],
    )
  ) {
    throw new Error(
      "Final release-freeze evidence must contain the exact required gates.",
    );
  }

  for (
    const gate of
    REQUIRED_FINAL_RELEASE_FREEZE_GATES
  ) {
    if (typeof evidence[gate] !== "boolean") {
      throw new Error(
        "Final release-freeze gate " +
          gate +
          " must be boolean.",
      );
    }
  }
}

export function createFinalReleaseFreezeReport(
  input: FinalReleaseFreezeInput,
): FinalReleaseFreezeReport {
  if (
    input.sourceCommit !==
    EXPECTED_RELEASE_FREEZE_SOURCE_COMMIT
  ) {
    throw new Error(
      "sourceCommit must equal " +
        EXPECTED_RELEASE_FREEZE_SOURCE_COMMIT +
        ".",
    );
  }

  if (
    !COMMIT_PATTERN.test(input.freezeCommit) ||
    input.freezeCommit === input.sourceCommit
  ) {
    throw new Error(
      "freezeCommit must be a distinct lowercase hexadecimal Git commit.",
    );
  }

  assertExactEvidenceShape(input.evidence);

  const normalizedEvidence =
    Object.fromEntries(
      REQUIRED_FINAL_RELEASE_FREEZE_GATES.map(
        (gate) => [
          gate,
          input.evidence[gate],
        ],
      ),
    ) as Record<
      FinalReleaseFreezeGate,
      boolean
    >;

  const frozenEvidence =
    deepFreeze(
      normalizedEvidence,
    ) as FinalReleaseFreezeEvidence;

  const failedGates =
    REQUIRED_FINAL_RELEASE_FREEZE_GATES.filter(
      (gate) => !frozenEvidence[gate],
    );

  const releaseFreezeSatisfied =
    failedGates.length === 0;

  const status: FinalReleaseFreezeStatus =
    releaseFreezeSatisfied
      ? "DAY_810_RELEASE_FROZEN"
      : "NOT_FROZEN";

  const evidenceDigest = sha256({
    checkpointId: "day-810",
    sourceCommit: input.sourceCommit,
    freezeCommit: input.freezeCommit,
    evidence: frozenEvidence,
  });

  const finalStatement:
    FinalReleaseFreezeReport["finalStatement"] =
      releaseFreezeSatisfied
        ? "NEXUS_DAY_810_RELEASE_FROZEN_PUBLIC_LAUNCH_BLOCKED"
        : "NEXUS_DAY_810_NOT_FROZEN_RESOLVE_FAILED_GATES";

  const reportCore = {
    version: FINAL_RELEASE_FREEZE_VERSION,
    checkpointId: "day-810" as const,
    sourceCommit: input.sourceCommit,
    freezeCommit: input.freezeCommit,
    status,
    releaseFreezeSatisfied,
    failedGates,
    evidence: frozenEvidence,
    evidenceDigest,
    safetyBoundary: {
      ownerApprovalRequired: true,
      productionDatabaseMutationAuthorized:
        false,
      productionDeploymentAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      customerMessageDeliveryAuthorized:
        false,
      paymentExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    } as const,
    finalStatement,
  };

  const report: FinalReleaseFreezeReport = {
    ...reportCore,
    reportDigest: sha256(reportCore),
  };

  return deepFreeze(
    report,
  ) as FinalReleaseFreezeReport;
}
