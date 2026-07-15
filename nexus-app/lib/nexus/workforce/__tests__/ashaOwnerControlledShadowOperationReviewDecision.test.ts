import {
  createAshaOwnerControlledShadowOperationReviewDecision,
} from "../ashaOwnerControlledShadowOperationReviewDecision";
import {
  executeAshaControlledShadowOperation,
} from "../ashaControlledShadowOperationExecution";
import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createAshaActivationCandidateIssuance,
  type AshaActivationCandidateIssuance,
} from "../ashaActivationCandidateIssuance";

import {
  createAshaOwnerActivatedRuntimeIssuance,
} from "../ashaOwnerActivatedRuntimeIssuance";

import {
  createAshaControlledShadowOperationPreparation,
} from "../ashaControlledShadowOperationPreparation";
import {
  createAshaOwnerActivationDecision,
  type AshaOwnerActivationDecision,
} from "../ashaOwnerActivationDecision";

import {
  ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION,
  type AshaFormalQualificationIssuance,
} from "../ashaFormalQualificationIssuance";

import {
  createAshaQualifiedEmployeeManifestIssuance,
} from "../ashaQualifiedEmployeeManifestIssuance";

import {
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  createAIEmployeeQualificationReport,
  type AIEmployeeQualificationCase,
  type AIEmployeeQualificationCategory,
} from "../employeeQualification";

import {
  createCoreLaunchEmployeeTemplateRegistry,
  findAIEmployeeTemplate,
} from "../employeeTemplateRegistry";

const TENANT_ID =
  "tenant-ppa-industrial";

const OWNER_ID =
  "owner-prashant-001";

const QUALIFIED_AT =
  "2026-07-15T15:00:00.000Z";

const MANIFEST_CREATED_AT =
  "2026-07-15T16:00:00.000Z";

const CANDIDATE_PREPARED_AT =
  "2026-07-15T17:00:00.000Z";

const DECIDED_AT =
  "2026-07-15T18:00:00.000Z";

const ACTIVATED_AT =
  "2026-07-15T19:00:00.000Z";

const RUNTIME_ID =
  "runtime-asha-activation-candidate-001";

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) =>
          stableStringify(item),
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
            stableStringify(
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
      "Unsupported test digest value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
      "utf8",
    )
    .digest("hex");
}

function canonicalTemplate() {
  const registry =
    createCoreLaunchEmployeeTemplateRegistry(
      MANIFEST_CREATED_AT,
    );

  const template =
    findAIEmployeeTemplate(
      registry,
      "template-asha-inquiry-intake-v1",
    );

  if (!template) {
    throw new Error(
      "Canonical Asha template fixture is missing.",
    );
  }

  return template;
}

function qualificationCases():
  readonly AIEmployeeQualificationCase[] {
  const cases:
    AIEmployeeQualificationCase[] = [];

  let sequence = 1;

  for (
    const category of
    Object.keys(
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
    ) as AIEmployeeQualificationCategory[]
  ) {
    const count =
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
        category
      ];

    for (
      let localSequence = 1;
      localSequence <= count;
      localSequence += 1
    ) {
      const caseId =
        "asha-owner-runtime-case-" +
        sequence
          .toString()
          .padStart(3, "0");

      cases.push({
        caseId,
        category,
        passed:
          true,
        evidenceDigest:
          sha256({
            caseId,
            category,
            localSequence,
            passed:
              true,
          }),
        executedAt:
          "2026-07-15T14:00:00.000Z",
      });

      sequence += 1;
    }
  }

  return cases;
}

function formalQualification():
  AshaFormalQualificationIssuance {
  const template =
    canonicalTemplate();

  const qualificationReport =
    createAIEmployeeQualificationReport({
      template,
      testCases:
        qualificationCases(),
      ownerApproval: {
        ownerId:
          OWNER_ID,
        approved:
          true,
        approvedAt:
          "2026-07-15T14:30:00.000Z",
      },
      qualifiedAt:
        QUALIFIED_AT,
    });

  const issuanceCore = {
    version:
      ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION,
    issuanceId:
      "asha-formal-qualification-001",
    issuanceState:
      "FORMAL_QUALIFICATION_ISSUED",
    employeeId:
      template.employeeId,
    templateId:
      template.templateId,
    tenantId:
      TENANT_ID,
    ownerId:
      OWNER_ID,
    evaluatorId:
      "evaluator-asha-independent-001",
    decisionId:
      "asha-owner-qualification-decision-001",
    decisionDigest:
      sha256({
        decision:
          "APPROVE_FORMAL_QUALIFICATION",
      }),
    evidenceLedgerId:
      "asha-qualification-evidence-ledger-001",
    evidenceLedgerDigest:
      sha256({
        ledger:
          "asha-qualification-evidence-ledger-001",
      }),
    fixturePackDigest:
      sha256({
        fixturePack:
          "asha-controlled-fixture-pack-v1",
      }),
    planDigest:
      sha256({
        plan:
          "asha-qualification-plan-v1",
      }),
    independentEvaluationReportDigest:
      sha256({
        evaluation:
          "asha-independent-evaluation-v1",
      }),
    qualificationReport,
    qualificationDigest:
      qualificationReport
        .qualificationDigest,
    reportSummary: {
      totalTestCases:
        100,
      passedTestCases:
        100,
      failedTestCases:
        0,
      mandatoryCategoryCoveragePassed:
        true,
      everyTestCasePassed:
        true,
      ownerApprovalRecorded:
        true,
      qualificationPassed:
        true,
      normalOperationCases:
        30,
      adversarialCases:
        15,
      tenantIsolationCases:
        15,
      ownerControlCases:
        15,
      emergencyPauseCases:
        5,
      departmentHandoffCases:
        10,
      auditEvidenceCases:
        5,
      failureRecoveryCases:
        5,
    },
    nextStep:
      "PREPARE_QUALIFIED_EMPLOYEE_MANIFEST",
    authorityBoundary: {
      registeredUnqualifiedTemplateBound:
        true,
      executionEvidenceBound:
        true,
      independentEvaluatorEvidenceVerified:
        true,
      ownerApprovalDecisionBound:
        true,
      qualificationEngineInvocationAuthorized:
        true,
      qualificationEngineInvoked:
        true,
      qualificationReportCreated:
        true,
      formalQualificationIssued:
        true,
      qualificationPassed:
        true,
      qualifiedManifestCreated:
        false,
      activationCandidateCreated:
        false,
      ownerActivationRecorded:
        false,
      runtimeActivated:
        false,
      controlledWorkAuthorized:
        false,
      customerDataAccessAuthorized:
        false,
      customerContactAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      productionDatabaseAuthorized:
        false,
      productionMutationAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      autonomousDecisionAuthorized:
        false,
      productionReadinessAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    },
    qualifiedAt:
      QUALIFIED_AT,
  } as const;

  return {
    ...issuanceCore,
    issuanceDigest:
      sha256(issuanceCore),
  };
}

function activationCandidateIssuance(
  options: {
    tenantId?: string;
    runtimeId?: string;
    issuanceId?: string;
  } = {},
): AshaActivationCandidateIssuance {
  const tenantId =
    options.tenantId ??
    TENANT_ID;

  const runtimeId =
    options.runtimeId ??
    RUNTIME_ID;

  const formal =
    formalQualification();

  const manifestIssuance =
    createAshaQualifiedEmployeeManifestIssuance({
      manifestIssuanceId:
        "asha-qualified-manifest-issuance-001",
      formalQualification:
        formal,
      tenantId,
      ownerId:
        OWNER_ID,
      createdAt:
        MANIFEST_CREATED_AT,
    });

  return createAshaActivationCandidateIssuance({
    activationCandidateIssuanceId:
      options.issuanceId ??
      "asha-activation-candidate-issuance-001",
    qualifiedManifestIssuance:
      manifestIssuance,
    formalQualification:
      formal,
    runtimeId,
    tenantId,
    ownerId:
      OWNER_ID,
    preparedAt:
      CANDIDATE_PREPARED_AT,
  });
}

function ownerDecision(
  source:
    AshaActivationCandidateIssuance,
  approved = true,
): AshaOwnerActivationDecision {
  return createAshaOwnerActivationDecision({
    activationCandidateIssuance:
      source,
    decisionId:
      "asha-owner-activation-decision-001",
    ownerId:
      OWNER_ID,
    decision:
      approved
        ? "APPROVE_ASHA_ACTIVATION"
        : "REJECT_ASHA_ACTIVATION",
    reason:
      approved
        ? "Owner approved Asha for controlled internal runtime activation."
        : "Owner rejected Asha runtime activation and retained the paused state.",
    decidedAt:
      DECIDED_AT,
  });
}

function createRuntimeIssuance(
  options: {
    source?:
      AshaActivationCandidateIssuance;
    decision?:
      AshaOwnerActivationDecision;
    activatedAt?:
      string;
  } = {},
) {
  const source =
    options.source ??
    activationCandidateIssuance();

  const decision =
    options.decision ??
    ownerDecision(source);

  return createAshaOwnerActivatedRuntimeIssuance({
    runtimeIssuanceId:
      "asha-owner-activated-runtime-issuance-001",
    activationCandidateIssuance:
      source,
    ownerActivationDecision:
      decision,
    activatedAt:
      options.activatedAt ??
      ACTIVATED_AT,
  });
}

const SHADOW_PREPARED_AT =
  "2026-07-15T20:00:00.000Z";

function createShadowPreparation(
  options: {
    source?: ReturnType<
      typeof createAshaOwnerActivatedRuntimeIssuance
    >;
    preparationId?: string;
    preparedAt?: string;
  } = {},
) {
  return createAshaControlledShadowOperationPreparation({
    preparationId:
      options.preparationId ??
      "asha-controlled-shadow-preparation-001",
    ownerActivatedRuntimeIssuance:
      options.source ??
      createRuntimeIssuance(),
    preparedAt:
      options.preparedAt ??
      SHADOW_PREPARED_AT,
  });
}

type Day24ExecutionInput =
  Parameters<
    typeof executeAshaControlledShadowOperation
  >[0];

function qualifiedManifestFromActivationCandidate(
  source:
    AshaActivationCandidateIssuance,
): Day24ExecutionInput["qualifiedManifest"] {
  return source.activationCandidate
    .qualifiedManifest;
}

function executionInput(
  overrides:
    Partial<Day24ExecutionInput> = {},
): Day24ExecutionInput {
  const activationCandidate =
    activationCandidateIssuance();

  const runtimeIssuance =
    createRuntimeIssuance({
      source:
        activationCandidate,
    });

  const preparation =
    createShadowPreparation({
      source:
        runtimeIssuance,
    });

  const executedAt =
    new Date(
      Date.parse(
        preparation.preparedAt,
      ) + 60_000,
    ).toISOString();

  return {
    executionId:
      "asha-controlled-shadow-execution-001",
    preparation,
    ownerActivatedRuntimeIssuance:
      runtimeIssuance,
    qualifiedManifest:
      qualifiedManifestFromActivationCandidate(
        activationCandidate,
      ),
    executedAt,
    ...overrides,
  };
}

type Day25ReviewInput =
  Parameters<
    typeof createAshaOwnerControlledShadowOperationReviewDecision
  >[0];

type Day25Source =
  Day25ReviewInput[
    "controlledShadowOperationExecution"
  ];

async function controlledShadowExecution():
  Promise<Day25Source> {
  return executeAshaControlledShadowOperation(
    executionInput(),
  );
}

async function reviewInput(
  overrides:
    Partial<Day25ReviewInput> = {},
): Promise<Day25ReviewInput> {
  const source =
    overrides
      .controlledShadowOperationExecution ??
    await controlledShadowExecution();

  const decidedAt =
    new Date(
      Date.parse(source.executedAt) +
        60_000,
    ).toISOString();

  return {
    controlledShadowOperationExecution:
      source,
    decisionId:
      "asha-controlled-shadow-review-decision-001",
    ownerId:
      source.ownerId,
    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
    reason:
      "Owner reviewed the synthetic controlled shadow evidence and approved preparation only.",
    decidedAt,
    ...overrides,
  };
}

describe(
  "Asha owner controlled shadow operation review decision",
  () => {
    it(
      "records owner approval for limited internal pilot preparation only",
      async () => {
        const decision =
          createAshaOwnerControlledShadowOperationReviewDecision(
            await reviewInput(),
          );

        expect(
          decision.version,
        ).toBe(
          "nexus-asha-owner-controlled-shadow-operation-review-decision-v1",
        );

        expect(
          decision.decisionState,
        ).toBe(
          "OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_RECORDED",
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
        );

        expect(
          decision.shadowOperationApproved,
        ).toBe(true);

        expect(
          decision
            .limitedInternalPilotPreparationEligible,
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "PREPARE_LIMITED_INTERNAL_PILOT",
        );
      },
    );

    it(
      "records owner rejection and retains controlled shadow only",
      async () => {
        const decision =
          createAshaOwnerControlledShadowOperationReviewDecision(
            await reviewInput({
              decision:
                "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION",
              reason:
                "Owner rejected pilot preparation and retained Asha within the controlled shadow boundary.",
            }),
          );

        expect(
          decision.shadowOperationApproved,
        ).toBe(false);

        expect(
          decision
            .limitedInternalPilotPreparationEligible,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .limitedInternalPilotPreparationAuthorized,
        ).toBe(false);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_CONTROLLED_SHADOW_ONLY",
        );
      },
    );

    it(
      "binds the decision to exact Day 24 execution runtime tenant owner and manifest evidence",
      async () => {
        const input =
          await reviewInput();

        const source =
          input
            .controlledShadowOperationExecution;

        const decision =
          createAshaOwnerControlledShadowOperationReviewDecision(
            input,
          );

        expect(
          decision.controlledShadowExecutionId,
        ).toBe(source.executionId);

        expect(
          decision.controlledShadowExecutionDigest,
        ).toBe(source.executionDigest);

        expect(
          decision.preparationId,
        ).toBe(source.preparationId);

        expect(
          decision.preparationDigest,
        ).toBe(source.preparationDigest);

        expect(
          decision.runtimeIssuanceId,
        ).toBe(source.runtimeIssuanceId);

        expect(
          decision.runtimeIssuanceDigest,
        ).toBe(
          source.runtimeIssuanceDigest,
        );

        expect(
          decision.runtimeId,
        ).toBe(source.runtimeId);

        expect(
          decision.runtimeDigest,
        ).toBe(source.runtimeDigest);

        expect(
          decision.qualifiedManifestDigest,
        ).toBe(
          source.qualifiedManifestDigest,
        );

        expect(
          decision.tenantId,
        ).toBe(source.tenantId);

        expect(
          decision.ownerId,
        ).toBe(source.ownerId);
      },
    );

    it(
      "records exact synthetic reviewed evidence and blocks every real execution authority",
      async () => {
        const decision =
          createAshaOwnerControlledShadowOperationReviewDecision(
            await reviewInput(),
          );

        expect(
          decision.reviewedEvidence,
        ).toEqual({
          fixtureId:
            "fixture-asha-controlled-shadow-inquiry-v1",
          scenarioId:
            "scenario-asha-controlled-shadow-inquiry-intake-001",
          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",
          toolId:
            "tool-inquiry-draft",
          toolMode:
            "DRAFT_ONLY",
          executionMode:
            "SANDBOX_ONLY",
          maximumInquiryCount:
            1,
          actualInquiryCount:
            1,
          authenticatedInquiryOutcome:
            "CREATED",
          authenticatedInquiryStatus:
            "NEW",
          recommendationStatus:
            "NOT_GENERATED",
        });

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          controlledShadowExecutionBound:
            true,
          controlledShadowExecutionIntegrityVerified:
            true,
          ownerIdentityBound:
            true,
          tenantIdentityBound:
            true,
          runtimeIdentityBound:
            true,
          qualifiedManifestBound:
            true,
          syntheticSanitizedDataOnly:
            true,
          maximumOneInquiryVerified:
            true,
          ownerDecisionRequired:
            true,
          approvalBypassAllowed:
            false,
          ownerReviewDecisionRecorded:
            true,
          limitedInternalPilotPreparationAuthorized:
            true,
          limitedInternalPilotExecutionAuthorized:
            false,
          realCustomerInquiryAuthorized:
            false,
          realCustomerDataAccessAuthorized:
            false,
          customerContactAuthorized:
            false,
          recommendationGenerationAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          productionDatabaseAuthorized:
            false,
          productionMutationAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          autonomousDecisionAuthorized:
            false,
          productionReadinessAuthorized:
            false,
          publicLaunchAuthorized:
            false,
          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "blocks a cross-owner controlled shadow review decision",
      async () => {
        const input =
          await reviewInput({
            ownerId:
              "owner-cross-tenant-002",
          });

        expect(() =>
          createAshaOwnerControlledShadowOperationReviewDecision(
            input,
          ),
        ).toThrow(
          "Only the controlled-shadow-bound owner can issue the review decision.",
        );
      },
    );

    it(
      "blocks a review decision before the controlled shadow execution time",
      async () => {
        const source =
          await controlledShadowExecution();

        const decidedAt =
          new Date(
            Date.parse(source.executedAt) -
              1,
          ).toISOString();

        const input =
          await reviewInput({
            controlledShadowOperationExecution:
              source,
            decidedAt,
          });

        expect(() =>
          createAshaOwnerControlledShadowOperationReviewDecision(
            input,
          ),
        ).toThrow(
          "Owner controlled-shadow review decision cannot precede shadow execution.",
        );
      },
    );

    it(
      "rejects a recomputed execution containing a tampered controlled inquiry receipt",
      async () => {
        const source =
          await controlledShadowExecution();

        const tamperedReceipt = {
          ...source.controlledInquiryReceipt,
          receiptDigest:
            "0".repeat(64),
        };

        const {
          executionDigest:
            ignoredExecutionDigest,
          ...sourceCore
        } = source;

        void ignoredExecutionDigest;

        const tamperedCore = {
          ...sourceCore,
          controlledInquiryReceipt:
            tamperedReceipt,
        };

        const tamperedSource = {
          ...tamperedCore,
          executionDigest:
            sha256(tamperedCore),
        } as Day25Source;

        const input =
          await reviewInput({
            controlledShadowOperationExecution:
              tamperedSource,
          });

        expect(() =>
          createAshaOwnerControlledShadowOperationReviewDecision(
            input,
          ),
        ).toThrow(
          "Controlled inquiry receipt integrity verification failed.",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and rejects secret-bearing review input",
      async () => {
        const input =
          await reviewInput();

        const first =
          createAshaOwnerControlledShadowOperationReviewDecision(
            input,
          );

        const second =
          createAshaOwnerControlledShadowOperationReviewDecision(
            input,
          );

        expect(first).toEqual(second);

        const {
          decisionDigest,
          ...decisionCore
        } = first;

        expect(
          decisionDigest,
        ).toBe(
          sha256(decisionCore),
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.reviewedEvidence,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          createAshaOwnerControlledShadowOperationReviewDecision({
            ...input,
            decisionId:
              "token-shadow-review-001",
          }),
        ).toThrow(
          "controlled-shadow review decisionId is invalid.",
        );

        expect(() =>
          createAshaOwnerControlledShadowOperationReviewDecision({
            ...input,
            reason:
              "Owner review contains api_key secret-value and must be blocked.",
          }),
        ).toThrow(
          "Owner controlled-shadow review reason contains prohibited secret-bearing content.",
        );
      },
    );
  },
);