import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
} from "./engineeringAIWorkforceDevelopmentPlan";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION,
} from "./engineeringAIWorkforceTemplateCreationExecution";

import {
  createEngineeringAIWorkforceFactoryLifecycleTransitionDecision,
} from "./engineeringAIWorkforceFactoryLifecycleTransitionDecision";

export const ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_RECORD_VERSION =
  "nexus-engineering-ai-workforce-factory-lifecycle-transition-approval-record-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION =
  createEngineeringAIWorkforceFactoryLifecycleTransitionDecision({
    developmentPlan:
      ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
    templateCreationExecution:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION,
    decisionId:
      "engineering-ai-workforce-factory-lifecycle-transition-owner-approval-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION",
    reason:
      "Owner approved exactly the first sequential Factory lifecycle transition for Ishaan, Leela, Vivaan, Anaya, Atharv, Mahir, Zara, and Advik from PLANNED_CANDIDATE to TEMPLATE_PREPARATION_PENDING only. Direct TEMPLATE_PREPARED transition, qualification, activation, runtime, repository access, branch creation, pull-request preparation, merge, deployment, secrets access, customer contact, external delivery, payment, legal commitment, autonomous execution, and public launch remain blocked.",
    decidedAt:
      "2026-07-22T17:31:07.182Z",
  });
