import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchPilotCompletionRecord,
  type SalesCoreLaunchPilotCompletionRecord,
} from "./salesCoreLaunchPilotCompletionRecord";

export const SALES_CORE_LAUNCH_READINESS_DECISION_VERSION =
  "sales-core-launch-readiness-decision-v1" as const;

export const SALES_CORE_LAUNCH_READINESS_DECISIONS = [
  "APPROVE_SALES_CORE_LAUNCH_READINESS",
  "REJECT_AND_RETAIN_SALES_CORE_LAUNCH_PILOT_COMPLETION",
] as const;

export type SalesCoreLaunchReadinessDecisionType =
  (
    typeof SALES_CORE_LAUNCH_READINESS_DECISIONS
  )[number];

export interface CreateSalesCoreLaunchReadinessDecisionInput {
  readonly salesCoreLaunchPilotCompletion:
    SalesCoreLaunchPilotCompletionRecord;

  readonly decisionId: string;
  readonly ownerId: string;

  readonly decision:
    SalesCoreLaunchReadinessDecisionType;

  readonly reason: string;
  readonly decidedAt: string;
}

export interface SalesCoreLaunchReadinessDecision {
  readonly version:
    typeof SALES_CORE_LAUNCH_READINESS_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    "OWNER_SALES_CORE_LAUNCH_READINESS_DECISION_RECORDED";

  readonly department:
    "SALES";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly sourceCompletionId: string;
  readonly sourceCompletionDigest: string;
  readonly sourceRegistryDigest: string;

  readonly decision:
    SalesCoreLaunchReadinessDecisionType;

  readonly salesCoreLaunchReadinessApproved:
    boolean;

  readonly reason: string;

  readonly reviewedEvidence: Readonly<{
    completionState:
      "SALES_CORE_LAUNCH_PILOT_COMPLETION_RECORDED";

    registeredTemplateCount:
      3;

    completedEmployeeCount:
      3;

    completedEmployeeCodes: readonly [
      "nx-sales-003",
      "nx-sales-004",
      "nx-sales-005",
    ];

    completedLaunchSequence: readonly [
      3,
      4,
      5,
    ];

    allLimitedInternalPilotsCompleted:
      true;

    sourceOwnerReviewRequired:
      true;

    sourceNextStep:
      "AWAIT_OWNER_SALES_CORE_LAUNCH_READINESS_DECISION";
  }>;

  readonly authorityBoundary: Readonly<{
    productionAuthorityGranted: false;
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    autonomousExecutionAuthorized: false;
    paymentsAuthorized: false;
    publicLaunchAuthorized: false;
  }>;

  readonly ownerControlBoundary: Readonly<{
    ownerDecisionRequiredForAnyActivation:
      true;

    separateProductionAuthorizationRequired:
      true;

    separateCustomerContactAuthorizationRequired:
      true;

    separateExternalDeliveryAuthorizationRequired:
      true;

    separatePaymentAuthorizationRequired:
      true;

    reversibleInternalPlanningOnly:
      true;
  }>;

  readonly nextStep:
    | "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLANNING"
    | "RETAIN_SALES_CORE_LAUNCH_PILOT_COMPLETION_ONLY";

  readonly decidedAt: string;
  readonly decisionDigest: string;
}

type DigestBoundRecord =
  Readonly<Record<string, unknown>>;

function canonicalize(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return JSON.stringify(value);
  }

  if (
    Array.isArray(value)
  ) {
    return (
      "[" +
      value
        .map((item) =>
          canonicalize(item),
        )
        .join(",") +
      "]"
    );
  }

  const record =
    value as Record<
      string,
      unknown
    >;

  return (
    "{" +
    Object.keys(record)
      .sort()
      .map(
        (key) =>
          JSON.stringify(key) +
          ":" +
          canonicalize(
            record[key],
          ),
      )
      .join(",") +
    "}"
  );
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      canonicalize(value),
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const child of
      Object.values(
        value as Record<
          string,
          unknown
        >,
      )
    ) {
      deepFreeze(child);
    }
  }

  return value;
}

function requireSafeIdentifier(
  label: string,
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    !/^[a-z0-9][a-z0-9._:-]{2,127}$/.test(
      value,
    )
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }
}

function requireDigest(
  label: string,
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{64}$/.test(
      value,
    )
  ) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    Number.isNaN(
      Date.parse(value),
    )
  ) {
    throw new Error(
      `${label} must be a valid timestamp.`,
    );
  }
}

function requireReason(
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    value.trim() !== value ||
    value.length < 20 ||
    value.length > 1000 ||
    /[\u0000-\u001f\u007f]/.test(
      value,
    )
  ) {
    throw new Error(
      "Sales readiness decision reason must be a canonical explanation between 20 and 1000 characters.",
    );
  }
}

function verifyDigestBoundObject(
  label: string,
  value: DigestBoundRecord,
  digestField: string,
): void {
  const digest =
    value[digestField];

  requireDigest(
    `${label} digest`,
    digest,
  );

  const unsigned = {
    ...value,
  };

  delete unsigned[digestField];

  if (
    sha256(unsigned) !==
    digest
  ) {
    throw new Error(
      `${label} digest verification failed.`,
    );
  }
}

export function validateSalesCoreLaunchReadinessDecision(
  record:
    SalesCoreLaunchReadinessDecision,
): void {
  verifyDigestBoundObject(
    "Sales core-launch readiness decision",
    record as unknown as
      DigestBoundRecord,
    "decisionDigest",
  );

  requireSafeIdentifier(
    "Sales readiness decision ID",
    record.decisionId,
  );

  requireSafeIdentifier(
    "Sales readiness tenant ID",
    record.tenantId,
  );

  requireSafeIdentifier(
    "Sales readiness owner ID",
    record.ownerId,
  );

  requireSafeIdentifier(
    "Sales readiness source completion ID",
    record.sourceCompletionId,
  );

  requireDigest(
    "Sales readiness source completion digest",
    record.sourceCompletionDigest,
  );

  requireDigest(
    "Sales readiness source registry digest",
    record.sourceRegistryDigest,
  );

  requireReason(
    record.reason,
  );

  requireTimestamp(
    "Sales readiness decision time",
    record.decidedAt,
  );

  if (
    record.version !==
      SALES_CORE_LAUNCH_READINESS_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_SALES_CORE_LAUNCH_READINESS_DECISION_RECORDED" ||
    record.department !==
      "SALES"
  ) {
    throw new Error(
      "Sales core-launch readiness decision identity is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_SALES_CORE_LAUNCH_READINESS" &&
    record.decision !==
      "REJECT_AND_RETAIN_SALES_CORE_LAUNCH_PILOT_COMPLETION"
  ) {
    throw new Error(
      "Sales core-launch readiness decision is invalid.",
    );
  }

  const approved =
    record.decision ===
      "APPROVE_SALES_CORE_LAUNCH_READINESS";

  if (
    record.salesCoreLaunchReadinessApproved !==
      approved
  ) {
    throw new Error(
      "Sales core-launch readiness approval state is invalid.",
    );
  }

  const evidence =
    record.reviewedEvidence;

  if (
    evidence.completionState !==
      "SALES_CORE_LAUNCH_PILOT_COMPLETION_RECORDED" ||
    evidence.registeredTemplateCount !==
      3 ||
    evidence.completedEmployeeCount !==
      3 ||
    evidence.allLimitedInternalPilotsCompleted !==
      true ||
    evidence.sourceOwnerReviewRequired !==
      true ||
    evidence.sourceNextStep !==
      "AWAIT_OWNER_SALES_CORE_LAUNCH_READINESS_DECISION"
  ) {
    throw new Error(
      "Sales core-launch readiness evidence is invalid.",
    );
  }

  if (
    evidence.completedEmployeeCodes.length !==
      3 ||
    evidence.completedEmployeeCodes[0] !==
      "nx-sales-003" ||
    evidence.completedEmployeeCodes[1] !==
      "nx-sales-004" ||
    evidence.completedEmployeeCodes[2] !==
      "nx-sales-005"
  ) {
    throw new Error(
      "Sales core-launch completed employee sequence is invalid.",
    );
  }

  if (
    evidence.completedLaunchSequence.length !==
      3 ||
    evidence.completedLaunchSequence[0] !==
      3 ||
    evidence.completedLaunchSequence[1] !==
      4 ||
    evidence.completedLaunchSequence[2] !==
      5
  ) {
    throw new Error(
      "Sales core-launch launch sequence evidence is invalid.",
    );
  }

  const authority =
    record.authorityBoundary;

  if (
    authority.productionAuthorityGranted !==
      false ||
    authority.realCustomerContactAuthorized !==
      false ||
    authority.externalDeliveryAuthorized !==
      false ||
    authority.autonomousExecutionAuthorized !==
      false ||
    authority.paymentsAuthorized !==
      false ||
    authority.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Sales core-launch readiness authority boundary is invalid.",
    );
  }

  const ownerControl =
    record.ownerControlBoundary;

  if (
    ownerControl.ownerDecisionRequiredForAnyActivation !==
      true ||
    ownerControl.separateProductionAuthorizationRequired !==
      true ||
    ownerControl.separateCustomerContactAuthorizationRequired !==
      true ||
    ownerControl.separateExternalDeliveryAuthorizationRequired !==
      true ||
    ownerControl.separatePaymentAuthorizationRequired !==
      true ||
    ownerControl.reversibleInternalPlanningOnly !==
      true
  ) {
    throw new Error(
      "Sales core-launch owner-control boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLANNING"
      : "RETAIN_SALES_CORE_LAUNCH_PILOT_COMPLETION_ONLY";

  if (
    record.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Sales core-launch readiness next step is invalid.",
    );
  }
}

export function createSalesCoreLaunchReadinessDecision(
  input:
    CreateSalesCoreLaunchReadinessDecisionInput,
): SalesCoreLaunchReadinessDecision {
  const source =
    input.salesCoreLaunchPilotCompletion;

  validateSalesCoreLaunchPilotCompletionRecord(
    source,
  );

  requireSafeIdentifier(
    "Sales readiness decision ID",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Sales readiness owner ID",
    input.ownerId,
  );

  requireReason(
    input.reason,
  );

  requireTimestamp(
    "Sales readiness decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Sales core-launch readiness decision owner does not match the completion owner.",
    );
  }

  if (
    input.decision !==
      "APPROVE_SALES_CORE_LAUNCH_READINESS" &&
    input.decision !==
      "REJECT_AND_RETAIN_SALES_CORE_LAUNCH_PILOT_COMPLETION"
  ) {
    throw new Error(
      "Sales core-launch readiness decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.recordedAt)
  ) {
    throw new Error(
      "Sales core-launch readiness decision cannot precede pilot completion.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_SALES_CORE_LAUNCH_READINESS";

  const decisionCore = {
    version:
      SALES_CORE_LAUNCH_READINESS_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_SALES_CORE_LAUNCH_READINESS_DECISION_RECORDED" as const,

    department:
      "SALES" as const,

    tenantId:
      source.tenantId,

    ownerId:
      input.ownerId,

    sourceCompletionId:
      source.completionId,

    sourceCompletionDigest:
      source.completionDigest,

    sourceRegistryDigest:
      source.registryDigest,

    decision:
      input.decision,

    salesCoreLaunchReadinessApproved:
      approved,

    reason:
      input.reason,

    reviewedEvidence: {
      completionState:
        source.completionState,

      registeredTemplateCount:
        source.registeredTemplateCount,

      completedEmployeeCount:
        3 as const,

      completedEmployeeCodes: [
        source.completedEmployees[0]
          .employeeCode,
        source.completedEmployees[1]
          .employeeCode,
        source.completedEmployees[2]
          .employeeCode,
      ] as const,

      completedLaunchSequence: [
        source.completedEmployees[0]
          .launchSequence,
        source.completedEmployees[1]
          .launchSequence,
        source.completedEmployees[2]
          .launchSequence,
      ] as const,

      allLimitedInternalPilotsCompleted:
        source.allLimitedInternalPilotsCompleted,

      sourceOwnerReviewRequired:
        source.ownerReviewRequired,

      sourceNextStep:
        source.nextStep,
    },

    authorityBoundary: {
      productionAuthorityGranted:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      autonomousExecutionAuthorized:
        false as const,

      paymentsAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,
    },

    ownerControlBoundary: {
      ownerDecisionRequiredForAnyActivation:
        true as const,

      separateProductionAuthorizationRequired:
        true as const,

      separateCustomerContactAuthorizationRequired:
        true as const,

      separateExternalDeliveryAuthorizationRequired:
        true as const,

      separatePaymentAuthorizationRequired:
        true as const,

      reversibleInternalPlanningOnly:
        true as const,
    },

    nextStep:
      approved
        ? "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLANNING" as const
        : "RETAIN_SALES_CORE_LAUNCH_PILOT_COMPLETION_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as SalesCoreLaunchReadinessDecision;

  validateSalesCoreLaunchReadinessDecision(
    record,
  );

  return record;
}
