import {
  createHash,
} from "node:crypto";

import {
  AI_EMPLOYEE_ACTIVATION_CANDIDATE_VERSION,
  createAIEmployeeActivationCandidate,
  type AIEmployeeActivationCandidate,
} from "./employeeQualification";

import {
  createCoreLaunchEmployeeTemplateRegistry,
  findAIEmployeeTemplate,
  type AIEmployeeTemplateRecord,
} from "./employeeTemplateRegistry";

import {
  validateMeeraFormalQualificationIssuance,
  type MeeraFormalQualificationIssuance,
} from "./meeraFormalQualificationIssuance";

import {
  validateMeeraQualifiedEmployeeManifestIssuance,
  type MeeraQualifiedEmployeeManifestIssuance,
} from "./meeraQualifiedEmployeeManifestIssuance";

export const MEERA_ACTIVATION_CANDIDATE_ISSUANCE_VERSION =
  "nexus-meera-activation-candidate-issuance-v1" as const;

export interface CreateMeeraActivationCandidateIssuanceInput {
  readonly activationCandidateIssuanceId:
    string;

  readonly qualifiedManifestIssuance:
    MeeraQualifiedEmployeeManifestIssuance;

  readonly formalQualification:
    MeeraFormalQualificationIssuance;

  readonly runtimeId:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly preparedAt:
    string;
}

export interface MeeraActivationCandidateIssuance {
  readonly version:
    typeof MEERA_ACTIVATION_CANDIDATE_ISSUANCE_VERSION;

  readonly activationCandidateIssuanceId:
    string;

  readonly issuanceState:
    "ACTIVATION_CANDIDATE_PREPARED";

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

  readonly runtimeId:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly qualifiedManifestIssuanceId:
    string;

  readonly qualifiedManifestIssuanceDigest:
    string;

  readonly formalQualificationIssuanceId:
    string;

  readonly formalQualificationIssuanceDigest:
    string;

  readonly qualificationDigest:
    string;

  readonly qualifiedManifestDigest:
    string;

  readonly sourceRegistryCreatedAt:
    string;

  readonly activationCandidate:
    AIEmployeeActivationCandidate;

  readonly authorityBoundary: Readonly<{
    qualifiedManifestIssuanceBound:
      true;

    formalQualificationBound:
      true;

    canonicalTemplateBound:
      true;

    registryCreationTimeBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    activationCandidateCreated:
      true;

    runtimeCreatedPaused:
      true;

    ownerActivationRecorded:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
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

  readonly nextStep:
    "AWAIT_OWNER_ACTIVATION";

  readonly preparedAt:
    string;

  readonly activationCandidateIssuanceDigest:
    string;
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
      "Unsupported deterministic Meera activation-candidate value.",
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
  sourceRegistryCreatedAt:
    string,
): AIEmployeeTemplateRecord {
  const registry =
    createCoreLaunchEmployeeTemplateRegistry(
      sourceRegistryCreatedAt,
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
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Canonical registered Meera template identity is invalid.",
    );
  }

  return template;
}

function validateQualifiedManifestBinding(
  input:
    CreateMeeraActivationCandidateIssuanceInput,
): void {
  const source =
    input.qualifiedManifestIssuance;

  validateMeeraQualifiedEmployeeManifestIssuance(
    source,
  );

  if (
    source.tenantId !==
      input.tenantId
  ) {
    throw new Error(
      "Cross-tenant Meera activation candidate creation is blocked.",
    );
  }

  if (
    source.ownerId !==
      input.ownerId
  ) {
    throw new Error(
      "Only the qualified-manifest-bound owner can prepare Meera's activation candidate.",
    );
  }

  if (
    source.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    source.templateId !==
      EXPECTED_TEMPLATE_ID ||
    source.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    source.displayName !==
      EXPECTED_DISPLAY_NAME ||
    source.officialRole !==
      EXPECTED_ROLE ||
    source.department !==
      EXPECTED_DEPARTMENT ||
    source.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Meera's registered workforce identity has changed.",
    );
  }

  const boundary =
    source.authorityBoundary;

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
    boundary.tenantIdentityBound !==
      true ||
    boundary.ownerIdentityBound !==
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
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Workforce Day 53 Meera authority boundary has been changed.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
      Date.parse(source.createdAt)
  ) {
    throw new Error(
      "Meera activation candidate cannot precede qualified manifest issuance.",
    );
  }
}

function validateFormalQualificationBinding(
  input:
    CreateMeeraActivationCandidateIssuanceInput,
): void {
  const qualified =
    input.qualifiedManifestIssuance;

  const formal =
    input.formalQualification;

  validateMeeraFormalQualificationIssuance(
    formal,
  );

  if (
    qualified
      .formalQualificationIssuanceId !==
        formal.issuanceId ||
    qualified
      .formalQualificationIssuanceDigest !==
        formal.issuanceDigest ||
    qualified.qualificationDigest !==
      formal.qualificationDigest ||
    formal.qualificationDigest !==
      formal.qualificationReport
        .qualificationDigest
  ) {
    throw new Error(
      "Meera formal qualification is not bound to the qualified manifest issuance.",
    );
  }

  if (
    formal.tenantId !==
      input.tenantId
  ) {
    throw new Error(
      "Cross-tenant Meera formal qualification binding is blocked.",
    );
  }

  if (
    formal.ownerId !==
      input.ownerId ||
    formal.qualificationReport
      .ownerApproval.ownerId !==
        input.ownerId
  ) {
    throw new Error(
      "Meera formal qualification owner binding is invalid.",
    );
  }

  if (
    formal.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    formal.templateId !==
      EXPECTED_TEMPLATE_ID ||
    formal.qualificationReport
      .employeeId !==
        EXPECTED_EMPLOYEE_ID ||
    formal.qualificationReport
      .templateId !==
        EXPECTED_TEMPLATE_ID
  ) {
    throw new Error(
      "Meera formal qualification belongs to a different AI employee.",
    );
  }
}

function validateCanonicalTemplateBinding(
  source:
    MeeraQualifiedEmployeeManifestIssuance,

  template:
    AIEmployeeTemplateRecord,
): void {
  if (
    template.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    template.templateId !==
      EXPECTED_TEMPLATE_ID ||
    template.templateDigest !==
      source.templateDigest ||
    template.manifest.manifestDigest !==
      source.sourceManifestDigest ||
    template.skillToolValidationDigest !==
      source.skillToolValidationDigest
  ) {
    throw new Error(
      "Canonical Meera template binding verification failed.",
    );
  }
}

function validateActivationCandidate(
  input:
    CreateMeeraActivationCandidateIssuanceInput,

  candidate:
    AIEmployeeActivationCandidate,
): void {
  const source =
    input.qualifiedManifestIssuance;

  if (
    candidate.version !==
      AI_EMPLOYEE_ACTIVATION_CANDIDATE_VERSION ||
    candidate.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    candidate.templateId !==
      EXPECTED_TEMPLATE_ID ||
    candidate.qualificationDigest !==
      source.qualificationDigest ||
    candidate.qualifiedManifest
      .manifestDigest !==
        source.qualifiedManifest
          .manifestDigest
  ) {
    throw new Error(
      "Meera activation candidate binding verification failed.",
    );
  }

  requireDigest(
    "Meera activation candidate digest",
    candidate.candidateDigest,
  );

  const runtime =
    candidate.pausedRuntime;

  if (
    candidate.activationEligible !==
      true ||
    candidate.ownerActivationRequired !==
      true ||
    runtime.runtimeId !==
      input.runtimeId ||
    runtime.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    runtime.templateId !==
      EXPECTED_TEMPLATE_ID ||
    runtime.manifestDigest !==
      source.qualifiedManifest
        .manifestDigest ||
    runtime.tenantId !==
      input.tenantId ||
    runtime.ownerId !==
      input.ownerId ||
    runtime.ownerActivated !==
      false ||
    runtime.runtimeState !==
      "PAUSED_AWAITING_OWNER" ||
    runtime.controlledWorkAuthorized !==
      false
  ) {
    throw new Error(
      "Meera activation candidate runtime must remain paused for owner activation.",
    );
  }

  if (
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
        false ||
    runtime.safetyBoundary
      .emergencyPauseAvailable !==
        true ||
    runtime.safetyBoundary
      .liveProviderExecutionAuthorized !==
        false ||
    runtime.safetyBoundary
      .externalDeliveryAuthorized !==
        false ||
    runtime.safetyBoundary
      .paymentExecutionAuthorized !==
        false ||
    runtime.safetyBoundary
      .publicLaunchAuthorized !==
        false
  ) {
    throw new Error(
      "Meera activation candidate safety boundary has been changed.",
    );
  }
}

export function validateMeeraActivationCandidateIssuance(
  issuance:
    MeeraActivationCandidateIssuance,
): void {
  if (
    issuance.version !==
      MEERA_ACTIVATION_CANDIDATE_ISSUANCE_VERSION ||
    issuance.issuanceState !==
      "ACTIVATION_CANDIDATE_PREPARED" ||
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
      EXPECTED_AUTONOMY_LEVEL ||
    issuance.nextStep !==
      "AWAIT_OWNER_ACTIVATION"
  ) {
    throw new Error(
      "Meera activation candidate issuance identity is invalid.",
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "activationCandidateIssuanceId",
        issuance
          .activationCandidateIssuanceId,
      ],
      [
        "runtimeId",
        issuance.runtimeId,
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
        "qualifiedManifestIssuanceId",
        issuance
          .qualifiedManifestIssuanceId,
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
        "qualifiedManifestIssuanceDigest",
        issuance
          .qualifiedManifestIssuanceDigest,
      ],
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
        "qualifiedManifestDigest",
        issuance.qualifiedManifestDigest,
      ],
      [
        "activationCandidateDigest",
        issuance.activationCandidate
          .candidateDigest,
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
    "Meera activation candidate preparation time",
    issuance.preparedAt,
  );

  if (
    issuance.activationCandidate.employeeId !==
      issuance.employeeId ||
    issuance.activationCandidate.templateId !==
      issuance.templateId ||
    issuance.activationCandidate
      .qualificationDigest !==
        issuance.qualificationDigest ||
    issuance.activationCandidate
      .qualifiedManifest
      .manifestDigest !==
        issuance.qualifiedManifestDigest ||
    issuance.activationCandidate
      .pausedRuntime.runtimeId !==
        issuance.runtimeId ||
    issuance.activationCandidate
      .pausedRuntime.tenantId !==
        issuance.tenantId ||
    issuance.activationCandidate
      .pausedRuntime.ownerId !==
        issuance.ownerId ||
    issuance.activationCandidate
      .pausedRuntime.runtimeState !==
        "PAUSED_AWAITING_OWNER" ||
    issuance.activationCandidate
      .pausedRuntime.ownerActivated !==
        false ||
    issuance.activationCandidate
      .pausedRuntime
      .controlledWorkAuthorized !==
        false
  ) {
    throw new Error(
      "Meera activation candidate record is invalid.",
    );
  }

  const boundary =
    issuance.authorityBoundary;

  if (
    boundary
      .qualifiedManifestIssuanceBound !==
        true ||
    boundary.formalQualificationBound !==
      true ||
    boundary.canonicalTemplateBound !==
      true ||
    boundary.registryCreationTimeBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.activationCandidateCreated !==
      true ||
    boundary.runtimeCreatedPaused !==
      true ||
    boundary.ownerActivationRecorded !==
      false ||
    boundary.runtimeActivated !==
      false ||
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
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Meera activation candidate authority boundary is invalid.",
    );
  }

  const {
    activationCandidateIssuanceDigest,
    ...issuanceCore
  } = issuance;

  if (
    !SHA_256_PATTERN.test(
      activationCandidateIssuanceDigest,
    ) ||
    activationCandidateIssuanceDigest !==
      sha256(issuanceCore)
  ) {
    throw new Error(
      "Meera activation candidate issuance integrity is invalid.",
    );
  }
}

export function createMeeraActivationCandidateIssuance(
  input:
    CreateMeeraActivationCandidateIssuanceInput,
): MeeraActivationCandidateIssuance {
  requireIdentifier(
    "Meera activation candidate issuanceId",
    input.activationCandidateIssuanceId,
  );

  requireIdentifier(
    "Meera activation candidate runtimeId",
    input.runtimeId,
  );

  requireIdentifier(
    "Meera activation candidate tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "Meera activation candidate ownerId",
    input.ownerId,
  );

  requireIsoTimestamp(
    "Meera activation candidate preparation time",
    input.preparedAt,
  );

  validateQualifiedManifestBinding(
    input,
  );

  validateFormalQualificationBinding(
    input,
  );

  const source =
    input.qualifiedManifestIssuance;

  const template =
    resolveCanonicalMeeraTemplate(
      source.sourceRegistryCreatedAt,
    );

  validateCanonicalTemplateBinding(
    source,
    template,
  );

  const activationCandidate =
    createAIEmployeeActivationCandidate({
      template,

      qualification:
        input.formalQualification
          .qualificationReport,

      runtimeId:
        input.runtimeId,

      tenantId:
        input.tenantId,

      ownerId:
        input.ownerId,

      preparedAt:
        input.preparedAt,
    });

  validateActivationCandidate(
    input,
    activationCandidate,
  );

  const formal =
    input.formalQualification;

  const issuanceCore = {
    version:
      MEERA_ACTIVATION_CANDIDATE_ISSUANCE_VERSION,

    activationCandidateIssuanceId:
      input.activationCandidateIssuanceId,

    issuanceState:
      "ACTIVATION_CANDIDATE_PREPARED" as const,

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

    runtimeId:
      input.runtimeId,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    qualifiedManifestIssuanceId:
      source.manifestIssuanceId,

    qualifiedManifestIssuanceDigest:
      source.manifestIssuanceDigest,

    formalQualificationIssuanceId:
      formal.issuanceId,

    formalQualificationIssuanceDigest:
      formal.issuanceDigest,

    qualificationDigest:
      formal.qualificationDigest,

    qualifiedManifestDigest:
      source.qualifiedManifest
        .manifestDigest,

    sourceRegistryCreatedAt:
      source.sourceRegistryCreatedAt,

    activationCandidate,

    authorityBoundary: {
      qualifiedManifestIssuanceBound:
        true as const,

      formalQualificationBound:
        true as const,

      canonicalTemplateBound:
        true as const,

      registryCreationTimeBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      activationCandidateCreated:
        true as const,

      runtimeCreatedPaused:
        true as const,

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

    nextStep:
      "AWAIT_OWNER_ACTIVATION" as const,

    preparedAt:
      input.preparedAt,
  };

  const issuance =
    deepFreeze({
      ...issuanceCore,

      activationCandidateIssuanceDigest:
        sha256(issuanceCore),
    }) as MeeraActivationCandidateIssuance;

  validateMeeraActivationCandidateIssuance(
    issuance,
  );

  return issuance;
}
