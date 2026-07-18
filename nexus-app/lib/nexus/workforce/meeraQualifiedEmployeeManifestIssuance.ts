import {
  createHash,
} from "node:crypto";

import type {
  AIEmployeeManifest,
} from "./aiEmployeeManifest";

import {
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  createQualifiedAIEmployeeManifest,
  type AIEmployeeQualificationCategory,
  type AIEmployeeQualificationReport,
} from "./employeeQualification";

import {
  createCoreLaunchEmployeeTemplateRegistry,
  findAIEmployeeTemplate,
  type AIEmployeeTemplateRecord,
} from "./employeeTemplateRegistry";

import {
  MEERA_FORMAL_QUALIFICATION_ISSUANCE_VERSION,
  validateMeeraFormalQualificationIssuance,
  type MeeraFormalQualificationIssuance,
} from "./meeraFormalQualificationIssuance";

export const MEERA_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION =
  "nexus-meera-qualified-employee-manifest-issuance-v1" as const;

export interface CreateMeeraQualifiedEmployeeManifestIssuanceInput {
  readonly manifestIssuanceId: string;

  readonly formalQualification:
    MeeraFormalQualificationIssuance;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly registryCreatedAt: string;
  readonly createdAt: string;
}

export interface MeeraQualifiedEmployeeManifestIssuance {
  readonly version:
    typeof MEERA_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION;

  readonly manifestIssuanceId: string;

  readonly issuanceState:
    "QUALIFIED_EMPLOYEE_MANIFEST_CREATED";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly templateId:
    "template-meera-quotation-proposal-specialist-v1";

  readonly employeeCode:
    "nx-sales-005";

  readonly displayName:
    "Meera";

  readonly officialRole:
    "AI Quotation & Proposal Specialist";

  readonly department:
    "SALES";

  readonly autonomyLevel:
    "DRAFTING_ASSISTANT";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly formalQualificationIssuanceId:
    string;

  readonly formalQualificationIssuanceDigest:
    string;

  readonly qualificationDigest: string;
  readonly templateDigest: string;
  readonly sourceManifestDigest: string;
  readonly skillToolValidationDigest: string;

  readonly sourceRegistryCreatedAt: string;

  readonly qualifiedManifest:
    AIEmployeeManifest;

  readonly authorityBoundary: Readonly<{
    formalQualificationBound: true;
    qualificationIntegrityVerified: true;
    canonicalTemplateBound: true;
    registryCreationTimeBound: true;
    tenantIdentityBound: true;
    ownerIdentityBound: true;

    registeredRolePreserved: true;
    registeredSkillsPreserved: true;
    registeredToolGrantsPreserved: true;
    registeredApprovalPolicyPreserved: true;
    registeredSafetyBoundariesPreserved: true;

    qualifiedManifestCreated: true;

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

  readonly createdAt: string;
  readonly manifestIssuanceDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

const EXPECTED_EMPLOYEE_ID =
  "employee-meera-quotation-proposal-specialist-v1" as const;

const EXPECTED_TEMPLATE_ID =
  "template-meera-quotation-proposal-specialist-v1" as const;

const EXPECTED_EMPLOYEE_CODE =
  "nx-sales-005" as const;

const EXPECTED_DISPLAY_NAME =
  "Meera" as const;

const EXPECTED_ROLE =
  "AI Quotation & Proposal Specialist" as const;

const EXPECTED_DEPARTMENT =
  "SALES" as const;

const EXPECTED_AUTONOMY_LEVEL =
  "DRAFTING_ASSISTANT" as const;

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
      "Unsupported deterministic Meera qualified-manifest value.",
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
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireIsoTimestamp(
  label: string,
  value: string,
): void {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function resolveCanonicalMeeraTemplate(
  registryCreatedAt: string,
): AIEmployeeTemplateRecord {
  const registry =
    createCoreLaunchEmployeeTemplateRegistry(
      registryCreatedAt,
    );

  const template =
    findAIEmployeeTemplate(
      registry,
      EXPECTED_TEMPLATE_ID,
    );

  if (template === undefined) {
    throw new Error(
      "Canonical registered Meera template was not found.",
    );
  }

  if (
    template.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    template.templateId !==
      EXPECTED_TEMPLATE_ID ||
    template.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    template.publicName !==
      EXPECTED_DISPLAY_NAME ||
    template.officialRole !==
      EXPECTED_ROLE ||
    template.department !==
      EXPECTED_DEPARTMENT ||
    template.manifest.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL ||
    template.status !==
      "REGISTERED_UNQUALIFIED" ||
    template.controlledActivationEligible !==
      false
  ) {
    throw new Error(
      "Canonical registered Meera template identity is invalid.",
    );
  }

  return template;
}

function validateQualificationEvidence(
  qualification:
    AIEmployeeQualificationReport,
): void {
  if (
    qualification.totalTestCases !== 100 ||
    qualification.passedTestCases !== 100 ||
    qualification
      .mandatoryCategoryCoveragePassed !==
        true ||
    qualification.everyTestCasePassed !==
      true ||
    qualification.qualificationPassed !==
      true ||
    qualification.ownerApproval.approved !==
      true
  ) {
    throw new Error(
      "Meera requires an owner-approved 100/100 passing qualification.",
    );
  }

  let totalCategoryCases = 0;

  for (
    const category of
    Object.keys(
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
    ) as
      AIEmployeeQualificationCategory[]
  ) {
    const expectedCount =
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
        category
      ];

    if (
      qualification.categoryCounts[
        category
      ] !== expectedCount
    ) {
      throw new Error(
        `Meera qualification category ${category} is not exact.`,
      );
    }

    totalCategoryCases +=
      qualification.categoryCounts[
        category
      ];
  }

  if (
    totalCategoryCases !==
      qualification.totalTestCases
  ) {
    throw new Error(
      "Meera qualification category totals do not match the report total.",
    );
  }

  if (
    qualification.safetyBoundary
      .syntheticQualificationBlocked !==
        true ||
    qualification.safetyBoundary
      .incompleteEvidenceBlocked !==
        true ||
    qualification.safetyBoundary
      .failedEvaluationBlocked !== true ||
    qualification.safetyBoundary
      .ownerApprovalRequired !== true ||
    qualification.safetyBoundary
      .tenantIsolationRequired !== true ||
    qualification.safetyBoundary
      .emergencyPauseRequired !== true ||
    qualification.safetyBoundary
      .externalDeliveryAuthorized !==
        false ||
    qualification.safetyBoundary
      .liveProviderExecutionAuthorized !==
        false ||
    qualification.safetyBoundary
      .paymentExecutionAuthorized !==
        false ||
    qualification.safetyBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Meera qualification safety boundary has been changed.",
    );
  }
}

function validateFormalQualification(
  input:
    CreateMeeraQualifiedEmployeeManifestIssuanceInput,

  template:
    AIEmployeeTemplateRecord,
): void {
  const formalQualification =
    input.formalQualification;

  validateMeeraFormalQualificationIssuance(
    formalQualification,
  );

  if (
    formalQualification.version !==
      MEERA_FORMAL_QUALIFICATION_ISSUANCE_VERSION ||
    formalQualification.issuanceState !==
      "FORMAL_QUALIFICATION_ISSUED" ||
    formalQualification.nextStep !==
      "PREPARE_QUALIFIED_EMPLOYEE_MANIFEST"
  ) {
    throw new Error(
      "A valid Workforce Day 52 Meera formal qualification issuance is required.",
    );
  }

  if (
    formalQualification.tenantId !==
      input.tenantId
  ) {
    throw new Error(
      "Cross-tenant Meera qualified manifest creation is blocked.",
    );
  }

  const qualification =
    formalQualification
      .qualificationReport;

  if (
    formalQualification.ownerId !==
      input.ownerId ||
    qualification.ownerApproval.ownerId !==
      input.ownerId
  ) {
    throw new Error(
      "Only the qualification-bound owner can create Meera's qualified manifest.",
    );
  }

  if (
    formalQualification.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    formalQualification.templateId !==
      EXPECTED_TEMPLATE_ID ||
    qualification.employeeId !==
      template.employeeId ||
    qualification.templateId !==
      template.templateId ||
    qualification.templateDigest !==
      template.templateDigest ||
    qualification.sourceManifestDigest !==
      template.manifest.manifestDigest ||
    formalQualification.qualificationDigest !==
      qualification.qualificationDigest
  ) {
    throw new Error(
      "Meera formal qualification does not belong to the canonical registered template at the evidence-bound registry creation time.",
    );
  }

  if (
    formalQualification.reportSummary
      .totalTestCases !== 100 ||
    formalQualification.reportSummary
      .passedTestCases !== 100 ||
    formalQualification.reportSummary
      .failedTestCases !== 0 ||
    formalQualification.reportSummary
      .qualificationEvidenceCount !== 100 ||
    formalQualification.reportSummary
      .assertionsExecuted !== 1300 ||
    formalQualification.reportSummary
      .assertionsPassed !== 1300 ||
    formalQualification.reportSummary
      .assertionsFailed !== 0 ||
    formalQualification.reportSummary
      .qualificationPassed !== true
  ) {
    throw new Error(
      "Workforce Day 52 Meera qualification summary is incomplete.",
    );
  }

  validateQualificationEvidence(
    qualification,
  );

  const authority =
    formalQualification
      .authorityBoundary;

  if (
    authority
      .registeredUnqualifiedTemplateBound !==
        true ||
    authority.formalPlanBound !== true ||
    authority.formalFixturePackBound !==
      true ||
    authority.executionEvidenceBound !==
      true ||
    authority
      .independentEvaluatorEvidenceVerified !==
        true ||
    authority.ownerApprovalDecisionBound !==
      true ||
    authority
      .qualificationEngineInvocationAuthorized !==
        true ||
    authority.qualificationEngineInvoked !==
      true ||
    authority.qualificationReportCreated !==
      true ||
    authority.formalQualificationIssued !==
      true ||
    authority.qualificationPassed !== true ||
    authority.qualifiedManifestCreated !==
      false ||
    authority.activationCandidateCreated !==
      false ||
    authority.ownerActivationRecorded !==
      false ||
    authority.runtimeActivated !== false ||
    authority.controlledWorkAuthorized !==
      false ||
    authority
      .realCustomerDataAccessAuthorized !==
        false ||
    authority
      .realCustomerContactAuthorized !==
        false ||
    authority.externalDeliveryAuthorized !==
      false ||
    authority
      .liveProviderExecutionAuthorized !==
        false ||
    authority.productionDatabaseAuthorized !==
      false ||
    authority.productionMutationAuthorized !==
      false ||
    authority.paymentExecutionAuthorized !==
      false ||
    authority.autonomousDecisionAuthorized !==
      false ||
    authority.productionReadinessAuthorized !==
      false ||
    authority.publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Workforce Day 52 Meera authority boundary has been changed.",
    );
  }

  if (
    formalQualification.qualifiedAt !==
      qualification.qualifiedAt
  ) {
    throw new Error(
      "Meera formal qualification time does not match its qualification report.",
    );
  }

  if (
    Date.parse(
      input.registryCreatedAt,
    ) >
      Date.parse(
        formalQualification.qualifiedAt,
      )
  ) {
    throw new Error(
      "Meera source registry cannot be created after formal qualification.",
    );
  }

  if (
    Date.parse(input.createdAt) <
      Date.parse(
        formalQualification.qualifiedAt,
      )
  ) {
    throw new Error(
      "Meera qualified manifest creation cannot precede formal qualification.",
    );
  }
}

function validatePreservedManifest(
  template:
    AIEmployeeTemplateRecord,

  qualification:
    AIEmployeeQualificationReport,

  qualifiedManifest:
    AIEmployeeManifest,
): void {
  const source =
    template.manifest;

  if (
    qualifiedManifest.employeeId !==
      source.employeeId ||
    qualifiedManifest.templateId !==
      source.templateId ||
    qualifiedManifest.displayName !==
      source.displayName ||
    qualifiedManifest.department !==
      source.department ||
    qualifiedManifest.roleTitle !==
      source.roleTitle ||
    qualifiedManifest.roleCharter !==
      source.roleCharter ||
    qualifiedManifest.autonomyLevel !==
      source.autonomyLevel
  ) {
    throw new Error(
      "Qualified manifest changed Meera's registered identity or role.",
    );
  }

  if (
    stableStringify(
      qualifiedManifest.skills,
    ) !==
      stableStringify(
        source.skills,
      ) ||
    stableStringify(
      qualifiedManifest.toolGrants,
    ) !==
      stableStringify(
        source.toolGrants,
      ) ||
    stableStringify(
      qualifiedManifest.knowledgePolicy,
    ) !==
      stableStringify(
        source.knowledgePolicy,
      ) ||
    stableStringify(
      qualifiedManifest.approvalPolicy,
    ) !==
      stableStringify(
        source.approvalPolicy,
      ) ||
    stableStringify(
      qualifiedManifest.kpis,
    ) !==
      stableStringify(
        source.kpis,
      ) ||
    stableStringify(
      qualifiedManifest.escalationPolicy,
    ) !==
      stableStringify(
        source.escalationPolicy,
      ) ||
    stableStringify(
      qualifiedManifest.auditPolicy,
    ) !==
      stableStringify(
        source.auditPolicy,
      )
  ) {
    throw new Error(
      "Qualified manifest changed Meera's registered operating contract.",
    );
  }

  if (
    qualifiedManifest.evaluation.status !==
      "QUALIFIED" ||
    qualifiedManifest.evaluation
      .testCasesPassed !==
      qualification.passedTestCases ||
    qualifiedManifest.evaluation
      .testCasesRequired !==
      qualification.totalTestCases ||
    qualifiedManifest.evaluation
      .adversarialTestsPassed !== true ||
    qualifiedManifest.evaluation
      .tenantIsolationPassed !== true ||
    qualifiedManifest.evaluation
      .ownerControlPassed !== true ||
    qualifiedManifest.evaluation
      .emergencyPausePassed !== true
  ) {
    throw new Error(
      "Qualified Meera manifest evaluation does not match the qualification report.",
    );
  }

  if (
    qualifiedManifest.safetyBoundary
      .ownerControlled !== true ||
    qualifiedManifest.safetyBoundary
      .emergencyPauseRequired !== true ||
    qualifiedManifest.safetyBoundary
      .crossTenantAccessAuthorized !==
        false ||
    qualifiedManifest.safetyBoundary
      .liveProviderExecutionAuthorized !==
        false ||
    qualifiedManifest.safetyBoundary
      .externalDeliveryAuthorized !==
        false ||
    qualifiedManifest.safetyBoundary
      .paymentExecutionAuthorized !==
        false ||
    qualifiedManifest.safetyBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Qualified Meera manifest safety boundary has been changed.",
    );
  }
}

export function validateMeeraQualifiedEmployeeManifestIssuance(
  issuance:
    MeeraQualifiedEmployeeManifestIssuance,
): void {
  if (
    issuance.version !==
      MEERA_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION ||
    issuance.issuanceState !==
      "QUALIFIED_EMPLOYEE_MANIFEST_CREATED" ||
    issuance.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    issuance.templateId !==
      EXPECTED_TEMPLATE_ID ||
    issuance.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    issuance.displayName !==
      EXPECTED_DISPLAY_NAME ||
    issuance.officialRole !==
      EXPECTED_ROLE ||
    issuance.department !==
      EXPECTED_DEPARTMENT ||
    issuance.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Meera qualified employee manifest issuance identity is invalid.",
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "manifestIssuanceId",
        issuance.manifestIssuanceId,
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
        "formalQualificationIssuanceId",
        issuance
          .formalQualificationIssuanceId,
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
        "formalQualificationIssuanceDigest",
        issuance
          .formalQualificationIssuanceDigest,
      ],
      [
        "qualificationDigest",
        issuance.qualificationDigest,
      ],
      [
        "templateDigest",
        issuance.templateDigest,
      ],
      [
        "sourceManifestDigest",
        issuance.sourceManifestDigest,
      ],
      [
        "skillToolValidationDigest",
        issuance.skillToolValidationDigest,
      ],
      [
        "qualifiedManifestDigest",
        issuance.qualifiedManifest
          .manifestDigest,
      ],
    ] as const
  ) {
    requireDigest(
      label,
      value,
    );
  }

  requireIsoTimestamp(
    "Meera source registry creation time",
    issuance.sourceRegistryCreatedAt,
  );

  requireIsoTimestamp(
    "Meera qualified manifest creation time",
    issuance.createdAt,
  );

  if (
    issuance.qualifiedManifest.employeeId !==
      issuance.employeeId ||
    issuance.qualifiedManifest.templateId !==
      issuance.templateId ||
    issuance.qualifiedManifest.displayName !==
      issuance.displayName ||
    issuance.qualifiedManifest.department !==
      issuance.department ||
    issuance.qualifiedManifest.roleTitle !==
      issuance.officialRole ||
    issuance.qualifiedManifest.autonomyLevel !==
      issuance.autonomyLevel ||
    issuance.qualifiedManifest.evaluation
      .status !== "QUALIFIED" ||
    issuance.qualifiedManifest.evaluation
      .testCasesPassed !== 100 ||
    issuance.qualifiedManifest.evaluation
      .testCasesRequired !== 100
  ) {
    throw new Error(
      "Meera qualified manifest record is invalid.",
    );
  }

  const boundary =
    issuance.authorityBoundary;

  if (
    boundary.formalQualificationBound !==
      true ||
    boundary
      .qualificationIntegrityVerified !==
        true ||
    boundary.canonicalTemplateBound !==
      true ||
    boundary.registryCreationTimeBound !==
      true ||
    boundary.tenantIdentityBound !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.registeredRolePreserved !==
      true ||
    boundary.registeredSkillsPreserved !==
      true ||
    boundary.registeredToolGrantsPreserved !==
      true ||
    boundary
      .registeredApprovalPolicyPreserved !==
        true ||
    boundary
      .registeredSafetyBoundariesPreserved !==
        true ||
    boundary.qualifiedManifestCreated !==
      true ||
    boundary.activationCandidateCreated !==
      false ||
    boundary.ownerActivationRecorded !==
      false ||
    boundary.runtimeActivated !== false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary
      .realCustomerDataAccessAuthorized !==
        false ||
    boundary
      .realCustomerContactAuthorized !==
        false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary
      .liveProviderExecutionAuthorized !==
        false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Meera qualified manifest authority boundary is invalid.",
    );
  }

  const {
    manifestIssuanceDigest,
    ...issuanceCore
  } = issuance;

  if (
    !SHA_256_PATTERN.test(
      manifestIssuanceDigest,
    ) ||
    manifestIssuanceDigest !==
      sha256(issuanceCore)
  ) {
    throw new Error(
      "Meera qualified employee manifest issuance integrity is invalid.",
    );
  }
}

export function createMeeraQualifiedEmployeeManifestIssuance(
  input:
    CreateMeeraQualifiedEmployeeManifestIssuanceInput,
): MeeraQualifiedEmployeeManifestIssuance {
  requireIdentifier(
    "Meera qualified manifest issuanceId",
    input.manifestIssuanceId,
  );

  requireIdentifier(
    "Meera qualified manifest tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "Meera qualified manifest ownerId",
    input.ownerId,
  );

  requireIsoTimestamp(
    "Meera source registry creation time",
    input.registryCreatedAt,
  );

  requireIsoTimestamp(
    "Meera qualified manifest creation time",
    input.createdAt,
  );

  const template =
    resolveCanonicalMeeraTemplate(
      input.registryCreatedAt,
    );

  validateFormalQualification(
    input,
    template,
  );

  const qualification =
    input.formalQualification
      .qualificationReport;

  const qualifiedManifest =
    createQualifiedAIEmployeeManifest(
      template,
      qualification,
    );

  validatePreservedManifest(
    template,
    qualification,
    qualifiedManifest,
  );

  const issuanceCore = {
    version:
      MEERA_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION,

    manifestIssuanceId:
      input.manifestIssuanceId,

    issuanceState:
      "QUALIFIED_EMPLOYEE_MANIFEST_CREATED" as const,

    employeeId:
      EXPECTED_EMPLOYEE_ID,

    templateId:
      EXPECTED_TEMPLATE_ID,

    employeeCode:
      EXPECTED_EMPLOYEE_CODE,

    displayName:
      EXPECTED_DISPLAY_NAME,

    officialRole:
      EXPECTED_ROLE,

    department:
      EXPECTED_DEPARTMENT,

    autonomyLevel:
      EXPECTED_AUTONOMY_LEVEL,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    formalQualificationIssuanceId:
      input.formalQualification
        .issuanceId,

    formalQualificationIssuanceDigest:
      input.formalQualification
        .issuanceDigest,

    qualificationDigest:
      qualification
        .qualificationDigest,

    templateDigest:
      template.templateDigest,

    sourceManifestDigest:
      template.manifest
        .manifestDigest,

    skillToolValidationDigest:
      template.skillToolValidationDigest,

    sourceRegistryCreatedAt:
      input.registryCreatedAt,

    qualifiedManifest,

    authorityBoundary: {
      formalQualificationBound:
        true as const,

      qualificationIntegrityVerified:
        true as const,

      canonicalTemplateBound:
        true as const,

      registryCreationTimeBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      registeredRolePreserved:
        true as const,

      registeredSkillsPreserved:
        true as const,

      registeredToolGrantsPreserved:
        true as const,

      registeredApprovalPolicyPreserved:
        true as const,

      registeredSafetyBoundariesPreserved:
        true as const,

      qualifiedManifestCreated:
        true as const,

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

    createdAt:
      input.createdAt,
  };

  const issuance =
    deepFreeze({
      ...issuanceCore,

      manifestIssuanceDigest:
        sha256(issuanceCore),
    }) as MeeraQualifiedEmployeeManifestIssuance;

  validateMeeraQualifiedEmployeeManifestIssuance(
    issuance,
  );

  return issuance;
}
