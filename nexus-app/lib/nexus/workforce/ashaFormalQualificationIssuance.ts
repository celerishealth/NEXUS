import {
  createHash,
} from "node:crypto";

import {
  AI_EMPLOYEE_QUALIFICATION_CATEGORIES,
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  AI_EMPLOYEE_QUALIFICATION_VERSION,
  createAIEmployeeQualificationReport,
  type AIEmployeeQualificationCategory,
  type AIEmployeeQualificationReport,
} from "./employeeQualification";

import {
  createCoreLaunchEmployeeTemplateRegistry,
  findAIEmployeeTemplate,
  type AIEmployeeTemplateRecord,
} from "./employeeTemplateRegistry";

import {
  ASHA_QUALIFICATION_TEST_PLAN_VERSION,
  type AshaQualificationTestPlan,
} from "./ashaQualificationTestPlan";

import {
  ASHA_QUALIFICATION_EXECUTION_EVIDENCE_VERSION,
  type AshaQualificationExecutionEvidenceLedger,
} from "./ashaQualificationExecutionEvidence";

import {
  ASHA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION,
  type AshaFormalQualificationReviewDecision,
} from "./ashaFormalQualificationReviewDecision";

export const ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION =
  "nexus-asha-formal-qualification-issuance-v1" as const;

export interface IssueAshaFormalQualificationInput {
  readonly issuanceId: string;
  readonly qualificationPlan:
    AshaQualificationTestPlan;
  readonly decision:
    AshaFormalQualificationReviewDecision;
  readonly evidenceLedger:
    AshaQualificationExecutionEvidenceLedger;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly qualifiedAt: string;
}

export interface AshaFormalQualificationIssuance {
  readonly version:
    typeof ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION;
  readonly issuanceId: string;
  readonly issuanceState:
    "FORMAL_QUALIFICATION_ISSUED";
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;
  readonly decisionId: string;
  readonly decisionDigest: string;
  readonly evidenceLedgerId: string;
  readonly evidenceLedgerDigest: string;
  readonly fixturePackDigest: string;
  readonly planDigest: string;
  readonly independentEvaluationReportDigest: string;
  readonly qualificationReport:
    AIEmployeeQualificationReport;
  readonly qualificationDigest: string;
  readonly reportSummary: Readonly<{
    totalTestCases: 100;
    passedTestCases: 100;
    failedTestCases: 0;
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
    customerDataAccessAuthorized: false;
    customerContactAuthorized: false;
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
      "Unsupported deterministic formal-qualification value.",
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

function requireIsoDate(
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

function validateEvidenceLedger(
  ledger:
    AshaQualificationExecutionEvidenceLedger,
): void {
  if (
    ledger.version !==
      ASHA_QUALIFICATION_EXECUTION_EVIDENCE_VERSION ||
    ledger.ledgerState !==
      "INDEPENDENT_ASSERTION_EVIDENCE_CAPTURED"
  ) {
    throw new Error(
      "Asha qualification execution-evidence state is invalid.",
    );
  }

  requireIdentifier(
    "qualification evidence ledgerId",
    ledger.ledgerId,
  );

  requireIdentifier(
    "qualification evidence employeeId",
    ledger.employeeId,
  );

  requireIdentifier(
    "qualification evidence templateId",
    ledger.templateId,
  );

  requireIdentifier(
    "qualification evidence tenantId",
    ledger.tenantId,
  );

  requireIdentifier(
    "qualification evidence ownerId",
    ledger.ownerId,
  );

  requireIdentifier(
    "qualification evidence evaluatorId",
    ledger.evaluatorId,
  );

  requireSha256(
    "qualification evidence ledger digest",
    ledger.ledgerDigest,
  );

  requireSha256(
    "fixture-pack digest",
    ledger.fixturePackDigest,
  );

  requireSha256(
    "qualification plan digest",
    ledger.planDigest,
  );

  requireSha256(
    "independent evaluation report digest",
    ledger.independentEvaluationReportDigest,
  );

  requireIsoDate(
    "qualification execution time",
    ledger.executedAt,
  );

  if (
    ledger.ownerId ===
      ledger.evaluatorId
  ) {
    throw new Error(
      "Qualification owner and evaluator must remain distinct.",
    );
  }

  if (
    ledger.harnessExecution
      .totalCases !== 400 ||
    ledger.harnessExecution
      .passedCases !== 400 ||
    ledger.harnessExecution
      .foundationCases !== 100 ||
    ledger.harnessExecution
      .foundationPassedCases !== 100 ||
    ledger.harnessExecution
      .specialistCases !== 300 ||
    ledger.harnessExecution
      .specialistPassedCases !== 300 ||
    ledger.harnessExecution
      .assertionDerivedEvidence !== true ||
    ledger.harnessExecution
      .everyCaseExecuted !== true ||
    ledger.harnessExecution
      .everyCasePassed !== true ||
    ledger.harnessExecution
      .failedAssertionBlocksReport !== true ||
    ledger.harnessExecution
      .duplicateEvidenceBlocked !== true
  ) {
    throw new Error(
      "Independent qualification evidence is incomplete.",
    );
  }

  if (
    ledger.qualificationCases.length !== 100 ||
    ledger.evidenceBindings.length !== 100 ||
    ledger.summary
      .qualificationCasesExecuted !== 100 ||
    ledger.summary
      .qualificationCasesPassed !== 100 ||
    ledger.summary
      .qualificationCasesFailed !== 0 ||
    ledger.summary
      .qualificationEvidenceCollected !== 100 ||
    ledger.summary
      .uniqueQualificationCaseIds !== 100 ||
    ledger.summary
      .uniqueQualificationEvidenceDigests !== 100
  ) {
    throw new Error(
      "Qualification evidence summary is incomplete.",
    );
  }

  const caseIds =
    new Set<string>();

  const evidenceDigests =
    new Set<string>();

  for (
    const qualificationCase of
    ledger.qualificationCases
  ) {
    requireIdentifier(
      "qualification caseId",
      qualificationCase.caseId,
    );

    requireSha256(
      "qualification evidence digest",
      qualificationCase.evidenceDigest,
    );

    requireIsoDate(
      "qualification case execution time",
      qualificationCase.executedAt,
    );

    if (
      qualificationCase.passed !== true ||
      qualificationCase.executedAt !==
        ledger.executedAt
    ) {
      throw new Error(
        "Qualification evidence contains a failed or mismatched case.",
      );
    }

    caseIds.add(
      qualificationCase.caseId,
    );

    evidenceDigests.add(
      qualificationCase.evidenceDigest,
    );
  }

  if (
    caseIds.size !== 100 ||
    evidenceDigests.size !== 100
  ) {
    throw new Error(
      "Qualification evidence identities or digests are duplicated.",
    );
  }

  for (
    const category of
    AI_EMPLOYEE_QUALIFICATION_CATEGORIES
  ) {
    const count =
      ledger.qualificationCases.filter(
        (qualificationCase) =>
          qualificationCase.category ===
          category,
      ).length;

    if (
      count !==
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
        category
      ]
    ) {
      throw new Error(
        "Qualification evidence category coverage is incomplete.",
      );
    }
  }

  if (
    ledger.authorityBoundary
      .fixturePackBound !== true ||
    ledger.authorityBoundary
      .independentEvaluationHarnessExecuted !== true ||
    ledger.authorityBoundary
      .assertionDerivedEvidenceRequired !== true ||
    ledger.authorityBoundary
      .hardCodedPassingEvidenceAccepted !== false ||
    ledger.authorityBoundary
      .qualificationTestingExecuted !== true ||
    ledger.authorityBoundary
      .qualificationEvidenceCollected !== true ||
    ledger.authorityBoundary
      .qualificationEngineInvoked !== false ||
    ledger.authorityBoundary
      .qualificationReportCreated !== false ||
    ledger.authorityBoundary
      .formalQualificationIssued !== false ||
    ledger.authorityBoundary
      .qualifiedManifestCreated !== false ||
    ledger.authorityBoundary
      .activationCandidateCreated !== false ||
    ledger.authorityBoundary
      .runtimeActivated !== false ||
    ledger.authorityBoundary
      .externalDeliveryAuthorized !== false ||
    ledger.authorityBoundary
      .liveProviderExecutionAuthorized !== false ||
    ledger.authorityBoundary
      .productionDatabaseAuthorized !== false ||
    ledger.authorityBoundary
      .productionMutationAuthorized !== false ||
    ledger.authorityBoundary
      .paymentExecutionAuthorized !== false ||
    ledger.authorityBoundary
      .productionReadinessAuthorized !== false ||
    ledger.authorityBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Qualification evidence authority boundary is invalid.",
    );
  }

  const {
    ledgerDigest,
    ...ledgerCore
  } = ledger;

  if (
    sha256(ledgerCore) !==
      ledgerDigest
  ) {
    throw new Error(
      "Qualification execution ledger digest is invalid.",
    );
  }
}

function validateReviewDecision(
  decision:
    AshaFormalQualificationReviewDecision,
): void {
  if (
    decision.version !==
      ASHA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION ||
    decision.decisionState !==
      "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED" ||
    decision.outcome !==
      "APPROVE_FORMAL_QUALIFICATION" ||
    decision.nextStep !==
      "INVOKE_FORMAL_QUALIFICATION_ENGINE"
  ) {
    throw new Error(
      "Formal qualification engine invocation requires an approved owner decision.",
    );
  }

  requireIdentifier(
    "formal qualification decisionId",
    decision.decisionId,
  );

  requireIdentifier(
    "formal qualification decision employeeId",
    decision.employeeId,
  );

  requireIdentifier(
    "formal qualification decision templateId",
    decision.templateId,
  );

  requireIdentifier(
    "formal qualification decision tenantId",
    decision.tenantId,
  );

  requireIdentifier(
    "formal qualification decision ownerId",
    decision.ownerId,
  );

  requireIdentifier(
    "formal qualification decision evaluatorId",
    decision.evaluatorId,
  );

  requireSha256(
    "formal qualification decision digest",
    decision.decisionDigest,
  );

  requireSha256(
    "formal qualification evidence digest",
    decision.evidenceLedgerDigest,
  );

  requireIsoDate(
    "formal qualification decision review time",
    decision.reviewedAt,
  );

  if (
    decision.ownerId ===
      decision.evaluatorId
  ) {
    throw new Error(
      "Formal qualification owner and evaluator must remain distinct.",
    );
  }

  if (
    decision.evidenceSummary
      .independentHarnessCasesExecuted !== 400 ||
    decision.evidenceSummary
      .independentHarnessCasesPassed !== 400 ||
    decision.evidenceSummary
      .foundationCasesExecuted !== 100 ||
    decision.evidenceSummary
      .foundationCasesPassed !== 100 ||
    decision.evidenceSummary
      .specialistCasesExecuted !== 300 ||
    decision.evidenceSummary
      .specialistCasesPassed !== 300 ||
    decision.evidenceSummary
      .qualificationCasesExecuted !== 100 ||
    decision.evidenceSummary
      .qualificationCasesPassed !== 100 ||
    decision.evidenceSummary
      .qualificationCasesFailed !== 0 ||
    decision.evidenceSummary
      .qualificationEvidenceCount !== 100 ||
    decision.evidenceSummary
      .uniqueQualificationCaseIds !== 100 ||
    decision.evidenceSummary
      .uniqueQualificationEvidenceDigests !== 100 ||
    decision.evidenceSummary
      .assertionDerivedEvidence !== true ||
    decision.evidenceSummary
      .hardCodedPassingEvidenceAccepted !== false
  ) {
    throw new Error(
      "Formal qualification owner decision evidence summary is incomplete.",
    );
  }

  if (
    decision.authorityBoundary
      .executionEvidenceBound !== true ||
    decision.authorityBoundary
      .independentEvaluatorEvidenceVerified !== true ||
    decision.authorityBoundary
      .ownerReviewRequired !== true ||
    decision.authorityBoundary
      .ownerDecisionRecorded !== true ||
    decision.authorityBoundary
      .formalQualificationEngineInvocationAuthorized !== true ||
    decision.authorityBoundary
      .qualificationEngineInvoked !== false ||
    decision.authorityBoundary
      .qualificationReportCreated !== false ||
    decision.authorityBoundary
      .formalQualificationIssued !== false ||
    decision.authorityBoundary
      .qualifiedManifestCreated !== false ||
    decision.authorityBoundary
      .activationCandidateCreated !== false ||
    decision.authorityBoundary
      .runtimeActivated !== false ||
    decision.authorityBoundary
      .ownerActivationRecorded !== false ||
    decision.authorityBoundary
      .customerDataAccessAuthorized !== false ||
    decision.authorityBoundary
      .customerContactAuthorized !== false ||
    decision.authorityBoundary
      .externalDeliveryAuthorized !== false ||
    decision.authorityBoundary
      .liveProviderExecutionAuthorized !== false ||
    decision.authorityBoundary
      .productionDatabaseAuthorized !== false ||
    decision.authorityBoundary
      .productionMutationAuthorized !== false ||
    decision.authorityBoundary
      .paymentExecutionAuthorized !== false ||
    decision.authorityBoundary
      .autonomousDecisionAuthorized !== false ||
    decision.authorityBoundary
      .productionReadinessAuthorized !== false ||
    decision.authorityBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Formal qualification owner decision authority boundary is invalid.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = decision;

  if (
    sha256(decisionCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Formal qualification owner decision digest is invalid.",
    );
  }
}

function validateQualificationPlan(
  plan:
    AshaQualificationTestPlan,
): void {
  if (
    plan.version !==
      ASHA_QUALIFICATION_TEST_PLAN_VERSION ||
    plan.planState !==
      "REGISTERED_TEMPLATE_BOUND_QUALIFICATION_PLAN_PREPARED"
  ) {
    throw new Error(
      "Asha qualification plan state is invalid.",
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "qualification planId",
        plan.planId,
      ],
      [
        "qualification plan employeeId",
        plan.employeeId,
      ],
      [
        "qualification plan templateId",
        plan.templateId,
      ],
      [
        "qualification plan tenantId",
        plan.tenantId,
      ],
      [
        "qualification plan ownerId",
        plan.ownerId,
      ],
      [
        "qualification plan evaluatorId",
        plan.evaluatorId,
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
        "qualification plan digest",
        plan.planDigest,
      ],
      [
        "qualification template digest",
        plan.templateBinding
          .templateDigest,
      ],
      [
        "qualification manifest digest",
        plan.templateBinding
          .manifestDigest,
      ],
      [
        "skill-tool validation digest",
        plan.templateBinding
          .skillToolValidationDigest,
      ],
    ] as const
  ) {
    requireSha256(
      label,
      value,
    );
  }

  requireIsoDate(
    "qualification registry creation time",
    plan.registryCreatedAt,
  );

  requireIsoDate(
    "qualification plan preparation time",
    plan.preparedAt,
  );

  if (
    Date.parse(plan.preparedAt) <
    Date.parse(plan.registryCreatedAt)
  ) {
    throw new Error(
      "Qualification plan cannot precede its canonical registry.",
    );
  }

  if (
    plan.templateBinding.publicName !==
      "Asha" ||
    plan.templateBinding.officialRole !==
      "AI Inquiry Intake Executive" ||
    plan.templateBinding.department !==
      "SALES" ||
    plan.templateBinding.templateStatus !==
      "REGISTERED_UNQUALIFIED" ||
    plan.templateBinding
      .controlledActivationEligible !== false ||
    plan.templateBinding
      .manifestEvaluation.status !==
      "UNQUALIFIED" ||
    plan.templateBinding
      .manifestEvaluation.testCasesPassed !== 0 ||
    plan.templateBinding
      .manifestEvaluation.testCasesRequired !== 100 ||
    plan.templateBinding
      .manifestEvaluation.adversarialTestsPassed !==
      false ||
    plan.templateBinding
      .manifestEvaluation.tenantIsolationPassed !==
      false ||
    plan.templateBinding
      .manifestEvaluation.ownerControlPassed !==
      false ||
    plan.templateBinding
      .manifestEvaluation.emergencyPausePassed !==
      false
  ) {
    throw new Error(
      "Qualification plan canonical template binding is invalid.",
    );
  }

  if (
    plan.requiredMinimumTestCases !== 100 ||
    plan.maximumTestCases !== 1000 ||
    plan.plannedCases.length !== 100 ||
    plan.preparationSummary
      .plannedCaseCount !== 100 ||
    plan.preparationSummary
      .unexecutedCaseCount !== 100 ||
    plan.preparationSummary
      .collectedEvidenceCount !== 0 ||
    plan.preparationSummary
      .passedCaseCount !== 0 ||
    plan.preparationSummary
      .failedCaseCount !== 0
  ) {
    throw new Error(
      "Qualification plan preparation summary is invalid.",
    );
  }

  if (
    plan.authorityBoundary
      .qualificationAdmissionBound !== true ||
    plan.authorityBoundary
      .canonicalRegisteredTemplateBound !== true ||
    plan.authorityBoundary
      .templateDigestBound !== true ||
    plan.authorityBoundary
      .manifestDigestBound !== true ||
    plan.authorityBoundary
      .ownerIdentityBound !== true ||
    plan.authorityBoundary
      .tenantIdentityBound !== true ||
    plan.authorityBoundary
      .qualificationTestingExecuted !== false ||
    plan.authorityBoundary
      .qualificationEngineInvoked !== false ||
    plan.authorityBoundary
      .qualificationReportCreated !== false ||
    plan.authorityBoundary
      .formalQualificationIssued !== false ||
    plan.authorityBoundary
      .qualifiedManifestCreated !== false ||
    plan.authorityBoundary
      .activationCandidateCreated !== false ||
    plan.authorityBoundary
      .runtimeActivated !== false ||
    plan.authorityBoundary
      .externalDeliveryAuthorized !== false ||
    plan.authorityBoundary
      .liveProviderExecutionAuthorized !== false ||
    plan.authorityBoundary
      .productionMutationAuthorized !== false ||
    plan.authorityBoundary
      .paymentExecutionAuthorized !== false ||
    plan.authorityBoundary
      .productionReadinessAuthorized !== false ||
    plan.authorityBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Qualification plan authority boundary is invalid.",
    );
  }

  const {
    planDigest,
    ...planCore
  } = plan;

  if (
    sha256(planCore) !==
      planDigest
  ) {
    throw new Error(
      "Qualification plan digest is invalid.",
    );
  }
}

function resolveCanonicalAshaTemplate(
  plan:
    AshaQualificationTestPlan,
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
      "Canonical Asha registered template was not found.",
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
      "REGISTERED_UNQUALIFIED" ||
    template.controlledActivationEligible !==
      false ||
    template.templateDigest !==
      plan.templateBinding.templateDigest ||
    template.manifest.manifestDigest !==
      plan.templateBinding.manifestDigest ||
    template.skillToolValidationDigest !==
      plan.templateBinding
        .skillToolValidationDigest
  ) {
    throw new Error(
      "Canonical Asha template record does not match the qualification plan.",
    );
  }

  if (
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
      "Canonical Asha template is not in its registered unqualified state.",
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
    AshaQualificationExecutionEvidenceLedger,
  decision:
    AshaFormalQualificationReviewDecision,
  qualifiedAt: string,
): void {
  if (
    report.version !==
      AI_EMPLOYEE_QUALIFICATION_VERSION
  ) {
    throw new Error(
      "Formal qualification report version is invalid.",
    );
  }

  requireSha256(
    "formal qualification digest",
    report.qualificationDigest,
  );

  requireIsoDate(
    "formal qualification report time",
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
      "Formal qualification report template binding is invalid.",
    );
  }

  if (
    report.totalTestCases !== 100 ||
    report.passedTestCases !== 100 ||
    report.mandatoryCategoryCoveragePassed !== true ||
    report.everyTestCasePassed !== true ||
    report.qualificationPassed !== true
  ) {
    throw new Error(
      "Formal qualification report did not pass all required cases.",
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
      "Formal qualification report owner approval binding is invalid.",
    );
  }

  if (
    ledger.qualificationCases.length !== 100 ||
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
      "Formal qualification source evidence is incomplete or duplicated.",
    );
  }

  for (
    const category of
    AI_EMPLOYEE_QUALIFICATION_CATEGORIES
  ) {
    if (
      report.categoryCounts[category] !==
        AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
          category
        ] ||
      ledger.qualificationCases.filter(
        (qualificationCase) =>
          qualificationCase.category ===
          category,
      ).length !==
        AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
          category
        ]
    ) {
      throw new Error(
        "Formal qualification category coverage is incomplete.",
      );
    }
  }

  if (
    report.safetyBoundary
      .syntheticQualificationBlocked !== true ||
    report.safetyBoundary
      .incompleteEvidenceBlocked !== true ||
    report.safetyBoundary
      .failedEvaluationBlocked !== true ||
    report.safetyBoundary
      .ownerApprovalRequired !== true ||
    report.safetyBoundary
      .tenantIsolationRequired !== true ||
    report.safetyBoundary
      .emergencyPauseRequired !== true ||
    report.safetyBoundary
      .externalDeliveryAuthorized !== false ||
    report.safetyBoundary
      .liveProviderExecutionAuthorized !== false ||
    report.safetyBoundary
      .paymentExecutionAuthorized !== false ||
    report.safetyBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Formal qualification report safety boundary is invalid.",
    );
  }
}
export function issueAshaFormalQualification(
  input:
    IssueAshaFormalQualificationInput,
): AshaFormalQualificationIssuance {
  requireIdentifier(
    "formal qualification issuanceId",
    input.issuanceId,
  );

  requireIdentifier(
    "formal qualification tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "formal qualification ownerId",
    input.ownerId,
  );

  requireIsoDate(
    "formal qualification issuance time",
    input.qualifiedAt,
  );

  validateEvidenceLedger(
    input.evidenceLedger,
  );

  validateReviewDecision(
    input.decision,
  );

  validateQualificationPlan(
    input.qualificationPlan,
  );

  const template =
    resolveCanonicalAshaTemplate(
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
      "Qualification plan and execution evidence are not bound.",
    );
  }

  if (
    input.tenantId !==
      input.evidenceLedger.tenantId ||
    input.tenantId !==
      input.decision.tenantId
  ) {
    throw new Error(
      "Cross-tenant formal qualification issuance is blocked.",
    );
  }

  if (
    input.ownerId !==
      input.evidenceLedger.ownerId ||
    input.ownerId !==
      input.decision.ownerId
  ) {
    throw new Error(
      "Only the evidence-bound approving owner can issue formal qualification.",
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
    input.decision.fixturePackDigest !==
      input.evidenceLedger.fixturePackDigest ||
    input.decision.planDigest !==
      input.evidenceLedger.planDigest ||
    input.decision.independentEvaluationReportDigest !==
      input.evidenceLedger
        .independentEvaluationReportDigest
  ) {
    throw new Error(
      "Formal qualification decision and execution evidence are not bound.",
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
      "Formal qualification evidence does not belong to the canonical registered Asha template.",
    );
  }

  if (
    Date.parse(input.qualifiedAt) <
      Date.parse(
        input.decision.reviewedAt,
      ) ||
    Date.parse(input.qualifiedAt) <
      Date.parse(
        input.evidenceLedger.executedAt,
      )
  ) {
    throw new Error(
      "Formal qualification issuance cannot precede evidence execution or owner approval.",
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

  const issuanceCore = {
    version:
      ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION,
    issuanceId:
      input.issuanceId,
    issuanceState:
      "FORMAL_QUALIFICATION_ISSUED" as const,
    employeeId:
      qualificationReport.employeeId,
    templateId:
      qualificationReport.templateId,
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
    fixturePackDigest:
      input.evidenceLedger.fixturePackDigest,
    planDigest:
      input.evidenceLedger.planDigest,
    independentEvaluationReportDigest:
      input.evidenceLedger
        .independentEvaluationReportDigest,
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
    } as const,
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
      input.qualifiedAt,
  };

  const issuance:
    AshaFormalQualificationIssuance = {
      ...issuanceCore,
      issuanceDigest:
        sha256(issuanceCore),
  };

  return deepFreeze(
    issuance,
  ) as AshaFormalQualificationIssuance;
}