import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_VERSION,
  executeAshaLimitedInternalPilotInquiryTwo,
  type ExecuteAshaLimitedInternalPilotInquiryTwoInput,
} from "../ashaLimitedInternalPilotInquiryTwoExecution";

import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_VERSION,
  type AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision,
} from "../ashaOwnerLimitedInternalPilotInquiryTwoExecutionDecision";


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



function createInquiryTwoDecision(
  base:
    Awaited<ReturnType<typeof day28ExecutionInput>>,
): AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision {
  const runtime =
    base.ownerActivatedRuntimeIssuance
      .ownerActivatedRuntime;

  const core = {
    version:
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_VERSION,

    decisionId:
      "decision-asha-limited-pilot-inquiry-two-execution-001",

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_RECORDED" as const,

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

    preparationId:
      "preparation-asha-limited-internal-pilot-inquiry-two-001",

    preparationDigest:
      "1".repeat(64),

    sourceInquiryReviewDecisionId:
      "decision-asha-limited-pilot-inquiry-one-review-001",

    sourceInquiryReviewDecisionDigest:
      "2".repeat(64),

    sourceInquiryExecutionId:
      "execution-asha-limited-internal-pilot-inquiry-001",

    sourceInquiryExecutionDigest:
      "3".repeat(64),

    runtimeIssuanceId:
      base.ownerActivatedRuntimeIssuance
        .runtimeIssuanceId,

    runtimeIssuanceDigest:
      base.ownerActivatedRuntimeIssuance
        .runtimeIssuanceDigest,

    runtimeId:
      base.ownerActivatedRuntimeIssuance
        .runtimeId,

    runtimeDigest:
      runtime.runtimeDigest,

    qualifiedManifestDigest:
      base.qualifiedManifest.manifestDigest,

    tenantId:
      runtime.tenantId,

    ownerId:
      runtime.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION" as const,

    approvedForInquiryTwoExecution:
      true,

    reason:
      "Owner approved only the bounded synthetic sandbox execution of inquiry two after reviewing its exact preparation evidence.",

    reviewedInquiryTwoPreparation: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        "VERIFIED_URGENCY_WITHOUT_EXAGGERATION" as const,

      inquirySequence:
        2 as const,

      priorReviewedInquirySequence:
        1 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacityBeforeExecution:
        2 as const,

      projectedRemainingInquiryCapacityAfterExecution:
        1 as const,

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

      urgencyVerificationStandardBound:
        true as const,

      urgencyExaggerationProhibited:
        true as const,

      falseScarcityOrPressureProhibited:
        true as const,

      transparentAIIdentityRequired:
        true as const,

      humanImpersonationAuthorized:
        false as const,

      existingPilotArchitectureBound:
        true as const,
    },

    authorityBoundary: {
      sourceInquiryTwoPreparationIntegrityVerified:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      exactRuntimeBound:
        true as const,

      exactQualifiedManifestBound:
        true as const,

      inquiryOneOwnerReviewApprovalBound:
        true as const,

      inquiryTwoPreparationBound:
        true as const,

      inquiryTwoExecutionDecisionRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      inquiryTwoExecutionAuthorized:
        true as const,

      inquiryTwoExecutionPerformed:
        false as const,

      syntheticInquiryExecutionPerformed:
        false as const,

      concurrentInquiryExecutionAuthorized:
        false as const,

      inquiryThreePreparationAuthorized:
        false as const,

      inquiryThreeExecutionAuthorized:
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

      ownerReviewAfterInquiryTwoRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "EXECUTE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO" as const,

    decidedAt:
      "2026-07-16T00:00:03.000Z",
  };

  return {
    ...core,
    decisionDigest:
      sha256(core),
  };
}

async function day32ExecutionInput(
  overrides:
    Partial<ExecuteAshaLimitedInternalPilotInquiryTwoInput> = {},
): Promise<ExecuteAshaLimitedInternalPilotInquiryTwoInput> {
  const base =
    await day28ExecutionInput();

  const decision =
    createInquiryTwoDecision(base);

  return {
    executionId:
      "execution-asha-limited-internal-pilot-inquiry-two-001",

    ownerLimitedInternalPilotInquiryTwoExecutionDecision:
      decision,

    ownerActivatedRuntimeIssuance:
      base.ownerActivatedRuntimeIssuance,

    qualifiedManifest:
      base.qualifiedManifest,

    executedAt:
      "2026-07-16T00:00:04.000Z",

    ...overrides,
  };
}

describe(
  "Asha limited internal pilot inquiry two execution",
  () => {
    it(
      "executes only synthetic inquiry two of three and stops for mandatory owner review",
      async () => {
        const result =
          await executeAshaLimitedInternalPilotInquiryTwo(
            await day32ExecutionInput(),
          );

        expect(result.version).toBe(
          ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_VERSION,
        );

        expect(result.executionState).toBe(
          "LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTED",
        );

        expect(result.pilotInquiry).toEqual({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",
          dataClass:
            "SYNTHETIC_SANITIZED_ONLY",
          actorClass:
            "OWNER_SUPERVISED_INTERNAL_ONLY",
          scenarioId:
            "VERIFIED_URGENCY_WITHOUT_EXAGGERATION",
          inquirySequence:
            2,
          maximumInquiryCount:
            3,
          remainingInquiryCapacity:
            1,
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

        expect(result.nextStep).toBe(
          "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW",
        );
      },
    );

    it(
      "creates the exact sanitized synthetic inquiry two through controlled intake",
      async () => {
        const result =
          await executeAshaLimitedInternalPilotInquiryTwo(
            await day32ExecutionInput(),
          );

        expect(
          result.syntheticInquiryEvidence,
        ).toEqual({
          idempotencyKey:
            "asha-limited-internal-pilot-inquiry-002",
          channel:
            "WEB",
          customerName:
            "Synthetic Pilot Customer Two",
          customerEmail:
            "synthetic.pilot.two@example.invalid",
          customerPhone:
            null,
          message:
            "Our internal workshop begins in three business days, and we need 40 certified safety helmets. Please confirm whether verified stock and realistic delivery timing can meet that date; if not, state the limitation clearly.",
          resultOutcome:
            "CREATED",
          inquiryId:
            "inquiry-asha-limited-internal-pilot-002",
          inquiryStatus:
            "NEW",
          createdAt:
            "2026-07-16T00:00:04.000Z",
        });

        expect(
          result.controlledInquiryReceipt
            .authenticatedInquiry.inquiry.id,
        ).toBe(
          "inquiry-asha-limited-internal-pilot-002",
        );

        expect(
          result.controlledInquiryReceipt
            .workforceAuthority.toolMode,
        ).toBe(
          "DRAFT_ONLY",
        );
      },
    );

    it(
      "locks verified urgency behavior without exaggeration pressure or impersonation",
      async () => {
        const result =
          await executeAshaLimitedInternalPilotInquiryTwo(
            await day32ExecutionInput(),
          );

        expect(
          result.humanLikeScenarioExpectation,
        ).toEqual({
          urgencyMustBeVerifiedBeforeClaiming:
            true,
          urgencyExaggerationProhibited:
            true,
          falseScarcityOrPressureProhibited:
            true,
          evidenceBasedClarificationRequired:
            true,
          transparentAIIdentityRequired:
            true,
          naturalProfessionalToneRequired:
            true,
          ownerEscalationOnUncertaintyRequired:
            true,
          responseGenerationPerformed:
            false,
          humanImpersonationAuthorized:
            false,
        });
      },
    );

    it(
      "keeps inquiry three and every real-world autonomous authority blocked",
      async () => {
        const result =
          await executeAshaLimitedInternalPilotInquiryTwo(
            await day32ExecutionInput(),
          );

        expect(result.executionBoundary).toMatchObject({
          inquiryTwoExecutionDecisionBound:
            true,
          inquiryTwoExecutionPerformed:
            true,
          inquiryThreePreparationAuthorized:
            false,
          inquiryThreeExecutionAuthorized:
            false,
          ownerReviewAfterInquiryTwoRequired:
            true,
          limitedInternalPilotCompleted:
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
        });
      },
    );

    it(
      "rejects an unapproved or integrity-tampered inquiry two decision",
      async () => {
        const input =
          await day32ExecutionInput();

        const approved =
          input.ownerLimitedInternalPilotInquiryTwoExecutionDecision;

        const {
          decisionDigest: _ignored,
          ...approvedCore
        } = approved;

        const rejectedCore = {
          ...approvedCore,
          decision:
            "REJECT_AND_RETAIN_INQUIRY_TWO_PREPARATION_ONLY" as const,
          approvedForInquiryTwoExecution:
            false,
          nextStep:
            "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_ONLY" as const,
        };

        const rejected = {
          ...rejectedCore,
          decisionDigest:
            sha256(rejectedCore),
        } as AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision;

        await expect(
          executeAshaLimitedInternalPilotInquiryTwo({
            ...input,
            ownerLimitedInternalPilotInquiryTwoExecutionDecision:
              rejected,
          }),
        ).rejects.toThrow(
          "An approved Workforce Day 31 inquiry two execution decision is required.",
        );

        await expect(
          executeAshaLimitedInternalPilotInquiryTwo({
            ...input,
            ownerLimitedInternalPilotInquiryTwoExecutionDecision: {
              ...approved,
              ownerId:
                "owner-tampered",
            },
          }),
        ).rejects.toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "rejects execution before approval and mismatched manifest evidence",
      async () => {
        const input =
          await day32ExecutionInput();

        await expect(
          executeAshaLimitedInternalPilotInquiryTwo({
            ...input,
            executedAt:
              "2026-07-16T00:00:02.000Z",
          }),
        ).rejects.toThrow(
          "cannot precede owner approval",
        );

        await expect(
          executeAshaLimitedInternalPilotInquiryTwo({
            ...input,
            qualifiedManifest: {
              ...input.qualifiedManifest,
              manifestDigest:
                "f".repeat(64),
            },
          }),
        ).rejects.toThrow();
      },
    );

    it(
      "is deterministic deeply frozen and digest-bound",
      async () => {
        const input =
          await day32ExecutionInput();

        const first =
          await executeAshaLimitedInternalPilotInquiryTwo(
            input,
          );

        const second =
          await executeAshaLimitedInternalPilotInquiryTwo(
            input,
          );

        expect(first).toEqual(second);
        expect(first.executionDigest).toBe(
          second.executionDigest,
        );
        expect(Object.isFrozen(first)).toBe(true);
        expect(
          Object.isFrozen(first.pilotInquiry),
        ).toBe(true);
        expect(
          Object.isFrozen(first.executionBoundary),
        ).toBe(true);

        const {
          executionDigest: _ignored,
          ...core
        } = first;

        expect(first.executionDigest).toBe(
          sha256(core),
        );
      },
    );

    it(
      "rejects a secret-bearing execution identity",
      async () => {
        await expect(
          executeAshaLimitedInternalPilotInquiryTwo(
            await day32ExecutionInput({
              executionId:
                "execution-secret-inquiry-two",
            }),
          ),
        ).rejects.toThrow(
          "contains a credential-bearing term",
        );
      },
    );
  },
);
