import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation";

import {
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision({
    decisionId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-plan-review-decision-001",
    sourcePreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
    ownerId:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION.ownerId,
    decision:
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN",
    reason:
      "Owner reviewed and accepted only the deterministic plan-only evidence for all eight repository read-only sandbox safety controls and authorized preparation of a separate bounded evidence-execution decision contract. Repository evaluation, repository read, repository write, command execution, network access, production activity, public launch and Founder Liberation remain unauthorized.",
    decidedAt: "2026-08-02T18:40:00.000Z",
  });