import {
  createHash,
} from "node:crypto";

import {
  RIYA_QUALIFICATION_READINESS_ASSESSMENT_VERSION,
  validateRiyaQualificationReadinessAssessment,
  type RiyaQualificationReadinessAssessment,
} from "./riyaQualificationReadinessAssessment";

export const RIYA_OWNER_QUALIFICATION_REVIEW_DECISION_VERSION =
  "nexus-riya-owner-qualification-review-decision-v1" as const;

export const RIYA_OWNER_QUALIFICATION_REVIEW_DECISIONS =
  [
    "APPROVE_FORMAL_QUALIFICATION_TESTING",
    "REJECT_FORMAL_QUALIFICATION_TESTING",
  ] as const;

export type RiyaOwnerQualificationReviewDecisionValue =
  (typeof RIYA_OWNER_QUALIFICATION_REVIEW_DECISIONS)[number];

export interface CreateRiyaOwnerQualificationReviewDecisionInput {
  readonly decisionId: string;

  readonly readiness:
    RiyaQualificationReadinessAssessment;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly decision:
    RiyaOwnerQualificationReviewDecisionValue;

  readonly rationale: string;
  readonly decidedAt: string;
}

export interface RiyaOwnerQualificationReviewDecision {
  readonly version:
    typeof RIYA_OWNER_QUALIFICATION_REVIEW_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    "OWNER_QUALIFICATION_REVIEW_RECORDED";

  readonly employeeId:
    "employee-riya-recommendation-specialist-v1";

  readonly templateId:
    "template-riya-recommendation-specialist-v1";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly readinessAssessmentId: string;
  readonly readinessDigest: string;

  readonly decision:
    RiyaOwnerQualificationReviewDecisionValue;

  readonly rationale: string;
  readonly decidedAt: string;

  readonly ownerApprovedForQualificationTesting:
    boolean;

  readonly qualificationTestingAdmissionEligible:
    boolean;

  readonly nextStep:
    | "CREATE_QUALIFICATION_TESTING_ADMISSION"
    | "RETAIN_REGISTERED_UNQUALIFIED_STATE";

  readonly reviewBoundary: Readonly<{
    ownerDecisionRequired: true;
    ownerIdentityBound: true;
    tenantIdentityBound: true;
    readinessDigestBound: true;
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

  readonly decisionDigest: string;
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
    "Unsupported deterministic Riya owner-review value.",
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
      "Riya owner-review decision time must be an exact ISO timestamp.",
    );
  }
}

function requireRationale(
  value: string,
): string {
  if (
    typeof value !== "string" ||
    value.trim() !== value ||
    value.length < 10 ||
    value.length > 1000 ||
    FORBIDDEN_SECRET_TEXT.test(value)
  ) {
    throw new Error(
      "Riya owner-review rationale is invalid.",
    );
  }

  return value;
}

export function createRiyaOwnerQualificationReviewDecision(
  input:
    CreateRiyaOwnerQualificationReviewDecisionInput,
): RiyaOwnerQualificationReviewDecision {
  requireIdentifier(
    "Riya decisionId",
    input.decisionId,
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
    input.decidedAt,
  );

  const rationale =
    requireRationale(
      input.rationale,
    );

  validateRiyaQualificationReadinessAssessment(
    input.readiness,
  );

  if (
    input.readiness.version !==
      RIYA_QUALIFICATION_READINESS_ASSESSMENT_VERSION ||
    input.readiness.assessmentState !==
      "READY_FOR_OWNER_QUALIFICATION_REVIEW"
  ) {
    throw new Error(
      "Riya readiness assessment is not reviewable.",
    );
  }

  if (
    input.readiness.employeeId !==
      "employee-riya-recommendation-specialist-v1" ||
    input.readiness.templateId !==
      "template-riya-recommendation-specialist-v1"
  ) {
    throw new Error(
      "Riya owner-review employee identity is invalid.",
    );
  }

  if (
    input.readiness.tenantId !==
      input.tenantId
  ) {
    throw new Error(
      "Cross-tenant Riya qualification review is blocked.",
    );
  }

  if (
    input.readiness.ownerId !==
      input.ownerId
  ) {
    throw new Error(
      "Only the readiness-bound owner can review Riya qualification.",
    );
  }

  if (
    !RIYA_OWNER_QUALIFICATION_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Riya owner qualification decision is invalid.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_FORMAL_QUALIFICATION_TESTING";

  const decisionCore = {
    version:
      RIYA_OWNER_QUALIFICATION_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_QUALIFICATION_REVIEW_RECORDED" as const,

    employeeId:
      "employee-riya-recommendation-specialist-v1" as const,

    templateId:
      "template-riya-recommendation-specialist-v1" as const,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    readinessAssessmentId:
      input.readiness.assessmentId,

    readinessDigest:
      input.readiness.readinessDigest,

    decision:
      input.decision,

    rationale,

    decidedAt:
      input.decidedAt,

    ownerApprovedForQualificationTesting:
      approved,

    qualificationTestingAdmissionEligible:
      approved,

    nextStep:
      approved
        ? "CREATE_QUALIFICATION_TESTING_ADMISSION" as const
        : "RETAIN_REGISTERED_UNQUALIFIED_STATE" as const,

    reviewBoundary: {
      ownerDecisionRequired:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      readinessDigestBound:
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
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  });
}

export function validateRiyaOwnerQualificationReviewDecision(
  decision:
    RiyaOwnerQualificationReviewDecision,
): void {
  if (
    decision.version !==
      RIYA_OWNER_QUALIFICATION_REVIEW_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_QUALIFICATION_REVIEW_RECORDED" ||
    decision.employeeId !==
      "employee-riya-recommendation-specialist-v1" ||
    decision.templateId !==
      "template-riya-recommendation-specialist-v1" ||
    !RIYA_OWNER_QUALIFICATION_REVIEW_DECISIONS.includes(
      decision.decision,
    )
  ) {
    throw new Error(
      "Riya owner qualification review identity is invalid.",
    );
  }

  const approved =
    decision.decision ===
    "APPROVE_FORMAL_QUALIFICATION_TESTING";

  if (
    decision.ownerApprovedForQualificationTesting !==
      approved ||
    decision.qualificationTestingAdmissionEligible !==
      approved ||
    decision.nextStep !==
      (
        approved
          ? "CREATE_QUALIFICATION_TESTING_ADMISSION"
          : "RETAIN_REGISTERED_UNQUALIFIED_STATE"
      )
  ) {
    throw new Error(
      "Riya owner qualification review outcome is invalid.",
    );
  }

  if (
    !SHA256.test(
      decision.readinessDigest,
    )
  ) {
    throw new Error(
      "Riya readiness digest is invalid.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = decision;

  if (
    !SHA256.test(decisionDigest) ||
    decisionDigest !==
      sha256(decisionCore)
  ) {
    throw new Error(
      "Riya owner qualification review integrity is invalid.",
    );
  }
}