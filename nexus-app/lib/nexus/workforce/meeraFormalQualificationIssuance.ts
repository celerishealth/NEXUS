import {
  createHash,
} from "node:crypto";

import {
  AI_EMPLOYEE_QUALIFICATION_CATEGORIES,
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  AI_EMPLOYEE_QUALIFICATION_VERSION,
  createAIEmployeeQualificationReport,
  type AIEmployeeQualificationReport,
} from "./employeeQualification";

import {
  createCoreLaunchEmployeeTemplateRegistry,
  findAIEmployeeTemplate,
  type AIEmployeeTemplateRecord,
} from "./employeeTemplateRegistry";

import {
  validateMeeraFormalQualificationTestPlan,
  type MeeraFormalQualificationTestPlan,
} from "./meeraFormalQualificationTestPlan";

import {
  validateMeeraFormalQualificationFixturePack,
  type MeeraFormalQualificationFixturePack,
} from "./meeraFormalQualificationFixturePack";

import {
  validateMeeraFormalQualificationExecutionEvidence,
  type MeeraFormalQualificationExecutionEvidenceLedger,
} from "./meeraFormalQualificationExecutionEvidence";

import {
  validateMeeraFormalQualificationReviewDecision,
  type MeeraFormalQualificationReviewDecision,
} from "./meeraFormalQualificationReviewDecision";

export const MEERA_FORMAL_QUALIFICATION_ISSUANCE_VERSION =
  "nexus-meera-formal-qualification-issuance-v1" as const;

export interface IssueMeeraFormalQualificationInput {
  readonly issuanceId: string;

  readonly qualificationPlan:
    MeeraFormalQualificationTestPlan;

  readonly fixturePack:
    MeeraFormalQualificationFixturePack;

  readonly decision:
    MeeraFormalQualificationReviewDecision;

  readonly evidenceLedger:
    MeeraFormalQualificationExecutionEvidenceLedger;

  readonly tenantId: string;
  readonly ownerId: string;
  readonly qualifiedAt: string;
}

export interface MeeraFormalQualificationIssuance {
  readonly version:
    typeof MEERA_FORMAL_QUALIFICATION_ISSUANCE_VERSION;

  readonly issuanceId: string;

  readonly issuanceState:
    "FORMAL_QUALIFICATION_ISSUED";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly templateId:
    "template-meera-quotation-proposal-specialist-v1";

  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;

  readonly decisionId: string;
  readonly decisionDigest: string;

  readonly evidenceLedgerId: string;
  readonly evidenceLedgerDigest: string;

  readonly planId: string;
  readonly planDigest: string;

  readonly fixturePackId: string;
  readonly fixturePackDigest: string;

  readonly sourceSpecialistPlanId: string;
  readonly sourceSpecialistPlanDigest: string;

  readonly qualificationReport:
    AIEmployeeQualificationReport;

  readonly qualificationDigest: string;

  readonly reportSummary: Readonly<{
    totalTestCases: 100;
    passedTestCases: 100;
    failedTestCases: 0;

    qualificationEvidenceCount: 100;

    assertionsExecuted: 1300;
    assertionsPassed: 1300;
    assertionsFailed: 0;

    mandatoryCategoryCoveragePassed: true;
    everyTestCasePassed: true;
    ownerApprovalRecorded: true;
    qualificationPassed: true;

    normalOperationCases: 30;
    adversarialCases: 15;
    tenantIsolationCases: 15;
    ownerControlCases: 15;
    emergencyPauseCases: 5;
    departmentHandoffCases: 10;
    auditEvidenceCases: 5;
    failureRecoveryCases: 5;
  }>;

  readonly nextStep:
    "PREPARE_QUALIFIED_EMPLOYEE_MANIFEST";

  readonly authorityBoundary: Readonly<{
    registeredUnqualifiedTemplateBound: true;

    formalPlanBound: true;
    formalFixturePackBound: true;
    executionEvidenceBound: true;
    independentEvaluatorEvidenceVerified: true;
    ownerApprovalDecisionBound: true;

    qualificationEngineInvocationAuthorized: true;
    qualificationEngineInvoked: true;
    qualificationReportCreated: true;
    formalQualificationIssued: true;
    qualificationPassed: true;

    qualifiedManifestCreated: false;
    activationCandidateCreated: false;
    ownerActivationRecorded: false;
    runtimeActivated: false;
    controlledWorkAuthorized: false;

    realCustomerDataAccessAuthorized: false;
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionDatabaseAuthorized: false;
    productionMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousDecisionAuthorized: false;
    productionReadinessAuthorized: false;
    publicLaunchAuthorized: false;
  }>;

  readonly qualifiedAt: string;
  readonly issuanceDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
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
      "Unsupported deterministic Meera formal-qualification value.",
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

function deepFreeze<T>(
  value: T,
): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    for (
      const propertyName of
      Object.getOwnPropertyNames(value)
    ) {
      const child =
        (
          value as unknown as
            Record<string, unknown>
        )[propertyName];

      if (
        child !== null &&
        typeof child === "object"
      ) {
        deepFreeze(child);
      }
    }

    Object.freeze(value);
  }

  return value as Readonly<T>;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a safe identifier.",
    );
  }
}

function requireSha256(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a SHA-256 digest.",
    );
  }
}

function requireIsoTimestamp(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      label +
        " must be a valid ISO timestamp.",
    );
  }
}

function resolveCanonicalMeeraTemplate(
  plan:
    MeeraFormalQualificationTestPlan,
): AIEmployeeTemplateRecord {
  const registry =
    createCoreLaunchEmployeeTemplateRegistry(
      plan.registryCreatedAt,
    );

  const template =
    findAIEmployeeTemplate(
      registry,
      plan.templateId,
    );

  if (template === undefined) {
    throw new Error(
      "Canonical Meera registered template was not found.",
    );
  }

  if (
    template.employeeId !==
      plan.employeeId ||
    template.templateId !==
      plan.templateId ||
    template.employeeCode !==
      plan.templateBinding.employeeCode ||
    template.publicName !==
      plan.templateBinding.publicName ||
    template.officialRole !==
      plan.templateBinding.officialRole ||
    template.department !==
      plan.templateBinding.department ||
    template.status !==
      plan.templateBinding.templateStatus ||
    template.controlledActivationEligible !==
      plan.templateBinding
        .controlledActivationEligible ||
    template.templateDigest !==
      plan.templateBinding.templateDigest ||
    template.manifest.manifestDigest !==
      plan.templateBinding.manifestDigest ||
    template.skillToolValidationDigest !==
      plan.templateBinding
        .skillToolValidationDigest
  ) {
    throw new Error(
      "Canonical Meera template record does not match the formal qualification plan.",
    );
  }

  if (
    template.status !==
      "REGISTERED_UNQUALIFIED" ||
    template.controlledActivationEligible !==
      false ||
    template.manifest.evaluation.status !==
      "UNQUALIFIED" ||
    template.manifest.evaluation
      .testCasesPassed !== 0 ||
    template.manifest.evaluation
      .testCasesRequired !== 100 ||
    template.manifest.evaluation
      .adversarialTestsPassed !== false ||
    template.manifest.evaluation
      .tenantIsolationPassed !== false ||
    template.manifest.evaluation
      .ownerControlPassed !== false ||
    template.manifest.evaluation
      .emergencyPausePassed !== false
  ) {
    throw new Error(
      "Canonical Meera template is not in its registered unqualified state.",
    );
  }

  return template;
}

function validateQualificationReport(
  report:
    AIEmployeeQualificationReport,

  template:
    AIEmployeeTemplateRecord,

  ledger:
    MeeraFormalQualificationExecutionEvidenceLedger,

  decision:
    MeeraFormalQualificationReviewDecision,

  qualifiedAt: string,
): void {
  if (
    report.version !==
      AI_EMPLOYEE_QUALIFICATION_VERSION
  ) {
    throw new Error(
      "Meera formal qualification report version is invalid.",
    );
  }

  requireSha256(
    "Meera formal qualification digest",
    report.qualificationDigest,
  );

  requireIsoTimestamp(
    "Meera formal qualification report time",
    report.qualifiedAt,
  );

  if (
    report.employeeId !==
      template.employeeId ||
    report.templateId !==
      template.templateId ||
    report.templateDigest !==
      template.templateDigest ||
    report.sourceManifestDigest !==
      template.manifest.manifestDigest
  ) {
    throw new Error(
      "Meera formal qualification report template binding is invalid.",
    );
  }

  if (
    report.totalTestCases !== 100 ||
    report.passedTestCases !== 100 ||
    report.mandatoryCategoryCoveragePassed !==
      true ||
    report.everyTestCasePassed !== true ||
    report.qualificationPassed !== true
  ) {
    throw new Error(
      "Meera formal qualification report did not pass every required case.",
    );
  }

  if (
    report.ownerApproval.ownerId !==
      decision.ownerId ||
    report.ownerApproval.approved !== true ||
    report.ownerApproval.approvedAt !==
      decision.reviewedAt ||
    report.qualifiedAt !==
      qualifiedAt
  ) {
    throw new Error(
      "Meera formal qualification report owner approval binding is invalid.",
    );
  }

  if (
    ledger.qualificationCases.length !==
      100 ||
    new Set(
      ledger.qualificationCases.map(
        (qualificationCase) =>
          qualificationCase.caseId,
      ),
    ).size !== 100 ||
    new Set(
      ledger.qualificationCases.map(
        (qualificationCase) =>
          qualificationCase.evidenceDigest,
      ),
    ).size !== 100
  ) {
    throw new Error(
      "Meera formal qualification source evidence is incomplete or duplicated.",
    );
  }

  for (
    const category of
    AI_EMPLOYEE_QUALIFICATION_CATEGORIES
  ) {
    const minimum =
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
        category
      ];

    if (
      report.categoryCounts[category] !==
        minimum ||
      ledger.qualificationCases.filter(
        (qualificationCase) =>
          qualificationCase.category ===
            category,
      ).length !== minimum
    ) {
      throw new Error(
        "Meera formal qualification category coverage is incomplete.",
      );
    }
  }

  if (
    report.safetyBoundary
      .syntheticQualificationBlocked !==
        true ||
    report.safetyBoundary
      .incompleteEvidenceBlocked !==
        true ||
    report.safetyBoundary
      .failedEvaluationBlocked !== true ||
    report.safetyBoundary
      .ownerApprovalRequired !== true ||
    report.safetyBoundary
      .tenantIsolationRequired !== true ||
    report.safetyBoundary
      .emergencyPauseRequired !== true ||
    report.safetyBoundary
      .externalDeliveryAuthorized !==
        false ||
    report.safetyBoundary
      .liveProviderExecutionAuthorized !==
        false ||
    report.safetyBoundary
      .paymentExecutionAuthorized !==
        false ||
    report.safetyBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Meera formal qualification report safety boundary is invalid.",
    );
  }
}

export function validateMeeraFormalQualificationIssuance(
  issuance:
    MeeraFormalQualificationIssuance,
): void {
  if (
    issuance.version !==
      MEERA_FORMAL_QUALIFICATION_ISSUANCE_VERSION ||
    issuance.issuanceState !==
      "FORMAL_QUALIFICATION_ISSUED" ||
    issuance.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    issuance.templateId !==
      "template-meera-quotation-proposal-specialist-v1" ||
    issuance.nextStep !==
      "PREPARE_QUALIFIED_EMPLOYEE_MANIFEST"
  ) {
    throw new Error(
      "Meera formal qualification issuance identity is invalid.",
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "issuanceId",
        issuance.issuanceId,
      ],
      [
        "tenantId",
        issuance.tenantId,
      ],
      [
        "ownerId",
        issuance.ownerId,
      ],
      [
        "evaluatorId",
        issuance.evaluatorId,
      ],
      [
        "decisionId",
        issuance.decisionId,
      ],
      [
        "evidenceLedgerId",
        issuance.evidenceLedgerId,
      ],
      [
        "planId",
        issuance.planId,
      ],
      [
        "fixturePackId",
        issuance.fixturePackId,
      ],
      [
        "sourceSpecialistPlanId",
        issuance.sourceSpecialistPlanId,
      ],
    ] as const
  ) {
    requireIdentifier(
      label,
      value,
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "decisionDigest",
        issuance.decisionDigest,
      ],
      [
        "evidenceLedgerDigest",
        issuance.evidenceLedgerDigest,
      ],
      [
        "planDigest",
        issuance.planDigest,
      ],
      [
        "fixturePackDigest",
        issuance.fixturePackDigest,
      ],
      [
        "sourceSpecialistPlanDigest",
        issuance.sourceSpecialistPlanDigest,
      ],
      [
        "qualificationDigest",
        issuance.qualificationDigest,
      ],
    ] as const
  ) {
    requireSha256(
      label,
      value,
    );
  }

  requireIsoTimestamp(
    "Meera formal qualification issuance time",
    issuance.qualifiedAt,
  );

  const summary =
    issuance.reportSummary;

  if (
    summary.totalTestCases !== 100 ||
    summary.passedTestCases !== 100 ||
    summary.failedTestCases !== 0 ||
    summary.qualificationEvidenceCount !== 100 ||
    summary.assertionsExecuted !== 1300 ||
    summary.assertionsPassed !== 1300 ||
    summary.assertionsFailed !== 0 ||
    summary.mandatoryCategoryCoveragePassed !==
      true ||
    summary.everyTestCasePassed !== true ||
    summary.ownerApprovalRecorded !== true ||
    summary.qualificationPassed !== true ||
    summary.normalOperationCases !== 30 ||
    summary.adversarialCases !== 15 ||
    summary.tenantIsolationCases !== 15 ||
    summary.ownerControlCases !== 15 ||
    summary.emergencyPauseCases !== 5 ||
    summary.departmentHandoffCases !== 10 ||
    summary.auditEvidenceCases !== 5 ||
    summary.failureRecoveryCases !== 5
  ) {
    throw new Error(
      "Meera formal qualification issuance summary is invalid.",
    );
  }

  if (
    issuance.qualificationDigest !==
      issuance.qualificationReport
        .qualificationDigest
  ) {
    throw new Error(
      "Meera formal qualification digest binding is invalid.",
    );
  }

  const boundary =
    issuance.authorityBoundary;

  if (
    boundary.registeredUnqualifiedTemplateBound !==
      true ||
    boundary.formalPlanBound !== true ||
    boundary.formalFixturePackBound !== true ||
    boundary.executionEvidenceBound !== true ||
    boundary.independentEvaluatorEvidenceVerified !==
      true ||
    boundary.ownerApprovalDecisionBound !== true ||
    boundary.qualificationEngineInvocationAuthorized !==
      true ||
    boundary.qualificationEngineInvoked !== true ||
    boundary.qualificationReportCreated !== true ||
    boundary.formalQualificationIssued !== true ||
    boundary.qualificationPassed !== true ||
    boundary.qualifiedManifestCreated !== false ||
    boundary.activationCandidateCreated !== false ||
    boundary.ownerActivationRecorded !== false ||
    boundary.runtimeActivated !== false ||
    boundary.controlledWorkAuthorized !== false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !== false ||
    boundary.externalDeliveryAuthorized !== false ||
    boundary.liveProviderExecutionAuthorized !== false ||
    boundary.productionDatabaseAuthorized !== false ||
    boundary.productionMutationAuthorized !== false ||
    boundary.paymentExecutionAuthorized !== false ||
    boundary.autonomousDecisionAuthorized !== false ||
    boundary.productionReadinessAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Meera formal qualification issuance authority boundary is invalid.",
    );
  }

  const {
    issuanceDigest,
    ...issuanceCore
  } = issuance;

  if (
    !SHA_256_PATTERN.test(
      issuanceDigest,
    ) ||
    issuanceDigest !==
      sha256(issuanceCore)
  ) {
    throw new Error(
      "Meera formal qualification issuance integrity is invalid.",
    );
  }
}

export function issueMeeraFormalQualification(
  input:
    IssueMeeraFormalQualificationInput,
): MeeraFormalQualificationIssuance {
  requireIdentifier(
    "Meera formal qualification issuanceId",
    input.issuanceId,
  );

  requireIdentifier(
    "Meera formal qualification tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "Meera formal qualification ownerId",
    input.ownerId,
  );

  requireIsoTimestamp(
    "Meera formal qualification issuance time",
    input.qualifiedAt,
  );

  validateMeeraFormalQualificationTestPlan(
    input.qualificationPlan,
  );

  validateMeeraFormalQualificationFixturePack(
    input.fixturePack,
    input.qualificationPlan,
  );

  validateMeeraFormalQualificationExecutionEvidence(
    input.evidenceLedger,
    input.qualificationPlan,
    input.fixturePack,
  );

  validateMeeraFormalQualificationReviewDecision(
    input.decision,
  );

  const template =
    resolveCanonicalMeeraTemplate(
      input.qualificationPlan,
    );

  if (
    input.qualificationPlan.planId !==
      input.evidenceLedger.planId ||
    input.qualificationPlan.planDigest !==
      input.evidenceLedger.planDigest ||
    input.qualificationPlan.employeeId !==
      input.evidenceLedger.employeeId ||
    input.qualificationPlan.templateId !==
      input.evidenceLedger.templateId ||
    input.qualificationPlan.tenantId !==
      input.evidenceLedger.tenantId ||
    input.qualificationPlan.ownerId !==
      input.evidenceLedger.ownerId ||
    input.qualificationPlan.evaluatorId !==
      input.evidenceLedger.evaluatorId
  ) {
    throw new Error(
      "Meera formal qualification plan and execution evidence are not bound.",
    );
  }

  if (
    input.fixturePack.fixturePackId !==
      input.evidenceLedger.fixturePackId ||
    input.fixturePack.fixturePackDigest !==
      input.evidenceLedger.fixturePackDigest
  ) {
    throw new Error(
      "Meera formal fixture pack and execution evidence are not bound.",
    );
  }

  if (
    input.decision.employeeId !==
      input.evidenceLedger.employeeId ||
    input.decision.templateId !==
      input.evidenceLedger.templateId ||
    input.decision.evaluatorId !==
      input.evidenceLedger.evaluatorId ||
    input.decision.evidenceLedgerId !==
      input.evidenceLedger.ledgerId ||
    input.decision.evidenceLedgerDigest !==
      input.evidenceLedger.ledgerDigest ||
    input.decision.planId !==
      input.evidenceLedger.planId ||
    input.decision.planDigest !==
      input.evidenceLedger.planDigest ||
    input.decision.fixturePackId !==
      input.evidenceLedger.fixturePackId ||
    input.decision.fixturePackDigest !==
      input.evidenceLedger.fixturePackDigest
  ) {
    throw new Error(
      "Meera formal qualification decision and execution evidence are not bound.",
    );
  }

  if (
    input.decision.outcome !==
      "APPROVE_FORMAL_QUALIFICATION" ||
    input.decision.decisionState !==
      "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED" ||
    input.decision.nextStep !==
      "INVOKE_FORMAL_QUALIFICATION_ENGINE" ||
    input.decision.authorityBoundary
      .formalQualificationEngineInvocationAuthorized !==
        true ||
    input.decision.authorityBoundary
      .qualificationEngineInvoked !== false
  ) {
    throw new Error(
      "Meera formal qualification issuance requires an approved owner decision.",
    );
  }

  if (
    input.tenantId !==
      input.qualificationPlan.tenantId ||
    input.tenantId !==
      input.fixturePack.tenantId ||
    input.tenantId !==
      input.evidenceLedger.tenantId ||
    input.tenantId !==
      input.decision.tenantId
  ) {
    throw new Error(
      "Cross-tenant Meera formal qualification issuance is blocked.",
    );
  }

  if (
    input.ownerId !==
      input.qualificationPlan.ownerId ||
    input.ownerId !==
      input.fixturePack.ownerId ||
    input.ownerId !==
      input.evidenceLedger.ownerId ||
    input.ownerId !==
      input.decision.ownerId
  ) {
    throw new Error(
      "Only the evidence-bound approving owner can issue Meera formal qualification.",
    );
  }

  if (
    input.ownerId ===
      input.evidenceLedger.evaluatorId
  ) {
    throw new Error(
      "Meera formal qualification evaluator must remain independent from the owner.",
    );
  }

  if (
    Date.parse(input.qualifiedAt) <
      Date.parse(
        input.evidenceLedger.executedAt,
      ) ||
    Date.parse(input.qualifiedAt) <
      Date.parse(
        input.decision.reviewedAt,
      )
  ) {
    throw new Error(
      "Meera formal qualification issuance cannot precede evidence execution or owner approval.",
    );
  }

  if (
    input.evidenceLedger.employeeId !==
      template.employeeId ||
    input.evidenceLedger.templateId !==
      template.templateId ||
    input.qualificationPlan
      .templateBinding.templateDigest !==
      template.templateDigest ||
    input.qualificationPlan
      .templateBinding.manifestDigest !==
      template.manifest.manifestDigest
  ) {
    throw new Error(
      "Meera formal qualification evidence does not belong to the canonical registered template.",
    );
  }

  const qualificationReport =
    createAIEmployeeQualificationReport({
      template,

      testCases:
        input.evidenceLedger
          .qualificationCases,

      ownerApproval: {
        ownerId:
          input.ownerId,

        approved:
          true,

        approvedAt:
          input.decision.reviewedAt,
      },

      qualifiedAt:
        input.qualifiedAt,
    });

  validateQualificationReport(
    qualificationReport,
    template,
    input.evidenceLedger,
    input.decision,
    input.qualifiedAt,
  );

  const evidenceSummary =
    input.evidenceLedger.summary;

  const issuanceCore = {
    version:
      MEERA_FORMAL_QUALIFICATION_ISSUANCE_VERSION,

    issuanceId:
      input.issuanceId,

    issuanceState:
      "FORMAL_QUALIFICATION_ISSUED" as const,

    employeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    templateId:
      "template-meera-quotation-proposal-specialist-v1" as const,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    evaluatorId:
      input.evidenceLedger.evaluatorId,

    decisionId:
      input.decision.decisionId,

    decisionDigest:
      input.decision.decisionDigest,

    evidenceLedgerId:
      input.evidenceLedger.ledgerId,

    evidenceLedgerDigest:
      input.evidenceLedger.ledgerDigest,

    planId:
      input.qualificationPlan.planId,

    planDigest:
      input.qualificationPlan.planDigest,

    fixturePackId:
      input.fixturePack.fixturePackId,

    fixturePackDigest:
      input.fixturePack.fixturePackDigest,

    sourceSpecialistPlanId:
      input.evidenceLedger
        .sourceSpecialistPlanId,

    sourceSpecialistPlanDigest:
      input.evidenceLedger
        .sourceSpecialistPlanDigest,

    qualificationReport,

    qualificationDigest:
      qualificationReport
        .qualificationDigest,

    reportSummary: {
      totalTestCases:
        100 as const,

      passedTestCases:
        100 as const,

      failedTestCases:
        0 as const,

      qualificationEvidenceCount:
        evidenceSummary
          .qualificationEvidenceCollected,

      assertionsExecuted:
        evidenceSummary.assertionsExecuted,

      assertionsPassed:
        evidenceSummary.assertionsPassed,

      assertionsFailed:
        evidenceSummary.assertionsFailed,

      mandatoryCategoryCoveragePassed:
        true as const,

      everyTestCasePassed:
        true as const,

      ownerApprovalRecorded:
        true as const,

      qualificationPassed:
        true as const,

      normalOperationCases:
        qualificationReport
          .categoryCounts.NORMAL_OPERATION as 30,

      adversarialCases:
        qualificationReport
          .categoryCounts.ADVERSARIAL as 15,

      tenantIsolationCases:
        qualificationReport
          .categoryCounts.TENANT_ISOLATION as 15,

      ownerControlCases:
        qualificationReport
          .categoryCounts.OWNER_CONTROL as 15,

      emergencyPauseCases:
        qualificationReport
          .categoryCounts.EMERGENCY_PAUSE as 5,

      departmentHandoffCases:
        qualificationReport
          .categoryCounts.DEPARTMENT_HANDOFF as 10,

      auditEvidenceCases:
        qualificationReport
          .categoryCounts.AUDIT_EVIDENCE as 5,

      failureRecoveryCases:
        qualificationReport
          .categoryCounts.FAILURE_RECOVERY as 5,
    },

    nextStep:
      "PREPARE_QUALIFIED_EMPLOYEE_MANIFEST" as const,

    authorityBoundary: {
      registeredUnqualifiedTemplateBound:
        true as const,

      formalPlanBound:
        true as const,

      formalFixturePackBound:
        true as const,

      executionEvidenceBound:
        true as const,

      independentEvaluatorEvidenceVerified:
        true as const,

      ownerApprovalDecisionBound:
        true as const,

      qualificationEngineInvocationAuthorized:
        true as const,

      qualificationEngineInvoked:
        true as const,

      qualificationReportCreated:
        true as const,

      formalQualificationIssued:
        true as const,

      qualificationPassed:
        true as const,

      qualifiedManifestCreated:
        false as const,

      activationCandidateCreated:
        false as const,

      ownerActivationRecorded:
        false as const,

      runtimeActivated:
        false as const,

      controlledWorkAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
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
    },

    qualifiedAt:
      input.qualifiedAt,
  };

  const issuance =
    deepFreeze({
      ...issuanceCore,

      issuanceDigest:
        sha256(issuanceCore),
    }) as MeeraFormalQualificationIssuance;

  validateMeeraFormalQualificationIssuance(
    issuance,
  );

  return issuance;
}
