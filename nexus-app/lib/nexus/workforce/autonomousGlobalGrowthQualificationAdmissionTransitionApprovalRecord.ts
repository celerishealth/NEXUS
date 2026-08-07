import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  createAutonomousGlobalGrowthQualificationAdmissionTransitionDecision,
} from "./autonomousGlobalGrowthQualificationAdmissionTransitionDecision";

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_RECORD_VERSION =
  "nexus-autonomous-global-growth-qualification-admission-transition-approval-record-v1" as const;

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION =
  createAutonomousGlobalGrowthQualificationAdmissionTransitionDecision({
    decisionId:
      "autonomous-global-growth-qualification-admission-owner-approval-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_V1",
    reason:
      "Owner explicitly approves only the exact sequential Factory transition for nine Autonomous Global Growth candidates from TEMPLATE_PREPARED to QUALIFICATION_ADMISSION_PENDING. Qualification execution, evidence acceptance, owner qualification approval, activation, runtime, credentials, connectors, publishing, customer contact, lead contact, demo execution, paid advertising, production execution, autonomous external action, Level 3 authority, and Founder Liberation remain blocked.",
    decidedAt:
      "2026-08-07T04:24:00.000Z",
  });