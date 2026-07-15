import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  createAshaActivationCandidateIssuance,
  type CreateAshaActivationCandidateIssuanceInput,
} from "../ashaActivationCandidateIssuance";

import {
  ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION,
  type AshaFormalQualificationIssuance,
} from "../ashaFormalQualificationIssuance";

import {
  createAshaQualifiedEmployeeManifestIssuance,
  type AshaQualifiedEmployeeManifestIssuance,
} from "../ashaQualifiedEmployeeManifestIssuance";

import {
  AI_EMPLOYEE_ACTIVATION_CANDIDATE_VERSION,
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  createAIEmployeeQualificationReport,
  type AIEmployeeQualificationCase,
  type AIEmployeeQualificationCategory,
} from "../employeeQualification";

import {
  createCoreLaunchEmployeeTemplateRegistry,
  findAIEmployeeTemplate,
} from "../employeeTemplateRegistry";

const TENANT_ID = "tenant-ppa-industrial";
const OWNER_ID = "owner-prashant-001";
const QUALIFIED_AT = "2026-07-15T15:00:00.000Z";
const MANIFEST_CREATED_AT = "2026-07-15T16:00:00.000Z";
const PREPARED_AT = "2026-07-15T17:00:00.000Z";
const RUNTIME_ID = "runtime-asha-activation-candidate-001";

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableStringify(record[key])}`,
      )
      .join(",")}}`;
  }

  const primitive = JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error("Unsupported test digest value.");
  }

  return primitive;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(stableStringify(value), "utf8")
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
  const cases: AIEmployeeQualificationCase[] = [];
  let sequence = 1;

  for (
    const category of Object.keys(
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
    ) as AIEmployeeQualificationCategory[]
  ) {
    const count =
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS[category];

    for (
      let localSequence = 1;
      localSequence <= count;
      localSequence += 1
    ) {
      const caseId =
        `asha-activation-case-${sequence
          .toString()
          .padStart(3, "0")}`;

      cases.push({
        caseId,
        category,
        passed: true,
        evidenceDigest: sha256({
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

function formalQualification():
  AshaFormalQualificationIssuance {
  const template = canonicalTemplate();

  const qualificationReport =
    createAIEmployeeQualificationReport({
      template,
      testCases: qualificationCases(),
      ownerApproval: {
        ownerId: OWNER_ID,
        approved: true,
        approvedAt:
          "2026-07-15T14:30:00.000Z",
      },
      qualifiedAt: QUALIFIED_AT,
    });

  const issuanceCore = {
    version:
      ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION,
    issuanceId:
      "asha-formal-qualification-001",
    issuanceState:
      "FORMAL_QUALIFICATION_ISSUED",
    employeeId: template.employeeId,
    templateId: template.templateId,
    tenantId: TENANT_ID,
    ownerId: OWNER_ID,
    evaluatorId:
      "evaluator-asha-independent-001",
    decisionId:
      "asha-owner-qualification-decision-001",
    decisionDigest: sha256({
      decision:
        "APPROVE_FORMAL_QUALIFICATION",
    }),
    evidenceLedgerId:
      "asha-qualification-evidence-ledger-001",
    evidenceLedgerDigest: sha256({
      ledger:
        "asha-qualification-evidence-ledger-001",
    }),
    fixturePackDigest: sha256({
      fixturePack:
        "asha-controlled-fixture-pack-v1",
    }),
    planDigest: sha256({
      plan: "asha-qualification-plan-v1",
    }),
    independentEvaluationReportDigest:
      sha256({
        evaluation:
          "asha-independent-evaluation-v1",
      }),
    qualificationReport,
    qualificationDigest:
      qualificationReport.qualificationDigest,
    reportSummary: {
      totalTestCases: 100,
      passedTestCases: 100,
      failedTestCases: 0,
      mandatoryCategoryCoveragePassed: true,
      everyTestCasePassed: true,
      ownerApprovalRecorded: true,
      qualificationPassed: true,
      normalOperationCases: 30,
      adversarialCases: 15,
      tenantIsolationCases: 15,
      ownerControlCases: 15,
      emergencyPauseCases: 5,
      departmentHandoffCases: 10,
      auditEvidenceCases: 5,
      failureRecoveryCases: 5,
    },
    nextStep:
      "PREPARE_QUALIFIED_EMPLOYEE_MANIFEST",
    authorityBoundary: {
      registeredUnqualifiedTemplateBound: true,
      executionEvidenceBound: true,
      independentEvaluatorEvidenceVerified: true,
      ownerApprovalDecisionBound: true,
      qualificationEngineInvocationAuthorized: true,
      qualificationEngineInvoked: true,
      qualificationReportCreated: true,
      formalQualificationIssued: true,
      qualificationPassed: true,
      qualifiedManifestCreated: false,
      activationCandidateCreated: false,
      ownerActivationRecorded: false,
      runtimeActivated: false,
      controlledWorkAuthorized: false,
      customerDataAccessAuthorized: false,
      customerContactAuthorized: false,
      externalDeliveryAuthorized: false,
      liveProviderExecutionAuthorized: false,
      productionDatabaseAuthorized: false,
      productionMutationAuthorized: false,
      paymentExecutionAuthorized: false,
      autonomousDecisionAuthorized: false,
      productionReadinessAuthorized: false,
      publicLaunchAuthorized: false,
    },
    qualifiedAt: QUALIFIED_AT,
  } as const;

  return {
    ...issuanceCore,
    issuanceDigest: sha256(issuanceCore),
  };
}

function activationInput(
  overrides:
    Partial<
      CreateAshaActivationCandidateIssuanceInput
    > = {},
):
  CreateAshaActivationCandidateIssuanceInput {
  const formal = formalQualification();

  const qualifiedManifestIssuance =
    createAshaQualifiedEmployeeManifestIssuance({
      manifestIssuanceId:
        "asha-qualified-manifest-issuance-001",
      formalQualification: formal,
      tenantId: TENANT_ID,
      ownerId: OWNER_ID,
      createdAt: MANIFEST_CREATED_AT,
    });

  return {
    activationCandidateIssuanceId:
      "asha-activation-candidate-issuance-001",
    qualifiedManifestIssuance,
    formalQualification: formal,
    runtimeId: RUNTIME_ID,
    tenantId: TENANT_ID,
    ownerId: OWNER_ID,
    preparedAt: PREPARED_AT,
    ...overrides,
  };
}

describe(
  "Asha activation candidate issuance",
  () => {
    it(
      "prepares the activation candidate from the sealed Day 19 issuance",
      () => {
        const issuance =
          createAshaActivationCandidateIssuance(
            activationInput(),
          );

        expect(issuance.issuanceState).toBe(
          "ACTIVATION_CANDIDATE_PREPARED",
        );

        expect(issuance.nextStep).toBe(
          "AWAIT_OWNER_ACTIVATION",
        );

        expect(
          issuance.activationCandidate.version,
        ).toBe(
          AI_EMPLOYEE_ACTIVATION_CANDIDATE_VERSION,
        );
      },
    );

    it(
      "creates a paused runtime without owner activation",
      () => {
        const runtime =
          createAshaActivationCandidateIssuance(
            activationInput(),
          ).activationCandidate.pausedRuntime;

        expect(runtime).toMatchObject({
          runtimeId: RUNTIME_ID,
          tenantId: TENANT_ID,
          ownerId: OWNER_ID,
          ownerActivated: false,
          runtimeState:
            "PAUSED_AWAITING_OWNER",
          controlledWorkAuthorized: false,
        });
      },
    );

    it(
      "preserves employee qualification manifest tenant and owner bindings",
      () => {
        const input = activationInput();

        const issuance =
          createAshaActivationCandidateIssuance(
            input,
          );

        expect(issuance).toMatchObject({
          employeeId:
            "employee-asha-inquiry-intake-v1",
          templateId:
            "template-asha-inquiry-intake-v1",
          employeeCode: "nx-sales-003",
          tenantId: TENANT_ID,
          ownerId: OWNER_ID,
          qualificationDigest:
            input.formalQualification
              .qualificationDigest,
          qualifiedManifestDigest:
            input.qualifiedManifestIssuance
              .qualifiedManifest.manifestDigest,
        });
      },
    );

    it(
      "keeps customer execution database payment and launch blocked",
      () => {
        const issuance =
          createAshaActivationCandidateIssuance(
            activationInput(),
          );

        expect(
          issuance.authorityBoundary,
        ).toMatchObject({
          activationCandidateCreated: true,
          runtimeCreatedPaused: true,
          ownerActivationRecorded: false,
          runtimeActivated: false,
          controlledWorkAuthorized: false,
          customerDataAccessAuthorized: false,
          customerContactAuthorized: false,
          externalDeliveryAuthorized: false,
          liveProviderExecutionAuthorized: false,
          productionDatabaseAuthorized: false,
          productionMutationAuthorized: false,
          paymentExecutionAuthorized: false,
          autonomousDecisionAuthorized: false,
          productionReadinessAuthorized: false,
          publicLaunchAuthorized: false,
        });
      },
    );

    it(
      "blocks cross-tenant activation candidate preparation",
      () => {
        expect(() =>
          createAshaActivationCandidateIssuance(
            activationInput({
              tenantId:
                "tenant-other-business",
            }),
          ),
        ).toThrow(
          "Cross-tenant activation candidate creation is blocked.",
        );
      },
    );

    it(
      "blocks an owner not bound to the qualified manifest",
      () => {
        expect(() =>
          createAshaActivationCandidateIssuance(
            activationInput({
              ownerId:
                "owner-other-001",
            }),
          ),
        ).toThrow(
          "Only the qualified-manifest-bound owner can prepare the activation candidate.",
        );
      },
    );

    it(
      "is deterministic and deeply immutable",
      () => {
        const input = activationInput();

        const first =
          createAshaActivationCandidateIssuance(
            input,
          );

        const second =
          createAshaActivationCandidateIssuance(
            input,
          );

        expect(
          first.activationCandidateIssuanceDigest,
        ).toBe(
          second.activationCandidateIssuanceDigest,
        );

        expect(Object.isFrozen(first)).toBe(true);

        expect(
          Object.isFrozen(
            first.activationCandidate,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.activationCandidate.pausedRuntime,
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects tampered Day 19 and Day 18 evidence",
      () => {
        const input = activationInput();

        const tamperedDay19 = {
          ...input.qualifiedManifestIssuance,
          manifestIssuanceId:
            "asha-qualified-manifest-issuance-tampered",
        } as
          AshaQualifiedEmployeeManifestIssuance;

        expect(() =>
          createAshaActivationCandidateIssuance({
            ...input,
            qualifiedManifestIssuance:
              tamperedDay19,
          }),
        ).toThrow(
          "Workforce Day 19 qualified manifest issuance integrity verification failed.",
        );

        const tamperedDay18 = {
          ...input.formalQualification,
          decisionId:
            "asha-owner-qualification-decision-tampered",
        } as
          AshaFormalQualificationIssuance;

        expect(() =>
          createAshaActivationCandidateIssuance({
            ...input,
            formalQualification:
              tamperedDay18,
          }),
        ).toThrow(
          "Workforce Day 18 formal qualification integrity verification failed.",
        );
      },
    );
  },
);