
import { createHash } from "node:crypto";

export const FINAL_MARKET_LAUNCH_DECISION_VERSION =
  "nexus-final-market-launch-decision-v1" as const;

export const EXPECTED_FINAL_MARKET_LAUNCH_SOURCE_COMMIT =
  "5953f19" as const;

export const REQUIRED_FINAL_MARKET_LAUNCH_DECISION_GATES = [
  "day810ReleaseFreezeVerified",
  "day810SourceCommitAncestor",
  "engineeringCompletionConfirmed",
  "ownerApprovalLocked",
  "sandboxExecutionOnly",
  "realBrowserEmergencyVerified",
  "originMainSync",
  "workingTreeClean",
  "productionDatabaseMutationBlocked",
  "productionDeploymentBlocked",
  "publicSignupBlocked",
  "liveProviderExecutionBlocked",
  "customerMessageDeliveryBlocked",
  "paymentExecutionBlocked",
] as const;

export type FinalMarketLaunchDecisionGate =
  (typeof REQUIRED_FINAL_MARKET_LAUNCH_DECISION_GATES)[number];

export type FinalMarketLaunchDecisionEvidence =
  Readonly<
    Record<
      FinalMarketLaunchDecisionGate,
      boolean
    >
  >;

export type FinalMarketLaunchDecisionStatus =
  | "DAY_811_FINAL_COMPLETION_CONTROLLED_MARKET_ENTRY_AUTHORIZED"
  | "NOT_COMPLETE";

export interface FinalMarketLaunchDecisionInput {
  readonly sourceCommit: string;
  readonly decisionCommit: string;
  readonly evidence:
    FinalMarketLaunchDecisionEvidence;
}

export interface FinalMarketLaunchDecisionReport {
  readonly version:
    typeof FINAL_MARKET_LAUNCH_DECISION_VERSION;
  readonly checkpointId: "day-811";
  readonly sourceCommit: string;
  readonly decisionCommit: string;
  readonly status:
    FinalMarketLaunchDecisionStatus;
  readonly finalCompletionConfirmed: boolean;
  readonly controlledMarketEntryAuthorized:
    boolean;
  readonly publicLaunchAuthorized: false;
  readonly failedGates:
    readonly FinalMarketLaunchDecisionGate[];
  readonly evidence:
    FinalMarketLaunchDecisionEvidence;
  readonly evidenceDigest: string;
  readonly authorizedScope: Readonly<{
    founderMarketingAuthorized: true;
    founderSalesConversationsAuthorized: true;
    founderDemoAuthorized: true;
    invitationOnlyPilotRecruitmentAuthorized:
      true;
  }>;
  readonly blockedScope: Readonly<{
    operationalCustomerActivationAuthorized:
      false;
    publicSignupAuthorized: false;
    productionDatabaseMutationAuthorized:
      false;
    productionDeploymentAuthorized: false;
    liveProviderExecutionAuthorized: false;
    customerMessageDeliveryAuthorized: false;
    paymentExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly finalStatement:
    | "NEXUS_DAY_811_FINAL_COMPLETION_CONFIRMED_CONTROLLED_MARKET_ENTRY_AUTHORIZED_PUBLIC_LAUNCH_BLOCKED"
    | "NEXUS_DAY_811_NOT_COMPLETE_RESOLVE_FAILED_GATES";
  readonly reportDigest: string;
}

const COMMIT_PATTERN =
  /^[0-9a-f]{7,40}$/;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
            stableStringify(item),
        )
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

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported value in deterministic Day 811 decision report.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
      "utf8",
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): Readonly<T> {
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
  evidence:
    FinalMarketLaunchDecisionEvidence,
): void {
  if (
    evidence === null ||
    typeof evidence !== "object" ||
    Array.isArray(evidence)
  ) {
    throw new Error(
      "Final market-launch evidence must be an object.",
    );
  }

  const actualKeys =
    Object.keys(evidence).sort();

  const expectedKeys =
    [
      ...REQUIRED_FINAL_MARKET_LAUNCH_DECISION_GATES,
    ].sort();

  if (
    actualKeys.length !==
      expectedKeys.length ||
    actualKeys.some(
      (key, index) =>
        key !== expectedKeys[index],
    )
  ) {
    throw new Error(
      "Final market-launch evidence must contain the exact required gates.",
    );
  }

  for (
    const gate of
    REQUIRED_FINAL_MARKET_LAUNCH_DECISION_GATES
  ) {
    if (
      typeof evidence[gate] !==
      "boolean"
    ) {
      throw new Error(
        "Final market-launch gate " +
          gate +
          " must be boolean.",
      );
    }
  }
}

export function createFinalMarketLaunchDecision(
  input: FinalMarketLaunchDecisionInput,
): FinalMarketLaunchDecisionReport {
  if (
    input.sourceCommit !==
    EXPECTED_FINAL_MARKET_LAUNCH_SOURCE_COMMIT
  ) {
    throw new Error(
      "sourceCommit must equal " +
        EXPECTED_FINAL_MARKET_LAUNCH_SOURCE_COMMIT +
        ".",
    );
  }

  if (
    !COMMIT_PATTERN.test(
      input.decisionCommit,
    ) ||
    input.decisionCommit ===
      input.sourceCommit
  ) {
    throw new Error(
      "decisionCommit must be a distinct lowercase hexadecimal Git commit.",
    );
  }

  assertExactEvidenceShape(
    input.evidence,
  );

  const normalizedEvidence =
    Object.fromEntries(
      REQUIRED_FINAL_MARKET_LAUNCH_DECISION_GATES.map(
        (gate) => [
          gate,
          input.evidence[gate],
        ],
      ),
    ) as Record<
      FinalMarketLaunchDecisionGate,
      boolean
    >;

  const frozenEvidence =
    deepFreeze(
      normalizedEvidence,
    ) as FinalMarketLaunchDecisionEvidence;

  const failedGates =
    REQUIRED_FINAL_MARKET_LAUNCH_DECISION_GATES.filter(
      (gate) =>
        !frozenEvidence[gate],
    );

  const decisionSatisfied =
    failedGates.length === 0;

  const status:
    FinalMarketLaunchDecisionStatus =
      decisionSatisfied
        ? "DAY_811_FINAL_COMPLETION_CONTROLLED_MARKET_ENTRY_AUTHORIZED"
        : "NOT_COMPLETE";

  const evidenceDigest =
    sha256({
      checkpointId: "day-811",
      sourceCommit:
        input.sourceCommit,
      decisionCommit:
        input.decisionCommit,
      evidence: frozenEvidence,
    });

  const finalStatement:
    FinalMarketLaunchDecisionReport["finalStatement"] =
      decisionSatisfied
        ? "NEXUS_DAY_811_FINAL_COMPLETION_CONFIRMED_CONTROLLED_MARKET_ENTRY_AUTHORIZED_PUBLIC_LAUNCH_BLOCKED"
        : "NEXUS_DAY_811_NOT_COMPLETE_RESOLVE_FAILED_GATES";

  const reportCore = {
    version:
      FINAL_MARKET_LAUNCH_DECISION_VERSION,
    checkpointId: "day-811" as const,
    sourceCommit:
      input.sourceCommit,
    decisionCommit:
      input.decisionCommit,
    status,
    finalCompletionConfirmed:
      decisionSatisfied,
    controlledMarketEntryAuthorized:
      decisionSatisfied,
    publicLaunchAuthorized:
      false as const,
    failedGates,
    evidence:
      frozenEvidence,
    evidenceDigest,
    authorizedScope: {
      founderMarketingAuthorized:
        true,
      founderSalesConversationsAuthorized:
        true,
      founderDemoAuthorized:
        true,
      invitationOnlyPilotRecruitmentAuthorized:
        true,
    } as const,
    blockedScope: {
      operationalCustomerActivationAuthorized:
        false,
      publicSignupAuthorized:
        false,
      productionDatabaseMutationAuthorized:
        false,
      productionDeploymentAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      customerMessageDeliveryAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    finalStatement,
  };

  const report:
    FinalMarketLaunchDecisionReport = {
      ...reportCore,
      reportDigest:
        sha256(reportCore),
    };

  return deepFreeze(
    report,
  ) as FinalMarketLaunchDecisionReport;
}
