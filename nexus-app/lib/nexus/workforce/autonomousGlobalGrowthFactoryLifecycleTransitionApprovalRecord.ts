import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  createAutonomousGlobalGrowthFactoryLifecycleTransitionDecision,
} from "./autonomousGlobalGrowthFactoryLifecycleTransitionDecision";

export const AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_RECORD_VERSION =
  "nexus-autonomous-global-growth-factory-lifecycle-transition-approval-record-v1" as const;

export const AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION =
  createAutonomousGlobalGrowthFactoryLifecycleTransitionDecision({
    decisionId:
      "autonomous-global-growth-factory-lifecycle-transition-owner-approval-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_V1",
    reason:
      "Owner explicitly approves only the first sequential Factory lifecycle transition for exactly nine Autonomous Global Growth AI candidates from PLANNED_CANDIDATE to TEMPLATE_PREPARATION_PENDING. Direct TEMPLATE_PREPARED bypass, qualification admission or execution, qualification acceptance, activation, runtime, credentials, live connectors, publishing, customer messaging, lead contact, demo booking, paid advertising, production execution, autonomous external action, Level 3 authority, and Founder Liberation remain blocked.",
    decidedAt:
      "2026-08-07T03:30:00.000Z",
  });