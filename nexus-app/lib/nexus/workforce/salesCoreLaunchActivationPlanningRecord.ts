import { createHash } from "node:crypto";

import {
  validateSalesCoreLaunchReadinessDecision,
  type SalesCoreLaunchReadinessDecision,
} from "./salesCoreLaunchReadinessDecision";

export const SALES_CORE_LAUNCH_ACTIVATION_PLANNING_RECORD_VERSION =
  "sales-core-launch-activation-planning-record-v1" as const;

export interface CreateSalesCoreLaunchActivationPlanningRecordInput {
  readonly planningId: string;
  readonly salesCoreLaunchReadinessDecision:
    SalesCoreLaunchReadinessDecision;
  readonly preparedAt: string;
}

export interface SalesCoreLaunchActivationPlanningRecord {
  readonly version:
    typeof SALES_CORE_LAUNCH_ACTIVATION_PLANNING_RECORD_VERSION;

  readonly planningId: string;
  readonly planningState:
    "SALES_CORE_LAUNCH_ACTIVATION_PLANNING_RECORDED";

  readonly department: "SALES";
  readonly tenantId: string;
  readonly ownerId: string;

  readonly sourceReadinessDecisionId: string;
  readonly sourceReadinessDecisionDigest: string;
  readonly sourceCompletionId: string;
  readonly sourceCompletionDigest: string;
  readonly sourceRegistryDigest: string;

  readonly salesCoreLaunchReadinessApproved: true;
  readonly activationPlanningPrepared: true;
  readonly ownerActivationPlanDecisionRequired: true;

  readonly plannedEmployees: readonly [
    Readonly<{
      employeeId: "employee-asha-inquiry-intake-v1";
      employeeCode: "nx-sales-003";
      launchSequence: 3;
      planningMode: "REVERSIBLE_INTERNAL_ONLY";
      includedInActivationPlan: true;
      runtimeActivationAuthorized: false;
      runtimeActivationExecuted: false;
    }>,
    Readonly<{
      employeeId: "employee-riya-recommendation-specialist-v1";
      employeeCode: "nx-sales-004";
      launchSequence: 4;
      planningMode: "REVERSIBLE_INTERNAL_ONLY";
      includedInActivationPlan: true;
      runtimeActivationAuthorized: false;
      runtimeActivationExecuted: false;
    }>,
    Readonly<{
      employeeId: "employee-meera-quotation-proposal-specialist-v1";
      employeeCode: "nx-sales-005";
      launchSequence: 5;
      planningMode: "REVERSIBLE_INTERNAL_ONLY";
      includedInActivationPlan: true;
      runtimeActivationAuthorized: false;
      runtimeActivationExecuted: false;
    }>,
  ];

  readonly activationSequence: readonly [3, 4, 5];

  readonly authorityBoundary: Readonly<{
    internalPlanningOnly: true;
    runtimeActivationAuthorized: false;
    runtimeActivationExecuted: false;
    controlledWorkAuthorized: false;
    productionAuthorityGranted: false;
    realCustomerDataAccessAuthorized: false;
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION";

  readonly preparedAt: string;
  readonly planningDigest: string;
}

type DigestBoundRecord =
  Readonly<Record<string, unknown>>;

function canonicalize(value: unknown): string {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return (
      "[" +
      value.map(canonicalize).join(",") +
      "]"
    );
  }

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
          canonicalize(record[key]),
      )
      .join(",") +
    "}"
  );
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(canonicalize(value))
    .digest("hex");
}

function deepFreeze<T>(value: T): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const child of Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(child);
    }
  }

  return value;
}

function requireIdentifier(
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
    !/^[0-9a-f]{64}$/.test(value)
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
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      `${label} must be a valid timestamp.`,
    );
  }
}

function verifyDigestBoundObject(
  label: string,
  value: DigestBoundRecord,
  digestField: string,
): void {
  const digest = value[digestField];

  requireDigest(
    `${label} digest`,
    digest,
  );

  const unsigned = { ...value };
  delete unsigned[digestField];

  if (sha256(unsigned) !== digest) {
    throw new Error(
      `${label} digest verification failed.`,
    );
  }
}

export function validateSalesCoreLaunchActivationPlanningRecord(
  record:
    SalesCoreLaunchActivationPlanningRecord,
): void {
  verifyDigestBoundObject(
    "Sales core-launch activation planning record",
    record as unknown as DigestBoundRecord,
    "planningDigest",
  );

  requireIdentifier(
    "Sales activation planning ID",
    record.planningId,
  );

  requireIdentifier(
    "Sales activation planning tenant ID",
    record.tenantId,
  );

  requireIdentifier(
    "Sales activation planning owner ID",
    record.ownerId,
  );

  requireIdentifier(
    "Sales readiness decision ID",
    record.sourceReadinessDecisionId,
  );

  requireIdentifier(
    "Sales source completion ID",
    record.sourceCompletionId,
  );

  requireDigest(
    "Sales readiness decision digest",
    record.sourceReadinessDecisionDigest,
  );

  requireDigest(
    "Sales source completion digest",
    record.sourceCompletionDigest,
  );

  requireDigest(
    "Sales source registry digest",
    record.sourceRegistryDigest,
  );

  requireTimestamp(
    "Sales activation planning time",
    record.preparedAt,
  );

  if (
    record.version !==
      SALES_CORE_LAUNCH_ACTIVATION_PLANNING_RECORD_VERSION ||
    record.planningState !==
      "SALES_CORE_LAUNCH_ACTIVATION_PLANNING_RECORDED" ||
    record.department !== "SALES" ||
    record.salesCoreLaunchReadinessApproved !==
      true ||
    record.activationPlanningPrepared !== true ||
    record.ownerActivationPlanDecisionRequired !==
      true ||
    record.nextStep !==
      "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION"
  ) {
    throw new Error(
      "Sales core-launch activation planning identity is invalid.",
    );
  }

  const expectedEmployees = [
    [
      "employee-asha-inquiry-intake-v1",
      "nx-sales-003",
      3,
    ],
    [
      "employee-riya-recommendation-specialist-v1",
      "nx-sales-004",
      4,
    ],
    [
      "employee-meera-quotation-proposal-specialist-v1",
      "nx-sales-005",
      5,
    ],
  ] as const;

  if (
    record.plannedEmployees.length !== 3 ||
    record.activationSequence.length !== 3
  ) {
    throw new Error(
      "Sales activation planning employee count is invalid.",
    );
  }

  record.plannedEmployees.forEach(
    (employee, index) => {
      const expected =
        expectedEmployees[index];

      if (
        employee.employeeId !== expected[0] ||
        employee.employeeCode !== expected[1] ||
        employee.launchSequence !== expected[2] ||
        employee.planningMode !==
          "REVERSIBLE_INTERNAL_ONLY" ||
        employee.includedInActivationPlan !==
          true ||
        employee.runtimeActivationAuthorized !==
          false ||
        employee.runtimeActivationExecuted !==
          false
      ) {
        throw new Error(
          "Sales activation planning employee binding is invalid.",
        );
      }

      if (
        record.activationSequence[index] !==
        expected[2]
      ) {
        throw new Error(
          "Sales activation sequence is invalid.",
        );
      }
    },
  );

  const boundary =
    record.authorityBoundary;

  if (
    boundary.internalPlanningOnly !== true ||
    boundary.runtimeActivationAuthorized !==
      false ||
    boundary.runtimeActivationExecuted !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.productionAuthorityGranted !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.autonomousExecutionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Sales core-launch activation planning authority boundary is invalid.",
    );
  }
}

export function createSalesCoreLaunchActivationPlanningRecord(
  input:
    CreateSalesCoreLaunchActivationPlanningRecordInput,
): SalesCoreLaunchActivationPlanningRecord {
  const source =
    input.salesCoreLaunchReadinessDecision;

  validateSalesCoreLaunchReadinessDecision(
    source,
  );

  requireIdentifier(
    "Sales activation planning ID",
    input.planningId,
  );

  requireTimestamp(
    "Sales activation planning time",
    input.preparedAt,
  );

  if (
    source.decision !==
      "APPROVE_SALES_CORE_LAUNCH_READINESS" ||
    source.salesCoreLaunchReadinessApproved !==
      true ||
    source.nextStep !==
      "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLANNING"
  ) {
    throw new Error(
      "Sales core-launch readiness approval is required before activation planning.",
    );
  }

  if (
    source.ownerControlBoundary
      .reversibleInternalPlanningOnly !== true
  ) {
    throw new Error(
      "Sales activation planning must remain reversible and internal only.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
    Date.parse(source.decidedAt)
  ) {
    throw new Error(
      "Sales activation planning cannot precede the readiness decision.",
    );
  }

  const planningCore = {
    version:
      SALES_CORE_LAUNCH_ACTIVATION_PLANNING_RECORD_VERSION,

    planningId:
      input.planningId,

    planningState:
      "SALES_CORE_LAUNCH_ACTIVATION_PLANNING_RECORDED" as const,

    department:
      "SALES" as const,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    sourceReadinessDecisionId:
      source.decisionId,

    sourceReadinessDecisionDigest:
      source.decisionDigest,

    sourceCompletionId:
      source.sourceCompletionId,

    sourceCompletionDigest:
      source.sourceCompletionDigest,

    sourceRegistryDigest:
      source.sourceRegistryDigest,

    salesCoreLaunchReadinessApproved:
      true as const,

    activationPlanningPrepared:
      true as const,

    ownerActivationPlanDecisionRequired:
      true as const,

    plannedEmployees: [
      {
        employeeId:
          "employee-asha-inquiry-intake-v1" as const,
        employeeCode:
          "nx-sales-003" as const,
        launchSequence:
          3 as const,
        planningMode:
          "REVERSIBLE_INTERNAL_ONLY" as const,
        includedInActivationPlan:
          true as const,
        runtimeActivationAuthorized:
          false as const,
        runtimeActivationExecuted:
          false as const,
      },
      {
        employeeId:
          "employee-riya-recommendation-specialist-v1" as const,
        employeeCode:
          "nx-sales-004" as const,
        launchSequence:
          4 as const,
        planningMode:
          "REVERSIBLE_INTERNAL_ONLY" as const,
        includedInActivationPlan:
          true as const,
        runtimeActivationAuthorized:
          false as const,
        runtimeActivationExecuted:
          false as const,
      },
      {
        employeeId:
          "employee-meera-quotation-proposal-specialist-v1" as const,
        employeeCode:
          "nx-sales-005" as const,
        launchSequence:
          5 as const,
        planningMode:
          "REVERSIBLE_INTERNAL_ONLY" as const,
        includedInActivationPlan:
          true as const,
        runtimeActivationAuthorized:
          false as const,
        runtimeActivationExecuted:
          false as const,
      },
    ] as const,

    activationSequence:
      [3, 4, 5] as const,

    authorityBoundary: {
      internalPlanningOnly:
        true as const,
      runtimeActivationAuthorized:
        false as const,
      runtimeActivationExecuted:
        false as const,
      controlledWorkAuthorized:
        false as const,
      productionAuthorityGranted:
        false as const,
      realCustomerDataAccessAuthorized:
        false as const,
      realCustomerContactAuthorized:
        false as const,
      externalDeliveryAuthorized:
        false as const,
      liveProviderExecutionAuthorized:
        false as const,
      paymentExecutionAuthorized:
        false as const,
      autonomousExecutionAuthorized:
        false as const,
      publicLaunchAuthorized:
        false as const,
    },

    nextStep:
      "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION" as const,

    preparedAt:
      input.preparedAt,
  };

  const record =
    deepFreeze({
      ...planningCore,
      planningDigest:
        sha256(planningCore),
    }) as SalesCoreLaunchActivationPlanningRecord;

  validateSalesCoreLaunchActivationPlanningRecord(
    record,
  );

  return record;
}
