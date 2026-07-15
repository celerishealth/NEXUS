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

describe(
  "Asha owner-activated runtime issuance",
  () => {
    it(
      "issues an owner-activated controlled runtime from the approved decision",
      () => {
        const issuance =
          createRuntimeIssuance();

        expect(
          issuance.issuanceState,
        ).toBe(
          "OWNER_ACTIVATED_RUNTIME_ISSUED",
        );

        expect(
          issuance.nextStep,
        ).toBe(
          "PREPARE_CONTROLLED_SHADOW_OPERATION",
        );
      },
    );

    it(
      "creates a ready runtime with controlled work authorized",
      () => {
        const runtime =
          createRuntimeIssuance()
            .ownerActivatedRuntime;

        expect(
          runtime.ownerActivated,
        ).toBe(true);

        expect(
          runtime.runtimeState,
        ).toBe(
          "READY_FOR_CONTROLLED_WORK",
        );

        expect(
          runtime.controlledWorkAuthorized,
        ).toBe(true);
      },
    );

    it(
      "preserves employee runtime manifest tenant and owner bindings",
      () => {
        const issuance =
          createRuntimeIssuance();

        expect(issuance).toMatchObject({
          employeeId:
            "employee-asha-inquiry-intake-v1",
          templateId:
            "template-asha-inquiry-intake-v1",
          employeeCode:
            "nx-sales-003",
          displayName:
            "Asha",
          officialRole:
            "AI Inquiry Intake Executive",
          department:
            "SALES",
          autonomyLevel:
            "DRAFTING_ASSISTANT",
          runtimeId:
            RUNTIME_ID,
          tenantId:
            TENANT_ID,
          ownerId:
            OWNER_ID,
        });

        expect(
          issuance.ownerActivatedRuntime
            .manifestDigest,
        ).toBe(
          issuance.qualifiedManifestDigest,
        );

        expect(
          issuance.ownerActivatedRuntime
            .runtimeDigest,
        ).not.toBe(
          issuance.pausedRuntimeDigest,
        );
      },
    );

    it(
      "keeps customer external provider database payment and launch authority blocked",
      () => {
        const issuance =
          createRuntimeIssuance();

        expect(
          issuance.authorityBoundary,
        ).toMatchObject({
          runtimeActivationExecuted:
            true,
          runtimeActivated:
            true,
          controlledWorkAuthorized:
            true,
          emergencyPauseAvailable:
            true,
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
        });

        expect(
          issuance.ownerActivatedRuntime
            .safetyBoundary,
        ).toMatchObject({
          emergencyPauseAvailable:
            true,
          liveProviderExecutionAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "rejects an owner activation rejection decision",
      () => {
        const source =
          activationCandidateIssuance();

        const rejected =
          ownerDecision(
            source,
            false,
          );

        expect(() =>
          createRuntimeIssuance({
            source,
            decision:
              rejected,
          }),
        ).toThrow(
          "Asha runtime activation requires an explicit approved owner decision.",
        );
      },
    );

    it(
      "blocks a decision bound to another activation candidate",
      () => {
        const original =
          activationCandidateIssuance();

        const decision =
          ownerDecision(original);

        const otherSource =
          activationCandidateIssuance({
            runtimeId:
              "runtime-asha-alternate-001",
            issuanceId:
              "asha-activation-candidate-alternate-001",
          });

        expect(() =>
          createRuntimeIssuance({
            source:
              otherSource,
            decision,
          }),
        ).toThrow(
          "Owner activation decision does not match the activation candidate.",
        );
      },
    );

    it(
      "blocks runtime activation before the owner decision time",
      () => {
        expect(() =>
          createRuntimeIssuance({
            activatedAt:
              "2026-07-15T17:59:59.000Z",
          }),
        ).toThrow(
          "Runtime activation cannot precede the owner activation decision.",
        );
      },
    );

    it(
      "is deterministic deeply immutable and rejects tampered candidate evidence",
      () => {
        const first =
          createRuntimeIssuance();

        const second =
          createRuntimeIssuance();

        expect(
          first.runtimeIssuanceDigest,
        ).toBe(
          second.runtimeIssuanceDigest,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.ownerActivatedRuntime,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.ownerActivatedRuntime
              .safetyBoundary,
          ),
        ).toBe(true);

        const source =
          activationCandidateIssuance();

        const tampered = {
          ...source,
          runtimeId:
            "runtime-asha-tampered-001",
        } as AshaActivationCandidateIssuance;

        expect(() =>
          createAshaOwnerActivatedRuntimeIssuance({
            runtimeIssuanceId:
              "asha-owner-activated-runtime-tampered-001",
            activationCandidateIssuance:
              tampered,
            ownerActivationDecision:
              ownerDecision(source),
            activatedAt:
              ACTIVATED_AT,
          }),
        ).toThrow(
          "Workforce Day 20 activation candidate issuance integrity verification failed.",
        );
      },
    );
  },
);