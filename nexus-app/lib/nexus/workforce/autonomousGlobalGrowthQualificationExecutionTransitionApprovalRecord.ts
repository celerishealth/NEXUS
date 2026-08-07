import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  createAutonomousGlobalGrowthQualificationExecutionTransitionDecision,
} from "./autonomousGlobalGrowthQualificationExecutionTransitionDecision";

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_RECORD_VERSION =
  "nexus-autonomous-global-growth-qualification-execution-transition-approval-record-v1" as const;

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION =
  createAutonomousGlobalGrowthQualificationExecutionTransitionDecision({
    decisionId:
      "autonomous-global-growth-qualification-execution-owner-approval-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_V1",
    reason:
      "Owner explicitly approves only the exact sequential Factory lifecycle transition for nine Autonomous Global Growth candidates from QUALIFICATION_ADMISSION_PENDING to QUALIFICATION_IN_PROGRESS. Qualification fixtures and evidence execution, qualification evidence acceptance, owner qualification approval, activation, runtime, credentials, live connectors, publishing, customer or lead contact, demo execution, paid advertising, production execution, autonomous external action, Level 3 authority, and Founder Liberation remain blocked.",
    decidedAt:
      "2026-08-07T04:49:00.000Z",
  });