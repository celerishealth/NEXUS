import {
  createHash,
} from "node:crypto";

import {
  createAIEmployeeActivationCandidate,
} from "./employeeQualification";

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

import {
  ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE,
  validateEngineeringAIWorkforceQualifiedEmployeeManifestIssuance,
} from "./engineeringAIWorkforceQualifiedEmployeeManifestIssuance";

export const ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE_VERSION =
  "nexus-engineering-ai-workforce-activation-candidate-issuance-v1" as const;

type EngineeringActivationCandidate =
  ReturnType<
    typeof createAIEmployeeActivationCandidate
  >;

export interface CreateEngineeringAIWorkforceActivationCandidateIssuanceInput {
  readonly activationCandidateIssuanceId:
    string;

  readonly qualifiedManifestIssuance:
    typeof ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE;

  readonly formalQualificationIssuance:
    typeof ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE;

  readonly templateRegistry:
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY;

  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly preparedAt: string;
}

export interface EngineeringAIWorkforceCandidateActivationCandidateIssuance {
  readonly developmentSequence:
    number;

  readonly issuanceState:
    "ENGINEERING_ACTIVATION_CANDIDATE_PREPARED";

  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;

  readonly templateId: string;
  readonly qualificationDigest: string;
  readonly qualifiedManifestDigest: string;

  readonly runtimeId: string;

  readonly activationCandidate:
    EngineeringActivationCandidate;

  readonly activationCandidateDigest:
    string;

  readonly pausedRuntimeDigest:
    string;

  readonly authorityBoundary: Readonly<{
    canonicalQualifiedManifestBound:
      true;

    canonicalFormalQualificationBound:
      true;

    canonicalTemplateBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    qualificationIntegrityVerified:
      true;

    qualifiedManifestIntegrityVerified:
      true;

    activationCandidatePrepared:
      true;

    activationEligible:
      true;

    ownerActivationRequired:
      true;

    runtimeCreatedPaused:
      true;

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

  readonly candidateIssuanceDigest:
    string;
}

export interface EngineeringAIWorkforceActivationCandidateIssuance {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE_VERSION;

  readonly activationCandidateIssuanceId:
    string;

  readonly issuanceState:
    "ENGINEERING_ACTIVATION_CANDIDATES_PREPARED";

  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly sourceQualifiedManifestIssuanceId:
    string;

  readonly sourceQualifiedManifestIssuanceDigest:
    string;

  readonly sourceFormalQualificationIssuanceId:
    string;

  readonly sourceFormalQualificationIssuanceDigest:
    string;

  readonly sourceTemplateRegistryDigest:
    string;

  readonly activationCandidateCount:
    8;

  readonly candidateIssuances:
    readonly EngineeringAIWorkforceCandidateActivationCandidateIssuance[];

  readonly aggregateSummary: Readonly<{
    qualifiedManifestCount:
      8;

    activationCandidateCount:
      8;

    pausedRuntimeCount:
      8;

    ownerActivationRequiredCount:
      8;

    ownerActivationDecisionCount:
      0;

    activatedRuntimeCount:
      0;

    controlledWorkAuthorizationCount:
      0;

    exactEightActivationCandidatesPrepared:
      true;

    exactCandidateSequencePreserved:
      true;

    exactCandidateIdentityPreserved:
      true;

    exactQualifiedManifestBindingsPreserved:
      true;

    uniqueActivationCandidateDigests:
      8;

    uniquePausedRuntimeDigests:
      8;
  }>;

  readonly nextStep:
    "AWAIT_ENGINEERING_OWNER_ACTIVATION_DECISION";

  readonly authorityBoundary: Readonly<{
    canonicalQualifiedManifestIssuanceBound:
      true;

    canonicalFormalQualificationIssuanceBound:
      true;

    canonicalTemplateRegistryBound:
      true;

    exactEightCandidatesRequired:
      true;

    qualifiedManifestCreated:
      true;

    activationCandidatePrepared:
      true;

    pausedRuntimeCreated:
      true;

    ownerActivationDecisionRequired:
      true;

    ownerActivationDecisionRecorded:
      false;

    runtimeActivationExecuted:
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

  readonly preparedAt: string;

  readonly issuanceDigest:
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
      "Unsupported deterministic Engineering activation-candidate issuance value.",
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

export function validateEngineeringAIWorkforceActivationCandidateIssuance(
  issuance:
    EngineeringAIWorkforceActivationCandidateIssuance,
): void {
  validateEngineeringAIWorkforceFormalQualificationIssuance(
    ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE,
  );

  validateEngineeringAIWorkforceQualifiedEmployeeManifestIssuance(
    ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE,
  );

  requireIdentifier(
    "Engineering activation-candidate issuance ID",
    issuance.activationCandidateIssuanceId,
  );

  requireTimestamp(
    "Engineering activation-candidate preparation time",
    issuance.preparedAt,
  );

  requireDigest(
    "Engineering activation-candidate issuance digest",
    issuance.issuanceDigest,
  );

  if (
    issuance.version !==
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE_VERSION ||
    issuance.issuanceState !==
      "ENGINEERING_ACTIVATION_CANDIDATES_PREPARED" ||
    issuance.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID ||
    issuance.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    issuance.sourceQualifiedManifestIssuanceId !==
      ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
        .manifestIssuanceId ||
    issuance.sourceQualifiedManifestIssuanceDigest !==
      ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
        .manifestIssuanceDigest ||
    issuance.sourceFormalQualificationIssuanceId !==
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
        .issuanceId ||
    issuance.sourceFormalQualificationIssuanceDigest !==
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
        .issuanceDigest ||
    issuance.sourceTemplateRegistryDigest !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY
        .registryDigest ||
    issuance.activationCandidateCount !==
      8 ||
    issuance.candidateIssuances.length !==
      8
  ) {
    throw new Error(
      "Engineering activation-candidate issuance identity is invalid.",
    );
  }

  requireUnique(
    "Engineering activation-candidate employee IDs",
    issuance.candidateIssuances.map(
      (record) =>
        record.employeeId,
    ),
  );

  requireUnique(
    "Engineering activation-candidate runtime IDs",
    issuance.candidateIssuances.map(
      (record) =>
        record.runtimeId,
    ),
  );

  requireUnique(
    "Engineering activation-candidate digests",
    issuance.candidateIssuances.map(
      (record) =>
        record.activationCandidateDigest,
    ),
  );

  requireUnique(
    "Engineering paused-runtime digests",
    issuance.candidateIssuances.map(
      (record) =>
        record.pausedRuntimeDigest,
    ),
  );

  issuance.candidateIssuances.forEach(
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

      const manifest =
        ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
          .candidateManifests[index];

      if (
        !template ||
        !qualification ||
        !manifest
      ) {
        throw new Error(
          "Engineering activation-candidate source binding is missing.",
        );
      }

      requireDigest(
        "Engineering candidate issuance digest",
        record.candidateIssuanceDigest,
      );

      requireDigest(
        "Engineering activation candidate digest",
        record.activationCandidateDigest,
      );

      requireDigest(
        "Engineering paused runtime digest",
        record.pausedRuntimeDigest,
      );

      const {
        candidateIssuanceDigest,
        ...recordCore
      } = record;

      const candidate =
        record.activationCandidate;

      const runtime =
        candidate.pausedRuntime;

      const boundary =
        record.authorityBoundary;

      if (
        sha256(recordCore) !==
          candidateIssuanceDigest ||
        record.developmentSequence !==
          index + 1 ||
        record.issuanceState !==
          "ENGINEERING_ACTIVATION_CANDIDATE_PREPARED" ||
        record.employeeId !==
          template.employeeId ||
        record.employeeId !==
          qualification.employeeId ||
        record.employeeId !==
          manifest.employeeId ||
        record.employeeCode !==
          template.employeeCode ||
        record.employeeCode !==
          qualification.employeeCode ||
        record.employeeCode !==
          manifest.employeeCode ||
        record.publicName !==
          template.publicName ||
        record.publicName !==
          qualification.publicName ||
        record.publicName !==
          manifest.publicName ||
        record.officialRole !==
          template.officialRole ||
        record.officialRole !==
          qualification.officialRole ||
        record.officialRole !==
          manifest.officialRole ||
        record.templateId !==
          template.templateId ||
        record.templateId !==
          qualification.templateId ||
        record.templateId !==
          manifest.templateId ||
        record.qualificationDigest !==
          qualification.qualificationDigest ||
        record.qualificationDigest !==
          manifest.qualificationDigest ||
        record.qualifiedManifestDigest !==
          manifest.qualifiedManifestDigest ||
        record.qualifiedManifestDigest !==
          candidate.qualifiedManifest.manifestDigest ||
        record.activationCandidateDigest !==
          candidate.candidateDigest ||
        record.pausedRuntimeDigest !==
          runtime.runtimeDigest ||
        record.runtimeId !==
          runtime.runtimeId ||
        candidate.employeeId !==
          record.employeeId ||
        candidate.templateId !==
          record.templateId ||
        candidate.qualificationDigest !==
          record.qualificationDigest ||
        candidate.activationEligible !==
          true ||
        candidate.ownerActivationRequired !==
          true ||
        candidate.preparedAt !==
          issuance.preparedAt ||
        runtime.employeeId !==
          record.employeeId ||
        runtime.templateId !==
          record.templateId ||
        runtime.manifestDigest !==
          record.qualifiedManifestDigest ||
        runtime.tenantId !==
          issuance.tenantId ||
        runtime.ownerId !==
          issuance.ownerId ||
        runtime.ownerActivated !==
          false ||
        runtime.runtimeState !==
          "PAUSED_AWAITING_OWNER" ||
        runtime.controlledWorkAuthorized !==
          false ||
        candidate.safetyBoundary
          .runtimeInitiallyPaused !==
            true ||
        candidate.safetyBoundary
          .crossTenantActivationBlocked !==
            true ||
        candidate.safetyBoundary
          .externalDeliveryAuthorized !==
            false ||
        candidate.safetyBoundary
          .liveProviderExecutionAuthorized !==
            false ||
        candidate.safetyBoundary
          .paymentExecutionAuthorized !==
            false ||
        candidate.safetyBoundary
          .publicLaunchAuthorized !==
            false
      ) {
        throw new Error(
          "Engineering activation-candidate binding is invalid.",
        );
      }

      if (
        boundary.canonicalQualifiedManifestBound !==
          true ||
        boundary.canonicalFormalQualificationBound !==
          true ||
        boundary.canonicalTemplateBound !==
          true ||
        boundary.tenantIdentityBound !==
          true ||
        boundary.ownerIdentityBound !==
          true ||
        boundary.qualificationIntegrityVerified !==
          true ||
        boundary.qualifiedManifestIntegrityVerified !==
          true ||
        boundary.activationCandidatePrepared !==
          true ||
        boundary.activationEligible !==
          true ||
        boundary.ownerActivationRequired !==
          true ||
        boundary.runtimeCreatedPaused !==
          true ||
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
          "Engineering activation-candidate authority boundary is invalid.",
        );
      }
    },
  );

  const summary =
    issuance.aggregateSummary;

  if (
    summary.qualifiedManifestCount !==
      8 ||
    summary.activationCandidateCount !==
      8 ||
    summary.pausedRuntimeCount !==
      8 ||
    summary.ownerActivationRequiredCount !==
      8 ||
    summary.ownerActivationDecisionCount !==
      0 ||
    summary.activatedRuntimeCount !==
      0 ||
    summary.controlledWorkAuthorizationCount !==
      0 ||
    summary.exactEightActivationCandidatesPrepared !==
      true ||
    summary.exactCandidateSequencePreserved !==
      true ||
    summary.exactCandidateIdentityPreserved !==
      true ||
    summary.exactQualifiedManifestBindingsPreserved !==
      true ||
    summary.uniqueActivationCandidateDigests !==
      8 ||
    summary.uniquePausedRuntimeDigests !==
      8
  ) {
    throw new Error(
      "Engineering activation-candidate aggregate summary is invalid.",
    );
  }

  const authority =
    issuance.authorityBoundary;

  if (
    authority.canonicalQualifiedManifestIssuanceBound !==
      true ||
    authority.canonicalFormalQualificationIssuanceBound !==
      true ||
    authority.canonicalTemplateRegistryBound !==
      true ||
    authority.exactEightCandidatesRequired !==
      true ||
    authority.qualifiedManifestCreated !==
      true ||
    authority.activationCandidatePrepared !==
      true ||
    authority.pausedRuntimeCreated !==
      true ||
    authority.ownerActivationDecisionRequired !==
      true ||
    authority.ownerActivationDecisionRecorded !==
      false ||
    authority.runtimeActivationExecuted !==
      false ||
    authority.runtimeActivated !==
      false ||
    authority.controlledWorkAuthorized !==
      false ||
    authority.repositoryReadAuthorized !==
      false ||
    authority.repositoryWriteAuthorized !==
      false ||
    authority.branchCreationAuthorized !==
      false ||
    authority.pullRequestPreparationAuthorized !==
      false ||
    authority.mergeAuthorized !==
      false ||
    authority.productionDeploymentAuthorized !==
      false ||
    authority.secretsAccessAuthorized !==
      false ||
    authority.realCustomerDataAccessAuthorized !==
      false ||
    authority.realCustomerContactAuthorized !==
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
    authority.financialCommitmentAuthorized !==
      false ||
    authority.legalCommitmentAuthorized !==
      false ||
    authority.autonomousDecisionAuthorized !==
      false ||
    authority.productionReadinessAuthorized !==
      false ||
    authority.publicLaunchAuthorized !==
      false ||
    issuance.nextStep !==
      "AWAIT_ENGINEERING_OWNER_ACTIVATION_DECISION"
  ) {
    throw new Error(
      "Engineering activation-candidate aggregate authority boundary is invalid.",
    );
  }

  if (
    Date.parse(issuance.preparedAt) <
    Date.parse(
      ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
        .createdAt,
    )
  ) {
    throw new Error(
      "Engineering activation candidates cannot precede qualified-manifest issuance.",
    );
  }

  const {
    issuanceDigest,
    ...issuanceCore
  } = issuance;

  if (
    sha256(issuanceCore) !==
      issuanceDigest
  ) {
    throw new Error(
      "Engineering activation-candidate issuance integrity is invalid.",
    );
  }

  if (
    !Object.isFrozen(issuance) ||
    !Object.isFrozen(
      issuance.candidateIssuances,
    ) ||
    issuance.candidateIssuances.some(
      (record) =>
        !Object.isFrozen(record) ||
        !Object.isFrozen(
          record.activationCandidate,
        ) ||
        !Object.isFrozen(
          record.activationCandidate
            .pausedRuntime,
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
      "Engineering activation-candidate issuance must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceActivationCandidateIssuance(
  input:
    CreateEngineeringAIWorkforceActivationCandidateIssuanceInput,
): EngineeringAIWorkforceActivationCandidateIssuance {
  if (
    input.qualifiedManifestIssuance !==
      ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE
  ) {
    throw new Error(
      "Only the canonical Engineering qualified-manifest issuance can prepare activation candidates.",
    );
  }

  if (
    input.formalQualificationIssuance !==
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
  ) {
    throw new Error(
      "Only the canonical Engineering formal qualification issuance can prepare activation candidates.",
    );
  }

  if (
    input.templateRegistry !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY
  ) {
    throw new Error(
      "Only the canonical Engineering template registry can prepare activation candidates.",
    );
  }

  validateEngineeringAIWorkforceQualifiedEmployeeManifestIssuance(
    input.qualifiedManifestIssuance,
  );

  validateEngineeringAIWorkforceFormalQualificationIssuance(
    input.formalQualificationIssuance,
  );

  requireIdentifier(
    "Engineering activation-candidate issuance ID",
    input.activationCandidateIssuanceId,
  );

  requireTimestamp(
    "Engineering activation-candidate preparation time",
    input.preparedAt,
  );

  if (
    input.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID ||
    input.tenantId !==
      input.qualifiedManifestIssuance
        .tenantId ||
    input.tenantId !==
      input.formalQualificationIssuance
        .tenantId
  ) {
    throw new Error(
      "Cross-tenant Engineering activation-candidate preparation is blocked.",
    );
  }

  if (
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    input.ownerId !==
      input.qualifiedManifestIssuance
        .ownerId ||
    input.ownerId !==
      input.formalQualificationIssuance
        .ownerId
  ) {
    throw new Error(
      "Only the qualification-bound NEXUS owner can prepare Engineering activation candidates.",
    );
  }

  if (
    input.qualifiedManifestIssuance
      .issuanceState !==
        "ENGINEERING_QUALIFIED_EMPLOYEE_MANIFESTS_CREATED" ||
    input.qualifiedManifestIssuance
      .candidateManifests.length !==
        8 ||
    input.formalQualificationIssuance
      .candidateIssuances.length !==
        8 ||
    input.templateRegistry.templates.length !==
        8 ||
    input.qualifiedManifestIssuance
      .authorityBoundary
      .qualifiedManifestCreated !==
        true ||
    input.qualifiedManifestIssuance
      .authorityBoundary
      .activationCandidateCreated !==
        false ||
    input.qualifiedManifestIssuance
      .nextStep !==
        "PREPARE_ENGINEERING_ACTIVATION_CANDIDATES"
  ) {
    throw new Error(
      "Engineering activation-candidate preparation requires complete unconsumed qualified-manifest issuance.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
    Date.parse(
      input.qualifiedManifestIssuance
        .createdAt,
    )
  ) {
    throw new Error(
      "Engineering activation candidates cannot precede qualified-manifest issuance.",
    );
  }

  const candidateIssuances =
    input.templateRegistry.templates.map(
      (
        template,
        index,
      ) => {
        const qualification =
          input.formalQualificationIssuance
            .candidateIssuances[index];

        const manifest =
          input.qualifiedManifestIssuance
            .candidateManifests[index];

        if (
          !qualification ||
          !manifest ||
          template.employeeId !==
            qualification.employeeId ||
          template.employeeId !==
            manifest.employeeId ||
          template.employeeCode !==
            qualification.employeeCode ||
          template.employeeCode !==
            manifest.employeeCode ||
          template.publicName !==
            qualification.publicName ||
          template.publicName !==
            manifest.publicName ||
          template.officialRole !==
            qualification.officialRole ||
          template.officialRole !==
            manifest.officialRole ||
          template.templateId !==
            qualification.templateId ||
          template.templateId !==
            manifest.templateId ||
          qualification.qualificationDigest !==
            manifest.qualificationDigest ||
          qualification.qualificationReport
            .qualificationPassed !==
              true ||
          manifest.qualifiedManifest
            .evaluation.status !==
              "QUALIFIED" ||
          manifest.authorityBoundary
            .qualifiedManifestCreated !==
              true ||
          manifest.authorityBoundary
            .activationCandidateCreated !==
              false
        ) {
          throw new Error(
            "Engineering activation-candidate source evidence is invalid.",
          );
        }

        const runtimeId =
          `runtime-engineering-${template.employeeCode}-candidate-v1`;

        const activationCandidate =
          createAIEmployeeActivationCandidate({
            template,
            qualification:
              qualification
                .qualificationReport,
            runtimeId,
            tenantId:
              input.tenantId,
            ownerId:
              input.ownerId,
            preparedAt:
              input.preparedAt,
          });

        if (
          activationCandidate
            .qualifiedManifest
            .manifestDigest !==
              manifest.qualifiedManifestDigest
        ) {
          throw new Error(
            "Engineering activation candidate did not preserve the issued qualified manifest.",
          );
        }

        const recordCore = {
          developmentSequence:
            index + 1,

          issuanceState:
            "ENGINEERING_ACTIVATION_CANDIDATE_PREPARED" as const,

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

          qualificationDigest:
            qualification
              .qualificationDigest,

          qualifiedManifestDigest:
            manifest
              .qualifiedManifestDigest,

          runtimeId,

          activationCandidate,

          activationCandidateDigest:
            activationCandidate
              .candidateDigest,

          pausedRuntimeDigest:
            activationCandidate
              .pausedRuntime
              .runtimeDigest,

          authorityBoundary: {
            canonicalQualifiedManifestBound:
              true as const,

            canonicalFormalQualificationBound:
              true as const,

            canonicalTemplateBound:
              true as const,

            tenantIdentityBound:
              true as const,

            ownerIdentityBound:
              true as const,

            qualificationIntegrityVerified:
              true as const,

            qualifiedManifestIntegrityVerified:
              true as const,

            activationCandidatePrepared:
              true as const,

            activationEligible:
              true as const,

            ownerActivationRequired:
              true as const,

            runtimeCreatedPaused:
              true as const,

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

          candidateIssuanceDigest:
            sha256(recordCore),
        });
      },
    );

  const issuanceCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE_VERSION,

    activationCandidateIssuanceId:
      input.activationCandidateIssuanceId,

    issuanceState:
      "ENGINEERING_ACTIVATION_CANDIDATES_PREPARED" as const,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    sourceQualifiedManifestIssuanceId:
      input.qualifiedManifestIssuance
        .manifestIssuanceId,

    sourceQualifiedManifestIssuanceDigest:
      input.qualifiedManifestIssuance
        .manifestIssuanceDigest,

    sourceFormalQualificationIssuanceId:
      input.formalQualificationIssuance
        .issuanceId,

    sourceFormalQualificationIssuanceDigest:
      input.formalQualificationIssuance
        .issuanceDigest,

    sourceTemplateRegistryDigest:
      input.templateRegistry
        .registryDigest,

    activationCandidateCount:
      8 as const,

    candidateIssuances,

    aggregateSummary: {
      qualifiedManifestCount:
        8 as const,

      activationCandidateCount:
        8 as const,

      pausedRuntimeCount:
        8 as const,

      ownerActivationRequiredCount:
        8 as const,

      ownerActivationDecisionCount:
        0 as const,

      activatedRuntimeCount:
        0 as const,

      controlledWorkAuthorizationCount:
        0 as const,

      exactEightActivationCandidatesPrepared:
        true as const,

      exactCandidateSequencePreserved:
        true as const,

      exactCandidateIdentityPreserved:
        true as const,

      exactQualifiedManifestBindingsPreserved:
        true as const,

      uniqueActivationCandidateDigests:
        8 as const,

      uniquePausedRuntimeDigests:
        8 as const,
    },

    nextStep:
      "AWAIT_ENGINEERING_OWNER_ACTIVATION_DECISION" as const,

    authorityBoundary: {
      canonicalQualifiedManifestIssuanceBound:
        true as const,

      canonicalFormalQualificationIssuanceBound:
        true as const,

      canonicalTemplateRegistryBound:
        true as const,

      exactEightCandidatesRequired:
        true as const,

      qualifiedManifestCreated:
        true as const,

      activationCandidatePrepared:
        true as const,

      pausedRuntimeCreated:
        true as const,

      ownerActivationDecisionRequired:
        true as const,

      ownerActivationDecisionRecorded:
        false as const,

      runtimeActivationExecuted:
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

    preparedAt:
      input.preparedAt,
  };

  const issuance =
    deepFreeze({
      ...issuanceCore,

      issuanceDigest:
        sha256(issuanceCore),
    }) as EngineeringAIWorkforceActivationCandidateIssuance;

  validateEngineeringAIWorkforceActivationCandidateIssuance(
    issuance,
  );

  return issuance;
}

export const ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE =
  createEngineeringAIWorkforceActivationCandidateIssuance({
    activationCandidateIssuanceId:
      "engineering-ai-workforce-activation-candidate-issuance-001",

    qualifiedManifestIssuance:
      ENGINEERING_AI_WORKFORCE_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE,

    formalQualificationIssuance:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE,

    templateRegistry:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY,

    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    preparedAt:
      "2026-07-23T07:47:21.980Z",
  });
