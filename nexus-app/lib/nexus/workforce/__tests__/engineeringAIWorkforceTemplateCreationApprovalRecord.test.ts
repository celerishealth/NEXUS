import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
} from "../engineeringAIWorkforceTemplatePreparationPlan";

import {
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionExecution";

import {
  validateEngineeringAIWorkforceTemplateCreationDecision,
} from "../engineeringAIWorkforceTemplateCreationDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION,
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_RECORD_VERSION,
} from "../engineeringAIWorkforceTemplateCreationApprovalRecord";

describe(
  "Engineering AI Workforce template-creation approval record",
  () => {
    it(
      "records the exact verified-owner approval",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION;

        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-template-creation-approval-record-v1",
        );

        expect(
          decision.ownerId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION",
        );

        expect(
          decision.templateCreationApproved,
        ).toBe(true);

        expect(
          decision.templateCreationExecutionAuthorized,
        ).toBe(true);
      },
    );

    it(
      "binds approval to the exact template plan and registry execution",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION;

        expect(
          decision.sourcePlanningId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .planningId,
        );

        expect(
          decision.sourcePlanningDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .planningDigest,
        );

        expect(
          decision.sourceRegistryExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
            .executionId,
        );

        expect(
          decision.sourceRegistryExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
            .executionDigest,
        );

        expect(
          decision.sourceExpandedRegistryDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
            .expandedRegistryDigest,
        );
      },
    );

    it(
      "authorizes exactly eight bounded template creations without performing them",
      () => {
        const candidates =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION
            .candidateTemplateCreationEligibility;

        expect(candidates).toHaveLength(8);

        expect(
          candidates.every(
            (candidate) =>
              candidate.registryRequirementsSatisfied ===
                true &&
              candidate.templateCreationAuthorized ===
                true &&
              candidate.templateCreated ===
                false &&
              candidate.factoryLifecycleTransitionExecuted ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves the planned identities launch sequences and registry requirements",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION;

        expect(
          decision.reviewedEvidence.proposedTemplateCount,
        ).toBe(8);

        expect(
          decision.reviewedEvidence.proposedLaunchSequences,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .proposedLaunchSequences,
        );

        expect(
          decision.reviewedEvidence.registeredEngineeringSkillCount,
        ).toBe(8);

        expect(
          decision.reviewedEvidence.registeredEngineeringToolCount,
        ).toBe(8);

        expect(
          decision.reviewedEvidence.registryRequirementsSatisfied,
        ).toBe(true);
      },
    );

    it(
      "does not create templates or mutate the template registry",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
          templateCreationExecutionAuthorized:
            true,
          templateCreationPerformed:
            false,
          employeeTemplateRegistryMutationPerformed:
            false,
          factoryLifecycleTransitionAuthorized:
            false,
        });
      },
    );

    it(
      "retains qualification activation repository deployment and external boundaries",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
          qualificationAdmissionAuthorized:
            false,
          qualificationExecutionAuthorized:
            false,
          qualificationEvidenceAccepted:
            false,
          ownerQualificationApproved:
            false,
          activationCandidatePrepared:
            false,
          ownerActivationApproved:
            false,
          runtimeAuthorized:
            false,
          repositoryReadAuthorized:
            false,
          repositoryWriteAuthorized:
            false,
          branchCreationAuthorized:
            false,
          pullRequestPreparationAuthorized:
            false,
          mergeAuthorized:
            false,
          productionDeploymentAuthorized:
            false,
          secretsAccessAuthorized:
            false,
          controlledWorkAuthorized:
            false,
          realCustomerDataAccessAuthorized:
            false,
          realCustomerContactAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
          autonomousExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "records immutable digest-verified approval evidence and advances only to bounded creation",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION;

        expect(
          decision.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(decision),
        ).toBe(true);

        expect(
          Object.isFrozen(
            decision.candidateTemplateCreationEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceTemplateCreationDecision(
            decision,
          ),
        ).not.toThrow();

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION",
        );
      },
    );
  },
);
