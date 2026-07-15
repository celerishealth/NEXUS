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
  createAshaOwnerActivationDecision,
  type AshaOwnerActivationDecisionType,
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
    ) as
      AIEmployeeQualificationCategory[]
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
        "asha-owner-activation-case-" +
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

function activationCandidateIssuance():
  AshaActivationCandidateIssuance {
  const formal =
    formalQualification();

  const manifestIssuance =
    createAshaQualifiedEmployeeManifestIssuance({
      manifestIssuanceId:
        "asha-qualified-manifest-issuance-001",
      formalQualification:
        formal,
      tenantId:
        TENANT_ID,
      ownerId:
        OWNER_ID,
      createdAt:
        MANIFEST_CREATED_AT,
    });

  return createAshaActivationCandidateIssuance({
    activationCandidateIssuanceId:
      "asha-activation-candidate-issuance-001",
    qualifiedManifestIssuance:
      manifestIssuance,
    formalQualification:
      formal,
    runtimeId:
      RUNTIME_ID,
    tenantId:
      TENANT_ID,
    ownerId:
      OWNER_ID,
    preparedAt:
      CANDIDATE_PREPARED_AT,
  });
}

function createDecision(
  decision:
    AshaOwnerActivationDecisionType,
  overrides: {
    ownerId?: string;
    reason?: string;
    decidedAt?: string;
    activationCandidateIssuance?:
      AshaActivationCandidateIssuance;
  } = {},
) {
  return createAshaOwnerActivationDecision({
    activationCandidateIssuance:
      overrides
        .activationCandidateIssuance ??
      activationCandidateIssuance(),
    decisionId:
      "asha-owner-activation-decision-001",
    ownerId:
      overrides.ownerId ??
      OWNER_ID,
    decision,
    reason:
      overrides.reason ??
      "Owner reviewed Asha's qualified activation candidate.",
    decidedAt:
      overrides.decidedAt ??
      DECIDED_AT,
  });
}

describe(
  "Asha owner activation decision",
  () => {
    it(
      "records an explicit owner approval without activating the runtime",
      () => {
        const decision =
          createDecision(
            "APPROVE_ASHA_ACTIVATION",
          );

        expect(
          decision.ownerActivationApproved,
        ).toBe(true);

        expect(
          decision.runtimeActivationEligible,
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "PREPARE_OWNER_ACTIVATED_RUNTIME",
        );

        expect(
          decision.authorityBoundary
            .runtimeActivationExecuted,
        ).toBe(false);
      },
    );

    it(
      "records rejection and retains the paused runtime",
      () => {
        const decision =
          createDecision(
            "REJECT_ASHA_ACTIVATION",
          );

        expect(
          decision.ownerActivationApproved,
        ).toBe(false);

        expect(
          decision.runtimeActivationEligible,
        ).toBe(false);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_PAUSED_RUNTIME",
        );
      },
    );

    it(
      "preserves Asha identity tenant owner qualification manifest and runtime bindings",
      () => {
        const decision =
          createDecision(
            "APPROVE_ASHA_ACTIVATION",
          );

        expect(decision).toMatchObject({
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
          decision
            .activationCandidateIssuanceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          decision.pausedRuntimeDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "keeps runtime customer execution database payment and launch authority blocked",
      () => {
        const decision =
          createDecision(
            "APPROVE_ASHA_ACTIVATION",
          );

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          ownerDecisionRequired:
            true,
          ownerIdentityBound:
            true,
          activationCandidateIssuanceBound:
            true,
          approvalBypassAllowed:
            false,
          ownerActivationDecisionRecorded:
            true,
          runtimeActivationExecuted:
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
        });
      },
    );

    it(
      "blocks an owner not bound to the activation candidate",
      () => {
        expect(() =>
          createDecision(
            "APPROVE_ASHA_ACTIVATION",
            {
              ownerId:
                "owner-other-001",
            },
          ),
        ).toThrow(
          "Only the activation-candidate-bound owner can issue the activation decision.",
        );
      },
    );

    it(
      "blocks a decision that precedes candidate preparation",
      () => {
        expect(() =>
          createDecision(
            "APPROVE_ASHA_ACTIVATION",
            {
              decidedAt:
                "2026-07-15T16:59:59.000Z",
            },
          ),
        ).toThrow(
          "Owner activation decision cannot precede activation candidate preparation.",
        );
      },
    );

    it(
      "is deterministic deeply immutable and normalizes the reason",
      () => {
        const reason =
          "  Owner approved the controlled Asha activation candidate.  ";

        const first =
          createDecision(
            "APPROVE_ASHA_ACTIVATION",
            {
              reason,
            },
          );

        const second =
          createDecision(
            "APPROVE_ASHA_ACTIVATION",
            {
              reason,
            },
          );

        expect(
          first.decisionDigest,
        ).toBe(
          second.decisionDigest,
        );

        expect(first.reason).toBe(
          reason.trim(),
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects tampered Workforce Day 20 activation candidate evidence",
      () => {
        const source =
          activationCandidateIssuance();

        const tampered = {
          ...source,
          runtimeId:
            "runtime-asha-tampered-001",
        } as
          AshaActivationCandidateIssuance;

        expect(() =>
          createDecision(
            "APPROVE_ASHA_ACTIVATION",
            {
              activationCandidateIssuance:
                tampered,
            },
          ),
        ).toThrow(
          "Workforce Day 20 activation candidate issuance integrity verification failed.",
        );
      },
    );
  },
);