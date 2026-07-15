import {
  createHash,
} from "node:crypto";

import type {
  AIEmployeeManifest,
} from "./aiEmployeeManifest";

import {
  ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION,
  type AshaFormalQualificationIssuance,
} from "./ashaFormalQualificationIssuance";

import {
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  AI_EMPLOYEE_QUALIFICATION_VERSION,
  createQualifiedAIEmployeeManifest,
  type AIEmployeeQualificationCategory,
  type AIEmployeeQualificationReport,
} from "./employeeQualification";

import {
  ASHA_INQUIRY_INTAKE_TEMPLATE,
  createCoreLaunchEmployeeTemplateRegistry,
  findAIEmployeeTemplate,
  type AIEmployeeTemplateRecord,
} from "./employeeTemplateRegistry";

export const ASHA_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION =
  "nexus-asha-qualified-employee-manifest-issuance-v1" as const;

export interface CreateAshaQualifiedEmployeeManifestIssuanceInput {
  readonly manifestIssuanceId: string;
  readonly formalQualification:
    AshaFormalQualificationIssuance;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly createdAt: string;
}

export interface AshaQualifiedEmployeeManifestIssuance {
  readonly version:
    typeof ASHA_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION;
  readonly manifestIssuanceId: string;
  readonly issuanceState:
    "QUALIFIED_EMPLOYEE_MANIFEST_CREATED";
  readonly employeeId:
    "employee-asha-inquiry-intake-v1";
  readonly templateId:
    "template-asha-inquiry-intake-v1";
  readonly employeeCode:
    "nx-sales-003";
  readonly displayName:
    "Asha";
  readonly officialRole:
    "AI Inquiry Intake Executive";
  readonly department:
    "SALES";
  readonly autonomyLevel:
    "DRAFTING_ASSISTANT";
  readonly tenantId: string;
  readonly ownerId: string;
  readonly formalQualificationIssuanceId: string;
  readonly formalQualificationIssuanceDigest: string;
  readonly qualificationDigest: string;
  readonly templateDigest: string;
  readonly sourceManifestDigest: string;
  readonly qualifiedManifest:
    AIEmployeeManifest;
  readonly authorityBoundary: Readonly<{
    formalQualificationBound: true;
    qualificationIntegrityVerified: true;
    canonicalTemplateBound: true;
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
  "employee-asha-inquiry-intake-v1" as const;

const EXPECTED_TEMPLATE_ID =
  "template-asha-inquiry-intake-v1" as const;

const EXPECTED_EMPLOYEE_CODE =
  "nx-sales-003" as const;

const EXPECTED_DISPLAY_NAME =
  "Asha" as const;

const EXPECTED_ROLE =
  "AI Inquiry Intake Executive" as const;

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
      "Unsupported deterministic qualified-manifest value.",
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
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireIsoDate(
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

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA_256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function resolveCanonicalAshaTemplate(
  createdAt: string,
): AIEmployeeTemplateRecord {
  const registry =
    createCoreLaunchEmployeeTemplateRegistry(
      createdAt,
    );

  const template =
    findAIEmployeeTemplate(
      registry,
      EXPECTED_TEMPLATE_ID,
    );

  if (!template) {
    throw new Error(
      "Canonical registered Asha template was not found.",
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
    template.status !==
      "REGISTERED_UNQUALIFIED" ||
    template.controlledActivationEligible !==
      false
  ) {
    throw new Error(
      "Canonical registered Asha template identity is invalid.",
    );
  }

  if (
    template.manifest.employeeId !==
      ASHA_INQUIRY_INTAKE_TEMPLATE
        .manifestInput.employeeId ||
    template.manifest.templateId !==
      ASHA_INQUIRY_INTAKE_TEMPLATE
        .manifestInput.templateId ||
    template.manifest.displayName !==
      ASHA_INQUIRY_INTAKE_TEMPLATE
        .manifestInput.displayName ||
    template.manifest.department !==
      ASHA_INQUIRY_INTAKE_TEMPLATE
        .manifestInput.department ||
    template.manifest.roleTitle !==
      ASHA_INQUIRY_INTAKE_TEMPLATE
        .manifestInput.roleTitle ||
    template.manifest.autonomyLevel !==
      ASHA_INQUIRY_INTAKE_TEMPLATE
        .manifestInput.autonomyLevel
  ) {
    throw new Error(
      "Canonical Asha manifest identity does not match the registered template.",
    );
  }

  return template;
}

function validateQualificationEvidence(
  qualification:
    AIEmployeeQualificationReport,
): void {
  if (
    qualification.totalTestCases !==
      100 ||
    qualification.passedTestCases !==
      100 ||
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
      "Asha requires an owner-approved 100/100 passing qualification.",
    );
  }

  requireIdentifier(
    "qualification owner ID",
    qualification.ownerApproval.ownerId,
  );

  requireIsoDate(
    "qualification owner approval time",
    qualification.ownerApproval.approvedAt,
  );

  requireIsoDate(
    "qualification time",
    qualification.qualifiedAt,
  );

  if (
    Date.parse(
      qualification.ownerApproval.approvedAt,
    ) >
    Date.parse(
      qualification.qualifiedAt,
    )
  ) {
    throw new Error(
      "Qualification cannot precede owner approval.",
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
        `Qualification category ${category} is not exact.`,
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
      "Qualification category totals do not match the report total.",
    );
  }
}

function validateFormalQualification(
  input:
    CreateAshaQualifiedEmployeeManifestIssuanceInput,
  template:
    AIEmployeeTemplateRecord,
): void {
  const formalQualification =
    input.formalQualification;

  if (
    formalQualification.version !==
      ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION ||
    formalQualification.issuanceState !==
      "FORMAL_QUALIFICATION_ISSUED" ||
    formalQualification.nextStep !==
      "PREPARE_QUALIFIED_EMPLOYEE_MANIFEST"
  ) {
    throw new Error(
      "A Day 18 formal qualification issuance is required.",
    );
  }

  requireDigest(
    "formal qualification issuance digest",
    formalQualification.issuanceDigest,
  );

  requireDigest(
    "formal qualification digest",
    formalQualification.qualificationDigest,
  );

  const {
    issuanceDigest,
    ...formalQualificationCore
  } = formalQualification;

  if (
    sha256(
      formalQualificationCore,
    ) !== issuanceDigest
  ) {
    throw new Error(
      "Day 18 formal qualification issuance integrity verification failed.",
    );
  }

  const qualification =
    formalQualification.qualificationReport;

  if (
    qualification.version !==
      AI_EMPLOYEE_QUALIFICATION_VERSION
  ) {
    throw new Error(
      "Asha qualification report version is invalid.",
    );
  }

  requireDigest(
    "qualification report digest",
    qualification.qualificationDigest,
  );

if (
    formalQualification.tenantId !==
      input.tenantId
  ) {
    throw new Error(
      "Cross-tenant qualified manifest creation is blocked.",
    );
  }

  if (
    formalQualification.ownerId !==
      input.ownerId ||
    qualification.ownerApproval.ownerId !==
      input.ownerId
  ) {
    throw new Error(
      "Only the qualification-bound owner can create the qualified manifest.",
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
      "Formal qualification does not belong to the canonical registered Asha template.",
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
      .mandatoryCategoryCoveragePassed !==
      true ||
    formalQualification.reportSummary
      .everyTestCasePassed !== true ||
    formalQualification.reportSummary
      .ownerApprovalRecorded !== true ||
    formalQualification.reportSummary
      .qualificationPassed !== true
  ) {
    throw new Error(
      "Day 18 formal qualification summary is not a 100/100 pass.",
    );
  }

  validateQualificationEvidence(
    qualification,
  );

  if (
    qualification.safetyBoundary
      .syntheticQualificationBlocked !==
      true ||
    qualification.safetyBoundary
      .incompleteEvidenceBlocked !==
      true ||
    qualification.safetyBoundary
      .failedEvaluationBlocked !==
      true ||
    qualification.safetyBoundary
      .ownerApprovalRequired !==
      true ||
    qualification.safetyBoundary
      .tenantIsolationRequired !==
      true ||
    qualification.safetyBoundary
      .emergencyPauseRequired !==
      true ||
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
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Qualification safety boundary has been changed.",
    );
  }

  const authority =
    formalQualification.authorityBoundary;

  if (
    authority
      .registeredUnqualifiedTemplateBound !==
      true ||
    authority.executionEvidenceBound !==
      true ||
    authority
      .independentEvaluatorEvidenceVerified !==
      true ||
    authority
      .ownerApprovalDecisionBound !==
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
    authority.qualificationPassed !==
      true ||
    authority.qualifiedManifestCreated !==
      false ||
    authority.activationCandidateCreated !==
      false ||
    authority.ownerActivationRecorded !==
      false ||
    authority.runtimeActivated !==
      false ||
    authority.controlledWorkAuthorized !==
      false ||
    authority.customerDataAccessAuthorized !==
      false ||
    authority.customerContactAuthorized !==
      false ||
    authority.externalDeliveryAuthorized !==
      false ||
    authority.liveProviderExecutionAuthorized !==
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
    authority.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Day 18 authority boundary has been changed.",
    );
  }

  if (
    formalQualification.qualifiedAt !==
      qualification.qualifiedAt
  ) {
    throw new Error(
      "Formal qualification time does not match the qualification report.",
    );
  }

  if (
    Date.parse(input.createdAt) <
    Date.parse(
      formalQualification.qualifiedAt,
    )
  ) {
    throw new Error(
      "Qualified manifest creation cannot precede formal qualification.",
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
      "Qualified manifest changed Asha's registered identity or role.",
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
      "Qualified manifest changed Asha's registered operating contract.",
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
      .adversarialTestsPassed !==
      true ||
    qualifiedManifest.evaluation
      .tenantIsolationPassed !==
      true ||
    qualifiedManifest.evaluation
      .ownerControlPassed !==
      true ||
    qualifiedManifest.evaluation
      .emergencyPausePassed !==
      true
  ) {
    throw new Error(
      "Qualified manifest evaluation does not match the qualification report.",
    );
  }

  if (
    qualifiedManifest.safetyBoundary
      .ownerControlled !== true ||
    qualifiedManifest.safetyBoundary
      .emergencyPauseRequired !==
      true ||
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
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Qualified manifest safety boundary has been changed.",
    );
  }
}

export function createAshaQualifiedEmployeeManifestIssuance(
  input:
    CreateAshaQualifiedEmployeeManifestIssuanceInput,
): AshaQualifiedEmployeeManifestIssuance {
  requireIdentifier(
    "qualified manifest issuanceId",
    input.manifestIssuanceId,
  );

  requireIdentifier(
    "qualified manifest tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "qualified manifest ownerId",
    input.ownerId,
  );

  requireIsoDate(
    "qualified manifest creation time",
    input.createdAt,
  );

  const template =
    resolveCanonicalAshaTemplate(
      input.createdAt,
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
      ASHA_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION,
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
    qualifiedManifest,
    authorityBoundary: {
      formalQualificationBound:
        true,
      qualificationIntegrityVerified:
        true,
      canonicalTemplateBound:
        true,
      tenantIdentityBound:
        true,
      ownerIdentityBound:
        true,
      registeredRolePreserved:
        true,
      registeredSkillsPreserved:
        true,
      registeredToolGrantsPreserved:
        true,
      registeredApprovalPolicyPreserved:
        true,
      registeredSafetyBoundariesPreserved:
        true,
      qualifiedManifestCreated:
        true,
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
    createdAt:
      input.createdAt,
  };

  const issuance:
    AshaQualifiedEmployeeManifestIssuance = {
      ...issuanceCore,
      manifestIssuanceDigest:
        sha256(issuanceCore),
    };

  return deepFreeze(
    issuance,
  ) as AshaQualifiedEmployeeManifestIssuance;
}
