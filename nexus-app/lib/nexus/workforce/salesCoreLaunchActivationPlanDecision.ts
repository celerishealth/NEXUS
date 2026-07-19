import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchActivationPlanningRecord,
  type SalesCoreLaunchActivationPlanningRecord,
} from "./salesCoreLaunchActivationPlanningRecord";

export const SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION_VERSION =
  "sales-core-launch-activation-plan-decision-v1" as const;

export const SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISIONS = [
  "APPROVE_SALES_CORE_LAUNCH_ACTIVATION_PLAN",
  "REJECT_AND_RETAIN_SALES_CORE_LAUNCH_ACTIVATION_PLANNING",
] as const;

export type SalesCoreLaunchActivationPlanDecisionType =
  (
    typeof SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISIONS
  )[number];

export interface CreateSalesCoreLaunchActivationPlanDecisionInput {
  readonly salesCoreLaunchActivationPlanning:
    SalesCoreLaunchActivationPlanningRecord;

  readonly decisionId: string;
  readonly ownerId: string;

  readonly decision:
    SalesCoreLaunchActivationPlanDecisionType;

  readonly reason: string;
  readonly decidedAt: string;
}

export interface SalesCoreLaunchActivationPlanDecision {
  readonly version:
    typeof SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    "OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION_RECORDED";

  readonly department:
    "SALES";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;

  readonly sourceReadinessDecisionId:
    string;

  readonly sourceReadinessDecisionDigest:
    string;

  readonly sourceCompletionId: string;
  readonly sourceCompletionDigest: string;
  readonly sourceRegistryDigest: string;

  readonly decision:
    SalesCoreLaunchActivationPlanDecisionType;

  readonly activationPlanApproved:
    boolean;

  readonly runtimeActivationPreparationEligible:
    boolean;

  readonly reason: string;

  readonly reviewedPlan: Readonly<{
    planningState:
      "SALES_CORE_LAUNCH_ACTIVATION_PLANNING_RECORDED";

    plannedEmployeeCount:
      3;

    plannedEmployeeCodes: readonly [
      "nx-sales-003",
      "nx-sales-004",
      "nx-sales-005",
    ];

    activationSequence: readonly [
      3,
      4,
      5,
    ];

    planningMode:
      "REVERSIBLE_INTERNAL_ONLY";

    sourceOwnerActivationPlanDecisionRequired:
      true;

    sourceNextStep:
      "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION";
  }>;

  readonly employeeActivationEligibility:
    readonly [
      Readonly<{
        employeeId:
          "employee-asha-inquiry-intake-v1";

        employeeCode:
          "nx-sales-003";

        launchSequence:
          3;

        runtimeActivationEligible:
          boolean;

        runtimeActivationAuthorized:
          false;

        runtimeActivationExecuted:
          false;
      }>,
      Readonly<{
        employeeId:
          "employee-riya-recommendation-specialist-v1";

        employeeCode:
          "nx-sales-004";

        launchSequence:
          4;

        runtimeActivationEligible:
          boolean;

        runtimeActivationAuthorized:
          false;

        runtimeActivationExecuted:
          false;
      }>,
      Readonly<{
        employeeId:
          "employee-meera-quotation-proposal-specialist-v1";

        employeeCode:
          "nx-sales-005";

        launchSequence:
          5;

        runtimeActivationEligible:
          boolean;

        runtimeActivationAuthorized:
          false;

        runtimeActivationExecuted:
          false;
      }>,
    ];

  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded:
      true;

    ownerIdentityBound:
      true;

    activationPlanningBound:
      true;

    approvalBypassAllowed:
      false;

    runtimeActivationPreparationEligible:
      boolean;

    runtimeActivationAuthorized:
      false;

    runtimeActivationExecuted:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
      false;

    productionAuthorityGranted:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    autonomousExecutionAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly nextStep:
    | "PREPARE_SALES_CORE_LAUNCH_OWNER_ACTIVATED_RUNTIMES"
    | "RETAIN_SALES_CORE_LAUNCH_ACTIVATION_PLANNING_ONLY";

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
      "Sales activation-plan decision reason must be a canonical explanation between 20 and 1000 characters.",
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

export function validateSalesCoreLaunchActivationPlanDecision(
  record:
    SalesCoreLaunchActivationPlanDecision,
): void {
  verifyDigestBoundObject(
    "Sales core-launch activation-plan decision",
    record as unknown as
      DigestBoundRecord,
    "decisionDigest",
  );

  requireIdentifier(
    "Sales activation-plan decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Sales activation-plan tenant ID",
    record.tenantId,
  );

  requireIdentifier(
    "Sales activation-plan owner ID",
    record.ownerId,
  );

  requireIdentifier(
    "Sales source planning ID",
    record.sourcePlanningId,
  );

  requireIdentifier(
    "Sales source readiness decision ID",
    record.sourceReadinessDecisionId,
  );

  requireIdentifier(
    "Sales source completion ID",
    record.sourceCompletionId,
  );

  requireDigest(
    "Sales source planning digest",
    record.sourcePlanningDigest,
  );

  requireDigest(
    "Sales source readiness decision digest",
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

  requireReason(
    record.reason,
  );

  requireTimestamp(
    "Sales activation-plan decision time",
    record.decidedAt,
  );

  if (
    record.version !==
      SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION_RECORDED" ||
    record.department !==
      "SALES"
  ) {
    throw new Error(
      "Sales core-launch activation-plan decision identity is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_SALES_CORE_LAUNCH_ACTIVATION_PLAN" &&
    record.decision !==
      "REJECT_AND_RETAIN_SALES_CORE_LAUNCH_ACTIVATION_PLANNING"
  ) {
    throw new Error(
      "Sales core-launch activation-plan decision is invalid.",
    );
  }

  const approved =
    record.decision ===
      "APPROVE_SALES_CORE_LAUNCH_ACTIVATION_PLAN";

  if (
    record.activationPlanApproved !==
      approved ||
    record.runtimeActivationPreparationEligible !==
      approved
  ) {
    throw new Error(
      "Sales core-launch activation-plan approval state is invalid.",
    );
  }

  const plan =
    record.reviewedPlan;

  if (
    plan.planningState !==
      "SALES_CORE_LAUNCH_ACTIVATION_PLANNING_RECORDED" ||
    plan.plannedEmployeeCount !==
      3 ||
    plan.planningMode !==
      "REVERSIBLE_INTERNAL_ONLY" ||
    plan.sourceOwnerActivationPlanDecisionRequired !==
      true ||
    plan.sourceNextStep !==
      "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION"
  ) {
    throw new Error(
      "Sales core-launch reviewed activation plan is invalid.",
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
    plan.plannedEmployeeCodes.length !==
      3 ||
    plan.activationSequence.length !==
      3 ||
    record.employeeActivationEligibility.length !==
      3
  ) {
    throw new Error(
      "Sales core-launch activation-plan employee count is invalid.",
    );
  }

  record.employeeActivationEligibility.forEach(
    (employee, index) => {
      const expected =
        expectedEmployees[index];

      if (
        employee.employeeId !==
          expected[0] ||
        employee.employeeCode !==
          expected[1] ||
        employee.launchSequence !==
          expected[2] ||
        employee.runtimeActivationEligible !==
          approved ||
        employee.runtimeActivationAuthorized !==
          false ||
        employee.runtimeActivationExecuted !==
          false ||
        plan.plannedEmployeeCodes[index] !==
          expected[1] ||
        plan.activationSequence[index] !==
          expected[2]
      ) {
        throw new Error(
          "Sales core-launch employee activation eligibility is invalid.",
        );
      }
    },
  );

  const boundary =
    record.authorityBoundary;

  if (
    boundary.ownerDecisionRecorded !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.activationPlanningBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.runtimeActivationPreparationEligible !==
      approved ||
    boundary.runtimeActivationAuthorized !==
      false ||
    boundary.runtimeActivationExecuted !==
      false ||
    boundary.runtimeActivated !==
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
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Sales core-launch activation-plan authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "PREPARE_SALES_CORE_LAUNCH_OWNER_ACTIVATED_RUNTIMES"
      : "RETAIN_SALES_CORE_LAUNCH_ACTIVATION_PLANNING_ONLY";

  if (
    record.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Sales core-launch activation-plan next step is invalid.",
    );
  }
}

export function createSalesCoreLaunchActivationPlanDecision(
  input:
    CreateSalesCoreLaunchActivationPlanDecisionInput,
): SalesCoreLaunchActivationPlanDecision {
  const source =
    input.salesCoreLaunchActivationPlanning;

  validateSalesCoreLaunchActivationPlanningRecord(
    source,
  );

  requireIdentifier(
    "Sales activation-plan decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Sales activation-plan owner ID",
    input.ownerId,
  );

  requireReason(
    input.reason,
  );

  requireTimestamp(
    "Sales activation-plan decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Sales core-launch activation-plan decision owner does not match the planning owner.",
    );
  }

  if (
    input.decision !==
      "APPROVE_SALES_CORE_LAUNCH_ACTIVATION_PLAN" &&
    input.decision !==
      "REJECT_AND_RETAIN_SALES_CORE_LAUNCH_ACTIVATION_PLANNING"
  ) {
    throw new Error(
      "Sales core-launch activation-plan decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Sales core-launch activation-plan decision cannot precede activation planning.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_SALES_CORE_LAUNCH_ACTIVATION_PLAN";

  const decisionCore = {
    version:
      SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION_RECORDED" as const,

    department:
      "SALES" as const,

    tenantId:
      source.tenantId,

    ownerId:
      input.ownerId,

    sourcePlanningId:
      source.planningId,

    sourcePlanningDigest:
      source.planningDigest,

    sourceReadinessDecisionId:
      source.sourceReadinessDecisionId,

    sourceReadinessDecisionDigest:
      source.sourceReadinessDecisionDigest,

    sourceCompletionId:
      source.sourceCompletionId,

    sourceCompletionDigest:
      source.sourceCompletionDigest,

    sourceRegistryDigest:
      source.sourceRegistryDigest,

    decision:
      input.decision,

    activationPlanApproved:
      approved,

    runtimeActivationPreparationEligible:
      approved,

    reason:
      input.reason,

    reviewedPlan: {
      planningState:
        source.planningState,

      plannedEmployeeCount:
        3 as const,

      plannedEmployeeCodes: [
        source.plannedEmployees[0]
          .employeeCode,
        source.plannedEmployees[1]
          .employeeCode,
        source.plannedEmployees[2]
          .employeeCode,
      ] as const,

      activationSequence:
        source.activationSequence,

      planningMode:
        "REVERSIBLE_INTERNAL_ONLY" as const,

      sourceOwnerActivationPlanDecisionRequired:
        source.ownerActivationPlanDecisionRequired,

      sourceNextStep:
        source.nextStep,
    },

    employeeActivationEligibility: [
      {
        employeeId:
          source.plannedEmployees[0]
            .employeeId,

        employeeCode:
          source.plannedEmployees[0]
            .employeeCode,

        launchSequence:
          source.plannedEmployees[0]
            .launchSequence,

        runtimeActivationEligible:
          approved,

        runtimeActivationAuthorized:
          false as const,

        runtimeActivationExecuted:
          false as const,
      },
      {
        employeeId:
          source.plannedEmployees[1]
            .employeeId,

        employeeCode:
          source.plannedEmployees[1]
            .employeeCode,

        launchSequence:
          source.plannedEmployees[1]
            .launchSequence,

        runtimeActivationEligible:
          approved,

        runtimeActivationAuthorized:
          false as const,

        runtimeActivationExecuted:
          false as const,
      },
      {
        employeeId:
          source.plannedEmployees[2]
            .employeeId,

        employeeCode:
          source.plannedEmployees[2]
            .employeeCode,

        launchSequence:
          source.plannedEmployees[2]
            .launchSequence,

        runtimeActivationEligible:
          approved,

        runtimeActivationAuthorized:
          false as const,

        runtimeActivationExecuted:
          false as const,
      },
    ] as const,

    authorityBoundary: {
      ownerDecisionRecorded:
        true as const,

      ownerIdentityBound:
        true as const,

      activationPlanningBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      runtimeActivationPreparationEligible:
        approved,

      runtimeActivationAuthorized:
        false as const,

      runtimeActivationExecuted:
        false as const,

      runtimeActivated:
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
      approved
        ? "PREPARE_SALES_CORE_LAUNCH_OWNER_ACTIVATED_RUNTIMES" as const
        : "RETAIN_SALES_CORE_LAUNCH_ACTIVATION_PLANNING_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as SalesCoreLaunchActivationPlanDecision;

  validateSalesCoreLaunchActivationPlanDecision(
    decision,
  );

  return decision;
}
