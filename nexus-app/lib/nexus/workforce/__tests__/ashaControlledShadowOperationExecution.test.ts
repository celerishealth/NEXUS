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

describe(
  "Asha controlled shadow operation execution",
  () => {
    it(
      "executes exactly one synthetic controlled inquiry and awaits owner review",
      async () => {
        const execution =
          await executeAshaControlledShadowOperation(
            executionInput(),
          );

        expect(
          execution.executionState,
        ).toBe(
          "CONTROLLED_SHADOW_OPERATION_EXECUTED",
        );

        expect(
          execution.executionBoundary
            .syntheticCreatorInvocationCount,
        ).toBe(1);

        expect(
          execution.executionBoundary
            .shadowExecutionExecuted,
        ).toBe(true);

        expect(
          execution.executionBoundary
            .syntheticAuthenticatedInquiryCreated,
        ).toBe(true);

        expect(
          execution.nextStep,
        ).toBe(
          "AWAIT_OWNER_SHADOW_OPERATION_REVIEW",
        );
      },
    );

    it(
      "records the exact synthetic sanitized draft-only sandbox fixture",
      async () => {
        const execution =
          await executeAshaControlledShadowOperation(
            executionInput(),
          );

        expect(
          execution.shadowFixture,
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
          maximumInquiryCount:
            1,
          executionMode:
            "SANDBOX_ONLY",
        });

        expect(
          execution.syntheticInquiryEvidence,
        ).toMatchObject({
          idempotencyKey:
            "asha-controlled-shadow-inquiry-request-001",
          channel:
            "WEB",
          customerName:
            "Synthetic Shadow Customer",
          customerEmail:
            "synthetic.shadow@example.invalid",
          customerPhone:
            null,
          resultOutcome:
            "CREATED",
          inquiryId:
            "inquiry-asha-controlled-shadow-001",
          inquiryStatus:
            "NEW",
        });
      },
    );

    it(
      "binds the execution to preparation runtime manifest tenant and owner",
      async () => {
        const input =
          executionInput();

        const execution =
          await executeAshaControlledShadowOperation(
            input,
          );

        expect(
          execution.preparationId,
        ).toBe(
          input.preparation.preparationId,
        );

        expect(
          execution.preparationDigest,
        ).toBe(
          input.preparation.preparationDigest,
        );

        expect(
          execution.runtimeIssuanceDigest,
        ).toBe(
          input.ownerActivatedRuntimeIssuance
            .runtimeIssuanceDigest,
        );

        expect(
          execution.runtimeDigest,
        ).toBe(
          input.ownerActivatedRuntimeIssuance
            .ownerActivatedRuntime
            .runtimeDigest,
        );

        expect(
          execution.qualifiedManifestDigest,
        ).toBe(
          input.qualifiedManifest
            .manifestDigest,
        );

        expect(
          execution.tenantId,
        ).toBe(
          input.preparation.tenantId,
        );

        expect(
          execution.ownerId,
        ).toBe(
          input.preparation.ownerId,
        );
      },
    );

    it(
      "keeps all real customer external production payment and launch authority blocked",
      async () => {
        const execution =
          await executeAshaControlledShadowOperation(
            executionInput(),
          );

        expect(
          execution.executionBoundary,
        ).toMatchObject({
          maximumInquiryCountEnforced:
            true,
          realCustomerInquiryCreated:
            false,
          realCustomerDataAccessAuthorized:
            false,
          customerContactAuthorized:
            false,
          recommendationGenerated:
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
          ownerReviewRequired:
            true,
          emergencyPauseAvailable:
            true,
          publicLaunchAuthorized:
            false,
        });

        expect(
          execution.controlledInquiryReceipt
            .safetyBoundary,
        ).toMatchObject({
          recommendationGenerationAuthorized:
            false,
          externalMessageDeliveryAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          ownerApprovalRequiredBeforeExecution:
            true,
          executionMode:
            "SANDBOX_ONLY",
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "blocks execution before the controlled shadow preparation time",
      async () => {
        const input =
          executionInput();

        const executedAt =
          new Date(
            Date.parse(
              input.preparation.preparedAt,
            ) - 1_000,
          ).toISOString();

        await expect(
          executeAshaControlledShadowOperation({
            ...input,
            executedAt,
          }),
        ).rejects.toThrow(
          "cannot precede preparation",
        );
      },
    );

    it(
      "rejects a tampered controlled shadow preparation digest",
      async () => {
        const input =
          executionInput();

        const preparation = {
          ...input.preparation,
          preparationDigest:
            "f".repeat(64),
        } as Day24ExecutionInput[
          "preparation"
        ];

        await expect(
          executeAshaControlledShadowOperation({
            ...input,
            preparation,
          }),
        ).rejects.toThrow(
          "preparation integrity verification failed",
        );
      },
    );

    it(
      "rejects tampered runtime issuance and recomputed cross-tenant preparation bindings",
      async () => {
        const input =
          executionInput();

        const runtimeIssuance = {
          ...input.ownerActivatedRuntimeIssuance,
          runtimeIssuanceDigest:
            "e".repeat(64),
        } as Day24ExecutionInput[
          "ownerActivatedRuntimeIssuance"
        ];

        await expect(
          executeAshaControlledShadowOperation({
            ...input,
            ownerActivatedRuntimeIssuance:
              runtimeIssuance,
          }),
        ).rejects.toThrow(
          "runtime issuance integrity verification failed",
        );

        const {
          preparationDigest:
            _oldPreparationDigest,
          ...preparationCore
        } = input.preparation;

        const alteredCore = {
          ...preparationCore,
          tenantId:
            "tenant-other-business",
        };

        const alteredPreparation = {
          ...alteredCore,
          preparationDigest:
            sha256(alteredCore),
        } as Day24ExecutionInput[
          "preparation"
        ];

        await expect(
          executeAshaControlledShadowOperation({
            ...input,
            preparation:
              alteredPreparation,
          }),
        ).rejects.toThrow(
          "not bound to the owner-activated runtime issuance",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and rejects secret-bearing execution identity",
      async () => {
        const input =
          executionInput();

        const first =
          await executeAshaControlledShadowOperation(
            input,
          );

        const second =
          await executeAshaControlledShadowOperation(
            input,
          );

        expect(second).toEqual(first);

        expect(
          first.executionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        const {
          executionDigest:
            _executionDigest,
          ...executionCore
        } = first;

        expect(
          first.executionDigest,
        ).toBe(
          sha256(executionCore),
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionBoundary,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.controlledInquiryReceipt,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.controlledInquiryReceipt
              .authenticatedInquiry,
          ),
        ).toBe(true);

        await expect(
          executeAshaControlledShadowOperation({
            ...input,
            executionId:
              "asha-secret-shadow-execution",
          }),
        ).rejects.toThrow(
          "executionId is invalid",
        );
      },
    );
  },
);