import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  createAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision,
} from "./autonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision";

export const AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_APPROVAL_RECORD_VERSION =
  "nexus-autonomous-global-growth-template-prepared-factory-transition-approval-record-v1" as const;

export const AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_APPROVAL_DECISION =
  createAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision({
    decisionId:
      "autonomous-global-growth-template-prepared-factory-transition-owner-approval-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_V1",
    reason:
      "Owner explicitly approves only the next sequential Factory transition for exactly nine Autonomous Global Growth AI candidates from TEMPLATE_PREPARATION_PENDING to TEMPLATE_PREPARED. Qualification admission or execution, qualification acceptance, activation, runtime, credentials, live connectors, publishing, customer messaging, lead contact, demo booking, paid advertising, production execution, autonomous external action, Level 3 authority, and Founder Liberation remain blocked.",
    decidedAt:
      "2026-08-07T03:45:00.000Z",
  });