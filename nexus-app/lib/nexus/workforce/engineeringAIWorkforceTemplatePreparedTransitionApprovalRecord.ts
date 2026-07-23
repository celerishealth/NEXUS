import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
} from "./engineeringAIWorkforceFactoryLifecycleTransitionExecution";

import {
  createEngineeringAIWorkforceTemplatePreparedTransitionDecision,
} from "./engineeringAIWorkforceTemplatePreparedTransitionDecision";

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_RECORD_VERSION =
  "nexus-engineering-ai-workforce-template-prepared-transition-approval-record-v1" as const;

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_DECISION =
  createEngineeringAIWorkforceTemplatePreparedTransitionDecision({
    lifecycleTransitionExecution:
      ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
    decisionId:
      "engineering-ai-workforce-template-prepared-transition-owner-approval-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION",
    reason:
      "Owner approved exactly eight sequential Engineering Factory transitions from TEMPLATE_PREPARATION_PENDING to TEMPLATE_PREPARED for Ishaan, Leela, Vivaan, Anaya, Atharv, Mahir, Zara, and Advik. Qualification admission, qualification execution, qualification acceptance, owner qualification approval, activation preparation, activation, runtime, repository access, branch creation, pull-request preparation, merge, deployment, secrets access, customer contact, external delivery, payments, financial or legal commitments, autonomous execution, and public launch remain blocked.",
    decidedAt:
      "2026-07-23T02:38:27.858Z",
  });
