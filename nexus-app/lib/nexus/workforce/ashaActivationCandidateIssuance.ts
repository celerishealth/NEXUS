import {
  createHash,
} from "node:crypto";

import {
  ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION,
  type AshaFormalQualificationIssuance,
} from "./ashaFormalQualificationIssuance";

import {
  ASHA_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION,
  type AshaQualifiedEmployeeManifestIssuance,
} from "./ashaQualifiedEmployeeManifestIssuance";

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

export const ASHA_ACTIVATION_CANDIDATE_ISSUANCE_VERSION =
  "nexus-asha-activation-candidate-issuance-v1" as const;

export interface CreateAshaActivationCandidateIssuanceInput {
  readonly activationCandidateIssuanceId:
    string;
  readonly qualifiedManifestIssuance:
    AshaQualifiedEmployeeManifestIssuance;
  readonly formalQualification:
    AshaFormalQualificationIssuance;
  readonly runtimeId:
    string;
  readonly tenantId:
    string;
  readonly ownerId:
    string;
  readonly preparedAt:
    string;
}

export interface AshaActivationCandidateIssuance {
  readonly version:
    typeof ASHA_ACTIVATION_CANDIDATE_ISSUANCE_VERSION;
  readonly activationCandidateIssuanceId:
    string;
  readonly issuanceState:
    "ACTIVATION_CANDIDATE_PREPARED";
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
  readonly activationCandidate:
    AIEmployeeActivationCandidate;
  readonly authorityBoundary: Readonly<{
    qualifiedManifestIssuanceBound:
      true;
    formalQualificationBound:
      true;
    canonicalTemplateBound:
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
    customerDataAccessAuthorized:
      false;
    customerContactAuthorized:
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
      value as Record<
        string,
        unknown
      >;

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
      "Unsupported deterministic activation-candidate value.",
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
        value as Record<
          string,
          unknown
        >,
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
  if (
    !SAFE_IDENTIFIER_PATTERN.test(
      value,
    ) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(
      value,
    )
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
  if (!SHA_256_PATTERN.test(value)) {
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
    new Date(timestamp)
      .toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function resolveCanonicalTemplate(
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
      "Canonical Asha template is missing.",
    );
  }

  return template;
}

function validateQualifiedManifestIssuance(
  input:
    CreateAshaActivationCandidateIssuanceInput,
): void {
  const source =
    input.qualifiedManifestIssuance;

  if (
    source.version !==
      ASHA_QUALIFIED_EMPLOYEE_MANIFEST_ISSUANCE_VERSION ||
    source.issuanceState !==
      "QUALIFIED_EMPLOYEE_MANIFEST_CREATED"
  ) {
    throw new Error(
      "A valid Workforce Day 19 qualified manifest issuance is required.",
    );
  }

  requireDigest(
    "qualified manifest issuance digest",
    source.manifestIssuanceDigest,
  );

  const {
    manifestIssuanceDigest,
    ...sourceCore
  } = source;

  if (
    sha256(sourceCore) !==
      manifestIssuanceDigest
  ) {
    throw new Error(
      "Workforce Day 19 qualified manifest issuance integrity verification failed.",
    );
  }

  if (
    source.tenantId !==
      input.tenantId
  ) {
    throw new Error(
      "Cross-tenant activation candidate creation is blocked.",
    );
  }

  if (
    source.ownerId !==
      input.ownerId
  ) {
    throw new Error(
      "Only the qualified-manifest-bound owner can prepare the activation candidate.",
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
      "Asha's registered workforce identity has changed.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
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
    boundary.customerDataAccessAuthorized !==
      false ||
    boundary.customerContactAuthorized !==
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
      "Workforce Day 19 authority boundary has been changed.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
    Date.parse(source.createdAt)
  ) {
    throw new Error(
      "Activation candidate cannot precede qualified manifest issuance.",
    );
  }
}

function validateFormalQualificationBinding(
  input:
    CreateAshaActivationCandidateIssuanceInput,
): void {
  const source =
    input.qualifiedManifestIssuance;

  const formal =
    input.formalQualification;

  if (
    formal.version !==
      ASHA_FORMAL_QUALIFICATION_ISSUANCE_VERSION ||
    formal.issuanceState !==
      "FORMAL_QUALIFICATION_ISSUED"
  ) {
    throw new Error(
      "A valid Workforce Day 18 formal qualification is required.",
    );
  }

  requireDigest(
    "formal qualification issuance digest",
    formal.issuanceDigest,
  );

  const {
    issuanceDigest,
    ...formalCore
  } = formal;

  if (
    sha256(formalCore) !==
      issuanceDigest
  ) {
    throw new Error(
      "Workforce Day 18 formal qualification integrity verification failed.",
    );
  }

  if (
    source.formalQualificationIssuanceId !==
      formal.issuanceId ||
    source.formalQualificationIssuanceDigest !==
      formal.issuanceDigest ||
    source.qualificationDigest !==
      formal.qualificationDigest ||
    formal.qualificationDigest !==
      formal.qualificationReport
        .qualificationDigest
  ) {
    throw new Error(
      "Formal qualification is not bound to the qualified manifest issuance.",
    );
  }

  if (
    formal.tenantId !==
      input.tenantId
  ) {
    throw new Error(
      "Cross-tenant formal qualification binding is blocked.",
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
      "Formal qualification owner binding is invalid.",
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
      "Formal qualification belongs to a different AI employee.",
    );
  }
}

function validateCanonicalTemplateBinding(
  source:
    AshaQualifiedEmployeeManifestIssuance,
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
    template.manifest
      .manifestDigest !==
      source.sourceManifestDigest
  ) {
    throw new Error(
      "Canonical Asha template binding verification failed.",
    );
  }
}

function validateActivationCandidate(
  input:
    CreateAshaActivationCandidateIssuanceInput,
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
      "Asha activation candidate binding verification failed.",
    );
  }

  requireDigest(
    "activation candidate digest",
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
      "Asha activation candidate runtime must remain paused for owner activation.",
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
      "Asha activation candidate safety boundary has been changed.",
    );
  }
}

export function createAshaActivationCandidateIssuance(
  input:
    CreateAshaActivationCandidateIssuanceInput,
): AshaActivationCandidateIssuance {
  requireIdentifier(
    "activation candidate issuanceId",
    input.activationCandidateIssuanceId,
  );

  requireIdentifier(
    "activation candidate runtimeId",
    input.runtimeId,
  );

  requireIdentifier(
    "activation candidate tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "activation candidate ownerId",
    input.ownerId,
  );

  requireIsoDate(
    "activation candidate preparation time",
    input.preparedAt,
  );

  validateQualifiedManifestIssuance(
    input,
  );

  validateFormalQualificationBinding(
    input,
  );

  const template =
    resolveCanonicalTemplate(
      input.qualifiedManifestIssuance
        .createdAt,
    );

  validateCanonicalTemplateBinding(
    input.qualifiedManifestIssuance,
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

  const source =
    input.qualifiedManifestIssuance;

  const formal =
    input.formalQualification;

  const issuanceCore = {
    version:
      ASHA_ACTIVATION_CANDIDATE_ISSUANCE_VERSION,
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
    activationCandidate,
    authorityBoundary: {
      qualifiedManifestIssuanceBound:
        true,
      formalQualificationBound:
        true,
      canonicalTemplateBound:
        true,
      tenantIdentityBound:
        true,
      ownerIdentityBound:
        true,
      activationCandidateCreated:
        true,
      runtimeCreatedPaused:
        true,
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
    nextStep:
      "AWAIT_OWNER_ACTIVATION" as const,
    preparedAt:
      input.preparedAt,
  };

  const issuance:
    AshaActivationCandidateIssuance = {
      ...issuanceCore,
      activationCandidateIssuanceDigest:
        sha256(issuanceCore),
    };

  return deepFreeze(
    issuance,
  ) as AshaActivationCandidateIssuance;
}