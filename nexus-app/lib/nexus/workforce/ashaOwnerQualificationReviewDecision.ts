import {
  createHash,
} from "node:crypto";

import {
  ASHA_SHADOW_QUALIFICATION_READINESS_VERSION,
  type AshaShadowQualificationReadinessEvidence,
} from "./ashaShadowQualificationReadiness";

export const ASHA_OWNER_QUALIFICATION_REVIEW_DECISION_VERSION =
  "nexus-asha-owner-qualification-review-decision-v1" as const;

export const ASHA_OWNER_QUALIFICATION_REVIEW_DECISIONS = [
  "APPROVE_FORMAL_QUALIFICATION_TESTING",
  "REJECT_FORMAL_QUALIFICATION_TESTING",
] as const;

export type AshaOwnerQualificationReviewDecisionType =
  (typeof ASHA_OWNER_QUALIFICATION_REVIEW_DECISIONS)[number];

export interface CreateAshaOwnerQualificationReviewDecisionInput {
  readonly readinessEvidence:
    AshaShadowQualificationReadinessEvidence;
  readonly decisionId: string;
  readonly ownerId: string;
  readonly decision:
    AshaOwnerQualificationReviewDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface AshaOwnerQualificationReviewDecision {
  readonly version:
    typeof ASHA_OWNER_QUALIFICATION_REVIEW_DECISION_VERSION;
  readonly decisionId: string;
  readonly readinessId: string;
  readonly readinessDigest: string;
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;
  readonly decision:
    AshaOwnerQualificationReviewDecisionType;
  readonly ownerApprovedForQualificationTesting: boolean;
  readonly qualificationTestingAdmissionEligible: boolean;
  readonly reason: string;
  readonly authorityBoundary: Readonly<{
    ownerDecisionRequired: true;
    ownerIdentityBound: true;
    readinessDigestBound: true;
    approvalBypassAllowed: false;
    qualificationTestingExecuted: false;
    qualificationEngineInvoked: false;
    formalQualificationIssued: false;
    qualifiedManifestCreated: false;
    activationCandidateCreated: false;
    runtimeActivated: false;
    productionReadinessAuthorized: false;
    customerDataAccessAuthorized: false;
    customerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousDecisionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly decidedAt: string;
  readonly decisionDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

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
            stableStringify(
              record[key],
            ),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic qualification-review value.",
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
        (
          value as unknown as
            Record<string, unknown>
        )[propertyName];

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

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a safe identifier.",
    );
  }
}

function requireSha256(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a SHA-256 digest.",
    );
  }
}

function requireIsoDate(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      label +
        " must be a valid ISO timestamp.",
    );
  }
}

function requireText(
  label: string,
  value: string,
  minimumLength: number,
  maximumLength: number,
): void {
  if (
    typeof value !== "string" ||
    value.trim().length < minimumLength ||
    value.trim().length > maximumLength
  ) {
    throw new Error(
      label +
        " must contain between " +
        minimumLength +
        " and " +
        maximumLength +
        " characters.",
    );
  }
}

function validateReadinessEvidence(
  evidence:
    AshaShadowQualificationReadinessEvidence,
): void {
  if (
    evidence.version !==
      ASHA_SHADOW_QUALIFICATION_READINESS_VERSION
  ) {
    throw new Error(
      "Asha qualification readiness evidence version is invalid.",
    );
  }

  requireIdentifier(
    "readinessId",
    evidence.readinessId,
  );

  requireIdentifier(
    "employeeId",
    evidence.employeeId,
  );

  requireIdentifier(
    "templateId",
    evidence.templateId,
  );

  requireIdentifier(
    "tenantId",
    evidence.tenantId,
  );

  requireIdentifier(
    "ownerId",
    evidence.ownerId,
  );

  requireIdentifier(
    "evaluatorId",
    evidence.evaluatorId,
  );

  requireIdentifier(
    "sessionId",
    evidence.sessionId,
  );

  requireIdentifier(
    "ledgerId",
    evidence.ledgerId,
  );

  requireSha256(
    "admission digest",
    evidence.admissionDigest,
  );

  requireSha256(
    "evaluation report digest",
    evidence.evaluationReportDigest,
  );

  requireSha256(
    "session digest",
    evidence.sessionDigest,
  );

  requireSha256(
    "ledger digest",
    evidence.ledgerDigest,
  );

  requireSha256(
    "readiness digest",
    evidence.readinessDigest,
  );

  requireIsoDate(
    "readiness review time",
    evidence.reviewedAt,
  );

  if (
    evidence.summary.totalObservations !==
      evidence.observationEvidence.length
  ) {
    throw new Error(
      "Readiness observation count does not match its evidence.",
    );
  }

  const passedObservations =
    evidence.observationEvidence.filter(
      (observation) =>
        observation.outcome === "PASS",
    ).length;

  const failedClosedObservations =
    evidence.observationEvidence.length -
    passedObservations;

  if (
    evidence.summary.passedObservations !==
      passedObservations ||
    evidence.summary.failedClosedObservations !==
      failedClosedObservations ||
    evidence.summary.ownerReviewRequired !==
      (failedClosedObservations > 0)
  ) {
    throw new Error(
      "Readiness evidence summary is inconsistent.",
    );
  }

  for (
    const observation of
    evidence.observationEvidence
  ) {
    if (
      !Number.isInteger(observation.sequence) ||
      observation.sequence < 1
    ) {
      throw new Error(
        "Readiness observation sequence is invalid.",
      );
    }

    requireIdentifier(
      "readiness observationId",
      observation.observationId,
    );

    requireSha256(
      "readiness observation digest",
      observation.observationDigest,
    );

    requireSha256(
      "readiness entry digest",
      observation.entryDigest,
    );

    requireIsoDate(
      "readiness observation time",
      observation.recordedAt,
    );

    if (
      !Number.isFinite(observation.score) ||
      observation.score < 0 ||
      observation.score > 100
    ) {
      throw new Error(
        "Readiness observation score is invalid.",
      );
    }

    if (
      observation.outcome !== "PASS" &&
      observation.outcome !== "FAIL_CLOSED"
    ) {
      throw new Error(
        "Readiness observation outcome is invalid.",
      );
    }
  }

  if (
    evidence.authorityBoundary
      .shadowEvidenceOnly !== true ||
    evidence.authorityBoundary
      .ownerReviewRequiredBeforeQualificationTesting !== true ||
    evidence.authorityBoundary
      .qualificationEngineInvoked !== false ||
    evidence.authorityBoundary
      .formalQualificationTestCasesCreated !== false ||
    evidence.authorityBoundary
      .formalQualificationAuthorized !== false ||
    evidence.authorityBoundary
      .qualifiedManifestCreated !== false ||
    evidence.authorityBoundary
      .activationCandidateCreated !== false ||
    evidence.authorityBoundary
      .runtimeActivationAuthorized !== false ||
    evidence.authorityBoundary
      .productionReadinessAuthorized !== false ||
    evidence.authorityBoundary
      .customerDataAccessAuthorized !== false ||
    evidence.authorityBoundary
      .customerContactAuthorized !== false ||
    evidence.authorityBoundary
      .externalDeliveryAuthorized !== false ||
    evidence.authorityBoundary
      .liveProviderExecutionAuthorized !== false ||
    evidence.authorityBoundary
      .productionMutationAuthorized !== false ||
    evidence.authorityBoundary
      .paymentExecutionAuthorized !== false ||
    evidence.authorityBoundary
      .autonomousDecisionAuthorized !== false ||
    evidence.authorityBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Readiness evidence exceeds its allowed authority boundary.",
    );
  }

  if (
    evidence.readinessState ===
      "READY_FOR_OWNER_QUALIFICATION_REVIEW"
  ) {
    if (
      evidence.readinessReason !==
        "READY_FOR_OWNER_QUALIFICATION_REVIEW" ||
      evidence.ownerQualificationReviewEligible !== true ||
      evidence.summary.totalObservations < 1 ||
      evidence.summary.failedClosedObservations !== 0 ||
      evidence.summary.ownerReviewRequired !== false ||
      evidence.nextStep !==
        "OWNER_REVIEW_BEFORE_FORMAL_QUALIFICATION_TESTING"
    ) {
      throw new Error(
        "Owner qualification-review readiness evidence is inconsistent.",
      );
    }
  } else {
    if (
      evidence.readinessState !== "BLOCKED" ||
      evidence.ownerQualificationReviewEligible !== false ||
      evidence.nextStep !==
        "CONTINUE_OR_REMEDIATE_SANITIZED_SHADOW_OBSERVATION"
    ) {
      throw new Error(
        "Blocked qualification-readiness evidence is inconsistent.",
      );
    }
  }

  const {
    readinessDigest,
    ...readinessCore
  } = evidence;

  if (
    sha256(readinessCore) !==
      readinessDigest
  ) {
    throw new Error(
      "Qualification readiness evidence digest is invalid.",
    );
  }
}

export function createAshaOwnerQualificationReviewDecision(
  input:
    CreateAshaOwnerQualificationReviewDecisionInput,
): AshaOwnerQualificationReviewDecision {
  validateReadinessEvidence(
    input.readinessEvidence,
  );

  requireIdentifier(
    "qualification-review decisionId",
    input.decisionId,
  );

  requireIdentifier(
    "qualification-review ownerId",
    input.ownerId,
  );

  requireText(
    "qualification-review reason",
    input.reason,
    12,
    1000,
  );

  requireIsoDate(
    "qualification-review decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      input.readinessEvidence.ownerId
  ) {
    throw new Error(
      "Only the readiness-bound owner can issue the qualification-review decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_FORMAL_QUALIFICATION_TESTING" &&
    input.decision !==
      "REJECT_FORMAL_QUALIFICATION_TESTING"
  ) {
    throw new Error(
      "Asha owner qualification-review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(
      input.readinessEvidence.reviewedAt,
    )
  ) {
    throw new Error(
      "Qualification-review decision cannot precede readiness evidence.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_FORMAL_QUALIFICATION_TESTING";

  if (
    approved &&
    (
      input.readinessEvidence.readinessState !==
        "READY_FOR_OWNER_QUALIFICATION_REVIEW" ||
      input.readinessEvidence
        .ownerQualificationReviewEligible !== true ||
      input.readinessEvidence.nextStep !==
        "OWNER_REVIEW_BEFORE_FORMAL_QUALIFICATION_TESTING"
    )
  ) {
    throw new Error(
      "Blocked readiness evidence cannot be approved for formal qualification testing.",
    );
  }

  const decisionCore = {
    version:
      ASHA_OWNER_QUALIFICATION_REVIEW_DECISION_VERSION,
    decisionId:
      input.decisionId,
    readinessId:
      input.readinessEvidence.readinessId,
    readinessDigest:
      input.readinessEvidence.readinessDigest,
    employeeId:
      input.readinessEvidence.employeeId,
    templateId:
      input.readinessEvidence.templateId,
    tenantId:
      input.readinessEvidence.tenantId,
    ownerId:
      input.ownerId,
    evaluatorId:
      input.readinessEvidence.evaluatorId,
    decision:
      input.decision,
    ownerApprovedForQualificationTesting:
      approved,
    qualificationTestingAdmissionEligible:
      approved,
    reason:
      input.reason.trim(),
    authorityBoundary: {
      ownerDecisionRequired:
        true,
      ownerIdentityBound:
        true,
      readinessDigestBound:
        true,
      approvalBypassAllowed:
        false,
      qualificationTestingExecuted:
        false,
      qualificationEngineInvoked:
        false,
      formalQualificationIssued:
        false,
      qualifiedManifestCreated:
        false,
      activationCandidateCreated:
        false,
      runtimeActivated:
        false,
      productionReadinessAuthorized:
        false,
      customerDataAccessAuthorized:
        false,
      customerContactAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      productionMutationAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      autonomousDecisionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    decidedAt:
      input.decidedAt,
  };

  const decision:
    AshaOwnerQualificationReviewDecision = {
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
  };

  return deepFreeze(
    decision,
  ) as AshaOwnerQualificationReviewDecision;
}