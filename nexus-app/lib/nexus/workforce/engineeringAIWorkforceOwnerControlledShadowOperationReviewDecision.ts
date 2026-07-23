import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
} from "./engineeringAIWorkforceFormalQualificationTestPlan";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  validateEngineeringAIWorkforceControlledShadowOperationExecution,
  type EngineeringAIWorkforceCandidateControlledShadowOperationExecution,
} from "./engineeringAIWorkforceControlledShadowOperationExecution";

export const ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-owner-controlled-shadow-operation-review-decision-v1" as const;

export type EngineeringAIWorkforceOwnerControlledShadowOperationReviewDecisionType =
  | "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION"
  | "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION";

export const ENGINEERING_AI_WORKFORCE_OWNER_REVIEW_REASONS = [
  "Owner approved Ishaan's synthetic architecture review for limited internal pilot preparation only.",
  "Owner approved Leela's synthetic engineering delivery review for limited internal pilot preparation only.",
  "Owner approved Vivaan's synthetic quality review for limited internal pilot preparation only.",
  "Owner approved Anaya's synthetic security review for limited internal pilot preparation only.",
  "Owner approved Atharv's synthetic reliability review for limited internal pilot preparation only.",
  "Owner approved Mahir's synthetic chaos-engineering review for limited internal pilot preparation only.",
  "Owner approved Zara's synthetic data-engineering review for limited internal pilot preparation only.",
  "Owner approved Advik's synthetic red-team review for limited internal pilot preparation only.",
] as const;

export interface CreateEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecisionInput {
  readonly decisionId:
    string;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly controlledShadowOperationExecution:
    typeof ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION;

  readonly decisions:
    readonly EngineeringAIWorkforceOwnerControlledShadowOperationReviewDecisionType[];

  readonly reasons:
    readonly string[];

  readonly decidedAt:
    string;
}

export interface EngineeringAIWorkforceCandidateOwnerControlledShadowOperationReviewDecision {
  readonly developmentSequence:
    number;

  readonly reviewState:
    "OWNER_ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_REVIEW_RECORDED";

  readonly employeeId:
    string;

  readonly employeeCode:
    string;

  readonly publicName:
    string;

  readonly officialRole:
    string;

  readonly runtimeId:
    string;

  readonly sourceCandidateExecutionDigest:
    string;

  readonly decision:
    EngineeringAIWorkforceOwnerControlledShadowOperationReviewDecisionType;

  readonly shadowOperationApproved:
    boolean;

  readonly limitedInternalPilotPreparationEligible:
    boolean;

  readonly reason:
    string;

  readonly reviewedEvidence: Readonly<{
    draftId:
      string;

    draftStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    evidenceToolMode:
      "READ_ONLY";

    draftToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    riskLevel:
      "MEDIUM";

    verifiedFactCount:
      3;

    findingCount:
      3;

    recommendationCount:
      3;

    uncertaintyCount:
      3;

    unsupportedFactsInvented:
      false;

    unsupportedClaimsIncluded:
      false;

    urgencyExaggerated:
      false;

    guaranteeMade:
      false;

    repositoryChangePrepared:
      false;

    repositoryChangeExecuted:
      false;

    productionChangeExecuted:
      false;

    customerDeliveryExecuted:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    controlledShadowExecutionBound:
      true;

    controlledShadowExecutionIntegrityVerified:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    runtimeIdentityBound:
      true;

    candidateIdentityBound:
      true;

    syntheticSanitizedDataOnly:
      true;

    maximumOneDraftVerified:
      true;

    ownerDecisionRequired:
      true;

    approvalBypassAllowed:
      false;

    ownerReviewDecisionRecorded:
      true;

    limitedInternalPilotPreparationAuthorized:
      boolean;

    limitedInternalPilotExecutionAuthorized:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    emergencyPauseAvailable:
      true;
  }>;

  readonly candidateReviewDigest:
    string;
}

export interface EngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_ENGINEERING_CONTROLLED_SHADOW_OPERATION_REVIEWS_RECORDED";

  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly sourceExecutionId:
    string;

  readonly sourceExecutionDigest:
    string;

  readonly candidateReviewCount:
    8;

  readonly candidateReviews:
    readonly EngineeringAIWorkforceCandidateOwnerControlledShadowOperationReviewDecision[];

  readonly aggregateSummary: Readonly<{
    reviewedCandidateCount:
      8;

    approvedCandidateCount:
      number;

    rejectedCandidateCount:
      number;

    limitedInternalPilotPreparationEligibleCount:
      number;

    limitedInternalPilotExecutionAuthorizedCount:
      0;

    repositoryAccessAuthorizedCount:
      0;

    productionDeploymentAuthorizedCount:
      0;

    realCustomerContactAuthorizedCount:
      0;

    paymentExecutionAuthorizedCount:
      0;

    publicLaunchAuthorizedCount:
      0;

    ownerReviewDecisionRecordedCount:
      8;

    uniqueCandidateReviewDigests:
      8;
  }>;

  readonly authorityBoundary: Readonly<{
    canonicalExecutionBound:
      true;

    exactEightReviewsRequired:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    ownerReviewDecisionsRecorded:
      true;

    approvalBypassAllowed:
      false;

    limitedInternalPilotPreparationAuthorized:
      boolean;

    limitedInternalPilotPreparationAuthorizedCount:
      number;

    limitedInternalPilotExecutionAuthorized:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    | "PREPARE_ENGINEERING_LIMITED_INTERNAL_PILOTS"
    | "RETAIN_ENGINEERING_CONTROLLED_SHADOW_ONLY";

  readonly decidedAt:
    string;

  readonly decisionDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

const FORBIDDEN_REASON_PATTERN =
  /(bearer\s+[a-z0-9._-]+|api[_-]?key|password|secret|access[_-]?token|refresh[_-]?token|session[_-]?id|authorization)/i;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((entry) =>
          stableStringify(entry),
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
            `${JSON.stringify(key)}:${stableStringify(record[key])}`,
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Engineering owner-review decision value.",
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
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
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
  if (!SAFE_IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireReason(
  reason: string,
): string {
  const normalized =
    reason.trim().replace(/\s+/g, " ");

  if (
    normalized.length < 24 ||
    normalized.length > 320 ||
    FORBIDDEN_REASON_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Engineering owner controlled-shadow review reason is invalid or contains prohibited secret-bearing content.",
    );
  }

  return normalized;
}

function validateExecutionForReview(
  source:
    typeof ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
): void {
  validateEngineeringAIWorkforceControlledShadowOperationExecution(
    source,
  );

  if (
    source.nextStep !==
      "AWAIT_OWNER_ENGINEERING_CONTROLLED_SHADOW_OPERATION_REVIEWS" ||
    source.candidateExecutions.length !==
      8 ||
    source.aggregateSummary
      .executedOperationCount !==
        8 ||
    source.aggregateSummary
      .draftCreatedCount !==
        8 ||
    source.aggregateSummary
      .ownerReviewRequiredCount !==
        8 ||
    source.aggregateSummary
      .ownerDecisionMadeCount !==
        0 ||
    source.executionBoundary
      .ownerReviewRequired !==
        true ||
    source.executionBoundary
      .ownerReviewRequiredCount !==
        8 ||
    source.executionBoundary
      .approvalBypassAllowed !==
        false ||
    source.executionBoundary
      .repositoryReadAuthorized !==
        false ||
    source.executionBoundary
      .repositoryWriteAuthorized !==
        false ||
    source.executionBoundary
      .productionDeploymentAuthorized !==
        false ||
    source.executionBoundary
      .realCustomerContactAuthorized !==
        false ||
    source.executionBoundary
      .paymentExecutionAuthorized !==
        false ||
    source.executionBoundary
      .publicLaunchAuthorized !==
        false
  ) {
    throw new Error(
      "A valid Engineering controlled-shadow execution awaiting eight owner reviews is required.",
    );
  }
}

function validateCandidateSource(
  source:
    EngineeringAIWorkforceCandidateControlledShadowOperationExecution,
): void {
  if (
    source.executionState !==
      "ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_EXECUTED" ||
    source.syntheticEvidence
      .dataClassification !==
        "SYNTHETIC_SANITIZED_ONLY" ||
    source.syntheticEvidence
      .evidenceToolMode !==
        "READ_ONLY" ||
    source.syntheticEvidence
      .executionMode !==
        "SANDBOX_ONLY" ||
    source.syntheticEvidence
      .verifiedFacts.length !==
        3 ||
    source.syntheticEvidence
      .unsupportedFactsInvented !==
        false ||
    source.draftEvidence
      .draftStatus !==
        "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    source.draftEvidence
      .draftToolMode !==
        "DRAFT_ONLY" ||
    source.draftEvidence
      .findings.length !==
        3 ||
    source.draftEvidence
      .recommendations.length !==
        3 ||
    source.draftEvidence
      .uncertainties.length !==
        3 ||
    source.draftEvidence
      .ownerDecisionMade !==
        false ||
    source.draftEvidence
      .unsupportedClaimsIncluded !==
        false ||
    source.draftEvidence
      .urgencyExaggerated !==
        false ||
    source.draftEvidence
      .guaranteeMade !==
        false ||
    source.draftEvidence
      .repositoryChangePrepared !==
        false ||
    source.draftEvidence
      .repositoryChangeExecuted !==
        false ||
    source.draftEvidence
      .productionChangeExecuted !==
        false ||
    source.draftEvidence
      .customerDeliveryExecuted !==
        false ||
    source.executionBoundary
      .draftCreatorInvocationCount !==
        1 ||
    source.executionBoundary
      .ownerReviewRequired !==
        true ||
    source.executionBoundary
      .repositoryReadAuthorized !==
        false ||
    source.executionBoundary
      .repositoryWriteAuthorized !==
        false ||
    source.executionBoundary
      .productionDeploymentAuthorized !==
        false ||
    source.executionBoundary
      .realCustomerContactAuthorized !==
        false ||
    source.executionBoundary
      .paymentExecutionAuthorized !==
        false ||
    source.executionBoundary
      .publicLaunchAuthorized !==
        false
  ) {
    throw new Error(
      "Engineering candidate controlled-shadow execution is not eligible for owner review.",
    );
  }
}

export function validateEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision(
  decision:
    EngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision,
): void {
  validateExecutionForReview(
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  );

  requireIdentifier(
    "Engineering owner-review decision ID",
    decision.decisionId,
  );

  requireTimestamp(
    "Engineering owner-review decision time",
    decision.decidedAt,
  );

  requireDigest(
    "Engineering owner-review decision digest",
    decision.decisionDigest,
  );

  if (
    decision.version !==
      ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_ENGINEERING_CONTROLLED_SHADOW_OPERATION_REVIEWS_RECORDED" ||
    decision.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID ||
    decision.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    decision.sourceExecutionId !==
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
        .executionId ||
    decision.sourceExecutionDigest !==
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
        .executionDigest ||
    decision.candidateReviewCount !==
      8 ||
    decision.candidateReviews.length !==
      8
  ) {
    throw new Error(
      "Engineering owner controlled-shadow review decision identity is invalid.",
    );
  }

  const uniqueReviewDigests =
    new Set(
      decision.candidateReviews.map(
        (review) =>
          review.candidateReviewDigest,
      ),
    );

  if (uniqueReviewDigests.size !== 8) {
    throw new Error(
      "Engineering candidate owner-review digests must remain unique.",
    );
  }

  decision.candidateReviews.forEach(
    (
      review,
      index,
    ) => {
      const source =
        ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
          .candidateExecutions[index];

      if (!source) {
        throw new Error(
          "Engineering owner-review source candidate is missing.",
        );
      }

      validateCandidateSource(
        source,
      );

      requireDigest(
        "Engineering candidate owner-review digest",
        review.candidateReviewDigest,
      );

      const approved =
        review.decision ===
          "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION";

      const reviewed =
        review.reviewedEvidence;

      const boundary =
        review.authorityBoundary;

      const {
        candidateReviewDigest,
        ...reviewCore
      } = review;

      if (
        sha256(reviewCore) !==
          candidateReviewDigest ||
        review.developmentSequence !==
          index + 1 ||
        review.reviewState !==
          "OWNER_ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_REVIEW_RECORDED" ||
        review.employeeId !==
          source.employeeId ||
        review.employeeCode !==
          source.employeeCode ||
        review.publicName !==
          source.publicName ||
        review.officialRole !==
          source.officialRole ||
        review.runtimeId !==
          source.runtimeId ||
        review.sourceCandidateExecutionDigest !==
          source.candidateExecutionDigest ||
        (
          review.decision !==
            "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION" &&
          review.decision !==
            "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION"
        ) ||
        review.shadowOperationApproved !==
          approved ||
        review.limitedInternalPilotPreparationEligible !==
          approved ||
        requireReason(review.reason) !==
          review.reason ||
        reviewed.draftId !==
          source.draftEvidence.draftId ||
        reviewed.draftStatus !==
          source.draftEvidence.draftStatus ||
        reviewed.dataClassification !==
          source.syntheticEvidence.dataClassification ||
        reviewed.evidenceToolMode !==
          source.syntheticEvidence.evidenceToolMode ||
        reviewed.draftToolMode !==
          source.draftEvidence.draftToolMode ||
        reviewed.executionMode !==
          source.syntheticEvidence.executionMode ||
        reviewed.riskLevel !==
          source.draftEvidence.riskLevel ||
        reviewed.verifiedFactCount !==
          3 ||
        reviewed.findingCount !==
          3 ||
        reviewed.recommendationCount !==
          3 ||
        reviewed.uncertaintyCount !==
          3 ||
        reviewed.unsupportedFactsInvented !==
          false ||
        reviewed.unsupportedClaimsIncluded !==
          false ||
        reviewed.urgencyExaggerated !==
          false ||
        reviewed.guaranteeMade !==
          false ||
        reviewed.repositoryChangePrepared !==
          false ||
        reviewed.repositoryChangeExecuted !==
          false ||
        reviewed.productionChangeExecuted !==
          false ||
        reviewed.customerDeliveryExecuted !==
          false
      ) {
        throw new Error(
          "Engineering candidate owner controlled-shadow reviewed evidence is invalid.",
        );
      }

      if (
        boundary.controlledShadowExecutionBound !==
          true ||
        boundary.controlledShadowExecutionIntegrityVerified !==
          true ||
        boundary.ownerIdentityBound !==
          true ||
        boundary.tenantIdentityBound !==
          true ||
        boundary.runtimeIdentityBound !==
          true ||
        boundary.candidateIdentityBound !==
          true ||
        boundary.syntheticSanitizedDataOnly !==
          true ||
        boundary.maximumOneDraftVerified !==
          true ||
        boundary.ownerDecisionRequired !==
          true ||
        boundary.approvalBypassAllowed !==
          false ||
        boundary.ownerReviewDecisionRecorded !==
          true ||
        boundary.limitedInternalPilotPreparationAuthorized !==
          approved ||
        boundary.limitedInternalPilotExecutionAuthorized !==
          false ||
        boundary.repositoryReadAuthorized !==
          false ||
        boundary.repositoryWriteAuthorized !==
          false ||
        boundary.branchCreationAuthorized !==
          false ||
        boundary.pullRequestPreparationAuthorized !==
          false ||
        boundary.mergeAuthorized !==
          false ||
        boundary.productionDeploymentAuthorized !==
          false ||
        boundary.secretsAccessAuthorized !==
          false ||
        boundary.realCustomerDataAccessAuthorized !==
          false ||
        boundary.realCustomerContactAuthorized !==
          false ||
        boundary.externalDeliveryAuthorized !==
          false ||
        boundary.liveProviderExecutionAuthorized !==
          false ||
        boundary.productionDatabaseAuthorized !==
          false ||
        boundary.productionMutationAuthorized !==
          false ||
        boundary.paymentExecutionAuthorized !==
          false ||
        boundary.financialCommitmentAuthorized !==
          false ||
        boundary.legalCommitmentAuthorized !==
          false ||
        boundary.autonomousDecisionAuthorized !==
          false ||
        boundary.productionReadinessAuthorized !==
          false ||
        boundary.publicLaunchAuthorized !==
          false ||
        boundary.emergencyPauseAvailable !==
          true
      ) {
        throw new Error(
          "Engineering candidate owner controlled-shadow review authority boundary is invalid.",
        );
      }
    },
  );

  const approvedCount =
    decision.candidateReviews.filter(
      (review) =>
        review.decision ===
          "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
    ).length;

  const rejectedCount =
    8 - approvedCount;

  const summary =
    decision.aggregateSummary;

  if (
    summary.reviewedCandidateCount !==
      8 ||
    summary.approvedCandidateCount !==
      approvedCount ||
    summary.rejectedCandidateCount !==
      rejectedCount ||
    summary.limitedInternalPilotPreparationEligibleCount !==
      approvedCount ||
    summary.limitedInternalPilotExecutionAuthorizedCount !==
      0 ||
    summary.repositoryAccessAuthorizedCount !==
      0 ||
    summary.productionDeploymentAuthorizedCount !==
      0 ||
    summary.realCustomerContactAuthorizedCount !==
      0 ||
    summary.paymentExecutionAuthorizedCount !==
      0 ||
    summary.publicLaunchAuthorizedCount !==
      0 ||
    summary.ownerReviewDecisionRecordedCount !==
      8 ||
    summary.uniqueCandidateReviewDigests !==
      8
  ) {
    throw new Error(
      "Engineering owner controlled-shadow review aggregate summary is invalid.",
    );
  }

  const allApproved =
    approvedCount === 8;

  const aggregateBoundary =
    decision.authorityBoundary;

  if (
    aggregateBoundary.canonicalExecutionBound !==
      true ||
    aggregateBoundary.exactEightReviewsRequired !==
      true ||
    aggregateBoundary.ownerIdentityBound !==
      true ||
    aggregateBoundary.tenantIdentityBound !==
      true ||
    aggregateBoundary.ownerReviewDecisionsRecorded !==
      true ||
    aggregateBoundary.approvalBypassAllowed !==
      false ||
    aggregateBoundary.limitedInternalPilotPreparationAuthorized !==
      allApproved ||
    aggregateBoundary.limitedInternalPilotPreparationAuthorizedCount !==
      approvedCount ||
    aggregateBoundary.limitedInternalPilotExecutionAuthorized !==
      false ||
    aggregateBoundary.repositoryReadAuthorized !==
      false ||
    aggregateBoundary.repositoryWriteAuthorized !==
      false ||
    aggregateBoundary.branchCreationAuthorized !==
      false ||
    aggregateBoundary.pullRequestPreparationAuthorized !==
      false ||
    aggregateBoundary.mergeAuthorized !==
      false ||
    aggregateBoundary.productionDeploymentAuthorized !==
      false ||
    aggregateBoundary.secretsAccessAuthorized !==
      false ||
    aggregateBoundary.realCustomerDataAccessAuthorized !==
      false ||
    aggregateBoundary.realCustomerContactAuthorized !==
      false ||
    aggregateBoundary.externalDeliveryAuthorized !==
      false ||
    aggregateBoundary.liveProviderExecutionAuthorized !==
      false ||
    aggregateBoundary.productionDatabaseAuthorized !==
      false ||
    aggregateBoundary.productionMutationAuthorized !==
      false ||
    aggregateBoundary.paymentExecutionAuthorized !==
      false ||
    aggregateBoundary.financialCommitmentAuthorized !==
      false ||
    aggregateBoundary.legalCommitmentAuthorized !==
      false ||
    aggregateBoundary.autonomousDecisionAuthorized !==
      false ||
    aggregateBoundary.productionReadinessAuthorized !==
      false ||
    aggregateBoundary.publicLaunchAuthorized !==
      false ||
    aggregateBoundary.emergencyPauseAvailable !==
      true ||
    decision.nextStep !==
      (
        allApproved
          ? "PREPARE_ENGINEERING_LIMITED_INTERNAL_PILOTS"
          : "RETAIN_ENGINEERING_CONTROLLED_SHADOW_ONLY"
      )
  ) {
    throw new Error(
      "Engineering owner controlled-shadow aggregate authority boundary is invalid.",
    );
  }

  if (
    Date.parse(decision.decidedAt) <
    Date.parse(
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
        .executedAt,
    )
  ) {
    throw new Error(
      "Engineering owner controlled-shadow review decision cannot precede execution.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = decision;

  if (
    sha256(decisionCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Engineering owner controlled-shadow review decision integrity is invalid.",
    );
  }

  if (
    !Object.isFrozen(decision) ||
    !Object.isFrozen(
      decision.candidateReviews,
    ) ||
    decision.candidateReviews.some(
      (review) =>
        !Object.isFrozen(review) ||
        !Object.isFrozen(
          review.reviewedEvidence,
        ) ||
        !Object.isFrozen(
          review.authorityBoundary,
        ),
    ) ||
    !Object.isFrozen(
      decision.aggregateSummary,
    ) ||
    !Object.isFrozen(
      decision.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering owner controlled-shadow review decision must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision(
  input:
    CreateEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecisionInput,
): EngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision {
  if (
    input.controlledShadowOperationExecution !==
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
  ) {
    throw new Error(
      "Only the canonical Engineering controlled-shadow execution can be reviewed.",
    );
  }

  validateExecutionForReview(
    input.controlledShadowOperationExecution,
  );

  requireIdentifier(
    "Engineering owner-review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Engineering owner-review decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
        .ownerId
  ) {
    throw new Error(
      "Only the Engineering controlled-shadow-bound owner can issue these review decisions.",
    );
  }

  if (
    input.decisions.length !==
      8 ||
    input.reasons.length !==
      8
  ) {
    throw new Error(
      "Exactly eight Engineering owner controlled-shadow review decisions are required.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(
      input.controlledShadowOperationExecution
        .executedAt,
    )
  ) {
    throw new Error(
      "Engineering owner controlled-shadow review decision cannot precede execution.",
    );
  }

  const source =
    input.controlledShadowOperationExecution;

  const candidateReviews =
    source.candidateExecutions.map(
      (
        candidate,
        index,
      ) => {
        validateCandidateSource(
          candidate,
        );

        const selectedDecision =
          input.decisions[index];

        const inputReason =
          input.reasons[index];

        if (
          selectedDecision !==
            "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION" &&
          selectedDecision !==
            "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION"
        ) {
          throw new Error(
            "Engineering candidate owner controlled-shadow review decision is invalid.",
          );
        }

        if (!inputReason) {
          throw new Error(
            "Engineering candidate owner controlled-shadow review reason is required.",
          );
        }

        const reason =
          requireReason(inputReason);

        const approved =
          selectedDecision ===
            "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION";

        const reviewCore = {
          developmentSequence:
            index + 1,

          reviewState:
            "OWNER_ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_REVIEW_RECORDED" as const,

          employeeId:
            candidate.employeeId,

          employeeCode:
            candidate.employeeCode,

          publicName:
            candidate.publicName,

          officialRole:
            candidate.officialRole,

          runtimeId:
            candidate.runtimeId,

          sourceCandidateExecutionDigest:
            candidate.candidateExecutionDigest,

          decision:
            selectedDecision,

          shadowOperationApproved:
            approved,

          limitedInternalPilotPreparationEligible:
            approved,

          reason,

          reviewedEvidence: {
            draftId:
              candidate.draftEvidence
                .draftId,

            draftStatus:
              candidate.draftEvidence
                .draftStatus,

            dataClassification:
              candidate.syntheticEvidence
                .dataClassification,

            evidenceToolMode:
              candidate.syntheticEvidence
                .evidenceToolMode,

            draftToolMode:
              candidate.draftEvidence
                .draftToolMode,

            executionMode:
              candidate.syntheticEvidence
                .executionMode,

            riskLevel:
              candidate.draftEvidence
                .riskLevel,

            verifiedFactCount:
              3 as const,

            findingCount:
              3 as const,

            recommendationCount:
              3 as const,

            uncertaintyCount:
              3 as const,

            unsupportedFactsInvented:
              candidate.syntheticEvidence
                .unsupportedFactsInvented,

            unsupportedClaimsIncluded:
              candidate.draftEvidence
                .unsupportedClaimsIncluded,

            urgencyExaggerated:
              candidate.draftEvidence
                .urgencyExaggerated,

            guaranteeMade:
              candidate.draftEvidence
                .guaranteeMade,

            repositoryChangePrepared:
              candidate.draftEvidence
                .repositoryChangePrepared,

            repositoryChangeExecuted:
              candidate.draftEvidence
                .repositoryChangeExecuted,

            productionChangeExecuted:
              candidate.draftEvidence
                .productionChangeExecuted,

            customerDeliveryExecuted:
              candidate.draftEvidence
                .customerDeliveryExecuted,
          },

          authorityBoundary: {
            controlledShadowExecutionBound:
              true as const,

            controlledShadowExecutionIntegrityVerified:
              true as const,

            ownerIdentityBound:
              true as const,

            tenantIdentityBound:
              true as const,

            runtimeIdentityBound:
              true as const,

            candidateIdentityBound:
              true as const,

            syntheticSanitizedDataOnly:
              true as const,

            maximumOneDraftVerified:
              true as const,

            ownerDecisionRequired:
              true as const,

            approvalBypassAllowed:
              false as const,

            ownerReviewDecisionRecorded:
              true as const,

            limitedInternalPilotPreparationAuthorized:
              approved,

            limitedInternalPilotExecutionAuthorized:
              false as const,

            repositoryReadAuthorized:
              false as const,

            repositoryWriteAuthorized:
              false as const,

            branchCreationAuthorized:
              false as const,

            pullRequestPreparationAuthorized:
              false as const,

            mergeAuthorized:
              false as const,

            productionDeploymentAuthorized:
              false as const,

            secretsAccessAuthorized:
              false as const,

            realCustomerDataAccessAuthorized:
              false as const,

            realCustomerContactAuthorized:
              false as const,

            externalDeliveryAuthorized:
              false as const,

            liveProviderExecutionAuthorized:
              false as const,

            productionDatabaseAuthorized:
              false as const,

            productionMutationAuthorized:
              false as const,

            paymentExecutionAuthorized:
              false as const,

            financialCommitmentAuthorized:
              false as const,

            legalCommitmentAuthorized:
              false as const,

            autonomousDecisionAuthorized:
              false as const,

            productionReadinessAuthorized:
              false as const,

            publicLaunchAuthorized:
              false as const,

            emergencyPauseAvailable:
              true as const,
          },
        };

        return deepFreeze({
          ...reviewCore,

          candidateReviewDigest:
            sha256(reviewCore),
        });
      },
    );

  const approvedCount =
    candidateReviews.filter(
      (review) =>
        review.decision ===
          "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
    ).length;

  const rejectedCount =
    8 - approvedCount;

  const allApproved =
    approvedCount === 8;

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_ENGINEERING_CONTROLLED_SHADOW_OPERATION_REVIEWS_RECORDED" as const,

    tenantId:
      source.tenantId,

    ownerId:
      input.ownerId,

    sourceExecutionId:
      source.executionId,

    sourceExecutionDigest:
      source.executionDigest,

    candidateReviewCount:
      8 as const,

    candidateReviews,

    aggregateSummary: {
      reviewedCandidateCount:
        8 as const,

      approvedCandidateCount:
        approvedCount,

      rejectedCandidateCount:
        rejectedCount,

      limitedInternalPilotPreparationEligibleCount:
        approvedCount,

      limitedInternalPilotExecutionAuthorizedCount:
        0 as const,

      repositoryAccessAuthorizedCount:
        0 as const,

      productionDeploymentAuthorizedCount:
        0 as const,

      realCustomerContactAuthorizedCount:
        0 as const,

      paymentExecutionAuthorizedCount:
        0 as const,

      publicLaunchAuthorizedCount:
        0 as const,

      ownerReviewDecisionRecordedCount:
        8 as const,

      uniqueCandidateReviewDigests:
        8 as const,
    },

    authorityBoundary: {
      canonicalExecutionBound:
        true as const,

      exactEightReviewsRequired:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerReviewDecisionsRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      limitedInternalPilotPreparationAuthorized:
        allApproved,

      limitedInternalPilotPreparationAuthorizedCount:
        approvedCount,

      limitedInternalPilotExecutionAuthorized:
        false as const,

      repositoryReadAuthorized:
        false as const,

      repositoryWriteAuthorized:
        false as const,

      branchCreationAuthorized:
        false as const,

      pullRequestPreparationAuthorized:
        false as const,

      mergeAuthorized:
        false as const,

      productionDeploymentAuthorized:
        false as const,

      secretsAccessAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionDatabaseAuthorized:
        false as const,

      productionMutationAuthorized:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      financialCommitmentAuthorized:
        false as const,

      legalCommitmentAuthorized:
        false as const,

      autonomousDecisionAuthorized:
        false as const,

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      (
        allApproved
          ? "PREPARE_ENGINEERING_LIMITED_INTERNAL_PILOTS"
          : "RETAIN_ENGINEERING_CONTROLLED_SHADOW_ONLY"
      ) as
        | "PREPARE_ENGINEERING_LIMITED_INTERNAL_PILOTS"
        | "RETAIN_ENGINEERING_CONTROLLED_SHADOW_ONLY",

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision;

  validateEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision(
    decision,
  );

  return decision;
}

export const ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION =
  createEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision({
    decisionId:
      "engineering-ai-workforce-owner-controlled-shadow-operation-review-decision-001",

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    controlledShadowOperationExecution:
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,

    decisions:
      [
        "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
        "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
        "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
        "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
        "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
        "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
        "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
        "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
      ],

    reasons:
      ENGINEERING_AI_WORKFORCE_OWNER_REVIEW_REASONS,

    decidedAt:
      "2026-07-23T12:59:46.233Z",
  });
