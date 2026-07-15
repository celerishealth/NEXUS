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

describe(
  "Asha limited internal pilot preparation",
  () => {
    it(
      "prepares a tightly bounded synthetic internal pilot without executing it",
      async () => {
        const result =
          createAshaLimitedInternalPilotPreparation(
            await day26PreparationInput(),
          );

        expect(result.version).toBe(
          "nexus-asha-limited-internal-pilot-preparation-v1",
        );

        expect(result.preparationState).toBe(
          "LIMITED_INTERNAL_PILOT_PREPARED",
        );

        expect(result.pilotScope).toEqual({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          dataClass:
            "SYNTHETIC_SANITIZED_ONLY",

          executionMode:
            "SANDBOX_ONLY",

          maximumInquiryCount:
            3,

          concurrentInquiryLimit:
            1,

          failureThreshold:
            1,

          ownerReviewFrequency:
            "AFTER_EVERY_INQUIRY",

          externalDeliveryMode:
            "DISABLED",

          productionMutationMode:
            "DISABLED",

          scenarios: [
            "INCOMPLETE_REQUIREMENT_CLARIFICATION",
            "VERIFIED_URGENCY_WITHOUT_EXAGGERATION",
            "SAFE_CUSTOMER_CONTEXT_CONTINUITY",
          ],
        });

        expect(result.nextStep).toBe(
          "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION",
        );
      },
    );

    it(
      "binds exact Day 25 decision employee tenant and owner evidence",
      async () => {
        const input =
          await day26PreparationInput();

        const source =
          input
            .ownerControlledShadowOperationReviewDecision;

        const result =
          createAshaLimitedInternalPilotPreparation(
            input,
          );

        expect(result.sourceReviewDecisionId).toBe(
          source.decisionId,
        );

        expect(result.sourceReviewDecisionDigest).toBe(
          source.decisionDigest,
        );

        expect(result.employeeId).toBe(
          "employee-asha-inquiry-intake-v1",
        );

        expect(result.templateId).toBe(
          "template-asha-inquiry-intake-v1",
        );

        expect(result.employeeCode).toBe(
          "nx-sales-003",
        );

        expect(result.displayName).toBe(
          "Asha",
        );

        expect(result.role).toBe(
          "AI Inquiry Intake Executive",
        );

        expect(result.department).toBe(
          "SALES",
        );

        expect(result.autonomyLevel).toBe(
          "DRAFTING_ASSISTANT",
        );

        expect(result.tenantId).toBe(
          source.tenantId,
        );

        expect(result.ownerId).toBe(
          source.ownerId,
        );
      },
    );

    it(
      "locks the transparent natural and non-robotic human-like employee standard",
      async () => {
        const result =
          createAshaLimitedInternalPilotPreparation(
            await day26PreparationInput(),
          );

        expect(
          result.humanLikeEmployeeStandard,
        ).toEqual({
          aiIdentityTransparent:
            true,

          naturalProfessionalConversationRequired:
            true,

          customerContextContinuityRequired:
            true,

          repeatedQuestionAvoidanceRequired:
            true,

          clarificationBeforeGuessingRequired:
            true,

          urgencyAndEmotionAwarenessRequired:
            true,

          promiseAndFollowUpTrackingRequired:
            true,

          uncertaintyEscalatesToOwner:
            true,

          nonRoboticCommunicationRequired:
            true,

          humanImpersonationAuthorized:
            false,
        });
      },
    );

    it(
      "bridges to the existing pilot architecture without invoking any pilot function",
      async () => {
        const result =
          createAshaLimitedInternalPilotPreparation(
            await day26PreparationInput(),
          );

        expect(
          result.existingPilotArchitectureBridge,
        ).toEqual({
          duplicatePilotEngineCreated:
            false,

          enrollmentModule:
            "lib/nexus/pilot/authenticatedControlledPilotEnrollment",

          enrollmentFunction:
            "enrollAuthenticatedControlledPilot",

          accessModule:
            "lib/nexus/pilot/authenticatedControlledPilotAccess",

          accessFunction:
            "enforceAuthenticatedControlledPilotAccess",

          controlModule:
            "lib/nexus/pilot/authenticatedControlledPilotControl",

          controlFunction:
            "controlAuthenticatedPilot",

          healthModule:
            "lib/nexus/pilot/authenticatedControlledPilotHealth",

          healthFunction:
            "observeAuthenticatedControlledPilotHealth",

          operationAdmissionModule:
            "lib/nexus/pilot/authenticatedControlledPilotOperationAdmission",

          operationAdmissionFunction:
            "admitAuthenticatedPilotOperation",

          enrollmentInvoked:
            false,

          accessGranted:
            false,

          pilotControlInvoked:
            false,

          healthObservationInvoked:
            false,

          operationAdmissionClaimed:
            false,
        });
      },
    );

    it(
      "requires monitoring and owner review while blocking every execution authority",
      async () => {
        const result =
          createAshaLimitedInternalPilotPreparation(
            await day26PreparationInput(),
          );

        expect(
          result.authorityBoundary,
        ).toEqual({
          sourceDecisionIntegrityVerified:
            true,

          exactEmployeeIdentityBound:
            true,

          exactTenantBound:
            true,

          exactOwnerBound:
            true,

          ownerPilotPreparationApprovalBound:
            true,

          approvalBypassAllowed:
            false,

          limitedInternalPilotPreparationAuthorized:
            true,

          limitedInternalPilotExecutionAuthorized:
            false,

          syntheticInquiryExecutionAuthorized:
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

          ownerReviewAfterEveryInquiry:
            true,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "rejects a Day 25 owner decision that did not approve pilot preparation",
      async () => {
        const rejected =
          createAshaOwnerControlledShadowOperationReviewDecision(
            await reviewInput({
              decision:
                "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION",

              reason:
                "Controlled shadow evidence requires additional internal review.",
            }),
          );

        await expect(
          async () =>
            createAshaLimitedInternalPilotPreparation({
              preparationId:
                "preparation-asha-limited-internal-pilot-001",

              ownerControlledShadowOperationReviewDecision:
                rejected,

              preparedAt:
                new Date(
                  Date.parse(rejected.decidedAt) +
                    1_000,
                ).toISOString(),
            }),
        ).rejects.toThrow(
          /requires explicit owner approval/i,
        );
      },
    );

    it(
      "rejects tampered Day 25 evidence and preparation before the owner decision",
      async () => {
        const source =
          await approvedReviewDecision();

        const tampered = {
          ...source,

          ownerId:
            "owner-tampered",
        } as Day26SourceDecision;

        expect(() =>
          createAshaLimitedInternalPilotPreparation({
            preparationId:
              "preparation-asha-limited-internal-pilot-001",

            ownerControlledShadowOperationReviewDecision:
              tampered,

            preparedAt:
              new Date(
                Date.parse(source.decidedAt) +
                  1_000,
              ).toISOString(),
          }),
        ).toThrow(
          /integrity verification failed/i,
        );

        expect(() =>
          createAshaLimitedInternalPilotPreparation({
            preparationId:
              "preparation-asha-limited-internal-pilot-001",

            ownerControlledShadowOperationReviewDecision:
              source,

            preparedAt:
              new Date(
                Date.parse(source.decidedAt) -
                  1,
              ).toISOString(),
          }),
        ).toThrow(
          /cannot precede the owner review decision/i,
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and rejects secret-bearing preparation identity",
      async () => {
        const input =
          await day26PreparationInput();

        const first =
          createAshaLimitedInternalPilotPreparation(
            input,
          );

        const second =
          createAshaLimitedInternalPilotPreparation(
            input,
          );

        expect(first).toEqual(second);

        expect(Object.isFrozen(first)).toBe(
          true,
        );

        expect(
          Object.isFrozen(first.pilotScope),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.humanLikeEmployeeStandard,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.existingPilotArchitectureBridge,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        const {
          preparationDigest,
          ...preparationCore
        } = first;

        expect(preparationDigest).toBe(
          sha256(preparationCore),
        );

        expect(() =>
          createAshaLimitedInternalPilotPreparation({
            ...input,

            preparationId:
              "preparation-secret-token-001",
          }),
        ).toThrow(
          /invalid or secret-bearing/i,
        );
      },
    );
  },
);