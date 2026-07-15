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

describe(
  "Asha controlled shadow operation preparation",
  () => {
    it(
      "prepares one controlled shadow operation from the owner-activated runtime",
      () => {
        const preparation =
          createShadowPreparation();

        expect(
          preparation.preparationState,
        ).toBe(
          "CONTROLLED_SHADOW_OPERATION_PREPARED",
        );

        expect(
          preparation.nextStep,
        ).toBe(
          "EXECUTE_CONTROLLED_SHADOW_OPERATION",
        );

        expect(
          preparation.authorityBoundary
            .shadowExecutionEligible,
        ).toBe(true);

        expect(
          preparation.authorityBoundary
            .shadowExecutionExecuted,
        ).toBe(false);
      },
    );

    it(
      "locks the shadow fixture to one synthetic sanitized draft-only sandbox inquiry",
      () => {
        const fixture =
          createShadowPreparation()
            .shadowFixture;

        expect(fixture).toEqual({
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
      },
    );

    it(
      "preserves runtime issuance manifest tenant owner and employee bindings",
      () => {
        const source =
          createRuntimeIssuance();

        const preparation =
          createShadowPreparation({
            source,
          });

        expect(
          preparation.runtimeIssuanceId,
        ).toBe(
          source.runtimeIssuanceId,
        );

        expect(
          preparation.runtimeIssuanceDigest,
        ).toBe(
          source.runtimeIssuanceDigest,
        );

        expect(
          preparation.runtimeId,
        ).toBe(
          source.runtimeId,
        );

        expect(
          preparation.runtimeDigest,
        ).toBe(
          source.ownerActivatedRuntime
            .runtimeDigest,
        );

        expect(
          preparation.qualifiedManifestDigest,
        ).toBe(
          source.qualifiedManifestDigest,
        );

        expect(
          preparation.tenantId,
        ).toBe(TENANT_ID);

        expect(
          preparation.ownerId,
        ).toBe(OWNER_ID);

        expect(
          preparation.employeeId,
        ).toBe(
          "employee-asha-inquiry-intake-v1",
        );
      },
    );

    it(
      "keeps inquiry execution customer access external providers production payments and launch blocked",
      () => {
        const boundary =
          createShadowPreparation()
            .authorityBoundary;

        expect(boundary).toMatchObject({
          ownerActivatedRuntimeIssuanceBound:
            true,
          ownerActivationBound:
            true,
          qualifiedManifestBound:
            true,
          runtimeIdentityBound:
            true,
          tenantIdentityBound:
            true,
          ownerIdentityBound:
            true,
          approvalBypassAllowed:
            false,
          runtimeReadyForControlledWork:
            true,
          shadowExecutionEligible:
            true,
          shadowExecutionExecuted:
            false,
          authenticatedInquiryCreated:
            false,
          syntheticSanitizedDataOnly:
            true,
          emergencyPauseAvailable:
            true,
          customerDataAccessAuthorized:
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
        });
      },
    );

    it(
      "blocks controlled shadow preparation before runtime activation",
      () => {
        expect(() =>
          createShadowPreparation({
            preparedAt:
              "2026-07-15T18:59:59.999Z",
          }),
        ).toThrow(
          "Controlled shadow preparation cannot precede runtime activation.",
        );
      },
    );

    it(
      "rejects tampered Workforce Day 22 runtime issuance evidence",
      () => {
        const source =
          createRuntimeIssuance();

        const tampered = {
          ...source,
          ownerId:
            "owner-other-001",
        } as ReturnType<
          typeof createAshaOwnerActivatedRuntimeIssuance
        >;

        expect(() =>
          createShadowPreparation({
            source:
              tampered,
          }),
        ).toThrow(
          "Workforce Day 22 runtime issuance integrity verification failed.",
        );
      },
    );

    it(
      "blocks recomputed cross-tenant runtime issuance binding",
      () => {
        const source =
          createRuntimeIssuance();

        const {
          runtimeIssuanceDigest:
            _ignoredDigest,
          ...sourceCore
        } = source;

        const crossTenantCore = {
          ...sourceCore,
          tenantId:
            "tenant-other-industrial",
        };

        const crossTenant = {
          ...crossTenantCore,
          runtimeIssuanceDigest:
            sha256(crossTenantCore),
        } as ReturnType<
          typeof createAshaOwnerActivatedRuntimeIssuance
        >;

        expect(() =>
          createShadowPreparation({
            source:
              crossTenant,
          }),
        ).toThrow(
          "Asha runtime is not ready for controlled shadow work.",
        );
      },
    );

    it(
      "is deterministic deeply immutable and rejects secret-bearing identifiers",
      () => {
        const first =
          createShadowPreparation();

        const second =
          createShadowPreparation();

        expect(
          first.preparationDigest,
        ).toBe(
          second.preparationDigest,
        );

        expect(
          first.preparationDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.shadowFixture,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(
          Reflect.set(
            first.shadowFixture,
            "maximumInquiryCount",
            2,
          ),
        ).toBe(false);

        expect(() =>
          createShadowPreparation({
            preparationId:
              "asha-secret-token-001",
          }),
        ).toThrow(
          "controlled shadow preparationId is invalid.",
        );
      },
    );
  },
);