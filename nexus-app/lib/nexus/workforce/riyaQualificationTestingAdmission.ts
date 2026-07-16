import {
  createHash,
} from "node:crypto";

import {
  validateRiyaOwnerQualificationReviewDecision,
  type RiyaOwnerQualificationReviewDecision,
} from "./riyaOwnerQualificationReviewDecision";

export const RIYA_QUALIFICATION_TESTING_ADMISSION_VERSION =
  "nexus-riya-qualification-testing-admission-v1" as const;

export interface CreateRiyaQualificationTestingAdmissionInput {
  readonly admissionId: string;

  readonly decision:
    RiyaOwnerQualificationReviewDecision;

  readonly employeeId:
    "employee-riya-recommendation-specialist-v1";

  readonly templateId:
    "template-riya-recommendation-specialist-v1";

  readonly tenantId: string;
  readonly ownerId: string;
  readonly preparedAt: string;
}

export interface RiyaQualificationTestingAdmission {
  readonly version:
    typeof RIYA_QUALIFICATION_TESTING_ADMISSION_VERSION;

  readonly admissionId: string;

  readonly admissionState:
    "QUALIFICATION_TESTING_ADMITTED";

  readonly employeeId:
    "employee-riya-recommendation-specialist-v1";

  readonly templateId:
    "template-riya-recommendation-specialist-v1";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly decisionId: string;
  readonly decisionDigest: string;

  readonly readinessAssessmentId: string;
  readonly readinessDigest: string;

  readonly preparedAt: string;

  readonly testingPolicy: Readonly<{
    sandboxOnly: true;
    requiredQualificationCases: 12;
    everyCaseMustPass: true;
    uniqueEvidenceDigestsRequired: true;
    tenantIsolationRequired: true;
    customerContextIsolationRequired: true;
    unsupportedClaimsBlocked: true;
    ownerApprovalBound: true;
  }>;

  readonly admissionBoundary: Readonly<{
    qualificationTestingAdmissionAuthorized: true;
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

  readonly admissionDigest: string;
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
    "Unsupported deterministic Riya testing-admission value.",
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
      "Riya testing-admission preparation time must be an exact ISO timestamp.",
    );
  }
}

export function createRiyaQualificationTestingAdmission(
  input:
    CreateRiyaQualificationTestingAdmissionInput,
): RiyaQualificationTestingAdmission {
  requireIdentifier(
    "Riya admissionId",
    input.admissionId,
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
    input.preparedAt,
  );

  validateRiyaOwnerQualificationReviewDecision(
    input.decision,
  );

  if (
    input.employeeId !==
      "employee-riya-recommendation-specialist-v1" ||
    input.templateId !==
      "template-riya-recommendation-specialist-v1" ||
    input.decision.employeeId !==
      input.employeeId ||
    input.decision.templateId !==
      input.templateId
  ) {
    throw new Error(
      "Riya testing-admission identity is invalid.",
    );
  }

  if (
    input.decision.tenantId !==
      input.tenantId
  ) {
    throw new Error(
      "Cross-tenant Riya testing admission is blocked.",
    );
  }

  if (
    input.decision.ownerId !==
      input.ownerId
  ) {
    throw new Error(
      "Only the decision-bound owner can admit Riya qualification testing.",
    );
  }

  if (
    input.decision.decision !==
      "APPROVE_FORMAL_QUALIFICATION_TESTING" ||
    input.decision.ownerApprovedForQualificationTesting !==
      true ||
    input.decision.qualificationTestingAdmissionEligible !==
      true ||
    input.decision.nextStep !==
      "CREATE_QUALIFICATION_TESTING_ADMISSION"
  ) {
    throw new Error(
      "Rejected Riya qualification review cannot create testing admission.",
    );
  }

  const admissionCore = {
    version:
      RIYA_QUALIFICATION_TESTING_ADMISSION_VERSION,

    admissionId:
      input.admissionId,

    admissionState:
      "QUALIFICATION_TESTING_ADMITTED" as const,

    employeeId:
      input.employeeId,

    templateId:
      input.templateId,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    decisionId:
      input.decision.decisionId,

    decisionDigest:
      input.decision.decisionDigest,

    readinessAssessmentId:
      input.decision.readinessAssessmentId,

    readinessDigest:
      input.decision.readinessDigest,

    preparedAt:
      input.preparedAt,

    testingPolicy: {
      sandboxOnly:
        true as const,

      requiredQualificationCases:
        12 as const,

      everyCaseMustPass:
        true as const,

      uniqueEvidenceDigestsRequired:
        true as const,

      tenantIsolationRequired:
        true as const,

      customerContextIsolationRequired:
        true as const,

      unsupportedClaimsBlocked:
        true as const,

      ownerApprovalBound:
        true as const,
    },

    admissionBoundary: {
      qualificationTestingAdmissionAuthorized:
        true as const,

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
    ...admissionCore,

    admissionDigest:
      sha256(admissionCore),
  });
}

export function validateRiyaQualificationTestingAdmission(
  admission:
    RiyaQualificationTestingAdmission,
): void {
  if (
    admission.version !==
      RIYA_QUALIFICATION_TESTING_ADMISSION_VERSION ||
    admission.admissionState !==
      "QUALIFICATION_TESTING_ADMITTED" ||
    admission.employeeId !==
      "employee-riya-recommendation-specialist-v1" ||
    admission.templateId !==
      "template-riya-recommendation-specialist-v1" ||
    admission.testingPolicy.requiredQualificationCases !==
      12 ||
    admission.admissionBoundary
      .qualificationTestingAdmissionAuthorized !==
      true ||
    admission.admissionBoundary
      .qualificationTestingExecuted !==
      false ||
    admission.admissionBoundary
      .formalQualificationIssued !==
      false ||
    admission.admissionBoundary
      .productionReady !==
      false
  ) {
    throw new Error(
      "Riya qualification testing admission is invalid.",
    );
  }

  if (
    !SHA256.test(
      admission.decisionDigest,
    ) ||
    !SHA256.test(
      admission.readinessDigest,
    )
  ) {
    throw new Error(
      "Riya qualification testing admission evidence is invalid.",
    );
  }

  const {
    admissionDigest,
    ...admissionCore
  } = admission;

  if (
    !SHA256.test(admissionDigest) ||
    admissionDigest !==
      sha256(admissionCore)
  ) {
    throw new Error(
      "Riya qualification testing admission integrity is invalid.",
    );
  }
}