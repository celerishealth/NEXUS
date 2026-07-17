import {
  createHash,
} from "node:crypto";

import {
  MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES,
} from "./meeraQuotationProposalSpecialistQualificationStandard";

import {
  validateMeeraQualificationTestingAdmission,
  type MeeraQualificationTestingAdmission,
} from "./meeraQualificationTestingAdmission";

export const MEERA_QUALIFICATION_TEST_PLAN_VERSION =
  "nexus-meera-qualification-test-plan-v1" as const;

export interface CreateMeeraQualificationTestPlanInput {
  readonly planId: string;

  readonly admission:
    MeeraQualificationTestingAdmission;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly plannedAt: string;
}

export interface MeeraQualificationPlannedCase {
  readonly sequence: number;
  readonly caseId: string;
  readonly competencyId: string;
  readonly title: string;
  readonly passCondition: string;
  readonly executionMode:
    "SANDBOX_ONLY";
  readonly evidenceRequired:
    true;
}

export interface MeeraQualificationTestPlan {
  readonly version:
    typeof MEERA_QUALIFICATION_TEST_PLAN_VERSION;

  readonly planId: string;

  readonly planState:
    "QUALIFICATION_TEST_PLAN_PREPARED";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly templateId:
    "template-meera-quotation-proposal-specialist-v1";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly admissionId: string;
  readonly admissionDigest: string;

  readonly decisionId: string;
  readonly decisionDigest: string;

  readonly readinessAssessmentId: string;
  readonly readinessDigest: string;

  readonly plannedCases:
    readonly MeeraQualificationPlannedCase[];

  readonly totalPlannedCases:
    12;

  readonly plannedAt: string;

  readonly testingPolicy: Readonly<{
    sandboxOnly: true;
    canonicalCasesRequired: true;
    everyCaseMustExecute: true;
    everyCaseMustPass: true;
    uniqueEvidenceDigestPerCaseRequired: true;
    deterministicExecutionRequired: true;
    tenantIsolationRequired: true;
    ownerReviewAfterExecutionRequired: true;
  }>;

  readonly executionBoundary: Readonly<{
    testPlanPrepared: true;
    fixturePackPrepared: false;
    qualificationTestingExecuted: false;
    formalQualificationIssued: false;
    automaticQualificationBlocked: true;
    productionReady: false;
  }>;

  readonly authorityBoundary: Readonly<{
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousDecisionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;

  readonly planDigest: string;
}

const SAFE_IDENTIFIER =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const SHA256 =
  /^[a-f0-9]{64}$/;

const FORBIDDEN_SECRET_TEXT =
  /(secret|token|password|authorization|bearer|cookie|private[-_ ]?key)/i;

function canonicalize(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value
      .map(canonicalize)
      .join(",")}]`;
  }

  if (typeof value === "object") {
    const record =
      value as Record<string, unknown>;

    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalize(record[key])}`,
      )
      .join(",")}}`;
  }

  throw new Error(
    "Unsupported deterministic Meera qualification-plan value.",
  );
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(canonicalize(value))
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
      const nestedValue of Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SAFE_IDENTIFIER.test(value) ||
    FORBIDDEN_SECRET_TEXT.test(value)
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireIsoTimestamp(
  value: string,
): void {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(
      "Meera qualification-plan time must be an exact ISO timestamp.",
    );
  }
}

export function createMeeraQualificationTestPlan(
  input:
    CreateMeeraQualificationTestPlanInput,
): MeeraQualificationTestPlan {
  requireIdentifier(
    "Meera qualification planId",
    input.planId,
  );

  requireIdentifier(
    "Meera qualification tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "Meera qualification ownerId",
    input.ownerId,
  );

  requireIsoTimestamp(
    input.plannedAt,
  );

  validateMeeraQualificationTestingAdmission(
    input.admission,
  );

  if (
    input.admission.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    input.admission.templateId !==
      "template-meera-quotation-proposal-specialist-v1"
  ) {
    throw new Error(
      "Meera qualification-plan identity is invalid.",
    );
  }

  if (
    input.admission.tenantId !==
      input.tenantId
  ) {
    throw new Error(
      "Cross-tenant Meera qualification planning is blocked.",
    );
  }

  if (
    input.admission.ownerId !==
      input.ownerId
  ) {
    throw new Error(
      "Only the admission-bound owner can prepare the Meera qualification plan.",
    );
  }

  if (
    input.admission.admissionState !==
      "QUALIFICATION_TESTING_ADMITTED" ||
    input.admission.admissionBoundary
      .qualificationTestingAdmissionAuthorized !==
      true ||
    input.admission.admissionBoundary
      .qualificationTestingExecuted !==
      false ||
    input.admission.admissionBoundary
      .formalQualificationIssued !==
      false
  ) {
    throw new Error(
      "Meera qualification admission is not eligible for test planning.",
    );
  }

  const plannedCases =
    MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES.map(
      (
        qualificationCase,
        index,
      ): MeeraQualificationPlannedCase => ({
        sequence:
          index + 1,

        caseId:
          qualificationCase.caseId,

        competencyId:
          qualificationCase.competencyId,

        title:
          qualificationCase.title,

        passCondition:
          qualificationCase.passCondition,

        executionMode:
          "SANDBOX_ONLY",

        evidenceRequired:
          true,
      }),
    );

  if (
    plannedCases.length !==
      12 ||
    new Set(
      plannedCases.map(
        (plannedCase) =>
          plannedCase.caseId,
      ),
    ).size !==
      12
  ) {
    throw new Error(
      "Meera qualification plan must contain exactly 12 unique canonical cases.",
    );
  }

  const planCore = {
    version:
      MEERA_QUALIFICATION_TEST_PLAN_VERSION,

    planId:
      input.planId,

    planState:
      "QUALIFICATION_TEST_PLAN_PREPARED" as const,

    employeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    templateId:
      "template-meera-quotation-proposal-specialist-v1" as const,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    admissionId:
      input.admission.admissionId,

    admissionDigest:
      input.admission.admissionDigest,

    decisionId:
      input.admission.decisionId,

    decisionDigest:
      input.admission.decisionDigest,

    readinessAssessmentId:
      input.admission.readinessAssessmentId,

    readinessDigest:
      input.admission.readinessDigest,

    plannedCases,

    totalPlannedCases:
      12 as const,

    plannedAt:
      input.plannedAt,

    testingPolicy: {
      sandboxOnly:
        true as const,

      canonicalCasesRequired:
        true as const,

      everyCaseMustExecute:
        true as const,

      everyCaseMustPass:
        true as const,

      uniqueEvidenceDigestPerCaseRequired:
        true as const,

      deterministicExecutionRequired:
        true as const,

      tenantIsolationRequired:
        true as const,

      ownerReviewAfterExecutionRequired:
        true as const,
    },

    executionBoundary: {
      testPlanPrepared:
        true as const,

      fixturePackPrepared:
        false as const,

      qualificationTestingExecuted:
        false as const,

      formalQualificationIssued:
        false as const,

      automaticQualificationBlocked:
        true as const,

      productionReady:
        false as const,
    },

    authorityBoundary: {
      realCustomerContactAuthorized:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionMutationAuthorized:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      autonomousDecisionAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,
    },
  };

  return deepFreeze({
    ...planCore,

    planDigest:
      sha256(planCore),
  });
}

export function validateMeeraQualificationTestPlan(
  plan:
    MeeraQualificationTestPlan,
): void {
  if (
    plan.version !==
      MEERA_QUALIFICATION_TEST_PLAN_VERSION ||
    plan.planState !==
      "QUALIFICATION_TEST_PLAN_PREPARED" ||
    plan.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    plan.templateId !==
      "template-meera-quotation-proposal-specialist-v1" ||
    plan.totalPlannedCases !==
      12 ||
    plan.plannedCases.length !==
      12
  ) {
    throw new Error(
      "Meera qualification test plan identity is invalid.",
    );
  }

  const expectedCaseIds =
    MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES.map(
      (qualificationCase) =>
        qualificationCase.caseId,
    );

  const actualCaseIds =
    plan.plannedCases.map(
      (plannedCase) =>
        plannedCase.caseId,
    );

  if (
    actualCaseIds.some(
      (
        caseId,
        index,
      ) =>
        caseId !==
        expectedCaseIds[index],
    ) ||
    new Set(actualCaseIds).size !==
      12
  ) {
    throw new Error(
      "Meera qualification plan canonical cases are invalid.",
    );
  }

  if (
    plan.plannedCases.some(
      (
        plannedCase,
        index,
      ) =>
        plannedCase.sequence !==
          index + 1 ||
        plannedCase.executionMode !==
          "SANDBOX_ONLY" ||
        plannedCase.evidenceRequired !==
          true,
    )
  ) {
    throw new Error(
      "Meera qualification planned-case boundary is invalid.",
    );
  }

  if (
    !SHA256.test(
      plan.admissionDigest,
    ) ||
    !SHA256.test(
      plan.decisionDigest,
    ) ||
    !SHA256.test(
      plan.readinessDigest,
    )
  ) {
    throw new Error(
      "Meera qualification plan source evidence is invalid.",
    );
  }

  if (
    plan.testingPolicy.sandboxOnly !==
      true ||
    plan.testingPolicy.canonicalCasesRequired !==
      true ||
    plan.testingPolicy.everyCaseMustExecute !==
      true ||
    plan.testingPolicy.everyCaseMustPass !==
      true ||
    plan.testingPolicy.uniqueEvidenceDigestPerCaseRequired !==
      true ||
    plan.testingPolicy.deterministicExecutionRequired !==
      true ||
    plan.testingPolicy.tenantIsolationRequired !==
      true ||
    plan.testingPolicy.ownerReviewAfterExecutionRequired !==
      true
  ) {
    throw new Error(
      "Meera qualification testing policy is invalid.",
    );
  }

  if (
    Object.values(
      plan.authorityBoundary,
    ).some(
      (authorized) =>
        authorized !== false,
    )
  ) {
    throw new Error(
      "Meera qualification plan authority boundary is invalid.",
    );
  }

  const {
    planDigest,
    ...planCore
  } = plan;

  if (
    !SHA256.test(planDigest) ||
    planDigest !==
      sha256(planCore)
  ) {
    throw new Error(
      "Meera qualification test plan integrity is invalid.",
    );
  }
}
