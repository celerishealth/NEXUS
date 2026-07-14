
import { createHash } from "node:crypto";

import {
  createAuthenticatedCustomerInquiry,
  type AuthenticatedCustomerInquiryResult,
  type CreateAuthenticatedCustomerInquiryInput,
} from "../inquiry/authenticatedCustomerInquiry";

import type {
  AIEmployeeManifest,
  AIEmployeeRuntimeContract,
} from "./aiEmployeeManifest";

import {
  ASHA_INQUIRY_INTAKE_TEMPLATE,
} from "./employeeTemplateRegistry";

export const ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION =
  "nexus-asha-controlled-inquiry-intake-v1" as const;

export type AshaAuthenticatedInquiryCreator = (
  input: CreateAuthenticatedCustomerInquiryInput,
) => Promise<AuthenticatedCustomerInquiryResult>;

export interface AshaControlledInquiryIntakeInput {
  readonly manifest:
    AIEmployeeManifest;
  readonly runtime:
    AIEmployeeRuntimeContract;
  readonly inquiry:
    CreateAuthenticatedCustomerInquiryInput;
  readonly createInquiry?:
    AshaAuthenticatedInquiryCreator;
}

export interface AshaControlledInquiryIntakeReceipt {
  readonly version:
    typeof ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION;
  readonly employeeId: string;
  readonly templateId: string;
  readonly runtimeId: string;
  readonly runtimeDigest: string;
  readonly tenantId: string;
  readonly authenticatedInquiry:
    AuthenticatedCustomerInquiryResult;
  readonly workforceAuthority: Readonly<{
    employeeQualified: true;
    employeeOwnerActivated: true;
    controlledWorkAuthorized: true;
    toolId: "tool-inquiry-draft";
    toolMode: "DRAFT_ONLY";
    tenantScoped: true;
  }>;
  readonly safetyBoundary: Readonly<{
    recommendationGenerationAuthorized: false;
    externalMessageDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    paymentExecutionAuthorized: false;
    ownerApprovalRequiredBeforeExecution: true;
    executionMode: "SANDBOX_ONLY";
    publicLaunchAuthorized: false;
  }>;
  readonly receiptDigest: string;
}

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
            stableStringify(record[key]),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Asha inquiry value.",
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

function assertAshaManifest(
  manifest: AIEmployeeManifest,
): void {
  if (
    manifest.employeeId !==
      ASHA_INQUIRY_INTAKE_TEMPLATE
        .employeeId ||
    manifest.templateId !==
      ASHA_INQUIRY_INTAKE_TEMPLATE
        .templateId
  ) {
    throw new Error(
      "Only the official Asha inquiry-intake employee is authorized.",
    );
  }

  if (
    manifest.evaluation.status !==
      "QUALIFIED"
  ) {
    throw new Error(
      "Asha must be qualified before controlled inquiry work.",
    );
  }

  const expectedGrant =
    ASHA_INQUIRY_INTAKE_TEMPLATE
      .manifestInput
      .toolGrants
      .find(
        (grant) =>
          grant.toolId ===
          "tool-inquiry-draft",
      );

  if (!expectedGrant) {
    throw new Error(
      "Official Asha inquiry tool definition is missing.",
    );
  }

  const actualGrant =
    manifest.toolGrants.find(
      (grant) =>
        grant.toolId ===
        expectedGrant.toolId,
    );

  if (
    !actualGrant ||
    actualGrant.capability !==
      expectedGrant.capability ||
    actualGrant.mode !==
      expectedGrant.mode ||
    actualGrant.risk !==
      expectedGrant.risk
  ) {
    throw new Error(
      "Asha inquiry tool authorization does not match the canonical template.",
    );
  }

  if (
    manifest.safetyBoundary
      .ownerControlled !== true ||
    manifest.safetyBoundary
      .crossTenantAccessAuthorized !==
      false ||
    manifest.safetyBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    manifest.safetyBoundary
      .externalDeliveryAuthorized !==
      false ||
    manifest.safetyBoundary
      .paymentExecutionAuthorized !==
      false ||
    manifest.safetyBoundary
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Asha manifest safety boundary is invalid.",
    );
  }
}

function assertActiveRuntime(
  manifest: AIEmployeeManifest,
  runtime: AIEmployeeRuntimeContract,
): void {
  if (
    runtime.employeeId !==
      manifest.employeeId ||
    runtime.templateId !==
      manifest.templateId ||
    runtime.manifestDigest !==
      manifest.manifestDigest
  ) {
    throw new Error(
      "Asha runtime identity does not match the qualified manifest.",
    );
  }

  if (
    runtime.ownerActivated !== true ||
    runtime.runtimeState !==
      "READY_FOR_CONTROLLED_WORK" ||
    runtime.controlledWorkAuthorized !==
      true
  ) {
    throw new Error(
      "Asha runtime must be explicitly owner-activated for controlled work.",
    );
  }

  if (
    runtime.authority
      .ownerApprovalRequired !== true ||
    runtime.authority
      .approvalBypassAllowed !== false ||
    runtime.authority
      .tenantScoped !== true ||
    runtime.authority
      .crossTenantDelegationAllowed !==
      false
  ) {
    throw new Error(
      "Asha runtime authority boundary is invalid.",
    );
  }

  if (
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
      "Asha runtime safety boundary is invalid.",
    );
  }
}

function assertAuthenticatedInquiryResult(
  result:
    AuthenticatedCustomerInquiryResult,
  runtime:
    AIEmployeeRuntimeContract,
): void {
  if (
    result.outcome !== "CREATED" &&
    result.outcome !== "EXISTING"
  ) {
    throw new Error(
      "Authenticated inquiry outcome is invalid.",
    );
  }

  if (
    !result.inquiry ||
    result.inquiry.tenantId !==
      runtime.tenantId
  ) {
    throw new Error(
      "Authenticated inquiry tenant does not match the Asha runtime tenant.",
    );
  }

  if (
    result.inquiry.status !== "NEW"
  ) {
    throw new Error(
      "Authenticated inquiry status is invalid.",
    );
  }

  if (
    !result.intakeAuthority ||
    !result.safetyBoundary
  ) {
    throw new Error(
      "Authenticated inquiry evidence is incomplete.",
    );
  }

  if (
    result.safetyBoundary
      .recommendationStatus !==
      "NOT_GENERATED" ||
    result.safetyBoundary
      .ownerApprovalRequiredBeforeExecution !==
      true ||
    result.safetyBoundary
      .executionMode !==
      "SANDBOX_ONLY" ||
    result.safetyBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    result.safetyBoundary
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Authenticated inquiry safety boundary is invalid.",
    );
  }
}

export async function executeAshaControlledInquiryIntake(
  input:
    AshaControlledInquiryIntakeInput,
): Promise<AshaControlledInquiryIntakeReceipt> {
  assertAshaManifest(
    input.manifest,
  );

  assertActiveRuntime(
    input.manifest,
    input.runtime,
  );

  const requestedTenantId =
    input.inquiry.requestedTenantId;

  if (
    requestedTenantId !== undefined &&
    requestedTenantId !== null &&
    requestedTenantId !==
      input.runtime.tenantId
  ) {
    throw new Error(
      "Asha cannot submit an inquiry for another tenant.",
    );
  }

  const creator =
    input.createInquiry ??
    createAuthenticatedCustomerInquiry;

  if (typeof creator !== "function") {
    throw new Error(
      "Authenticated inquiry creator is not safely configured.",
    );
  }

  const authenticatedInquiry =
    await creator(input.inquiry);

  assertAuthenticatedInquiryResult(
    authenticatedInquiry,
    input.runtime,
  );

  const receiptCore = {
    version:
      ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION,
    employeeId:
      input.manifest.employeeId,
    templateId:
      input.manifest.templateId,
    runtimeId:
      input.runtime.runtimeId,
    runtimeDigest:
      input.runtime.runtimeDigest,
    tenantId:
      input.runtime.tenantId,
    authenticatedInquiry,
    workforceAuthority: {
      employeeQualified:
        true as const,
      employeeOwnerActivated:
        true as const,
      controlledWorkAuthorized:
        true as const,
      toolId:
        "tool-inquiry-draft" as const,
      toolMode:
        "DRAFT_ONLY" as const,
      tenantScoped:
        true as const,
    },
    safetyBoundary: {
      recommendationGenerationAuthorized:
        false as const,
      externalMessageDeliveryAuthorized:
        false as const,
      liveProviderExecutionAuthorized:
        false as const,
      paymentExecutionAuthorized:
        false as const,
      ownerApprovalRequiredBeforeExecution:
        true as const,
      executionMode:
        "SANDBOX_ONLY" as const,
      publicLaunchAuthorized:
        false as const,
    },
  };

  const receipt:
    AshaControlledInquiryIntakeReceipt = {
      ...receiptCore,
      receiptDigest:
        sha256(receiptCore),
    };

  return deepFreeze(
    receipt,
  ) as AshaControlledInquiryIntakeReceipt;
}
