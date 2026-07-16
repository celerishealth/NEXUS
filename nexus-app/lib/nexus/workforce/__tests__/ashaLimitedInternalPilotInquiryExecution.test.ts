import {
  executeAshaLimitedInternalPilotInquiry,
} from "../ashaLimitedInternalPilotInquiryExecution";

import {
  createAshaOwnerLimitedInternalPilotExecutionDecision,
} from "../ashaOwnerLimitedInternalPilotExecutionDecision";
import {
  createAshaLimitedInternalPilotPreparation,
} from "../ashaLimitedInternalPilotPreparation";
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

type Day26PreparationInput =
  Parameters<
    typeof createAshaLimitedInternalPilotPreparation
  >[0];

type Day26SourceDecision =
  Day26PreparationInput[
    "ownerControlledShadowOperationReviewDecision"
  ];

async function approvedReviewDecision():
  Promise<Day26SourceDecision> {
  const input =
    await reviewInput();

  return createAshaOwnerControlledShadowOperationReviewDecision(
    input,
  );
}

async function day26PreparationInput(
  overrides:
    Partial<Day26PreparationInput> = {},
): Promise<Day26PreparationInput> {
  const source =
    await approvedReviewDecision();

  return {
    preparationId:
      "preparation-asha-limited-internal-pilot-001",

    ownerControlledShadowOperationReviewDecision:
      source,

    preparedAt:
      new Date(
        Date.parse(source.decidedAt) + 1_000,
      ).toISOString(),

    ...overrides,
  };
}

type Day27DecisionInput =
  Parameters<
    typeof createAshaOwnerLimitedInternalPilotExecutionDecision
  >[0];

type Day27Preparation =
  Day27DecisionInput[
    "limitedInternalPilotPreparation"
  ];

async function approvedPilotPreparation():
  Promise<Day27Preparation> {
  return createAshaLimitedInternalPilotPreparation(
    await day26PreparationInput(),
  );
}

async function day27DecisionInput(
  overrides:
    Partial<Day27DecisionInput> = {},
): Promise<Day27DecisionInput> {
  const preparation =
    await approvedPilotPreparation();

  return {
    limitedInternalPilotPreparation:
      preparation,

    decisionId:
      "decision-asha-limited-internal-pilot-execution-001",

    ownerId:
      preparation.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION",

    reason:
      "Approved for the strictly bounded synthetic internal pilot execution.",

    decidedAt:
      new Date(
        Date.parse(preparation.preparedAt) +
          1_000,
      ).toISOString(),

    ...overrides,
  };
}


type Day28ExecutionInput =
  Parameters<
    typeof executeAshaLimitedInternalPilotInquiry
  >[0];

async function approvedLimitedPilotExecutionDecision() {
  return createAshaOwnerLimitedInternalPilotExecutionDecision(
    await day27DecisionInput(),
  );
}

async function day28ExecutionInput(
  overrides:
    Partial<Day28ExecutionInput> = {},
): Promise<Day28ExecutionInput> {
  const decision =
    await approvedLimitedPilotExecutionDecision();

  const activationCandidate =
    activationCandidateIssuance();

  const runtimeIssuance =
    createRuntimeIssuance({
      source:
        activationCandidate,
    });

  const executedAt =
    new Date(
      Date.parse(decision.decidedAt) +
        1_000,
    ).toISOString();

  return {
    executionId:
      "execution-asha-limited-internal-pilot-inquiry-001",

    ownerLimitedInternalPilotExecutionDecision:
      decision,

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
  "Asha limited internal pilot inquiry execution",
  () => {
    it(
      "executes inquiry one of three and stops for mandatory owner review",
      async () => {
        const execution =
          await executeAshaLimitedInternalPilotInquiry(
            await day28ExecutionInput(),
          );

        expect(execution.executionState).toBe(
          "LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTED",
        );

        expect(
          execution.pilotInquiry.inquirySequence,
        ).toBe(1);

        expect(
          execution.pilotInquiry.remainingInquiryCapacity,
        ).toBe(2);

        expect(execution.nextStep).toBe(
          "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW",
        );

        expect(
          execution.executionBoundary
            .limitedInternalPilotCompleted,
        ).toBe(false);
      },
    );

    it(
      "records the exact bounded synthetic draft-only pilot scope",
      async () => {
        const execution =
          await executeAshaLimitedInternalPilotInquiry(
            await day28ExecutionInput(),
          );

        expect(execution.pilotInquiry).toEqual({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          dataClass:
            "SYNTHETIC_SANITIZED_ONLY",

          actorClass:
            "OWNER_SUPERVISED_INTERNAL_ONLY",

          scenarioId:
            "INCOMPLETE_REQUIREMENT_CLARIFICATION",

          inquirySequence:
            1,

          maximumInquiryCount:
            3,

          remainingInquiryCapacity:
            2,

          concurrentInquiryLimit:
            1,

          failureThreshold:
            1,

          ownerReviewFrequency:
            "AFTER_EVERY_INQUIRY",

          toolId:
            "tool-inquiry-draft",

          toolMode:
            "DRAFT_ONLY",

          executionMode:
            "SANDBOX_ONLY",
        });
      },
    );

    it(
      "creates the exact sanitized synthetic inquiry through the injected creator",
      async () => {
        const execution =
          await executeAshaLimitedInternalPilotInquiry(
            await day28ExecutionInput(),
          );

        expect(
          execution.syntheticInquiryEvidence,
        ).toMatchObject({
          idempotencyKey:
            "asha-limited-internal-pilot-inquiry-001",

          channel:
            "WEB",

          customerName:
            "Synthetic Pilot Customer One",

          customerEmail:
            "synthetic.pilot.one@example.invalid",

          customerPhone:
            null,

          resultOutcome:
            "CREATED",

          inquiryId:
            "inquiry-asha-limited-internal-pilot-001",

          inquiryStatus:
            "NEW",
        });

        expect(
          execution.controlledInquiryReceipt
            .workforceAuthority,
        ).toEqual({
          employeeQualified:
            true,

          employeeOwnerActivated:
            true,

          controlledWorkAuthorized:
            true,

          toolId:
            "tool-inquiry-draft",

          toolMode:
            "DRAFT_ONLY",

          tenantScoped:
            true,
        });
      },
    );

    it(
      "binds owner approval runtime manifest tenant owner and exact Asha identity",
      async () => {
        const input =
          await day28ExecutionInput();

        const execution =
          await executeAshaLimitedInternalPilotInquiry(
            input,
          );

        expect(
          execution.ownerExecutionDecisionId,
        ).toBe(
          input
            .ownerLimitedInternalPilotExecutionDecision
            .decisionId,
        );

        expect(execution.runtimeId).toBe(
          input.ownerActivatedRuntimeIssuance
            .runtimeId,
        );

        expect(
          execution.qualifiedManifestDigest,
        ).toBe(
          input.qualifiedManifest
            .manifestDigest,
        );

        expect(execution.tenantId).toBe(
          input
            .ownerLimitedInternalPilotExecutionDecision
            .tenantId,
        );

        expect(execution.ownerId).toBe(
          input
            .ownerLimitedInternalPilotExecutionDecision
            .ownerId,
        );

        expect(execution.employeeId).toBe(
          "employee-asha-inquiry-intake-v1",
        );
      },
    );

    it(
      "rejects missing approval rejection decisions and tampered decision integrity",
      async () => {
        const input =
          await day28ExecutionInput();

        const rejectedDecision =
          createAshaOwnerLimitedInternalPilotExecutionDecision(
            await day27DecisionInput({
              decision:
                "REJECT_LIMITED_INTERNAL_PILOT_EXECUTION",

              reason:
                "Owner retained preparation-only status.",
            }),
          );

        await expect(
          executeAshaLimitedInternalPilotInquiry({
            ...input,

            ownerLimitedInternalPilotExecutionDecision:
              rejectedDecision,
          }),
        ).rejects.toThrow(
          "approved Workforce Day 27",
        );

        const tamperedDecision = {
          ...input
            .ownerLimitedInternalPilotExecutionDecision,

          decisionDigest:
            "a".repeat(64),
        } as Day28ExecutionInput[
          "ownerLimitedInternalPilotExecutionDecision"
        ];

        await expect(
          executeAshaLimitedInternalPilotInquiry({
            ...input,

            ownerLimitedInternalPilotExecutionDecision:
              tamperedDecision,
          }),
        ).rejects.toThrow(
          "decision integrity verification failed",
        );
      },
    );

    it(
      "rejects altered runtime manifest and execution before owner approval",
      async () => {
        const input =
          await day28ExecutionInput();

        const alteredRuntime = {
          ...input.ownerActivatedRuntimeIssuance,

          runtimeIssuanceDigest:
            "b".repeat(64),
        } as Day28ExecutionInput[
          "ownerActivatedRuntimeIssuance"
        ];

        await expect(
          executeAshaLimitedInternalPilotInquiry({
            ...input,

            ownerActivatedRuntimeIssuance:
              alteredRuntime,
          }),
        ).rejects.toThrow(
          "runtime issuance integrity verification failed",
        );

        const alteredManifest = {
          ...input.qualifiedManifest,

          manifestDigest:
            "c".repeat(64),
        } as Day28ExecutionInput[
          "qualifiedManifest"
        ];

        await expect(
          executeAshaLimitedInternalPilotInquiry({
            ...input,

            qualifiedManifest:
              alteredManifest,
          }),
        ).rejects.toThrow(
          "manifest integrity verification failed",
        );

        const beforeApproval =
          new Date(
            Date.parse(
              input
                .ownerLimitedInternalPilotExecutionDecision
                .decidedAt,
            ) - 1,
          ).toISOString();

        await expect(
          executeAshaLimitedInternalPilotInquiry({
            ...input,

            executedAt:
              beforeApproval,
          }),
        ).rejects.toThrow(
          "cannot precede owner approval",
        );
      },
    );

    it(
      "keeps every real-world and autonomous authority blocked",
      async () => {
        const execution =
          await executeAshaLimitedInternalPilotInquiry(
            await day28ExecutionInput(),
          );

        expect(
          execution.executionBoundary,
        ).toMatchObject({
          ownerExecutionApprovalBound:
            true,

          ownerReviewAfterInquiryRequired:
            true,

          limitedInternalPilotInquiryExecuted:
            true,

          limitedInternalPilotCompleted:
            false,

          syntheticAuthenticatedInquiryCreated:
            true,

          genericPilotArchitectureInvoked:
            false,

          realCustomerInquiryCreated:
            false,

          realCustomerDataAccessed:
            false,

          customerContactPerformed:
            false,

          recommendationGenerationPerformed:
            false,

          externalDeliveryPerformed:
            false,

          liveProviderExecutionPerformed:
            false,

          productionDatabaseUsed:
            false,

          productionMutationPerformed:
            false,

          paymentExecutionPerformed:
            false,

          autonomousDecisionPerformed:
            false,

          productionReadinessAuthorized:
            false,

          publicLaunchAuthorized:
            false,

          emergencyPauseAvailable:
            true,
        });

        expect(
          execution.controlledInquiryReceipt
            .safetyBoundary,
        ).toEqual({
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
      "is deterministic deeply frozen digest-bound and rejects secret-bearing execution identity",
      async () => {
        const input =
          await day28ExecutionInput();

        const first =
          await executeAshaLimitedInternalPilotInquiry(
            input,
          );

        const second =
          await executeAshaLimitedInternalPilotInquiry(
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

        expect(first.executionDigest).toBe(
          sha256(executionCore),
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.pilotInquiry,
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
          executeAshaLimitedInternalPilotInquiry({
            ...input,

            executionId:
              "secret-asha-pilot-execution",
          }),
        ).rejects.toThrow(
          "credential-bearing term",
        );
      },
    );
  },
);