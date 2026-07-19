import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision,
} from "../ashaOwnerLimitedInternalPilotInquiryThreeReviewDecision";

import type {
  RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,
} from "../riyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision";

import type {
  SalesCoreLaunchEvidenceDefectContainmentRecord,
} from "../salesCoreLaunchEvidenceDefectContainmentRecord";

import {
  createSalesCoreLaunchCommercialEvidenceRemediationRecord,
  validateSalesCoreLaunchCommercialEvidenceRemediationRecord,
  type CreateSalesCoreLaunchCommercialEvidenceRemediationRecordInput,
  type SalesCoreLaunchCommercialEvidenceRemediationRecord,
} from "../salesCoreLaunchCommercialEvidenceRemediationRecord";

import {
  createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision,
  validateSalesCoreLaunchCommercialEvidenceRemediationReviewDecision,
  type CreateSalesCoreLaunchCommercialEvidenceRemediationReviewDecisionInput,
  type SalesCoreLaunchCommercialEvidenceRemediationReviewDecision,
} from "../salesCoreLaunchCommercialEvidenceRemediationReviewDecision";
import {
  MEERA_COMMERCIAL_REQUALIFICATION_CASES,
  createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
  type CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparationInput,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
} from "../salesCoreLaunchCommercialEvidenceControlledRequalificationPreparation";
import {
  createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision,
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision,
  type CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecisionInput,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision,
} from "../salesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision";
import {
  executeSalesCoreLaunchCommercialEvidenceControlledRequalification,
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence,
  type ExecuteSalesCoreLaunchCommercialEvidenceControlledRequalificationInput,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence,
} from "../salesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence";
function canonicalize(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
            canonicalize(item),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            JSON.stringify(key) +
            ":" +
            canonicalize(
              record[key],
            ),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic test value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      canonicalize(value),
      "utf8",
    )
    .digest("hex");
}

function signRecord<
  T extends Record<string, unknown>,
>(
  core: T,
  digestField: string,
): T {
  return {
    ...core,
    [digestField]:
      sha256(core),
  } as T;
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

function createInput():
  CreateSalesCoreLaunchCommercialEvidenceRemediationRecordInput {
  const tenantId =
    "tenant-ppa-industrial-solution";

  const ownerId =
    "owner-prashant-srivastav";

  const asha =
    signRecord(
      {
        decisionId:
          "asha-inquiry-three-review-001",

        decisionState:
          "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_RECORDED" as const,

        employeeId:
          "employee-asha-inquiry-intake-v1" as const,

        tenantId,
        ownerId,

        limitedInternalPilotInquiryThreeExecutionId:
          "asha-inquiry-three-execution-001",

        limitedInternalPilotInquiryThreeExecutionDigest:
          "2".repeat(64),

        decision:
          "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION" as const,

        limitedInternalPilotCompleted:
          true as const,

        reviewedEvidence: {
          scenarioId:
            "SAFE_CUSTOMER_CONTEXT_CONTINUITY" as const,

          dataClass:
            "SYNTHETIC_SANITIZED_ONLY" as const,

          toolMode:
            "DRAFT_ONLY" as const,

          executionMode:
            "SANDBOX_ONLY" as const,

          clarificationBeforeGuessingRequired:
            true as const,

          tenantScopedContextOnly:
            true as const,

          customerScopedContextOnly:
            true as const,
        },

        authorityBoundary: {
          ownerDecisionRequired:
            true as const,

          approvalBypassAllowed:
            false as const,

          realCustomerDataAccessAuthorized:
            false as const,

          customerContactAuthorized:
            false as const,

          recommendationGenerationAuthorized:
            false as const,

          externalDeliveryAuthorized:
            false as const,

          liveProviderExecutionAuthorized:
            false as const,

          paymentExecutionAuthorized:
            false as const,

          autonomousDecisionAuthorized:
            false as const,

          publicLaunchAuthorized:
            false as const,
        },

        nextStep:
          "LIMITED_INTERNAL_PILOT_COMPLETE" as const,

        decidedAt:
          "2026-07-16T19:00:00.000Z",
      },
      "decisionDigest",
    ) as unknown as
      AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision;

  const riya =
    signRecord(
      {
        decisionId:
          "riya-recommendation-three-review-001",

        decisionState:
          "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_RECORDED" as const,

        employeeId:
          "employee-riya-recommendation-specialist-v1" as const,

        tenantId,
        ownerId,

        limitedInternalPilotRecommendationThreeExecutionId:
          "riya-recommendation-three-execution-001",

        limitedInternalPilotRecommendationThreeExecutionDigest:
          "3".repeat(64),

        decision:
          "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION" as const,

        limitedInternalPilotCompleted:
          true as const,

        reviewedEvidence: {
          scenarioId:
            "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" as const,

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY" as const,

          inquiryEvidenceToolMode:
            "READ_ONLY" as const,

          recommendationToolMode:
            "DRAFT_ONLY" as const,

          executionMode:
            "SANDBOX_ONLY" as const,

          ownerDecisionReserved:
            true as const,

          assumptionsMade:
            false as const,

          unsupportedClaimsIncluded:
            false as const,

          unsupportedFactsInvented:
            false as const,

          customerDeliveryPrepared:
            false as const,

          customerDeliveryExecuted:
            false as const,

          realCustomerDataUsed:
            false as const,

          crossCustomerEvidenceUsed:
            false as const,

          crossTenantEvidenceUsed:
            false as const,
        },

        authorityBoundary: {
          ownerDecisionRequired:
            true as const,

          approvalBypassAllowed:
            false as const,

          recommendationCustomerDeliveryAuthorized:
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

          autonomousDecisionAuthorized:
            false as const,

          publicLaunchAuthorized:
            false as const,
        },

        nextStep:
          "LIMITED_INTERNAL_PILOT_COMPLETE" as const,

        decidedAt:
          "2026-07-16T19:30:02.000Z",
      },
      "decisionDigest",
    ) as unknown as
      RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision;

  const containment =
    signRecord(
      {
        containmentId:
          "sales-core-launch-containment-001",

        containmentState:
          "SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINED" as const,

        affectedEmployeeId:
          "employee-meera-quotation-proposal-specialist-v1" as const,

        affectedEmployeeCode:
          "nx-sales-005" as const,

        tenantId,
        ownerId,

        sourceChain: {
          sourceRegistryDigest:
            "1".repeat(64),
        },

        containmentBoundary: {
          historicalRecordsMutated:
            false as const,

          sourceDigestsPreserved:
            true as const,

          runtimeActivationPreparationEligible:
            false as const,

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

          remediationRequired:
            true as const,

          ownerReapprovalRequiredAfterRemediation:
            true as const,
        },

        nextStep:
          "REMEDIATE_MEERA_COMMERCIAL_EVIDENCE_AND_REQUALIFY_SALES_CORE_LAUNCH" as const,

        detectedAt:
          "2026-07-18T10:00:00.000Z",
      },
      "containmentDigest",
    ) as unknown as
      SalesCoreLaunchEvidenceDefectContainmentRecord;

  return {
    remediationId:
      "sales-core-commercial-remediation-001",

    containmentRecord:
      containment,

    ashaInquiryReviewDecision:
      asha,

    riyaRecommendationReviewDecision:
      riya,

    reason:
      "Create additive digest-bound Meera commercial evidence without modifying historical records.",

    remediatedAt:
      "2026-07-19T10:00:00.000Z",
  };
}

function createReviewInput(
  overrides:
    Partial<CreateSalesCoreLaunchCommercialEvidenceRemediationReviewDecisionInput> = {},
): CreateSalesCoreLaunchCommercialEvidenceRemediationReviewDecisionInput {
  const remediation =
    createSalesCoreLaunchCommercialEvidenceRemediationRecord(
      createInput(),
    );

  return {
    decisionId:
      "sales-core-commercial-remediation-review-001",

    commercialEvidenceRemediation:
      remediation,

    ownerId:
      remediation.ownerId,

    decision:
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_FOR_CONTROLLED_REQUALIFICATION_PREPARATION",

    reason:
      "Owner approves controlled Meera commercial evidence requalification preparation only.",

    reviewedAt:
      "2026-07-19T10:00:01.000Z",

    ...overrides,
  };
}

function createPreparationInput(
  overrides:
    Partial<CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparationInput> = {},
): CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparationInput {
  const reviewDecision =
    createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
      createReviewInput(),
    );

  return {
    preparationId:
      "sales-core-commercial-requalification-preparation-001",

    remediationReviewDecision:
      reviewDecision,

    ownerId:
      reviewDecision.ownerId,

    preparedAt:
      "2026-07-19T10:00:02.000Z",

    ...overrides,
  };
}

function createExecutionDecisionInput(
  overrides:
    Partial<CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecisionInput> = {},
): CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecisionInput {
  const preparation =
    createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
      createPreparationInput(),
    );

  return {
    controlledRequalificationPreparation:
      preparation,

    decisionId:
      "sales-core-commercial-requalification-execution-decision-001",

    ownerId:
      preparation.ownerId,

    decision:
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION",

    reason:
      "Owner approves only the bounded twelve-case synthetic commercial requalification execution.",

    decidedAt:
      "2026-07-19T10:00:03.000Z",

    ...overrides,
  };
}

function createExecutionEvidenceInput(
  overrides:
    Partial<ExecuteSalesCoreLaunchCommercialEvidenceControlledRequalificationInput> = {},
): ExecuteSalesCoreLaunchCommercialEvidenceControlledRequalificationInput {
  const preparation =
    createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
      createPreparationInput(),
    );

  const executionDecision =
    createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision(
      createExecutionDecisionInput({
        controlledRequalificationPreparation:
          preparation,
      }),
    );

  return {
    ledgerId:
      "sales-core-commercial-requalification-evidence-ledger-001",

    controlledRequalificationPreparation:
      preparation,

    executionDecision,

    ownerId:
      preparation.ownerId,

    evaluatorId:
      "evaluator-commercial-independent-001",

    executedAt:
      "2026-07-19T10:00:04.000Z",

    ...overrides,
  };
}

describe(
  "salesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence",
  () => {
    it(
      "executes exactly twelve commercial cases with forty-eight passing assertions",
      async () => {
        const ledger =
          await executeSalesCoreLaunchCommercialEvidenceControlledRequalification(
            createExecutionEvidenceInput(),
          );

        expect(ledger).toMatchObject({
          ledgerState:
            "MEERA_COMMERCIAL_REQUALIFICATION_ASSERTION_EVIDENCE_CAPTURED",

          summary: {
            qualificationCasesExecuted:
              12,

            qualificationCasesPassed:
              12,

            qualificationCasesFailed:
              0,

            qualificationEvidenceCollected:
              12,

            totalAssertionsExecuted:
              48,

            totalAssertionsPassed:
              48,

            totalAssertionsFailed:
              0,
          },
        });

        expect(
          ledger.evidenceBindings,
        ).toHaveLength(12);
      },
    );

    it(
      "creates unique assertion-derived evidence for every commercial case",
      async () => {
        const ledger =
          await executeSalesCoreLaunchCommercialEvidenceControlledRequalification(
            createExecutionEvidenceInput(),
          );

        expect(
          new Set(
            ledger.evidenceBindings.map(
              (binding) =>
                binding.caseId,
            ),
          ).size,
        ).toBe(12);

        expect(
          new Set(
            ledger.evidenceBindings.map(
              (binding) =>
                binding.evidenceId,
            ),
          ).size,
        ).toBe(12);

        expect(
          new Set(
            ledger.evidenceBindings.map(
              (binding) =>
                binding.evidenceDigest,
            ),
          ).size,
        ).toBe(12);

        expect(
          new Set(
            ledger.evidenceBindings.map(
              (binding) =>
                binding.bindingDigest,
            ),
          ).size,
        ).toBe(12);

        expect(
          ledger.evidenceBindings.every(
            (binding) =>
              binding.assertionDerivedEvidence ===
                true &&
              binding.hardCodedPassingEvidenceAccepted ===
                false &&
              binding.passed ===
                true &&
              binding.assertions.length ===
                4 &&
              binding.assertions.every(
                (item) =>
                  item.passed ===
                    true,
              ),
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves commercial allow and fail-closed escalation coverage",
      async () => {
        const ledger =
          await executeSalesCoreLaunchCommercialEvidenceControlledRequalification(
            createExecutionEvidenceInput(),
          );

        expect(ledger.summary)
          .toMatchObject({
            syntheticCommercialDraftAllowedCases:
              8,

            ownerEscalationCases:
              4,
          });

        expect(
          ledger.evidenceBindings.filter(
            (binding) =>
              binding.actualControl ===
                "BLOCK_AND_ESCALATE_TO_OWNER",
          ).map(
            (binding) =>
              binding.caseId,
          ),
        ).toEqual([
          "meera-commercial-requalification-04-unresolved-pricing",
          "meera-commercial-requalification-10-tenant-owner",
          "meera-commercial-requalification-11-adversarial-integrity",
          "meera-commercial-requalification-12-failure-recovery",
        ]);
      },
    );

    it(
      "binds the exact preparation decision tenant owner and remediation chain",
      async () => {
        const input =
          createExecutionEvidenceInput();

        const ledger =
          await executeSalesCoreLaunchCommercialEvidenceControlledRequalification(
            input,
          );

        expect(ledger.preparationId)
          .toBe(
            input.controlledRequalificationPreparation
              .preparationId,
          );

        expect(ledger.preparationDigest)
          .toBe(
            input.controlledRequalificationPreparation
              .preparationDigest,
          );

        expect(ledger.executionDecisionId)
          .toBe(
            input.executionDecision.decisionId,
          );

        expect(ledger.executionDecisionDigest)
          .toBe(
            input.executionDecision.decisionDigest,
          );

        expect(ledger.tenantId)
          .toBe(
            input.controlledRequalificationPreparation
              .tenantId,
          );

        expect(ledger.ownerId)
          .toBe(
            input.controlledRequalificationPreparation
              .ownerId,
          );

        expect(
          ledger.sourceRemediationDigest,
        ).toBe(
          input.controlledRequalificationPreparation
            .sourceRemediationDigest,
        );

        expect(
          ledger.sourceContainmentDigest,
        ).toBe(
          input.controlledRequalificationPreparation
            .sourceContainmentDigest,
        );
      },
    );

    it(
      "requires owner review and does not requalify activate deliver charge or launch",
      async () => {
        const ledger =
          await executeSalesCoreLaunchCommercialEvidenceControlledRequalification(
            createExecutionEvidenceInput(),
          );

        expect(ledger.nextStep)
          .toBe(
            "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_REVIEW",
          );

        expect(ledger.executionBoundary)
          .toMatchObject({
            controlledRequalificationExecutionPerformed:
              true,

            qualificationCasesExecuted:
              12,

            qualificationCasesPassed:
              12,

            executionEvidenceCreated:
              true,

            independentEvaluationCompleted:
              true,

            ownerReviewRequiredAfterExecution:
              true,

            ownerPostExecutionReviewRecorded:
              false,

            meeraCommercialEvidenceRequalified:
              false,

            salesCoreLaunchRequalificationEligible:
              false,
          });

        expect(
          Object.values(
            ledger.authorityBoundary,
          ).every(
            (authorized) =>
              authorized ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "blocks wrong owner owner-evaluator rejected decision and early execution",
      async () => {
        await expect(
          executeSalesCoreLaunchCommercialEvidenceControlledRequalification(
            createExecutionEvidenceInput({
              ownerId:
                "owner-other",
            }),
          ),
        ).rejects.toThrow(
          "preparation-and-decision-bound owner",
        );

        const ownerInput =
          createExecutionEvidenceInput();

        await expect(
          executeSalesCoreLaunchCommercialEvidenceControlledRequalification({
            ...ownerInput,

            evaluatorId:
              ownerInput.ownerId,
          }),
        ).rejects.toThrow(
          "distinct from the owner",
        );

        const rejectedPreparation =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
            createPreparationInput(),
          );

        const rejectedDecision =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision(
            createExecutionDecisionInput({
              controlledRequalificationPreparation:
                rejectedPreparation,

              decision:
                "REJECT_AND_RETAIN_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_ONLY",

              reason:
                "Owner retains the bounded preparation and rejects controlled execution.",
            }),
          );

        await expect(
          executeSalesCoreLaunchCommercialEvidenceControlledRequalification({
            ...createExecutionEvidenceInput(),

            controlledRequalificationPreparation:
              rejectedPreparation,

            executionDecision:
              rejectedDecision,

            ownerId:
              rejectedPreparation.ownerId,
          }),
        ).rejects.toThrow(
          "does not authorize controlled commercial requalification execution",
        );

        await expect(
          executeSalesCoreLaunchCommercialEvidenceControlledRequalification(
            createExecutionEvidenceInput({
              executedAt:
                "2026-07-19T10:00:02.999Z",
            }),
          ),
        ).rejects.toThrow(
          "cannot precede preparation or owner decision",
        );
      },
    );

    it(
      "blocks tampered preparation and mismatched owner decision evidence",
      async () => {
        const input =
          createExecutionEvidenceInput();

        const tamperedPreparation = {
          ...input.controlledRequalificationPreparation,

          ownerId:
            "owner-tampered",
        };

        await expect(
          executeSalesCoreLaunchCommercialEvidenceControlledRequalification({
            ...input,

            controlledRequalificationPreparation:
              tamperedPreparation,
          }),
        ).rejects.toThrow(
          "integrity verification failed",
        );

        const otherPreparation =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
            createPreparationInput({
              preparationId:
                "sales-core-commercial-requalification-preparation-002",

              preparedAt:
                "2026-07-19T10:00:02.500Z",
            }),
          );

        await expect(
          executeSalesCoreLaunchCommercialEvidenceControlledRequalification({
            ...input,

            controlledRequalificationPreparation:
              otherPreparation,
          }),
        ).rejects.toThrow(
          "not bound to the supplied preparation",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and blocks tampering",
      async () => {
        const input =
          createExecutionEvidenceInput();

        const first =
          await executeSalesCoreLaunchCommercialEvidenceControlledRequalification(
            input,
          );

        const second =
          await executeSalesCoreLaunchCommercialEvidenceControlledRequalification(
            input,
          );

        expect(second).toEqual(first);

        expect(first.ledgerDigest)
          .toMatch(/^[0-9a-f]{64}$/);

        expect(Object.isFrozen(first))
          .toBe(true);

        expect(
          Object.isFrozen(
            first.evidenceBindings,
          ),
        ).toBe(true);

        expect(
          first.evidenceBindings.every(
            (binding) =>
              Object.isFrozen(binding) &&
              Object.isFrozen(
                binding.assertions,
              ) &&
              binding.assertions.every(
                (item) =>
                  Object.isFrozen(item),
              ),
          ),
        ).toBe(true);

        expect(() =>
          validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence(
            first,
          ),
        ).not.toThrow();

        const tamperedSummary = {
          ...first,

          summary: {
            ...first.summary,

            qualificationCasesPassed:
              11,
          },
        } as unknown as
          SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence;

        expect(() =>
          validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence(
            tamperedSummary,
          ),
        ).toThrow();

        const unsigned = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            publicLaunchAuthorized:
              true,
          },
        } as unknown as
          Record<string, unknown>;

        delete unsigned.ledgerDigest;

        const escalated = {
          ...unsigned,

          ledgerDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence;

        expect(() =>
          validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence(
            escalated,
          ),
        ).toThrow(
          "summary or boundary is invalid",
        );
      },
    );
  },
);
