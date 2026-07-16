import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_VERSION,
  executeAshaLimitedInternalPilotInquiryThree,
  type ExecuteAshaLimitedInternalPilotInquiryThreeInput,
} from "../ashaLimitedInternalPilotInquiryThreeExecution";

import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION_VERSION,
  type AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision,
} from "../ashaOwnerLimitedInternalPilotInquiryThreeExecutionDecision";


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



function rebindInquiryThreeDecisionDigest(
  value:
    AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision,
): AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision {
  const core = {
    ...value,
  } as Record<string, unknown>;

  delete core.decisionDigest;

  return {
    ...core,

    decisionDigest:
      sha256(core),
  } as unknown as AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision;
}

function createInquiryThreeDecision(
  base:
    Awaited<ReturnType<typeof day28ExecutionInput>>,
): AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision {
  const runtimeIssuance =
    base.ownerActivatedRuntimeIssuance;

  const runtime =
    runtimeIssuance.ownerActivatedRuntime;

  const core = {
    version:
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION_VERSION,

    decisionId:
      "decision-asha-limited-pilot-inquiry-three-execution-001",

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION_RECORDED" as const,

    employeeId:
      "employee-asha-inquiry-intake-v1" as const,

    templateId:
      "template-asha-inquiry-intake-v1" as const,

    employeeCode:
      "nx-sales-003" as const,

    displayName:
      "Asha" as const,

    officialRole:
      "AI Inquiry Intake Executive" as const,

    department:
      "SALES" as const,

    autonomyLevel:
      "DRAFTING_ASSISTANT" as const,

    inquiryThreePreparationId:
      "preparation-asha-limited-pilot-inquiry-three-001",

    inquiryThreePreparationDigest:
      "a".repeat(64),

    sourceInquiryTwoReviewDecisionId:
      "decision-asha-limited-pilot-inquiry-two-review-001",

    sourceInquiryTwoReviewDecisionDigest:
      "b".repeat(64),

    sourceInquiryTwoExecutionId:
      "execution-asha-limited-internal-pilot-inquiry-two-001",

    sourceInquiryTwoExecutionDigest:
      "c".repeat(64),

    ownerInquiryTwoExecutionDecisionId:
      "decision-asha-limited-pilot-inquiry-two-execution-001",

    ownerInquiryTwoExecutionDecisionDigest:
      "d".repeat(64),

    inquiryTwoPreparationId:
      "preparation-asha-limited-pilot-inquiry-two-001",

    inquiryTwoPreparationDigest:
      "e".repeat(64),

    sourceInquiryOneReviewDecisionId:
      "decision-asha-limited-pilot-inquiry-one-review-001",

    sourceInquiryOneReviewDecisionDigest:
      "f".repeat(64),

    sourceInquiryOneExecutionId:
      "execution-asha-limited-internal-pilot-inquiry-one-001",

    sourceInquiryOneExecutionDigest:
      "1".repeat(64),

    runtimeIssuanceId:
      runtimeIssuance.runtimeIssuanceId,

    runtimeIssuanceDigest:
      runtimeIssuance.runtimeIssuanceDigest,

    runtimeId:
      runtimeIssuance.runtimeId,

    runtimeDigest:
      runtime.runtimeDigest,

    qualifiedManifestDigest:
      base.qualifiedManifest.manifestDigest,

    tenantId:
      runtime.tenantId,

    ownerId:
      runtime.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION" as const,

    executionApproved:
      true,

    inquiryThreeExecutionAuthorized:
      true,

    reason:
      "Owner verified the complete Inquiry 3 preparation and approved only its bounded sandbox execution; all external and autonomous authority remains blocked.",

    preparedInquiry: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        "SAFE_CUSTOMER_CONTEXT_CONTINUITY" as const,

      inquirySequence:
        3 as const,

      priorReviewedInquirySequence:
        2 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacityBeforeExecution:
        1 as const,

      projectedRemainingInquiryCapacityAfterExecution:
        0 as const,

      concurrentInquiryLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_INQUIRY" as const,

      toolId:
        "tool-inquiry-draft" as const,

      toolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,
    },

    customerContextContinuityExpectation: {
      customerContextContinuityRequired:
        true as const,

      repeatedQuestionAvoidanceRequired:
        true as const,

      clarificationBeforeGuessingRequired:
        true as const,

      promiseAndFollowUpTrackingRequired:
        true as const,

      uncertaintyEscalatesToOwner:
        true as const,

      tenantScopedContextOnly:
        true as const,

      customerScopedContextOnly:
        true as const,

      crossTenantContextReuseAuthorized:
        false as const,

      crossCustomerContextReuseAuthorized:
        false as const,

      responseGenerationPerformed:
        false as const,

      humanImpersonationAuthorized:
        false as const,
    },

    authorityBoundary: {
      inquiryThreePreparationBound:
        true as const,

      inquiryThreePreparationIntegrityVerified:
        true as const,

      sourceInquiryTwoReviewDecisionBound:
        true as const,

      sourceInquiryTwoExecutionBound:
        true as const,

      sourceInquiryTwoPreparationBound:
        true as const,

      sourceInquiryOneReviewDecisionBound:
        true as const,

      sourceInquiryOneExecutionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      inquiryThreePrepared:
        true as const,

      ownerDecisionRequired:
        true as const,

      approvalBypassAllowed:
        false as const,

      inquiryThreeExecutionAuthorized:
        true,

      inquiryThreeExecutionPerformed:
        false as const,

      syntheticInquiryExecutionPerformed:
        false as const,

      concurrentInquiryExecutionAuthorized:
        false as const,

      limitedInternalPilotCompleted:
        false as const,

      realCustomerInquiryAuthorized:
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

      productionDatabaseAuthorized:
        false as const,

      productionMutationAuthorized:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      autonomousDecisionAuthorized:
        false as const,

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,

      monitoringRequired:
        true as const,

      ownerReviewAfterInquiryThreeRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "EXECUTE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE" as const,

    decidedAt:
      "2026-07-16T00:00:07.000Z",
  };

  return {
    ...core,

    decisionDigest:
      sha256(core),
  };
}

async function day36ExecutionInput(
  overrides:
    Partial<ExecuteAshaLimitedInternalPilotInquiryThreeInput> = {},
): Promise<ExecuteAshaLimitedInternalPilotInquiryThreeInput> {
  const base =
    await day28ExecutionInput();

  const decision =
    createInquiryThreeDecision(
      base,
    );

  return {
    executionId:
      "execution-asha-limited-internal-pilot-inquiry-three-001",

    ownerLimitedInternalPilotInquiryThreeExecutionDecision:
      decision,

    ownerActivatedRuntimeIssuance:
      base.ownerActivatedRuntimeIssuance,

    qualifiedManifest:
      base.qualifiedManifest,

    executedAt:
      "2026-07-16T00:00:08.000Z",

    ...overrides,
  };
}

describe(
  "Asha limited internal pilot inquiry three execution",
  () => {
    it(
      "executes only synthetic inquiry three of three and stops for mandatory owner review",
      async () => {
        const result =
          await executeAshaLimitedInternalPilotInquiryThree(
            await day36ExecutionInput(),
          );

        expect(result.version).toBe(
          ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_VERSION,
        );

        expect(result.executionState).toBe(
          "LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTED",
        );

        expect(
          result.pilotInquiry.inquirySequence,
        ).toBe(3);

        expect(
          result.pilotInquiry.remainingInquiryCapacity,
        ).toBe(0);

        expect(
          result.executionBoundary.finalInquirySequenceReached,
        ).toBe(true);

        expect(
          result.executionBoundary.remainingInquiryCapacityExhausted,
        ).toBe(true);

        expect(
          result.executionBoundary.limitedInternalPilotCompleted,
        ).toBe(false);

        expect(result.nextStep).toBe(
          "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW",
        );
      },
    );

    it(
      "creates the exact sanitized synthetic inquiry three through controlled intake",
      async () => {
        const result =
          await executeAshaLimitedInternalPilotInquiryThree(
            await day36ExecutionInput(),
          );

        expect(
          result.syntheticInquiryEvidence,
        ).toEqual({
          idempotencyKey:
            "asha-limited-internal-pilot-inquiry-003",

          channel:
            "WEB",

          customerName:
            "Synthetic Pilot Customer Three",

          customerEmail:
            "synthetic.pilot.three@example.invalid",

          customerPhone:
            null,

          message:
            "I previously asked about certified safety helmets for our workshop. Please continue from that confirmed context without asking me to repeat known details, and clearly identify anything still missing before drafting a response.",

          resultOutcome:
            "CREATED",

          inquiryId:
            "inquiry-asha-limited-internal-pilot-003",

          inquiryStatus:
            "NEW",

          createdAt:
            "2026-07-16T00:00:08.000Z",
        });

        expect(
          result.controlledInquiryReceipt
            .authenticatedInquiry
            .inquiry
            .id,
        ).toBe(
          result.syntheticInquiryEvidence.inquiryId,
        );
      },
    );

    it(
      "locks safe customer context continuity without repeated questioning or context leakage",
      async () => {
        const result =
          await executeAshaLimitedInternalPilotInquiryThree(
            await day36ExecutionInput(),
          );

        expect(
          result.pilotInquiry.scenarioId,
        ).toBe(
          "SAFE_CUSTOMER_CONTEXT_CONTINUITY",
        );

        expect(
          result.customerContextContinuityExpectation,
        ).toEqual({
          customerContextContinuityRequired:
            true,

          repeatedQuestionAvoidanceRequired:
            true,

          clarificationBeforeGuessingRequired:
            true,

          promiseAndFollowUpTrackingRequired:
            true,

          uncertaintyEscalatesToOwner:
            true,

          tenantScopedContextOnly:
            true,

          customerScopedContextOnly:
            true,

          crossTenantContextReuseAuthorized:
            false,

          crossCustomerContextReuseAuthorized:
            false,

          responseGenerationPerformed:
            false,

          humanImpersonationAuthorized:
            false,
        });
      },
    );

    it(
      "keeps final owner review and every real-world autonomous authority blocked",
      async () => {
        const result =
          await executeAshaLimitedInternalPilotInquiryThree(
            await day36ExecutionInput(),
          );

        expect(
          result.executionBoundary,
        ).toMatchObject({
          inquiryThreeExecutionPerformed:
            true,

          ownerReviewAfterInquiryThreeRequired:
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
      },
    );

    it(
      "rejects an unapproved or integrity-tampered inquiry three decision",
      async () => {
        const input =
          await day36ExecutionInput();

        const rejected =
          rebindInquiryThreeDecisionDigest({
            ...input
              .ownerLimitedInternalPilotInquiryThreeExecutionDecision,

            decision:
              "REJECT_AND_RETAIN_INQUIRY_THREE_PREPARATION_ONLY",

            executionApproved:
              false,

            inquiryThreeExecutionAuthorized:
              false,

            authorityBoundary: {
              ...input
                .ownerLimitedInternalPilotInquiryThreeExecutionDecision
                .authorityBoundary,

              inquiryThreeExecutionAuthorized:
                false,
            },

            nextStep:
              "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_ONLY",
          });

        await expect(
          executeAshaLimitedInternalPilotInquiryThree({
            ...input,

            ownerLimitedInternalPilotInquiryThreeExecutionDecision:
              rejected,
          }),
        ).rejects.toThrow(
          "An approved Workforce Day 35 inquiry three execution decision is required.",
        );

        const tampered = {
          ...input
            .ownerLimitedInternalPilotInquiryThreeExecutionDecision,

          preparedInquiry: {
            ...input
              .ownerLimitedInternalPilotInquiryThreeExecutionDecision
              .preparedInquiry,

            inquirySequence:
              2 as 3,
          },
        };

        await expect(
          executeAshaLimitedInternalPilotInquiryThree({
            ...input,

            ownerLimitedInternalPilotInquiryThreeExecutionDecision:
              tampered,
          }),
        ).rejects.toThrow(
          "Owner inquiry three execution decision integrity verification failed.",
        );
      },
    );

    it(
      "rejects execution before approval and mismatched qualified manifest evidence",
      async () => {
        const input =
          await day36ExecutionInput();

        await expect(
          executeAshaLimitedInternalPilotInquiryThree({
            ...input,

            executedAt:
              "2026-07-16T00:00:06.000Z",
          }),
        ).rejects.toThrow(
          "Limited internal pilot inquiry three execution cannot precede owner approval.",
        );

        await expect(
          executeAshaLimitedInternalPilotInquiryThree({
            ...input,

            qualifiedManifest: {
              ...input.qualifiedManifest,

              manifestDigest:
                "9".repeat(64),
            },
          }),
        ).rejects.toThrow(
          "Inquiry three execution runtime or qualified manifest evidence does not match the owner decision.",
        );
      },
    );

    it(
      "is deterministic deeply frozen and digest-bound",
      async () => {
        const input =
          await day36ExecutionInput();

        const first =
          await executeAshaLimitedInternalPilotInquiryThree(
            input,
          );

        const second =
          await executeAshaLimitedInternalPilotInquiryThree(
            input,
          );

        expect(first).toEqual(
          second,
        );

        const digestCore = {
          ...first,
        } as Record<string, unknown>;

        delete digestCore.executionDigest;

        expect(
          first.executionDigest,
        ).toBe(
          sha256(digestCore),
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
            first.customerContextContinuityExpectation,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.controlledInquiryReceipt,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionBoundary,
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects a secret-bearing execution identity",
      async () => {
        await expect(
          executeAshaLimitedInternalPilotInquiryThree(
            await day36ExecutionInput({
              executionId:
                "execution-secret-token",
            }),
          ),
        ).rejects.toThrow(
          "Limited internal pilot inquiry three execution identity contains a credential-bearing term.",
        );
      },
    );
  },
);
