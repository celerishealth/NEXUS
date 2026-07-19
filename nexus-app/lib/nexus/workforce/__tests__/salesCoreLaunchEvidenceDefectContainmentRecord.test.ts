import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  MeeraLimitedInternalPilotQuotationProposalTwoExecution,
} from "../meeraLimitedInternalPilotQuotationProposalTwoExecution";

import type {
  MeeraLimitedInternalPilotQuotationProposalThreeExecution,
} from "../meeraLimitedInternalPilotQuotationProposalThreeExecution";

import type {
  MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision,
} from "../meeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision";

import type {
  SalesCoreLaunchPilotCompletionRecord,
} from "../salesCoreLaunchPilotCompletionRecord";

import type {
  SalesCoreLaunchReadinessDecision,
} from "../salesCoreLaunchReadinessDecision";

import type {
  SalesCoreLaunchActivationPlanningRecord,
} from "../salesCoreLaunchActivationPlanningRecord";

import type {
  SalesCoreLaunchActivationPlanDecision,
} from "../salesCoreLaunchActivationPlanDecision";

import {
  createSalesCoreLaunchEvidenceDefectContainmentRecord,
  validateSalesCoreLaunchEvidenceDefectContainmentRecord,
  type CreateSalesCoreLaunchEvidenceDefectContainmentRecordInput,
  type SalesCoreLaunchEvidenceDefectContainmentRecord,
} from "../salesCoreLaunchEvidenceDefectContainmentRecord";

function canonicalize(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value
      .map((item) => canonicalize(item))
      .join(",")}]`;
  }

  const record =
    value as Record<string, unknown>;

  return `{${Object.keys(record)
    .sort()
    .map(
      (key) =>
        `${JSON.stringify(key)}:${canonicalize(
          record[key],
        )}`,
    )
    .join(",")}}`;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(canonicalize(value))
    .digest("hex");
}

function signRecord<
  T extends Record<string, unknown>,
>(
  core: T,
  digestField: string,
): T & Record<string, string> {
  return {
    ...core,
    [digestField]:
      sha256(core),
  };
}

function resignRecord<
  T extends Record<string, unknown>,
>(
  record: T,
  digestField: string,
): T {
  const unsigned = {
    ...record,
  } as Record<string, unknown>;

  delete unsigned[digestField];

  return {
    ...unsigned,
    [digestField]:
      sha256(unsigned),
  } as T;
}

function createSourceChain() {
  const tenantId =
    "tenant-ppa-industrial-solution";

  const ownerId =
    "owner-prashant-srivastav";

  const proposalTwo =
    signRecord(
      {
        version:
          "synthetic-meera-proposal-two-execution-v1",

        executionId:
          "meera-quotation-proposal-two-execution-001",

        employeeId:
          "employee-meera-quotation-proposal-specialist-v1",

        employeeCode:
          "nx-sales-005",

        tenantId,
        ownerId,

        recommendationDraft: {
          recommendationStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW" as const,

          recommendationOutcome:
            "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION" as const,

          assumptionsMade:
            false as const,

          missingFactsExplicit:
            true as const,

          customerDeliveryPrepared:
            false as const,

          customerDeliveryExecuted:
            false as const,
        },
      },
      "executionDigest",
    ) as unknown as
      MeeraLimitedInternalPilotQuotationProposalTwoExecution;

  const proposalThree =
    signRecord(
      {
        version:
          "synthetic-meera-proposal-three-execution-v1",

        executionId:
          "meera-quotation-proposal-three-execution-001",

        employeeId:
          "employee-meera-quotation-proposal-specialist-v1",

        employeeCode:
          "nx-sales-005",

        tenantId,
        ownerId,

        sourceQuotationProposalTwoExecutionId:
          proposalTwo.executionId,

        sourceQuotationProposalTwoExecutionDigest:
          proposalTwo.executionDigest,

        quotationProposalDraft: {
          quotationProposalStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW" as const,

          recommendationOutcome:
            "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS" as const,

          preferredOptionId:
            "OPTION_A_BOUNDED_SIMPLE_ROLLOUT" as const,

          options: [
            {
              optionId:
                "OPTION_A_BOUNDED_SIMPLE_ROLLOUT",
            },
            {
              optionId:
                "OPTION_B_HIGH_CAPACITY_ROLLOUT",
            },
          ],

          rationale: [
            "Synthetic recommendation-style rationale.",
          ],

          uncertainties: [
            "Commercial pricing evidence remains absent.",
          ],

          ownerDecisionMade:
            false as const,

          customerDeliveryPrepared:
            false as const,

          customerDeliveryExecuted:
            false as const,
        },
      },
      "executionDigest",
    ) as unknown as
      MeeraLimitedInternalPilotQuotationProposalThreeExecution;

  const meeraFinal =
    signRecord(
      {
        version:
          "synthetic-meera-final-review-v1",

        decisionId:
          "meera-final-review-decision-001",

        employeeId:
          "employee-meera-quotation-proposal-specialist-v1",

        employeeCode:
          "nx-sales-005",

        tenantId,
        ownerId,

        limitedInternalPilotQuotationProposalThreeExecutionId:
          proposalThree.executionId,

        limitedInternalPilotQuotationProposalThreeExecutionDigest:
          proposalThree.executionDigest,

        decision:
          "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION" as const,

        limitedInternalPilotCompleted:
          true as const,

        reviewedEvidence: {
          quotationProposalStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW" as const,

          recommendationOutcome:
            "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS" as const,

          preferredOptionId:
            "OPTION_A_BOUNDED_SIMPLE_ROLLOUT" as const,

          optionIds: [
            "OPTION_A_BOUNDED_SIMPLE_ROLLOUT",
            "OPTION_B_HIGH_CAPACITY_ROLLOUT",
          ],

          rationale: [
            "Synthetic recommendation-style rationale.",
          ],

          uncertainties: [
            "Commercial pricing evidence remains absent.",
          ],
        },

        nextStep:
          "LIMITED_INTERNAL_PILOT_COMPLETE" as const,
      },
      "decisionDigest",
    ) as unknown as
      MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision;

  const registryDigest =
    "1".repeat(64);

  const completion =
    signRecord(
      {
        version:
          "sales-core-launch-pilot-completion-record-v1",

        completionId:
          "sales-core-launch-pilot-completion-001",

        tenantId,
        ownerId,
        registryDigest,

        completedEmployees: [
          {
            employeeId:
              "employee-asha-inquiry-intake-v1",

            employeeCode:
              "nx-sales-003",

            launchSequence:
              3,

            sourceDecisionId:
              "asha-final-review-decision-001",

            sourceDecisionDigest:
              "2".repeat(64),
          },
          {
            employeeId:
              "employee-riya-recommendation-specialist-v1",

            employeeCode:
              "nx-sales-004",

            launchSequence:
              4,

            sourceDecisionId:
              "riya-final-review-decision-001",

            sourceDecisionDigest:
              "3".repeat(64),
          },
          {
            employeeId:
              "employee-meera-quotation-proposal-specialist-v1",

            employeeCode:
              "nx-sales-005",

            launchSequence:
              5,

            sourceDecisionId:
              meeraFinal.decisionId,

            sourceDecisionDigest:
              meeraFinal.decisionDigest,
          },
        ],

        allLimitedInternalPilotsCompleted:
          true as const,

        nextStep:
          "AWAIT_OWNER_SALES_CORE_LAUNCH_READINESS_DECISION" as const,
      },
      "completionDigest",
    ) as unknown as
      SalesCoreLaunchPilotCompletionRecord;

  const readiness =
    signRecord(
      {
        version:
          "sales-core-launch-readiness-decision-v1",

        decisionId:
          "sales-core-launch-readiness-decision-001",

        tenantId,
        ownerId,

        sourceCompletionId:
          completion.completionId,

        sourceCompletionDigest:
          completion.completionDigest,

        sourceRegistryDigest:
          registryDigest,

        decision:
          "APPROVE_SALES_CORE_LAUNCH_READINESS" as const,

        salesCoreLaunchReadinessApproved:
          true as const,

        nextStep:
          "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLANNING" as const,
      },
      "decisionDigest",
    ) as unknown as
      SalesCoreLaunchReadinessDecision;

  const planning =
    signRecord(
      {
        version:
          "sales-core-launch-activation-planning-record-v1",

        planningId:
          "sales-core-launch-activation-planning-001",

        tenantId,
        ownerId,

        sourceReadinessDecisionId:
          readiness.decisionId,

        sourceReadinessDecisionDigest:
          readiness.decisionDigest,

        sourceCompletionId:
          completion.completionId,

        sourceCompletionDigest:
          completion.completionDigest,

        sourceRegistryDigest:
          registryDigest,

        nextStep:
          "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION" as const,
      },
      "planningDigest",
    ) as unknown as
      SalesCoreLaunchActivationPlanningRecord;

  const activationDecision =
    signRecord(
      {
        version:
          "sales-core-launch-activation-plan-decision-v1",

        decisionId:
          "sales-core-launch-activation-plan-decision-001",

        tenantId,
        ownerId,

        sourcePlanningId:
          planning.planningId,

        sourcePlanningDigest:
          planning.planningDigest,

        sourceReadinessDecisionId:
          readiness.decisionId,

        sourceReadinessDecisionDigest:
          readiness.decisionDigest,

        sourceCompletionId:
          completion.completionId,

        sourceCompletionDigest:
          completion.completionDigest,

        sourceRegistryDigest:
          registryDigest,

        decision:
          "APPROVE_SALES_CORE_LAUNCH_ACTIVATION_PLAN" as const,

        activationPlanApproved:
          true as const,

        runtimeActivationPreparationEligible:
          true as const,

        authorityBoundary: {
          runtimeActivationAuthorized:
            false as const,

          runtimeActivationExecuted:
            false as const,

          runtimeActivated:
            false as const,

          controlledWorkAuthorized:
            false as const,

          productionAuthorityGranted:
            false as const,

          realCustomerDataAccessAuthorized:
            false as const,

          realCustomerContactAuthorized:
            false as const,

          externalDeliveryAuthorized:
            false as const,

          liveProviderExecutionAuthorized:
            false as const,

          paymentExecutionAuthorized:
            false as const,

          autonomousExecutionAuthorized:
            false as const,

          publicLaunchAuthorized:
            false as const,
        },

        nextStep:
          "PREPARE_SALES_CORE_LAUNCH_OWNER_ACTIVATED_RUNTIMES" as const,
      },
      "decisionDigest",
    ) as unknown as
      SalesCoreLaunchActivationPlanDecision;

  return {
    tenantId,
    ownerId,
    proposalTwo,
    proposalThree,
    meeraFinal,
    completion,
    readiness,
    planning,
    activationDecision,
  };
}

function createInput(
  overrides:
    Partial<CreateSalesCoreLaunchEvidenceDefectContainmentRecordInput> = {},
): CreateSalesCoreLaunchEvidenceDefectContainmentRecordInput {
  const chain =
    createSourceChain();

  return {
    containmentId:
      "sales-core-launch-evidence-defect-containment-001",

    meeraQuotationProposalTwoExecution:
      chain.proposalTwo,

    meeraQuotationProposalThreeExecution:
      chain.proposalThree,

    meeraFinalReviewDecision:
      chain.meeraFinal,

    salesCoreLaunchPilotCompletion:
      chain.completion,

    salesCoreLaunchReadinessDecision:
      chain.readiness,

    salesCoreLaunchActivationPlanning:
      chain.planning,

    salesCoreLaunchActivationPlanDecision:
      chain.activationDecision,

    reason:
      "Meera proposal two and proposal three contain recommendation-specialist structures instead of sufficient commercial quotation evidence, so activation preparation must stop pending remediation and owner reapproval.",

    detectedAt:
      "2026-07-19T12:00:00.000Z",

    ...overrides,
  };
}

describe(
  "Sales core-launch evidence-defect containment record",
  () => {
    it(
      "records immutable containment across the complete affected source chain",
      () => {
        const result =
          createSalesCoreLaunchEvidenceDefectContainmentRecord(
            createInput(),
          );

        expect(result).toMatchObject({
          containmentState:
            "SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINED",

          department:
            "SALES",

          affectedEmployeeCode:
            "nx-sales-005",

          defectClassification:
            "COPY_ADAPTATION_COMMERCIAL_CONTRACT_REGRESSION",

          nextStep:
            "REMEDIATE_MEERA_COMMERCIAL_EVIDENCE_AND_REQUALIFY_SALES_CORE_LAUNCH",
        });

        expect(
          result.sourceChain
            .meeraFinalReviewDecisionDigest,
        ).toMatch(/^[a-f0-9]{64}$/);

        expect(
          result.sourceChain
            .salesCoreLaunchActivationPlanDecisionDigest,
        ).toMatch(/^[a-f0-9]{64}$/);

        validateSalesCoreLaunchEvidenceDefectContainmentRecord(
          result,
        );
      },
    );

    it(
      "revokes preparation eligibility and preserves every consequential authority block",
      () => {
        const result =
          createSalesCoreLaunchEvidenceDefectContainmentRecord(
            createInput(),
          );

        expect(
          result.containmentBoundary,
        ).toEqual({
          historicalRecordsMutated:
            false,

          sourceDigestsPreserved:
            true,

          priorActivationPlanApprovalRetainedAsHistoricalEvidenceOnly:
            true,

          containmentOverridesPreparationEligibility:
            true,

          runtimeActivationPreparationEligible:
            false,

          runtimeActivationAuthorized:
            false,

          runtimeActivationExecuted:
            false,

          runtimeActivated:
            false,

          controlledWorkAuthorized:
            false,

          productionAuthorityGranted:
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

          autonomousExecutionAuthorized:
            false,

          publicLaunchAuthorized:
            false,

          remediationRequired:
            true,

          ownerReapprovalRequiredAfterRemediation:
            true,
        });
      },
    );

    it(
      "is deterministic for the same immutable source chain",
      () => {
        const input =
          createInput();

        const first =
          createSalesCoreLaunchEvidenceDefectContainmentRecord(
            input,
          );

        const second =
          createSalesCoreLaunchEvidenceDefectContainmentRecord(
            input,
          );

        expect(
          second.containmentDigest,
        ).toBe(first.containmentDigest);

        expect(second).toEqual(first);
      },
    );

    it(
      "rejects a missing proposal-two defect signature",
      () => {
        const input =
          createInput();

        const source =
          input
            .meeraQuotationProposalTwoExecution as unknown as
              Record<string, unknown>;

        const modified =
          resignRecord(
            {
              ...source,

              recommendationDraft: {
                ...(
                  source.recommendationDraft as
                    Record<string, unknown>
                ),

                recommendationOutcome:
                  "COMMERCIAL_QUOTATION_READY",
              },
            },
            "executionDigest",
          ) as unknown as
            MeeraLimitedInternalPilotQuotationProposalTwoExecution;

        expect(() =>
          createSalesCoreLaunchEvidenceDefectContainmentRecord({
            ...input,

            meeraQuotationProposalTwoExecution:
              modified,
          }),
        ).toThrow(
          "Meera proposal-two defect signature is not verified.",
        );
      },
    );

    it(
      "rejects a missing proposal-three recommendation-shape signature",
      () => {
        const input =
          createInput();

        const source =
          input
            .meeraQuotationProposalThreeExecution as unknown as
              Record<string, unknown>;

        const modified =
          resignRecord(
            {
              ...source,

              quotationProposalDraft: {
                ...(
                  source.quotationProposalDraft as
                    Record<string, unknown>
                ),

                preferredOptionId:
                  "OWNER_DECISION_RESERVED",
              },
            },
            "executionDigest",
          ) as unknown as
            MeeraLimitedInternalPilotQuotationProposalThreeExecution;

        expect(() =>
          createSalesCoreLaunchEvidenceDefectContainmentRecord({
            ...input,

            meeraQuotationProposalThreeExecution:
              modified,
          }),
        ).toThrow(
          "Meera proposal-three defect signature is not verified.",
        );
      },
    );

    it(
      "rejects final review evidence that does not propagate the observed defect",
      () => {
        const input =
          createInput();

        const source =
          input
            .meeraFinalReviewDecision as unknown as
              Record<string, unknown>;

        const modified =
          resignRecord(
            {
              ...source,

              reviewedEvidence: {
                ...(
                  source.reviewedEvidence as
                    Record<string, unknown>
                ),

                preferredOptionId:
                  "OPTION_B_HIGH_CAPACITY_ROLLOUT",
              },
            },
            "decisionDigest",
          ) as unknown as
            MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision;

        expect(() =>
          createSalesCoreLaunchEvidenceDefectContainmentRecord({
            ...input,

            meeraFinalReviewDecision:
              modified,
          }),
        ).toThrow(
          "Meera final review defect propagation is invalid.",
        );
      },
    );

    it(
      "rejects a broken readiness chain and cross-tenant activation decision",
      () => {
        const input =
          createInput();

        const readinessSource =
          input
            .salesCoreLaunchReadinessDecision as unknown as
              Record<string, unknown>;

        const brokenReadiness =
          resignRecord(
            {
              ...readinessSource,

              sourceCompletionDigest:
                "f".repeat(64),
            },
            "decisionDigest",
          ) as unknown as
            SalesCoreLaunchReadinessDecision;

        expect(() =>
          createSalesCoreLaunchEvidenceDefectContainmentRecord({
            ...input,

            salesCoreLaunchReadinessDecision:
              brokenReadiness,
          }),
        ).toThrow(
          "Sales readiness source chain is invalid.",
        );

        const activationSource =
          input
            .salesCoreLaunchActivationPlanDecision as unknown as
              Record<string, unknown>;

        const crossTenantActivation =
          resignRecord(
            {
              ...activationSource,

              tenantId:
                "tenant-cross-boundary",
            },
            "decisionDigest",
          ) as unknown as
            SalesCoreLaunchActivationPlanDecision;

        expect(() =>
          createSalesCoreLaunchEvidenceDefectContainmentRecord({
            ...input,

            salesCoreLaunchActivationPlanDecision:
              crossTenantActivation,
          }),
        ).toThrow(
          "Containment source chain crosses tenant or owner identity.",
        );
      },
    );

    it(
      "detects raw mutation and blocks a re-signed authority escalation",
      () => {
        const record =
          createSalesCoreLaunchEvidenceDefectContainmentRecord(
            createInput(),
          );

        const tampered = {
          ...record,

          ownerId:
            "owner-unauthorized",
        } as
          SalesCoreLaunchEvidenceDefectContainmentRecord;

        expect(() =>
          validateSalesCoreLaunchEvidenceDefectContainmentRecord(
            tampered,
          ),
        ).toThrow(
          "Sales core launch evidence-defect containment record digest verification failed.",
        );

        const unsigned = {
          ...record,
        } as Record<string, unknown>;

        delete unsigned.containmentDigest;

        unsigned.containmentBoundary = {
          ...record.containmentBoundary,

          runtimeActivationPreparationEligible:
            true,
        };

        const resigned = {
          ...unsigned,

          containmentDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchEvidenceDefectContainmentRecord;

        expect(() =>
          validateSalesCoreLaunchEvidenceDefectContainmentRecord(
            resigned,
          ),
        ).toThrow(
          "Sales core launch evidence-defect containment record is invalid.",
        );
      },
    );
  },
);
