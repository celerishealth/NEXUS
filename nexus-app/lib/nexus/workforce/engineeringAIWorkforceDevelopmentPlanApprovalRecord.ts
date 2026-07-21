import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
} from "./engineeringAIWorkforceDevelopmentPlan";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
  createEngineeringAIWorkforceDevelopmentPlanDecision,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

export const ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_RECORD_VERSION =
  "nexus-engineering-ai-workforce-development-plan-approval-record-v1" as const;

export const ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION =
  createEngineeringAIWorkforceDevelopmentPlanDecision({
    developmentPlan:
      ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
    decisionId:
      "engineering-ai-workforce-development-plan-owner-approval-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN",
    reason:
      "Owner approved preparation of the controlled Engineering AI Workforce template-preparation plan while retaining all qualification, activation, repository access, branch, pull-request, merge, deployment, secrets, customer-data, external-delivery, payment, legal-commitment, autonomous-execution, and public-launch boundaries.",
    decidedAt:
      "2026-07-21T10:09:36.502Z",
  });
