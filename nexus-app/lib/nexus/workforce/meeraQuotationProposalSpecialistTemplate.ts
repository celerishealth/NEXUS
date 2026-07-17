import {
  createHash,
} from "node:crypto";

export const MEERA_QUOTATION_PROPOSAL_SPECIALIST_TEMPLATE_VERSION =
  "nexus-meera-quotation-proposal-specialist-template-v1" as const;

export interface MeeraQuotationProposalSpecialistTemplate {
  readonly version:
    typeof MEERA_QUOTATION_PROPOSAL_SPECIALIST_TEMPLATE_VERSION;

  readonly templateId:
    "template-meera-quotation-proposal-specialist-v1";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly employeeCode:
    "nx-sales-005";

  readonly displayName:
    "Meera";

  readonly officialRole:
    "AI Quotation & Proposal Specialist";

  readonly department:
    "SALES";

  readonly managerRoleKey:
    "founder-chief-of-staff";

  readonly launchSequence:
    5;

  readonly autonomyLevel:
    "DRAFTING_ASSISTANT";

  readonly templateStatus:
    "QUALIFICATION_REQUIRED";

  readonly roleCharter:
    string;

  readonly skills: readonly Readonly<{
    skillId: string;
    name: string;
    description: string;
  }>[];

  readonly toolGrants: readonly Readonly<{
    toolId: string;
    capability: string;
    mode: "READ_ONLY" | "DRAFT_ONLY";
    risk: "LOW" | "MEDIUM";
    externalEffect: false;
  }>[];

  readonly approvalPolicy: Readonly<{
    ownerApprovalRequiredBeforeCustomerDelivery: true;
    ownerApprovalRequiredBeforeExecution: true;
    autonomousExternalActionAllowed: false;
  }>;

  readonly safetyBoundary: Readonly<{
    tenantScoped: true;
    crossTenantAccessAuthorized: false;
    sandboxOnly: true;
    realCustomerContactAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionDatabaseMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;

  readonly activationBoundary: Readonly<{
    qualificationRequired: true;
    activationAuthorized: false;
    pilotExecutionAuthorized: false;
    productionReady: false;
  }>;

  readonly createdAt:
    string;

  readonly templateDigest:
    string;
}

const ROLE_CHARTER =
  "Prepare clear tenant-scoped quotation and proposal drafts from authorized inquiry evidence and owner-approved recommendations, expose pricing assumptions, exclusions, and missing commercial evidence, and route every consequential commercial commitment to the owner for approval.";

const SKILLS = [
  {
    skillId:
      "skill-quotation-proposal-drafting",
    name:
      "Quotation and proposal drafting",
    description:
      "Creates clear tenant-scoped quotation and proposal drafts from authorized evidence.",
  },
  {
    skillId:
      "skill-pricing-assumption-analysis",
    name:
      "Pricing assumption analysis",
    description:
      "Identifies pricing assumptions, exclusions, uncertainty, and missing commercial evidence.",
  },
  {
    skillId:
      "skill-owner-commercial-escalation",
    name:
      "Owner commercial escalation",
    description:
      "Escalates consequential pricing and commercial commitments to the owner with complete evidence.",
  },
] as const;

const TOOL_GRANTS = [
  {
    toolId:
      "tool-inquiry-read",
    capability:
      "Read tenant-scoped authorized inquiry records",
    mode:
      "READ_ONLY",
    risk:
      "LOW",
    externalEffect:
      false,
  },
  {
    toolId:
      "tool-recommendation-read",
    capability:
      "Read tenant-scoped owner-approved recommendation records",
    mode:
      "READ_ONLY",
    risk:
      "LOW",
    externalEffect:
      false,
  },
  {
    toolId:
      "tool-quotation-proposal-draft",
    capability:
      "Create a sandbox quotation or proposal draft for owner review",
    mode:
      "DRAFT_ONLY",
    risk:
      "MEDIUM",
    externalEffect:
      false,
  },
] as const;

function canonicalize(
  value:
    unknown,
): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(
      value,
    );
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    return `[${value
      .map(canonicalize)
      .join(",")}]`;
  }

  if (
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalize(record[key])}`,
      )
      .join(",")}}`;
  }

  throw new Error(
    "Unsupported deterministic Meera template value.",
  );
}

function sha256(
  value:
    unknown,
): string {
  return createHash(
    "sha256",
  )
    .update(
      canonicalize(value),
    )
    .digest(
      "hex",
    );
}

function deepFreeze<T>(
  value:
    T,
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIsoTimestamp(
  value:
    string,
): string {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(
      "Meera template creation time must be an exact ISO timestamp.",
    );
  }

  return value;
}

export function createMeeraQuotationProposalSpecialistTemplate(
  createdAt:
    string,
): MeeraQuotationProposalSpecialistTemplate {
  const normalizedCreatedAt =
    requireIsoTimestamp(createdAt);

  const templateCore = {
    version:
      MEERA_QUOTATION_PROPOSAL_SPECIALIST_TEMPLATE_VERSION,

    templateId:
      "template-meera-quotation-proposal-specialist-v1" as const,

    employeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    employeeCode:
      "nx-sales-005" as const,

    displayName:
      "Meera" as const,

    officialRole:
      "AI Quotation & Proposal Specialist" as const,

    department:
      "SALES" as const,

    managerRoleKey:
      "founder-chief-of-staff" as const,

    launchSequence:
      5 as const,

    autonomyLevel:
      "DRAFTING_ASSISTANT" as const,

    templateStatus:
      "QUALIFICATION_REQUIRED" as const,

    roleCharter:
      ROLE_CHARTER,

    skills:
      SKILLS,

    toolGrants:
      TOOL_GRANTS,

    approvalPolicy: {
      ownerApprovalRequiredBeforeCustomerDelivery:
        true as const,

      ownerApprovalRequiredBeforeExecution:
        true as const,

      autonomousExternalActionAllowed:
        false as const,
    },

    safetyBoundary: {
      tenantScoped:
        true as const,

      crossTenantAccessAuthorized:
        false as const,

      sandboxOnly:
        true as const,

      realCustomerContactAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionDatabaseMutationAuthorized:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,
    },

    activationBoundary: {
      qualificationRequired:
        true as const,

      activationAuthorized:
        false as const,

      pilotExecutionAuthorized:
        false as const,

      productionReady:
        false as const,
    },

    createdAt:
      normalizedCreatedAt,
  };

  return deepFreeze({
    ...templateCore,

    templateDigest:
      sha256(templateCore),
  });
}

export function validateMeeraQuotationProposalSpecialistTemplate(
  template:
    MeeraQuotationProposalSpecialistTemplate,
): void {
  if (
    template.version !==
      MEERA_QUOTATION_PROPOSAL_SPECIALIST_TEMPLATE_VERSION ||
    template.templateId !==
      "template-meera-quotation-proposal-specialist-v1" ||
    template.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    template.employeeCode !==
      "nx-sales-005" ||
    template.displayName !==
      "Meera" ||
    template.officialRole !==
      "AI Quotation & Proposal Specialist" ||
    template.department !==
      "SALES" ||
    template.launchSequence !==
      5 ||
    template.autonomyLevel !==
      "DRAFTING_ASSISTANT"
  ) {
    throw new Error(
      "Meera quotation and proposal specialist identity is invalid.",
    );
  }

  if (
    template.approvalPolicy
      .ownerApprovalRequiredBeforeCustomerDelivery !== true ||
    template.approvalPolicy
      .ownerApprovalRequiredBeforeExecution !== true ||
    template.approvalPolicy
      .autonomousExternalActionAllowed !== false ||
    template.safetyBoundary.tenantScoped !== true ||
    template.safetyBoundary
      .crossTenantAccessAuthorized !== false ||
    template.safetyBoundary.sandboxOnly !== true ||
    template.safetyBoundary
      .realCustomerContactAuthorized !== false ||
    template.safetyBoundary
      .liveProviderExecutionAuthorized !== false ||
    template.safetyBoundary
      .productionDatabaseMutationAuthorized !== false ||
    template.safetyBoundary
      .paymentExecutionAuthorized !== false ||
    template.safetyBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Meera quotation and proposal specialist authority boundary is invalid.",
    );
  }

  requireIsoTimestamp(
    template.createdAt,
  );

  const {
    templateDigest,
    ...templateCore
  } = template;

  if (
    !/^[a-f0-9]{64}$/.test(templateDigest) ||
    templateDigest !==
      sha256(templateCore)
  ) {
    throw new Error(
      "Meera quotation and proposal specialist template integrity is invalid.",
    );
  }
}
