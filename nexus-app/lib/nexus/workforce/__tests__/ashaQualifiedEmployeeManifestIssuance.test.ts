import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION,
  type AshaFormalQualificationIssuance,
} from "../ashaFormalQualificationIssuance";

import {
  createAshaQualifiedEmployeeManifestIssuance,
  type CreateAshaQualifiedEmployeeManifestIssuanceInput,
} from "../ashaQualifiedEmployeeManifestIssuance";

import {
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  AI_EMPLOYEE_QUALIFICATION_VERSION,
  type AIEmployeeQualificationCase,
  type AIEmployeeQualificationCategory,
  type AIEmployeeQualificationReport,
} from "../employeeQualification";

import {
  createCoreLaunchEmployeeTemplateRegistry,
  findAIEmployeeTemplate,
  type AIEmployeeTemplateRecord,
} from "../employeeTemplateRegistry";

const TENANT_ID =
  "tenant-ppa-industrial";

const OWNER_ID =
  "owner-prashant-001";

const QUALIFIED_AT =
  "2026-07-15T15:00:00.000Z";

const CREATED_AT =
  "2026-07-15T16:00:00.000Z";

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

function pad(
  value: number,
): string {
  return value
    .toString()
    .padStart(3, "0");
}

function canonicalTemplate():
  AIEmployeeTemplateRecord {
  const registry =
    createCoreLaunchEmployeeTemplateRegistry(
      CREATED_AT,
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
        "asha-qualified-case-" +
        pad(sequence);

      cases.push({
        caseId,
        category,
        passed: true,
        evidenceDigest:
          sha256({
            caseId,
            category,
            localSequence,
            passed: true,
          }),
        executedAt:
          "2026-07-15T14:00:00.000Z",
      });

      sequence += 1;
    }
  }

  return cases;
}

function qualificationReport(
  template:
    AIEmployeeTemplateRecord,
): AIEmployeeQualificationReport {
  const evidenceCases =
    qualificationCases();

  const qualificationCore = {
    version:
      AI_EMPLOYEE_QUALIFICATION_VERSION,
    employeeId:
      template.employeeId,
    templateId:
      template.templateId,
    templateDigest:
      template.templateDigest,
    sourceManifestDigest:
      template.manifest
        .manifestDigest,
    totalTestCases:
      100,
    passedTestCases:
      100,
    categoryCounts: {
      NORMAL_OPERATION: 30,
      ADVERSARIAL: 15,
      TENANT_ISOLATION: 15,
      OWNER_CONTROL: 15,
      EMERGENCY_PAUSE: 5,
      DEPARTMENT_HANDOFF: 10,
      AUDIT_EVIDENCE: 5,
      FAILURE_RECOVERY: 5,
    },
    mandatoryCategoryCoveragePassed:
      true as const,
    everyTestCasePassed:
      true as const,
    ownerApproval: {
      ownerId:
        OWNER_ID,
      approved:
        true as const,
      approvedAt:
        "2026-07-15T14:30:00.000Z",
    },
    qualificationPassed:
      true as const,
    qualifiedAt:
      QUALIFIED_AT,
    safetyBoundary: {
      syntheticQualificationBlocked:
        true,
      incompleteEvidenceBlocked:
        true,
      failedEvaluationBlocked:
        true,
      ownerApprovalRequired:
        true,
      tenantIsolationRequired:
        true,
      emergencyPauseRequired:
        true,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    evidenceCases,
  };

  return {
    ...qualificationCore,
    qualificationDigest:
      sha256(qualificationCore),
  };
}

function formalQualification():
  AshaFormalQualificationIssuance {
  const template =
    canonicalTemplate();

  const qualification =
    qualificationReport(template);

  const issuanceCore = {
    version:
      ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION,
    issuanceId:
      "asha-formal-qualification-001",
    issuanceState:
      "FORMAL_QUALIFICATION_ISSUED" as const,
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
    qualificationReport:
      qualification,
    qualificationDigest:
      qualification.qualificationDigest,
    reportSummary: {
      totalTestCases:
        100 as const,
      passedTestCases:
        100 as const,
      failedTestCases:
        0 as const,
      mandatoryCategoryCoveragePassed:
        true as const,
      everyTestCasePassed:
        true as const,
      ownerApprovalRecorded:
        true as const,
      qualificationPassed:
        true as const,
      normalOperationCases:
        30 as const,
      adversarialCases:
        15 as const,
      tenantIsolationCases:
        15 as const,
      ownerControlCases:
        15 as const,
      emergencyPauseCases:
        5 as const,
      departmentHandoffCases:
        10 as const,
      auditEvidenceCases:
        5 as const,
      failureRecoveryCases:
        5 as const,
    },
    nextStep:
      "PREPARE_QUALIFIED_EMPLOYEE_MANIFEST" as const,
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
    } as const,
    qualifiedAt:
      QUALIFIED_AT,
  };

  return {
    ...issuanceCore,
    issuanceDigest:
      sha256(issuanceCore),
  };
}

function issuanceInput(
  overrides:
    Partial<
      CreateAshaQualifiedEmployeeManifestIssuanceInput
    > = {},
):
  CreateAshaQualifiedEmployeeManifestIssuanceInput {
  return {
    manifestIssuanceId:
      "asha-qualified-manifest-issuance-001",
    formalQualification:
      formalQualification(),
    tenantId:
      TENANT_ID,
    ownerId:
      OWNER_ID,
    createdAt:
      CREATED_AT,
    ...overrides,
  };
}

describe(
  "Asha qualified employee manifest issuance",
  () => {
    it(
      "creates Asha's qualified manifest from the Day 18 formal qualification",
      () => {
        const issuance =
          createAshaQualifiedEmployeeManifestIssuance(
            issuanceInput(),
          );

        expect(
          issuance.issuanceState,
        ).toBe(
          "QUALIFIED_EMPLOYEE_MANIFEST_CREATED",
        );

        expect(
          issuance.employeeId,
        ).toBe(
          "employee-asha-inquiry-intake-v1",
        );

        expect(
          issuance.templateId,
        ).toBe(
          "template-asha-inquiry-intake-v1",
        );

        expect(
          issuance.qualifiedManifest
            .evaluation.status,
        ).toBe("QUALIFIED");

        expect(
          issuance.qualifiedManifest
            .evaluation.testCasesPassed,
        ).toBe(100);
      },
    );

    it(
      "binds the qualified manifest to the formal qualification, tenant, owner and canonical template",
      () => {
        const input =
          issuanceInput();

        const issuance =
          createAshaQualifiedEmployeeManifestIssuance(
            input,
          );

        expect(
          issuance.tenantId,
        ).toBe(TENANT_ID);

        expect(
          issuance.ownerId,
        ).toBe(OWNER_ID);

        expect(
          issuance
            .formalQualificationIssuanceId,
        ).toBe(
          input.formalQualification
            .issuanceId,
        );

        expect(
          issuance
            .formalQualificationIssuanceDigest,
        ).toBe(
          input.formalQualification
            .issuanceDigest,
        );

        expect(
          issuance.qualificationDigest,
        ).toBe(
          input.formalQualification
            .qualificationDigest,
        );
      },
    );

    it(
      "preserves Asha's registered role, skills, tools and approval policy",
      () => {
        const template =
          canonicalTemplate();

        const issuance =
          createAshaQualifiedEmployeeManifestIssuance(
            issuanceInput(),
          );

        expect(
          issuance.employeeCode,
        ).toBe("nx-sales-003");

        expect(
          issuance.officialRole,
        ).toBe(
          "AI Inquiry Intake Executive",
        );

        expect(
          issuance.department,
        ).toBe("SALES");

        expect(
          issuance.autonomyLevel,
        ).toBe(
          "DRAFTING_ASSISTANT",
        );

        expect(
          issuance.qualifiedManifest
            .skills,
        ).toEqual(
          template.manifest.skills,
        );

        expect(
          issuance.qualifiedManifest
            .toolGrants,
        ).toEqual(
          template.manifest.toolGrants,
        );

        expect(
          issuance.qualifiedManifest
            .approvalPolicy,
        ).toEqual(
          template.manifest
            .approvalPolicy,
        );
      },
    );

    it(
      "preserves fail-closed safety boundaries without creating activation or runtime state",
      () => {
        const issuance =
          createAshaQualifiedEmployeeManifestIssuance(
            issuanceInput(),
          );

        expect(
          issuance.qualifiedManifest
            .safetyBoundary,
        ).toEqual({
          ownerControlled: true,
          emergencyPauseRequired: true,
          crossTenantAccessAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });

        expect(
          issuance.authorityBoundary
            .qualifiedManifestCreated,
        ).toBe(true);

        expect(
          issuance.authorityBoundary
            .activationCandidateCreated,
        ).toBe(false);

        expect(
          issuance.authorityBoundary
            .ownerActivationRecorded,
        ).toBe(false);

        expect(
          issuance.authorityBoundary
            .runtimeActivated,
        ).toBe(false);

        expect(
          "activationCandidate" in issuance,
        ).toBe(false);

        expect(
          "pausedRuntime" in issuance,
        ).toBe(false);
      },
    );

    it(
      "keeps controlled work, customer access, external execution, payment and launch blocked",
      () => {
        const boundary =
          createAshaQualifiedEmployeeManifestIssuance(
            issuanceInput(),
          ).authorityBoundary;

        expect(boundary).toMatchObject({
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
      "blocks cross-tenant qualified manifest creation",
      () => {
        expect(() =>
          createAshaQualifiedEmployeeManifestIssuance(
            issuanceInput({
              tenantId:
                "tenant-other-business",
            }),
          ),
        ).toThrow(
          "Cross-tenant qualified manifest creation is blocked.",
        );
      },
    );

    it(
      "blocks an owner that is not bound to the formal qualification",
      () => {
        expect(() =>
          createAshaQualifiedEmployeeManifestIssuance(
            issuanceInput({
              ownerId:
                "owner-other-001",
            }),
          ),
        ).toThrow(
          "Only the qualification-bound owner can create the qualified manifest.",
        );
      },
    );

    it(
      "is deterministic, immutable and rejects tampered Day 18 qualification evidence",
      () => {
        const input =
          issuanceInput();

        const first =
          createAshaQualifiedEmployeeManifestIssuance(
            input,
          );

        const second =
          createAshaQualifiedEmployeeManifestIssuance(
            input,
          );

        expect(
          first.manifestIssuanceDigest,
        ).toBe(
          second.manifestIssuanceDigest,
        );

        expect(
          first.qualifiedManifest
            .manifestDigest,
        ).toBe(
          second.qualifiedManifest
            .manifestDigest,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.qualifiedManifest,
          ),
        ).toBe(true);

        const source =
          formalQualification();

        const tampered =
          {
            ...source,
            qualificationDigest:
              "0".repeat(64),
          } as
            AshaFormalQualificationIssuance;

        expect(() =>
          createAshaQualifiedEmployeeManifestIssuance(
            issuanceInput({
              formalQualification:
                tampered,
            }),
          ),
        ).toThrow(
          "Day 18 formal qualification issuance integrity verification failed.",
        );
      },
    );
  },
);
