import {
  createHash,
} from "node:crypto";

import type {
  AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision,
} from "./ashaOwnerLimitedInternalPilotInquiryThreeReviewDecision";
import type {
  AIEmployeeTemplateRegistry,
} from "./employeeTemplateRegistry";
import type {
  MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision,
} from "./meeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision";
import type {
  RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,
} from "./riyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision";

export const SALES_CORE_LAUNCH_PILOT_COMPLETION_RECORD_VERSION =
  "sales-core-launch-pilot-completion-record-v1" as const;

export interface CreateSalesCoreLaunchPilotCompletionRecordInput {
  readonly completionId: string;
  readonly registry: AIEmployeeTemplateRegistry;
  readonly ashaDecision:
    AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision;
  readonly riyaDecision:
    RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision;
  readonly meeraDecision:
    MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision;
  readonly recordedAt: string;
}

export interface SalesCoreLaunchPilotCompletionRecord {
  readonly version:
    typeof SALES_CORE_LAUNCH_PILOT_COMPLETION_RECORD_VERSION;

  readonly completionId: string;

  readonly completionState:
    "SALES_CORE_LAUNCH_PILOT_COMPLETION_RECORDED";

  readonly department:
    "SALES";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly registryDigest: string;
  readonly registeredTemplateCount: 3;

  readonly completedEmployees: readonly [
    Readonly<{
      employeeId:
        "employee-asha-inquiry-intake-v1";
      employeeCode:
        "nx-sales-003";
      launchSequence: 3;
      sourceDecisionId: string;
      sourceDecisionDigest: string;
    }>,
    Readonly<{
      employeeId:
        "employee-riya-recommendation-specialist-v1";
      employeeCode:
        "nx-sales-004";
      launchSequence: 4;
      sourceDecisionId: string;
      sourceDecisionDigest: string;
    }>,
    Readonly<{
      employeeId:
        "employee-meera-quotation-proposal-specialist-v1";
      employeeCode:
        "nx-sales-005";
      launchSequence: 5;
      sourceDecisionId: string;
      sourceDecisionDigest: string;
    }>,
  ];

  readonly allLimitedInternalPilotsCompleted: true;
  readonly ownerReviewRequired: true;

  readonly authorityBoundary: Readonly<{
    productionAuthorityGranted: false;
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    autonomousExecutionAuthorized: false;
    paymentsAuthorized: false;
    publicLaunchAuthorized: false;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_SALES_CORE_LAUNCH_READINESS_DECISION";

  readonly recordedAt: string;
  readonly completionDigest: string;
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

  if (Array.isArray(value)) {
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

function digestObject(
  value: unknown,
): string {
  return createHash("sha256")
    .update(canonicalize(value))
    .digest("hex");
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
    !/^[0-9a-f]{64}$/.test(value)
  ) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireIsoTimestamp(
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
    digestObject(unsigned) !==
    digest
  ) {
    throw new Error(
      `${label} digest verification failed.`,
    );
  }
}

interface FinalPilotDecisionContract
  extends DigestBoundRecord {
  readonly decisionId: string;
  readonly decisionDigest: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly department: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly limitedInternalPilotCompleted:
    boolean;
  readonly nextStep: string;
}

function validateFinalPilotDecision(
  label: string,
  decision: FinalPilotDecisionContract,
  expectedEmployeeId: string,
  expectedEmployeeCode: string,
): void {
  verifyDigestBoundObject(
    label,
    decision,
    "decisionDigest",
  );

  requireSafeIdentifier(
    `${label} decision ID`,
    decision.decisionId,
  );

  requireSafeIdentifier(
    `${label} tenant ID`,
    decision.tenantId,
  );

  requireSafeIdentifier(
    `${label} owner ID`,
    decision.ownerId,
  );

  if (
    decision.employeeId !==
      expectedEmployeeId ||
    decision.employeeCode !==
      expectedEmployeeCode ||
    decision.department !==
      "SALES"
  ) {
    throw new Error(
      `${label} employee binding is invalid.`,
    );
  }

  if (
    decision.limitedInternalPilotCompleted !==
      true ||
    decision.nextStep !==
      "LIMITED_INTERNAL_PILOT_COMPLETE"
  ) {
    throw new Error(
      `${label} limited internal pilot is not complete.`,
    );
  }
}

function validateRegistry(
  registry: AIEmployeeTemplateRegistry,
): void {
  verifyDigestBoundObject(
    "Employee template registry",
    registry as unknown as DigestBoundRecord,
    "registryDigest",
  );

  if (
    registry.registeredTemplateCount !==
      3 ||
    registry.templates.length !==
      3
  ) {
    throw new Error(
      "Sales core-launch registry must contain exactly three templates.",
    );
  }

  const expected = [
    {
      employeeId:
        "employee-asha-inquiry-intake-v1",
      employeeCode:
        "nx-sales-003",
      launchSequence: 3,
    },
    {
      employeeId:
        "employee-riya-recommendation-specialist-v1",
      employeeCode:
        "nx-sales-004",
      launchSequence: 4,
    },
    {
      employeeId:
        "employee-meera-quotation-proposal-specialist-v1",
      employeeCode:
        "nx-sales-005",
      launchSequence: 5,
    },
  ] as const;

  for (const employee of expected) {
    const template =
      registry.templates.find(
        (candidate) =>
          candidate.employeeId ===
          employee.employeeId,
      );

    if (
      !template ||
      template.employeeCode !==
        employee.employeeCode ||
      template.department !==
        "SALES" ||
      template.managerRoleKey !==
        "founder-chief-of-staff" ||
      template.launchSequence !==
        employee.launchSequence
    ) {
      throw new Error(
        `Sales core-launch registry binding is invalid for ${employee.employeeId}.`,
      );
    }
  }

  if (
    registry.safetyBoundary
      .ownerControlRequired !== true ||
    registry.safetyBoundary
      .tenantIsolationRequired !== true ||
    registry.safetyBoundary
      .unqualifiedActivationBlocked !== true
  ) {
    throw new Error(
      "Sales core-launch registry safety boundary is invalid.",
    );
  }
}

export function validateSalesCoreLaunchPilotCompletionRecord(
  record: SalesCoreLaunchPilotCompletionRecord,
): void {
  verifyDigestBoundObject(
    "Sales core-launch pilot completion record",
    record as unknown as DigestBoundRecord,
    "completionDigest",
  );

  requireSafeIdentifier(
    "Sales completion ID",
    record.completionId,
  );

  requireSafeIdentifier(
    "Sales completion tenant ID",
    record.tenantId,
  );

  requireSafeIdentifier(
    "Sales completion owner ID",
    record.ownerId,
  );

  requireDigest(
    "Sales completion registry digest",
    record.registryDigest,
  );

  requireIsoTimestamp(
    "Sales completion recorded time",
    record.recordedAt,
  );

  if (
    record.version !==
      SALES_CORE_LAUNCH_PILOT_COMPLETION_RECORD_VERSION ||
    record.completionState !==
      "SALES_CORE_LAUNCH_PILOT_COMPLETION_RECORDED" ||
    record.department !==
      "SALES" ||
    record.registeredTemplateCount !==
      3 ||
    record.completedEmployees.length !==
      3 ||
    record.allLimitedInternalPilotsCompleted !==
      true ||
    record.ownerReviewRequired !==
      true ||
    record.nextStep !==
      "AWAIT_OWNER_SALES_CORE_LAUNCH_READINESS_DECISION"
  ) {
    throw new Error(
      "Sales core-launch pilot completion record is invalid.",
    );
  }

  if (
    record.authorityBoundary
      .productionAuthorityGranted !==
      false ||
    record.authorityBoundary
      .realCustomerContactAuthorized !==
      false ||
    record.authorityBoundary
      .externalDeliveryAuthorized !==
      false ||
    record.authorityBoundary
      .autonomousExecutionAuthorized !==
      false ||
    record.authorityBoundary
      .paymentsAuthorized !==
      false ||
    record.authorityBoundary
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Sales core-launch authority boundary is invalid.",
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

  record.completedEmployees.forEach(
    (employee, index) => {
      const expected =
        expectedEmployees[index];

      if (
        employee.employeeId !==
          expected[0] ||
        employee.employeeCode !==
          expected[1] ||
        employee.launchSequence !==
          expected[2]
      ) {
        throw new Error(
          "Sales completion employee sequence is invalid.",
        );
      }

      requireSafeIdentifier(
        "Sales source decision ID",
        employee.sourceDecisionId,
      );

      requireDigest(
        "Sales source decision digest",
        employee.sourceDecisionDigest,
      );
    },
  );
}

export function createSalesCoreLaunchPilotCompletionRecord(
  input: CreateSalesCoreLaunchPilotCompletionRecordInput,
): SalesCoreLaunchPilotCompletionRecord {
  requireSafeIdentifier(
    "Sales completion ID",
    input.completionId,
  );

  requireIsoTimestamp(
    "Sales completion recorded time",
    input.recordedAt,
  );

  validateRegistry(input.registry);

  const asha =
    input.ashaDecision as unknown as
      FinalPilotDecisionContract;
  const riya =
    input.riyaDecision as unknown as
      FinalPilotDecisionContract;
  const meera =
    input.meeraDecision as unknown as
      FinalPilotDecisionContract;

  validateFinalPilotDecision(
    "Asha final pilot decision",
    asha,
    "employee-asha-inquiry-intake-v1",
    "nx-sales-003",
  );

  validateFinalPilotDecision(
    "Riya final pilot decision",
    riya,
    "employee-riya-recommendation-specialist-v1",
    "nx-sales-004",
  );

  validateFinalPilotDecision(
    "Meera final pilot decision",
    meera,
    "employee-meera-quotation-proposal-specialist-v1",
    "nx-sales-005",
  );

  if (
    asha.tenantId !==
      riya.tenantId ||
    asha.tenantId !==
      meera.tenantId ||
    asha.ownerId !==
      riya.ownerId ||
    asha.ownerId !==
      meera.ownerId
  ) {
    throw new Error(
      "Sales completion decisions must share one tenant and owner.",
    );
  }

  const completionCore = {
    version:
      SALES_CORE_LAUNCH_PILOT_COMPLETION_RECORD_VERSION,

    completionId:
      input.completionId,

    completionState:
      "SALES_CORE_LAUNCH_PILOT_COMPLETION_RECORDED" as const,

    department:
      "SALES" as const,

    tenantId:
      asha.tenantId,

    ownerId:
      asha.ownerId,

    registryDigest:
      input.registry.registryDigest,

    registeredTemplateCount:
      3 as const,

    completedEmployees: [
      {
        employeeId:
          "employee-asha-inquiry-intake-v1" as const,
        employeeCode:
          "nx-sales-003" as const,
        launchSequence:
          3 as const,
        sourceDecisionId:
          asha.decisionId,
        sourceDecisionDigest:
          asha.decisionDigest,
      },
      {
        employeeId:
          "employee-riya-recommendation-specialist-v1" as const,
        employeeCode:
          "nx-sales-004" as const,
        launchSequence:
          4 as const,
        sourceDecisionId:
          riya.decisionId,
        sourceDecisionDigest:
          riya.decisionDigest,
      },
      {
        employeeId:
          "employee-meera-quotation-proposal-specialist-v1" as const,
        employeeCode:
          "nx-sales-005" as const,
        launchSequence:
          5 as const,
        sourceDecisionId:
          meera.decisionId,
        sourceDecisionDigest:
          meera.decisionDigest,
      },
    ] as const,

    allLimitedInternalPilotsCompleted:
      true as const,

    ownerReviewRequired:
      true as const,

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

    nextStep:
      "AWAIT_OWNER_SALES_CORE_LAUNCH_READINESS_DECISION" as const,

    recordedAt:
      input.recordedAt,
  };

  const record: SalesCoreLaunchPilotCompletionRecord =
    {
      ...completionCore,
      completionDigest:
        digestObject(completionCore),
    };

  validateSalesCoreLaunchPilotCompletionRecord(
    record,
  );

  return record;
}
