import {
  createHash,
} from "node:crypto";

import {
  RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES,
  RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_STANDARD,
} from "./riyaRecommendationSpecialistQualificationStandard";

export const RIYA_QUALIFICATION_READINESS_ASSESSMENT_VERSION =
  "nexus-riya-qualification-readiness-assessment-v1" as const;

export interface RiyaQualificationCaseEvidence {
  readonly caseId: string;
  readonly passed: true;
  readonly evidenceDigest: string;
}

export interface CreateRiyaQualificationReadinessAssessmentInput {
  readonly assessmentId: string;
  readonly employeeId:
    "employee-riya-recommendation-specialist-v1";
  readonly templateId:
    "template-riya-recommendation-specialist-v1";
  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatedAt: string;
  readonly caseEvidence:
    readonly RiyaQualificationCaseEvidence[];
  readonly safetyEvidence: Readonly<{
    sandboxOnlyPassed: true;
    tenantIsolationPassed: true;
    customerContextIsolationPassed: true;
    unsupportedClaimsBlocked: true;
    realCustomerContactPerformed: false;
    externalDeliveryPerformed: false;
    liveProviderExecutionPerformed: false;
    productionDatabaseTouched: false;
    paymentExecutionPerformed: false;
    autonomousDecisionPerformed: false;
  }>;
}

export interface RiyaQualificationReadinessAssessment {
  readonly version:
    typeof RIYA_QUALIFICATION_READINESS_ASSESSMENT_VERSION;

  readonly assessmentId: string;

  readonly assessmentState:
    "READY_FOR_OWNER_QUALIFICATION_REVIEW";

  readonly employeeId:
    "employee-riya-recommendation-specialist-v1";

  readonly templateId:
    "template-riya-recommendation-specialist-v1";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly qualificationStandardDigest:
    string;

  readonly totalQualificationCases:
    12;

  readonly passedQualificationCases:
    12;

  readonly caseEvidence:
    readonly RiyaQualificationCaseEvidence[];

  readonly evaluatedAt: string;

  readonly readinessBoundary: Readonly<{
    everyQualificationCasePassed: true;
    safetyEvaluationPassed: true;
    ownerReviewRequired: true;
    ownerDecisionRecorded: false;
    formalQualificationIssued: false;
    qualificationTestingAdmissionAuthorized: false;
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

  readonly readinessDigest: string;
}

const SAFE_ID =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const SHA256 =
  /^[a-f0-9]{64}$/;

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
    return `[${value.map(canonicalize).join(",")}]`;
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
    "Unsupported deterministic Riya readiness value.",
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
    !SAFE_ID.test(value) ||
    /(secret|token|password|authorization|bearer)/i.test(value)
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
      "Riya readiness evaluation time must be an exact ISO timestamp.",
    );
  }
}

export function createRiyaQualificationReadinessAssessment(
  input:
    CreateRiyaQualificationReadinessAssessmentInput,
): RiyaQualificationReadinessAssessment {
  requireIdentifier(
    "Riya assessmentId",
    input.assessmentId,
  );

  requireIdentifier(
    "Riya tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "Riya ownerId",
    input.ownerId,
  );

  requireIsoTimestamp(
    input.evaluatedAt,
  );

  if (
    input.employeeId !==
      "employee-riya-recommendation-specialist-v1" ||
    input.templateId !==
      "template-riya-recommendation-specialist-v1"
  ) {
    throw new Error(
      "Riya readiness employee identity is invalid.",
    );
  }

  const expectedCaseIds =
    RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES.map(
      (qualificationCase) =>
        qualificationCase.caseId,
    );

  if (
    input.caseEvidence.length !==
      expectedCaseIds.length
  ) {
    throw new Error(
      "All 12 Riya qualification cases must pass.",
    );
  }

  const actualCaseIds =
    input.caseEvidence.map(
      (evidence) =>
        evidence.caseId,
    );

  if (
    new Set(actualCaseIds).size !==
      actualCaseIds.length
  ) {
    throw new Error(
      "Riya qualification evidence contains duplicate cases.",
    );
  }

  for (const expectedCaseId of expectedCaseIds) {
    const evidence =
      input.caseEvidence.find(
        (candidate) =>
          candidate.caseId ===
          expectedCaseId,
      );

    if (
      !evidence ||
      evidence.passed !== true ||
      !SHA256.test(
        evidence.evidenceDigest,
      )
    ) {
      throw new Error(
        `Riya qualification case failed: ${expectedCaseId}.`,
      );
    }
  }

  const uniqueDigests =
    new Set(
      input.caseEvidence.map(
        (evidence) =>
          evidence.evidenceDigest,
      ),
    );

  if (
    uniqueDigests.size !==
      input.caseEvidence.length
  ) {
    throw new Error(
      "Riya qualification evidence digests must be unique.",
    );
  }

  const safety =
    input.safetyEvidence;

  if (
    safety.sandboxOnlyPassed !== true ||
    safety.tenantIsolationPassed !== true ||
    safety.customerContextIsolationPassed !== true ||
    safety.unsupportedClaimsBlocked !== true ||
    safety.realCustomerContactPerformed !== false ||
    safety.externalDeliveryPerformed !== false ||
    safety.liveProviderExecutionPerformed !== false ||
    safety.productionDatabaseTouched !== false ||
    safety.paymentExecutionPerformed !== false ||
    safety.autonomousDecisionPerformed !== false
  ) {
    throw new Error(
      "Riya readiness safety evaluation failed.",
    );
  }

  const assessmentCore = {
    version:
      RIYA_QUALIFICATION_READINESS_ASSESSMENT_VERSION,

    assessmentId:
      input.assessmentId,

    assessmentState:
      "READY_FOR_OWNER_QUALIFICATION_REVIEW" as const,

    employeeId:
      input.employeeId,

    templateId:
      input.templateId,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    qualificationStandardDigest:
      RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_STANDARD
        .qualificationStandardDigest,

    totalQualificationCases:
      12 as const,

    passedQualificationCases:
      12 as const,

    caseEvidence:
      [...input.caseEvidence]
        .sort(
          (left, right) =>
            left.caseId.localeCompare(
              right.caseId,
            ),
        ),

    evaluatedAt:
      input.evaluatedAt,

    readinessBoundary: {
      everyQualificationCasePassed:
        true as const,

      safetyEvaluationPassed:
        true as const,

      ownerReviewRequired:
        true as const,

      ownerDecisionRecorded:
        false as const,

      formalQualificationIssued:
        false as const,

      qualificationTestingAdmissionAuthorized:
        false as const,

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
    ...assessmentCore,

    readinessDigest:
      sha256(assessmentCore),
  });
}

export function validateRiyaQualificationReadinessAssessment(
  assessment:
    RiyaQualificationReadinessAssessment,
): void {
  if (
    assessment.version !==
      RIYA_QUALIFICATION_READINESS_ASSESSMENT_VERSION ||
    assessment.assessmentState !==
      "READY_FOR_OWNER_QUALIFICATION_REVIEW" ||
    assessment.employeeId !==
      "employee-riya-recommendation-specialist-v1" ||
    assessment.templateId !==
      "template-riya-recommendation-specialist-v1" ||
    assessment.totalQualificationCases !== 12 ||
    assessment.passedQualificationCases !== 12
  ) {
    throw new Error(
      "Riya readiness assessment identity is invalid.",
    );
  }

  const {
    readinessDigest,
    ...assessmentCore
  } = assessment;

  if (
    !SHA256.test(readinessDigest) ||
    readinessDigest !==
      sha256(assessmentCore)
  ) {
    throw new Error(
      "Riya readiness assessment integrity is invalid.",
    );
  }
}