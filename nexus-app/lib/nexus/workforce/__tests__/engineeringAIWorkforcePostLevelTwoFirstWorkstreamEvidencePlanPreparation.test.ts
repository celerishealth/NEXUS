import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,
} from "../engineeringAIWorkforceOwnerActivatedRuntimeIssuance";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
  ENGINEERING_AI_WORKFORCE_SECOND_SYNTHETIC_TASK_EVIDENCE_PROFILES,
  createEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation,
  validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation,
  type EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation,
} from "../engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation";

describe(
  "Engineering AI Workforce post-Level-2 first-workstream evidence-plan preparation",
  () => {
    it(
      "binds to the canonical owner approval and activated runtimes",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;
        const approval =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION;
        const runtime =
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE;

        expect(
          preparation.sourceWorkstreamPreparationReviewDecisionId,
        ).toBe(approval.decisionId);
        expect(
          preparation.sourceWorkstreamPreparationReviewDecisionDigest,
        ).toBe(approval.decisionDigest);
        expect(
          preparation.sourceRuntimeIssuanceId,
        ).toBe(runtime.runtimeIssuanceId);
        expect(
          preparation.sourceRuntimeIssuanceDigest,
        ).toBe(runtime.runtimeIssuanceDigest);
      },
    );

    it(
      "prepares exactly eight identity-bound second-task evidence plans",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;
        const runtimes =
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
            .candidateRuntimeIssuances;

        expect(
          preparation.candidatePlanCount,
        ).toBe(8);
        expect(
          preparation.candidatePlans,
        ).toHaveLength(8);
        expect(
          preparation.candidatePlans.map(
            (plan) => ({
              employeeId: plan.employeeId,
              employeeCode: plan.employeeCode,
              publicName: plan.publicName,
              officialRole: plan.officialRole,
              runtimeId: plan.runtimeId,
            }),
          ),
        ).toEqual(
          runtimes.map((runtime) => ({
            employeeId: runtime.employeeId,
            employeeCode: runtime.employeeCode,
            publicName: runtime.publicName,
            officialRole: runtime.officialRole,
            runtimeId: runtime.runtimeId,
          })),
        );
      },
    );

    it(
      "assigns one distinct bounded evidence scenario to every employee",
      () => {
        const plans =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
            .candidatePlans;

        expect(
          plans.map(
            (plan) => plan.scenarioId,
          ),
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_SECOND_SYNTHETIC_TASK_EVIDENCE_PROFILES.map(
            (profile) =>
              profile.scenarioId,
          ),
        );
        expect(
          new Set(
            plans.map(
              (plan) => plan.scenarioId,
            ),
          ).size,
        ).toBe(8);
      },
    );

    it(
      "keeps every plan synthetic sanitized read-only and plan-only",
      () => {
        const plans =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
            .candidatePlans;

        expect(
          plans.every(
            (plan) =>
              plan.dataClassification ===
                "SYNTHETIC_SANITIZED_ONLY" &&
              plan.outputMode ===
                "PLAN_ONLY" &&
              plan.evidenceToolMode ===
                "READ_ONLY" &&
              plan.maximumTaskCount === 1 &&
              plan.concurrentTaskLimit ===
                0 &&
              plan
                .deterministicEvidenceRequired ===
                true &&
              plan
                .independentValidationRequired ===
                true,
          ),
        ).toBe(true);
      },
    );

    it(
      "records zero task execution concurrency and repository authority",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

        expect(preparation.summary).toMatchObject({
          candidateCount: 8,
          firstTaskReviewedAndApprovedCount:
            8,
          activatedRuntimeCount: 8,
          secondTaskEvidencePlanPreparedCount:
            8,
          ownerExecutionDecisionRequiredCount:
            8,
          ownerExecutionDecisionRecordedCount:
            0,
          secondTaskExecutionAuthorizedCount:
            0,
          secondTaskExecutedCount: 0,
          concurrentExecutionAuthorizedCount:
            0,
          repositoryReadAuthorizedCount: 0,
          repositoryWriteAuthorizedCount: 0,
        });

        expect(
          preparation.candidatePlans.every(
            (plan) =>
              plan
                .secondTaskExecutionAuthorized ===
                false &&
              plan.secondTaskExecuted ===
                false &&
              plan
                .concurrentExecutionAuthorized ===
                false &&
              plan
                .repositoryReadAuthorized ===
                false &&
              plan
                .repositoryWriteAuthorized ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves production external payment launch and Founder Liberation blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
            .authorityBoundary,
        ).toMatchObject({
          evidencePlanningOnly: true,
          levelThreeAuthorityGranted:
            false,
          secondTaskExecutionAuthorized:
            false,
          thirdTaskExecutionAuthorized:
            false,
          concurrentExecutionAuthorized:
            false,
          repositoryReadAuthorized: false,
          repositoryWriteAuthorized: false,
          productionDatabaseAuthorized:
            false,
          productionMutationAuthorized:
            false,
          productionDeploymentAuthorized:
            false,
          realCustomerContactAuthorized:
            false,
          externalDeliveryAuthorized: false,
          liveProviderExecutionAuthorized:
            false,
          paymentExecutionAuthorized: false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized: false,
          autonomousDecisionAuthorized:
            false,
          productionReadinessAuthorized:
            false,
          publicLaunchAuthorized: false,
          founderLiberationAchieved: false,
          founderReleasedFromRoutineExecution:
            false,
          ownerFinalAuthorityPreserved:
            true,
        });
      },
    );

    it(
      "requires owner review before any execution decision",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

        expect(
          preparation.ownerEvidencePlanReviewRequired,
        ).toBe(true);
        expect(
          preparation.ownerEvidencePlanReviewRecorded,
        ).toBe(false);
        expect(preparation.nextStep).toBe(
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW",
        );
      },
    );

    it(
      "creates deterministic immutable digest-bound planning evidence",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;
        const recreated =
          createEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation({
            preparationId:
              source.preparationId,
            preparedAt:
              source.preparedAt,
          });

        expect(recreated).toEqual(source);
        expect(
          source.preparationDigest,
        ).toMatch(/^[0-9a-f]{64}$/);
        expect(Object.isFrozen(source)).toBe(
          true,
        );
        expect(
          Object.isFrozen(
            source.candidatePlans,
          ),
        ).toBe(true);
        expect(
          source.candidatePlans.every(
            (plan) =>
              Object.isFrozen(plan) &&
              /^[0-9a-f]{64}$/.test(
                plan.candidatePlanDigest,
              ),
          ),
        ).toBe(true);
        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation(
            source,
          ),
        ).not.toThrow();
      },
      15000,
    );

    it(
      "fails closed when second-task execution authority is injected",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;
        const tampered = {
          ...source,
          authorityBoundary: {
            ...source.authorityBoundary,
            secondTaskExecutionAuthorized:
              true,
          },
        } as unknown as EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation;

        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation(
            tampered,
          ),
        ).toThrow();
      },
    );
  },
);