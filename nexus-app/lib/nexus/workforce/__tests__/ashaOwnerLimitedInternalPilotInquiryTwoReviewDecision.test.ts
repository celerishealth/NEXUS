import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISION_VERSION,
  createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision,
  type CreateAshaOwnerLimitedInternalPilotInquiryTwoReviewDecisionInput,
} from "../ashaOwnerLimitedInternalPilotInquiryTwoReviewDecision";

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

async function executedInquiryTwo() {
  return executeAshaLimitedInternalPilotInquiryTwo(
    await day32ExecutionInput(),
  );
}

async function approvedInquiryTwoReviewInput(
  overrides:
    Partial<CreateAshaOwnerLimitedInternalPilotInquiryTwoReviewDecisionInput> = {},
): Promise<CreateAshaOwnerLimitedInternalPilotInquiryTwoReviewDecisionInput> {
  const execution =
    await executedInquiryTwo();

  return {
    limitedInternalPilotInquiryTwoExecution:
      execution,

    decisionId:
      "decision-asha-limited-pilot-inquiry-two-review-001",

    ownerId:
      execution.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION",

    reason:
      "Owner verified the complete Inquiry 2 sandbox evidence and approved preparation of Inquiry 3 only; execution remains separately blocked.",

    decidedAt:
      "2026-07-16T00:00:05.000Z",

    ...overrides,
  };
}

describe(
  "Asha owner limited internal pilot inquiry two review decision",
  () => {
    it(
      "records approval for inquiry three preparation only without authorizing execution",
      async () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision(
            await approvedInquiryTwoReviewInput(),
          );

        expect(result.version).toBe(
          ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISION_VERSION,
        );

        expect(result.decisionState).toBe(
          "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_RECORDED",
        );

        expect(
          result.inquiryThreePreparationApproved,
        ).toBe(true);

        expect(
          result.inquiryThreeExecutionAuthorized,
        ).toBe(false);

        expect(result.nextStep).toBe(
          "PREPARE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE",
        );
      },
    );

    it(
      "records rejection and retains inquiry two as the latest executed inquiry",
      async () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision(
            await approvedInquiryTwoReviewInput({
              decision:
                "REJECT_AND_RETAIN_INQUIRY_TWO_ONLY",

              reason:
                "Owner rejected further pilot preparation and retained Inquiry 2 as the latest executed bounded synthetic inquiry.",
            }),
          );

        expect(
          result.inquiryThreePreparationApproved,
        ).toBe(false);

        expect(
          result.authorityBoundary
            .inquiryThreePreparationAuthorized,
        ).toBe(false);

        expect(result.nextStep).toBe(
          "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_ONLY",
        );
      },
    );

    it(
      "records the exact verified urgency evidence and sequence two of three",
      async () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision(
            await approvedInquiryTwoReviewInput(),
          );

        expect(result.reviewedEvidence).toEqual({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",
          dataClass:
            "SYNTHETIC_SANITIZED_ONLY",
          actorClass:
            "OWNER_SUPERVISED_INTERNAL_ONLY",
          scenarioId:
            "VERIFIED_URGENCY_WITHOUT_EXAGGERATION",
          reviewedInquirySequence:
            2,
          maximumInquiryCount:
            3,
          remainingInquiryCapacity:
            1,
          ownerReviewFrequency:
            "AFTER_EVERY_INQUIRY",
          toolId:
            "tool-inquiry-draft",
          toolMode:
            "DRAFT_ONLY",
          executionMode:
            "SANDBOX_ONLY",
          controlledInquiryOutcome:
            "CREATED",
          controlledInquiryStatus:
            "NEW",
          recommendationStatus:
            "NOT_GENERATED",
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
          humanImpersonationAuthorized:
            false,
        });
      },
    );

    it(
      "binds the exact Inquiry 2 execution decision preparation runtime tenant owner and prior inquiry evidence",
      async () => {
        const input =
          await approvedInquiryTwoReviewInput();

        const source =
          input.limitedInternalPilotInquiryTwoExecution;

        const result =
          createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision(
            input,
          );

        expect(result).toMatchObject({
          limitedInternalPilotInquiryTwoExecutionId:
            source.executionId,
          limitedInternalPilotInquiryTwoExecutionDigest:
            source.executionDigest,
          ownerExecutionDecisionId:
            source.ownerExecutionDecisionId,
          ownerExecutionDecisionDigest:
            source.ownerExecutionDecisionDigest,
          preparationId:
            source.preparationId,
          preparationDigest:
            source.preparationDigest,
          sourceInquiryReviewDecisionId:
            source.sourceInquiryReviewDecisionId,
          sourceInquiryReviewDecisionDigest:
            source.sourceInquiryReviewDecisionDigest,
          sourceInquiryExecutionId:
            source.sourceInquiryExecutionId,
          sourceInquiryExecutionDigest:
            source.sourceInquiryExecutionDigest,
          runtimeIssuanceId:
            source.runtimeIssuanceId,
          runtimeIssuanceDigest:
            source.runtimeIssuanceDigest,
          runtimeId:
            source.runtimeId,
          runtimeDigest:
            source.runtimeDigest,
          qualifiedManifestDigest:
            source.qualifiedManifestDigest,
          tenantId:
            source.tenantId,
          ownerId:
            source.ownerId,
        });
      },
    );

    it(
      "keeps inquiry three execution and every real-world autonomous authority blocked",
      async () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision(
            await approvedInquiryTwoReviewInput(),
          );

        expect(result.authorityBoundary).toMatchObject({
          inquiryTwoReviewed:
            true,
          inquiryThreePreparationAuthorized:
            true,
          inquiryThreeExecutionAuthorized:
            false,
          concurrentInquiryExecutionAuthorized:
            false,
          limitedInternalPilotCompleted:
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
          monitoringRequired:
            true,
          ownerReviewAfterInquiryThreeRequired:
            true,
          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "rejects a cross-owner decision and a review before inquiry two execution",
      async () => {
        await expect(
          async () =>
            createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision(
              await approvedInquiryTwoReviewInput({
                ownerId:
                  "owner-different",
              }),
            ),
        ).rejects.toThrow(
          "Only the inquiry-two-bound owner",
        );

        await expect(
          async () =>
            createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision(
              await approvedInquiryTwoReviewInput({
                decidedAt:
                  "2026-07-16T00:00:03.000Z",
              }),
            ),
        ).rejects.toThrow(
          "cannot precede inquiry two execution",
        );
      },
    );

    it(
      "rejects tampered execution and recomputed receipt evidence",
      async () => {
        const input =
          await approvedInquiryTwoReviewInput();

        const source =
          input.limitedInternalPilotInquiryTwoExecution;

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision({
            ...input,

            limitedInternalPilotInquiryTwoExecution: {
              ...source,

              executionDigest:
                "f".repeat(64),
            },
          }),
        ).toThrow(
          "integrity verification failed",
        );

        const receipt = {
          ...source.controlledInquiryReceipt,

          authenticatedInquiry: {
            ...source.controlledInquiryReceipt
              .authenticatedInquiry,

            inquiry: {
              ...source.controlledInquiryReceipt
                .authenticatedInquiry.inquiry,

              customerName:
                "Tampered Synthetic Customer",
            },
          },
        };

        const {
          receiptDigest: _ignoredReceiptDigest,
          ...receiptCore
        } = receipt;

        const recomputedReceipt = {
          ...receiptCore,

          receiptDigest:
            sha256(receiptCore),
        };

        const tamperedExecutionCore = {
          ...source,

          controlledInquiryReceipt:
            recomputedReceipt,
        };

        const {
          executionDigest: _ignoredExecutionDigest,
          ...coreWithoutExecutionDigest
        } = tamperedExecutionCore;

        const recomputedExecution = {
          ...coreWithoutExecutionDigest,

          executionDigest:
            sha256(coreWithoutExecutionDigest),
        } as typeof source;

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision({
            ...input,

            limitedInternalPilotInquiryTwoExecution:
              recomputedExecution,
          }),
        ).toThrow(
          "controlled authenticated evidence is invalid",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and rejects secret-bearing review input",
      async () => {
        const input =
          await approvedInquiryTwoReviewInput();

        const first =
          createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision(
            input,
          );

        const second =
          createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision(
            input,
          );

        expect(first).toEqual(second);
        expect(first.decisionDigest).toBe(
          second.decisionDigest,
        );

        expect(Object.isFrozen(first)).toBe(true);
        expect(
          Object.isFrozen(first.reviewedEvidence),
        ).toBe(true);
        expect(
          Object.isFrozen(first.authorityBoundary),
        ).toBe(true);

        const {
          decisionDigest: _ignored,
          ...core
        } = first;

        expect(first.decisionDigest).toBe(
          sha256(core),
        );

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision({
            ...input,

            decisionId:
              "decision-secret-inquiry-two-review",
          }),
        ).toThrow(
          "contains a credential-bearing term",
        );
      },
    );
  },
);
