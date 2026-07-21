import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
} from "./engineeringAIWorkforceSkillToolRegistryExpansionPreparation";

import {
  createEngineeringAIWorkforceSkillToolRegistryExpansionDecision,
} from "./engineeringAIWorkforceSkillToolRegistryExpansionDecision";

export const ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD_VERSION =
  "nexus-engineering-ai-workforce-skill-tool-registry-expansion-approval-record-v1" as const;

export const ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION =
  createEngineeringAIWorkforceSkillToolRegistryExpansionDecision({
    registryExpansionPreparation:
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
    decisionId:
      "engineering-ai-workforce-skill-tool-registry-expansion-owner-approval-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
    reason:
      "Owner approved controlled registry mutation eligibility for exactly eight Engineering skills and eight audited tenant-scoped non-external draft-only tools while retaining the requirement for a separate bounded application step and preserving all template creation, factory transition, qualification, activation, runtime, repository access, branch, pull-request, merge, production deployment, secrets, customer-data, external-delivery, payment, legal-commitment, autonomous-execution, and public-launch boundaries.",
    decidedAt:
      "2026-07-21T17:27:28.046Z",
  });
