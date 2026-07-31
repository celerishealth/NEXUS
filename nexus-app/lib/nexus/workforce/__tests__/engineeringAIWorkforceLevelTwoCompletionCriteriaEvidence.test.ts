import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE,
  createEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence,
  type EngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence,
  validateEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence,
} from "../engineeringAIWorkforceLevelTwoCompletionCriteriaEvidence";

function cloneCanonicalRecord(): EngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence {
  return JSON.parse(
    JSON.stringify(
      ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE,
    ),
  ) as EngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence;
}

describe(
  "engineering AI workforce Level-2 completion-criteria evidence",
  () => {
    it(
      "binds all canonical evidence and records the exact Level-2 metrics",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE;

        expect(record.sourceBindingCount).toBe(14);
        expect(record.sourceBindings).toHaveLength(14);
        expect(
          new Set(
            record.sourceBindings.map(
              (binding) =>
                binding.sourceId,
            ),
          ).size,
        ).toBe(14);
        expect(
          new Set(
            record.sourceBindings.map(
              (binding) =>
                binding.sourceDigest,
            ),
          ).size,
        ).toBe(14);

        expect(record.summary).toEqual({
          candidateCount: 8,
          qualificationCasesExecuted: 800,
          qualificationCasesPassed: 800,
          qualificationCasesFailed: 0,
          qualificationEvidenceCollected: 800,
          ownerActivationApprovedCount: 8,
          runtimeActivationExecutedCount: 8,
          activatedRuntimeCount: 8,
          controlledWorkAuthorizationCount: 8,
          shadowReviewApprovedCount: 8,
          shadowReviewRejectedCount: 0,
          limitedInternalPilotPreparationAuthorizedCount: 8,
          firstSyntheticPilotTaskExecutionAuthorizedCount: 8,
          firstSyntheticPilotTaskExecutionReviewedCount: 8,
          firstSyntheticPilotTaskExecutionApprovedCount: 8,
          engineeringFirstTaskSequenceCompleted: true,
          levelTwoEvidenceCriteriaSatisfied: true,
        });

        expect(record.nextStep).toBe(
          "AWAIT_OWNER_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_REVIEW",
        );

        expect(
          () =>
            validateEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence(
              record,
            ),
        ).not.toThrow();
      },
    );

    it(
      "preserves owner authority and blocks Level-3, pilot, production, payment, launch, and Founder Liberation claims",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE
            .authorityBoundary;

        expect(boundary).toMatchObject({
          canonicalEvidenceBound: true,
          allCanonicalValidatorsPassed: true,
          ownerFinalAuthorityPreserved: true,
          ownerCompletionReviewRequired: true,
          ownerCompletionReviewAccepted: false,
          levelThreeAuthorityGranted: false,
          pilotCompleted: false,
          furtherCandidateExecutionAuthorized: false,
          secondTaskExecutionAuthorized: false,
          thirdTaskExecutionAuthorized: false,
          concurrentExecutionAuthorized: false,
          repositoryReadAuthorized: false,
          repositoryWriteAuthorized: false,
          branchCreationAuthorized: false,
          pullRequestPreparationAuthorized: false,
          mergeAuthorized: false,
          secretsAccessAuthorized: false,
          realCustomerDataAccessAuthorized: false,
          realCustomerContactAuthorized: false,
          externalDeliveryAuthorized: false,
          liveProviderExecutionAuthorized: false,
          productionDatabaseAuthorized: false,
          productionMutationAuthorized: false,
          productionDeploymentAuthorized: false,
          paymentExecutionAuthorized: false,
          financialCommitmentAuthorized: false,
          legalCommitmentAuthorized: false,
          autonomousDecisionAuthorized: false,
          productionReadinessAuthorized: false,
          publicLaunchAuthorized: false,
          monitoringRequired: true,
          emergencyPauseAvailable: true,
          founderLiberationAchieved: false,
          founderReleasedFromRoutineExecution: false,
        });
      },
    );

    it(
      "creates deterministic deeply frozen digest-verified evidence",
      () => {
        const input = {
          evidenceId:
            "engineering-ai-workforce-level-two-completion-criteria-evidence-test",
          auditedAt:
            "2026-07-25T15:54:00.000Z",
        };

        const first =
          createEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence(
            input,
          );
        const second =
          createEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence(
            input,
          );

        expect(second).toEqual(first);
        expect(first.evidenceDigest).toMatch(
          /^[0-9a-f]{64}$/,
        );
        expect(Object.isFrozen(first)).toBe(true);
        expect(
          Object.isFrozen(
            first.sourceBindings,
          ),
        ).toBe(true);
        expect(
          first.sourceBindings.every(
            (binding) =>
              Object.isFrozen(binding),
          ),
        ).toBe(true);
        expect(
          Object.isFrozen(
            first.summary,
          ),
        ).toBe(true);
        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects a tampered evidence digest",
      () => {
        const tampered = {
          ...cloneCanonicalRecord(),
          evidenceDigest:
            "0".repeat(64),
        } as EngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence;

        expect(
          () =>
            validateEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence(
              tampered,
            ),
        ).toThrow(
          "Engineering Level-2 completion evidence integrity is invalid.",
        );
      },
    );
  },
);
