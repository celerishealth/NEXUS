import {
  createHash,
} from "node:crypto";

import {
  createQualifiedAIEmployeeManifest,
} from "./employeeQualification";

import {
  type AIEmployeeManifest,
} from "./aiEmployeeManifest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
} from "./engineeringAIWorkforceFormalQualificationTestPlan";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY,
} from "./engineeringAIWorkforceTemplateCreationExecution";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE,
  validateEngineeringAIWorkforceFormalQualificationIssuance,
} from "./engineeringAIWorkforceFormalQualificationIssuance";

export const ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION =
  "nexus-engineering-ai-workforce-qualified-employee-manifest-issuance-v1" as const;

export interface CreateEngineeringAIWorkforceQualifiedEmployeeManifestIssuanceInput {
  readonly manifestIssuanceId:
    string;

  readonly formalQualificationIssuance:
    typeof ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE;

  readonly templateRegistry:
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY;

  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly createdAt: string;
}

export interface EngineeringAIWorkforceCandidateQualifiedEmployeeManifestIssuance {
  readonly developmentSequence:
    number;

  readonly issuanceState:
    "ENGINEERING_CANDIDATE_QUALIFIED_EMPLOYEE_MANIFEST_CREATED";

  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;

  readonly templateId: string;
  readonly templateDigest: string;

  readonly formalQualificationCandidateIssuanceDigest:
    string;

  readonly qualificationDigest:
    string;

  readonly sourceManifestDigest:
    string;

  readonly qualifiedManifest:
    AIEmployeeManifest;

  readonly qualifiedManifestDigest:
    string;

  readonly authorityBoundary: Readonly<{
    formalQualificationBound:
      true;

    qualificationIntegrityVerified:
      true;

    canonicalTemplateBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    registeredIdentityPreserved:
      true;

    registeredRolePreserved:
      true;

    registeredSkillsPreserved:
      true;

    registeredToolGrantsPreserved:
      true;

    registeredKnowledgePolicyPreserved:
      true;

    registeredApprovalPolicyPreserved:
      true;

    registeredEscalationPolicyPreserved:
      true;

    registeredAuditPolicyPreserved:
      true;

    registeredSafetyBoundariesPreserved:
      true;

    qualifiedManifestCreated:
      true;

    activationCandidateCreated:
      false;

    ownerActivationRecorded:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly candidateManifestIssuanceDigest:
    string;
}

export interface EngineeringAIWorkforceQualifiedEmployeeManifestIssuance {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION;

  readonly manifestIssuanceId:
    string;

  readonly issuanceState:
    "ENGINEERING_QUALIFIED_EMPLOYEE_MANIFESTS_CREATED";

  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly sourceFormalQualificationIssuanceId:
    string;

  readonly sourceFormalQualificationIssuanceDigest:
    string;

  readonly sourceTemplateRegistryDigest:
    string;

  readonly candidateManifestCount:
    8;

  readonly candidateManifests:
    readonly EngineeringAIWorkforceCandidateQualifiedEmployeeManifestIssuance[];

  readonly aggregateSummary: Readonly<{
    formallyQualifiedCandidateCount:
      8;

    qualifiedManifestCount:
      8;

    qualifiedEvaluationCount:
      8;

    totalQualificationCasesPassed:
      800;

    exactEightQualifiedManifestsCreated:
      true;

    exactCandidateSequencePreserved:
      true;

    exactRegisteredIdentitiesPreserved:
      true;

    exactRegisteredRolesPreserved:
      true;

    exactRegisteredSkillsPreserved:
      true;

    exactRegisteredToolGrantsPreserved:
      true;

    exactRegisteredSafetyBoundariesPreserved:
      true;

    uniqueQualifiedManifestDigests:
      8;

    activationCandidatesCreated:
      0;

    runtimesActivated:
      0;

    controlledWorkAuthorizations:
      0;
  }>;

  readonly nextStep:
    "PREPARE_ENGINEERING_ACTIVATION_CANDIDATES";

  readonly authorityBoundary: Readonly<{
    canonicalFormalQualificationBound:
      true;

    canonicalTemplateRegistryBound:
      true;

    exactEightCandidatesRequired:
      true;

    formalQualificationIssued:
      true;

    qualifiedManifestCreated:
      true;

    activationCandidatePreparationAuthorized:
      false;

    activationCandidateCreated:
      false;

    ownerActivationRecorded:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly createdAt: string;

  readonly manifestIssuanceDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((entry) =>
          stableStringify(entry),
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
            `${JSON.stringify(key)}:${stableStringify(record[key])}`,
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Engineering qualified-manifest issuance value.",
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
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (!SAFE_IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
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
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireUnique(
  label: string,
  values: readonly string[],
): void {
  if (
    new Set(values).size !==
      values.length
  ) {
    throw new Error(
      `${label} must remain unique.`,
    );
  }
}

function validatePreservedManifest(
  source:
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY.templates[number],

  qualifiedManifest:
    AIEmployeeManifest,
): void {
  if (
    qualifiedManifest.employeeId !==
      source.employeeId ||
    qualifiedManifest.templateId !==
      source.templateId ||
    qualifiedManifest.displayName !==
      source.manifest.displayName ||
    qualifiedManifest.department !==
      source.manifest.department ||
    qualifiedManifest.roleTitle !==
      source.manifest.roleTitle ||
    qualifiedManifest.roleCharter !==
      source.manifest.roleCharter ||
    qualifiedManifest.autonomyLevel !==
      source.manifest.autonomyLevel ||
    stableStringify(
      qualifiedManifest.skills,
    ) !==
      stableStringify(
        source.manifest.skills,
      ) ||
    stableStringify(
      qualifiedManifest.toolGrants,
    ) !==
      stableStringify(
        source.manifest.toolGrants,
      ) ||
    stableStringify(
      qualifiedManifest.knowledgePolicy,
    ) !==
      stableStringify(
        source.manifest.knowledgePolicy,
      ) ||
    stableStringify(
      qualifiedManifest.approvalPolicy,
    ) !==
      stableStringify(
        source.manifest.approvalPolicy,
      ) ||
    stableStringify(
      qualifiedManifest.kpis,
    ) !==
      stableStringify(
        source.manifest.kpis,
      ) ||
    stableStringify(
      qualifiedManifest.escalationPolicy,
    ) !==
      stableStringify(
        source.manifest.escalationPolicy,
      ) ||
    stableStringify(
      qualifiedManifest.auditPolicy,
    ) !==
      stableStringify(
        source.manifest.auditPolicy,
      ) ||
    qualifiedManifest.createdAt !==
      source.manifest.createdAt ||
    qualifiedManifest.evaluation.status !==
      "QUALIFIED" ||
    qualifiedManifest.evaluation
      .testCasesPassed !==
        100 ||
    qualifiedManifest.evaluation
      .testCasesRequired !==
        100 ||
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
        true ||
    qualifiedManifest.safetyBoundary
      .ownerControlled !==
        true ||
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
      "Engineering qualified manifest did not preserve the registered employee contract.",
    );
  }
}

export function validateEngineeringAIWorkforceQualifiedEmployeeManifestIssuance(
  issuance:
    EngineeringAIWorkforceQualifiedEmployeeManifestIssuance,
): void {
  validateEngineeringAIWorkforceFormalQualificationIssuance(
    ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE,
  );

  requireIdentifier(
    "Engineering qualified-manifest issuance ID",
    issuance.manifestIssuanceId,
  );

  requireTimestamp(
    "Engineering qualified-manifest issuance time",
    issuance.createdAt,
  );

  requireDigest(
    "Engineering qualified-manifest issuance digest",
    issuance.manifestIssuanceDigest,
  );

  if (
    issuance.version !==
      ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION ||
    issuance.issuanceState !==
      "ENGINEERING_QUALIFIED_EMPLOYEE_MANIFESTS_CREATED" ||
    issuance.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID ||
    issuance.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    issuance.sourceFormalQualificationIssuanceId !==
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
        .issuanceId ||
    issuance.sourceFormalQualificationIssuanceDigest !==
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
        .issuanceDigest ||
    issuance.sourceTemplateRegistryDigest !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY
        .registryDigest ||
    issuance.candidateManifestCount !==
      8 ||
    issuance.candidateManifests.length !==
      8
  ) {
    throw new Error(
      "Engineering qualified-manifest issuance identity is invalid.",
    );
  }

  requireUnique(
    "Engineering qualified-manifest employee IDs",
    issuance.candidateManifests.map(
      (record) =>
        record.employeeId,
    ),
  );

  requireUnique(
    "Engineering qualified-manifest digests",
    issuance.candidateManifests.map(
      (record) =>
        record.qualifiedManifestDigest,
    ),
  );

  requireUnique(
    "Engineering candidate manifest issuance digests",
    issuance.candidateManifests.map(
      (record) =>
        record.candidateManifestIssuanceDigest,
    ),
  );

  issuance.candidateManifests.forEach(
    (
      record,
      index,
    ) => {
      const template =
        ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY
          .templates[index];

      const qualification =
        ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
          .candidateIssuances[index];

      if (
        !template ||
        !qualification
      ) {
        throw new Error(
          "Engineering qualified-manifest source binding is missing.",
        );
      }

      requireDigest(
        "Engineering candidate manifest issuance digest",
        record.candidateManifestIssuanceDigest,
      );

      requireDigest(
        "Engineering qualified manifest digest",
        record.qualifiedManifestDigest,
      );

      const {
        candidateManifestIssuanceDigest,
        ...recordCore
      } = record;

      const boundary =
        record.authorityBoundary;

      if (
        sha256(recordCore) !==
          candidateManifestIssuanceDigest ||
        record.developmentSequence !==
          index + 1 ||
        record.issuanceState !==
          "ENGINEERING_CANDIDATE_QUALIFIED_EMPLOYEE_MANIFEST_CREATED" ||
        record.employeeId !==
          template.employeeId ||
        record.employeeId !==
          qualification.employeeId ||
        record.employeeCode !==
          template.employeeCode ||
        record.employeeCode !==
          qualification.employeeCode ||
        record.publicName !==
          template.publicName ||
        record.publicName !==
          qualification.publicName ||
        record.officialRole !==
          template.officialRole ||
        record.officialRole !==
          qualification.officialRole ||
        record.templateId !==
          template.templateId ||
        record.templateId !==
          qualification.templateId ||
        record.templateDigest !==
          template.templateDigest ||
        record.templateDigest !==
          qualification.templateDigest ||
        record.formalQualificationCandidateIssuanceDigest !==
          qualification.candidateIssuanceDigest ||
        record.qualificationDigest !==
          qualification.qualificationDigest ||
        record.sourceManifestDigest !==
          template.manifest.manifestDigest ||
        record.qualifiedManifestDigest !==
          record.qualifiedManifest.manifestDigest
      ) {
        throw new Error(
          "Engineering candidate qualified-manifest binding is invalid.",
        );
      }

      validatePreservedManifest(
        template,
        record.qualifiedManifest,
      );

      if (
        boundary.formalQualificationBound !==
          true ||
        boundary.qualificationIntegrityVerified !==
          true ||
        boundary.canonicalTemplateBound !==
          true ||
        boundary.tenantIdentityBound !==
          true ||
        boundary.ownerIdentityBound !==
          true ||
        boundary.registeredIdentityPreserved !==
          true ||
        boundary.registeredRolePreserved !==
          true ||
        boundary.registeredSkillsPreserved !==
          true ||
        boundary.registeredToolGrantsPreserved !==
          true ||
        boundary.registeredKnowledgePolicyPreserved !==
          true ||
        boundary.registeredApprovalPolicyPreserved !==
          true ||
        boundary.registeredEscalationPolicyPreserved !==
          true ||
        boundary.registeredAuditPolicyPreserved !==
          true ||
        boundary.registeredSafetyBoundariesPreserved !==
          true ||
        boundary.qualifiedManifestCreated !==
          true ||
        boundary.activationCandidateCreated !==
          false ||
        boundary.ownerActivationRecorded !==
          false ||
        boundary.runtimeActivated !==
          false ||
        boundary.controlledWorkAuthorized !==
          false ||
        boundary.repositoryReadAuthorized !==
          false ||
        boundary.repositoryWriteAuthorized !==
          false ||
        boundary.productionDeploymentAuthorized !==
          false ||
        boundary.realCustomerDataAccessAuthorized !==
          false ||
        boundary.realCustomerContactAuthorized !==
          false ||
        boundary.externalDeliveryAuthorized !==
          false ||
        boundary.liveProviderExecutionAuthorized !==
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
        boundary.publicLaunchAuthorized !==
          false
      ) {
        throw new Error(
          "Engineering candidate qualified-manifest authority boundary is invalid.",
        );
      }
    },
  );

  const summary =
    issuance.aggregateSummary;

  if (
    summary.formallyQualifiedCandidateCount !==
      8 ||
    summary.qualifiedManifestCount !==
      8 ||
    summary.qualifiedEvaluationCount !==
      8 ||
    summary.totalQualificationCasesPassed !==
      800 ||
    summary.exactEightQualifiedManifestsCreated !==
      true ||
    summary.exactCandidateSequencePreserved !==
      true ||
    summary.exactRegisteredIdentitiesPreserved !==
      true ||
    summary.exactRegisteredRolesPreserved !==
      true ||
    summary.exactRegisteredSkillsPreserved !==
      true ||
    summary.exactRegisteredToolGrantsPreserved !==
      true ||
    summary.exactRegisteredSafetyBoundariesPreserved !==
      true ||
    summary.uniqueQualifiedManifestDigests !==
      8 ||
    summary.activationCandidatesCreated !==
      0 ||
    summary.runtimesActivated !==
      0 ||
    summary.controlledWorkAuthorizations !==
      0
  ) {
    throw new Error(
      "Engineering qualified-manifest aggregate summary is invalid.",
    );
  }

  const boundary =
    issuance.authorityBoundary;

  if (
    boundary.canonicalFormalQualificationBound !==
      true ||
    boundary.canonicalTemplateRegistryBound !==
      true ||
    boundary.exactEightCandidatesRequired !==
      true ||
    boundary.formalQualificationIssued !==
      true ||
    boundary.qualifiedManifestCreated !==
      true ||
    boundary.activationCandidatePreparationAuthorized !==
      false ||
    boundary.activationCandidateCreated !==
      false ||
    boundary.ownerActivationRecorded !==
      false ||
    boundary.runtimeActivated !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !==
      false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.secretsAccessAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.financialCommitmentAuthorized !==
      false ||
    boundary.legalCommitmentAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    issuance.nextStep !==
      "PREPARE_ENGINEERING_ACTIVATION_CANDIDATES"
  ) {
    throw new Error(
      "Engineering qualified-manifest issuance authority boundary is invalid.",
    );
  }

  if (
    Date.parse(issuance.createdAt) <
    Date.parse(
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
        .qualifiedAt,
    )
  ) {
    throw new Error(
      "Engineering qualified-manifest issuance cannot precede formal qualification.",
    );
  }

  const {
    manifestIssuanceDigest,
    ...issuanceCore
  } = issuance;

  if (
    sha256(issuanceCore) !==
      manifestIssuanceDigest
  ) {
    throw new Error(
      "Engineering qualified-manifest issuance integrity is invalid.",
    );
  }

  if (
    !Object.isFrozen(issuance) ||
    !Object.isFrozen(
      issuance.candidateManifests,
    ) ||
    issuance.candidateManifests.some(
      (record) =>
        !Object.isFrozen(record) ||
        !Object.isFrozen(
          record.qualifiedManifest,
        ) ||
        !Object.isFrozen(
          record.authorityBoundary,
        ),
    ) ||
    !Object.isFrozen(
      issuance.aggregateSummary,
    ) ||
    !Object.isFrozen(
      issuance.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering qualified-manifest issuance must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceQualifiedEmployeeManifestIssuance(
  input:
    CreateEngineeringAIWorkforceQualifiedEmployeeManifestIssuanceInput,
): EngineeringAIWorkforceQualifiedEmployeeManifestIssuance {
  if (
    input.formalQualificationIssuance !==
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
  ) {
    throw new Error(
      "Only the canonical Engineering formal qualification issuance can create qualified manifests.",
    );
  }

  if (
    input.templateRegistry !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY
  ) {
    throw new Error(
      "Only the canonical Engineering template registry can create qualified manifests.",
    );
  }

  validateEngineeringAIWorkforceFormalQualificationIssuance(
    input.formalQualificationIssuance,
  );

  requireIdentifier(
    "Engineering qualified-manifest issuance ID",
    input.manifestIssuanceId,
  );

  requireTimestamp(
    "Engineering qualified-manifest issuance time",
    input.createdAt,
  );

  if (
    input.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID ||
    input.tenantId !==
      input.formalQualificationIssuance
        .tenantId
  ) {
    throw new Error(
      "Cross-tenant Engineering qualified-manifest creation is blocked.",
    );
  }

  if (
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    input.ownerId !==
      input.formalQualificationIssuance
        .ownerId
  ) {
    throw new Error(
      "Only the qualification-bound NEXUS owner can create Engineering qualified manifests.",
    );
  }

  if (
    input.formalQualificationIssuance
      .issuanceState !==
        "ENGINEERING_FORMAL_QUALIFICATION_ISSUED" ||
    input.formalQualificationIssuance
      .candidateIssuances.length !==
        8 ||
    input.templateRegistry
      .templates.length !==
        8 ||
    input.formalQualificationIssuance
      .authorityBoundary
      .formalQualificationIssued !==
        true ||
    input.formalQualificationIssuance
      .authorityBoundary
      .qualifiedManifestCreated !==
        false ||
    input.formalQualificationIssuance
      .nextStep !==
        "PREPARE_ENGINEERING_QUALIFIED_EMPLOYEE_MANIFESTS"
  ) {
    throw new Error(
      "Engineering qualified-manifest creation requires complete unconsumed formal qualification issuance.",
    );
  }

  if (
    Date.parse(input.createdAt) <
    Date.parse(
      input.formalQualificationIssuance
        .qualifiedAt,
    )
  ) {
    throw new Error(
      "Engineering qualified-manifest issuance cannot precede formal qualification.",
    );
  }

  const candidateManifests =
    input.templateRegistry.templates.map(
      (
        template,
        index,
      ) => {
        const qualificationIssuance =
          input.formalQualificationIssuance
            .candidateIssuances[index];

        if (
          !qualificationIssuance ||
          template.employeeId !==
            qualificationIssuance.employeeId ||
          template.employeeCode !==
            qualificationIssuance.employeeCode ||
          template.publicName !==
            qualificationIssuance.publicName ||
          template.officialRole !==
            qualificationIssuance.officialRole ||
          template.templateId !==
            qualificationIssuance.templateId ||
          template.templateDigest !==
            qualificationIssuance.templateDigest ||
          qualificationIssuance
            .qualificationReport
            .qualificationPassed !==
              true ||
          qualificationIssuance
            .authorityBoundary
            .formalQualificationIssued !==
              true ||
          qualificationIssuance
            .authorityBoundary
            .qualifiedManifestCreated !==
              false
        ) {
          throw new Error(
            "Engineering qualified-manifest source qualification is invalid.",
          );
        }

        const qualifiedManifest =
          createQualifiedAIEmployeeManifest(
            template,
            qualificationIssuance
              .qualificationReport,
          );

        validatePreservedManifest(
          template,
          qualifiedManifest,
        );

        const recordCore = {
          developmentSequence:
            index + 1,

          issuanceState:
            "ENGINEERING_CANDIDATE_QUALIFIED_EMPLOYEE_MANIFEST_CREATED" as const,

          employeeId:
            template.employeeId,

          employeeCode:
            template.employeeCode,

          publicName:
            template.publicName,

          officialRole:
            template.officialRole,

          templateId:
            template.templateId,

          templateDigest:
            template.templateDigest,

          formalQualificationCandidateIssuanceDigest:
            qualificationIssuance
              .candidateIssuanceDigest,

          qualificationDigest:
            qualificationIssuance
              .qualificationDigest,

          sourceManifestDigest:
            template.manifest
              .manifestDigest,

          qualifiedManifest,

          qualifiedManifestDigest:
            qualifiedManifest
              .manifestDigest,

          authorityBoundary: {
            formalQualificationBound:
              true as const,

            qualificationIntegrityVerified:
              true as const,

            canonicalTemplateBound:
              true as const,

            tenantIdentityBound:
              true as const,

            ownerIdentityBound:
              true as const,

            registeredIdentityPreserved:
              true as const,

            registeredRolePreserved:
              true as const,

            registeredSkillsPreserved:
              true as const,

            registeredToolGrantsPreserved:
              true as const,

            registeredKnowledgePolicyPreserved:
              true as const,

            registeredApprovalPolicyPreserved:
              true as const,

            registeredEscalationPolicyPreserved:
              true as const,

            registeredAuditPolicyPreserved:
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

            repositoryReadAuthorized:
              false as const,

            repositoryWriteAuthorized:
              false as const,

            productionDeploymentAuthorized:
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
        };

        return deepFreeze({
          ...recordCore,

          candidateManifestIssuanceDigest:
            sha256(recordCore),
        });
      },
    );

  const issuanceCore = {
    version:
      ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION,

    manifestIssuanceId:
      input.manifestIssuanceId,

    issuanceState:
      "ENGINEERING_QUALIFIED_EMPLOYEE_MANIFESTS_CREATED" as const,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    sourceFormalQualificationIssuanceId:
      input.formalQualificationIssuance
        .issuanceId,

    sourceFormalQualificationIssuanceDigest:
      input.formalQualificationIssuance
        .issuanceDigest,

    sourceTemplateRegistryDigest:
      input.templateRegistry
        .registryDigest,

    candidateManifestCount:
      8 as const,

    candidateManifests,

    aggregateSummary: {
      formallyQualifiedCandidateCount:
        8 as const,

      qualifiedManifestCount:
        8 as const,

      qualifiedEvaluationCount:
        8 as const,

      totalQualificationCasesPassed:
        800 as const,

      exactEightQualifiedManifestsCreated:
        true as const,

      exactCandidateSequencePreserved:
        true as const,

      exactRegisteredIdentitiesPreserved:
        true as const,

      exactRegisteredRolesPreserved:
        true as const,

      exactRegisteredSkillsPreserved:
        true as const,

      exactRegisteredToolGrantsPreserved:
        true as const,

      exactRegisteredSafetyBoundariesPreserved:
        true as const,

      uniqueQualifiedManifestDigests:
        8 as const,

      activationCandidatesCreated:
        0 as const,

      runtimesActivated:
        0 as const,

      controlledWorkAuthorizations:
        0 as const,
    },

    nextStep:
      "PREPARE_ENGINEERING_ACTIVATION_CANDIDATES" as const,

    authorityBoundary: {
      canonicalFormalQualificationBound:
        true as const,

      canonicalTemplateRegistryBound:
        true as const,

      exactEightCandidatesRequired:
        true as const,

      formalQualificationIssued:
        true as const,

      qualifiedManifestCreated:
        true as const,

      activationCandidatePreparationAuthorized:
        false as const,

      activationCandidateCreated:
        false as const,

      ownerActivationRecorded:
        false as const,

      runtimeActivated:
        false as const,

      controlledWorkAuthorized:
        false as const,

      repositoryReadAuthorized:
        false as const,

      repositoryWriteAuthorized:
        false as const,

      branchCreationAuthorized:
        false as const,

      pullRequestPreparationAuthorized:
        false as const,

      mergeAuthorized:
        false as const,

      productionDeploymentAuthorized:
        false as const,

      secretsAccessAuthorized:
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

      financialCommitmentAuthorized:
        false as const,

      legalCommitmentAuthorized:
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
    }) as EngineeringAIWorkforceQualifiedEmployeeManifestIssuance;

  validateEngineeringAIWorkforceQualifiedEmployeeManifestIssuance(
    issuance,
  );

  return issuance;
}

export const ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE =
  createEngineeringAIWorkforceQualifiedEmployeeManifestIssuance({
    manifestIssuanceId:
      "engineering-ai-workforce-qualified-employee-manifest-issuance-001",

    formalQualificationIssuance:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE,

    templateRegistry:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY,

    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    createdAt:
      "2026-07-23T07:30:12.254Z",
  });
