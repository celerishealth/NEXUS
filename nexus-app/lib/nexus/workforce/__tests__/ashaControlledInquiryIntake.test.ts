
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createAIEmployeeManifest,
  createAIEmployeeRuntimeContract,
  type AIEmployeeManifest,
  type AIEmployeeManifestInput,
  type AIEmployeeRuntimeContract,
} from "../aiEmployeeManifest";

import {
  ASHA_INQUIRY_INTAKE_TEMPLATE,
} from "../employeeTemplateRegistry";

import {
  executeAshaControlledInquiryIntake,
  type AshaAuthenticatedInquiryCreator,
} from "../ashaControlledInquiryIntake";

import type {
  AuthenticatedCustomerInquiryResult,
  CreateAuthenticatedCustomerInquiryInput,
} from "../../inquiry/authenticatedCustomerInquiry";

function qualifiedManifest(
  overrides:
    Partial<AIEmployeeManifestInput> = {},
): AIEmployeeManifest {
  const source =
    ASHA_INQUIRY_INTAKE_TEMPLATE
      .manifestInput;

  return createAIEmployeeManifest({
    ...source,
    skills: [
      ...source.skills,
    ],
    toolGrants: [
      ...source.toolGrants,
    ],
    knowledgePolicy: {
      ...source.knowledgePolicy,
      sourceTypes: [
        ...source.knowledgePolicy
          .sourceTypes,
      ],
    },
    approvalPolicy: {
      ...source.approvalPolicy,
      requiredFor: [
        ...source.approvalPolicy
          .requiredFor,
      ],
    },
    kpis: [
      ...source.kpis,
    ],
    escalationPolicy: {
      ...source.escalationPolicy,
      escalateOn: [
        ...source.escalationPolicy
          .escalateOn,
      ],
    },
    auditPolicy: {
      ...source.auditPolicy,
    },
    evaluation: {
      status:
        "QUALIFIED",
      testCasesPassed:
        100,
      testCasesRequired:
        100,
      adversarialTestsPassed:
        true,
      tenantIsolationPassed:
        true,
      ownerControlPassed:
        true,
      emergencyPausePassed:
        true,
    },
    ...overrides,
  });
}

function activeRuntime(
  manifest:
    AIEmployeeManifest =
      qualifiedManifest(),
): AIEmployeeRuntimeContract {
  return createAIEmployeeRuntimeContract({
    manifest,
    runtimeId:
      "runtime-asha-active-001",
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    ownerActivated:
      true,
    startedAt:
      "2026-07-15T10:00:00.000Z",
  });
}

function inquiryInput(
  overrides:
    Partial<CreateAuthenticatedCustomerInquiryInput> = {},
): CreateAuthenticatedCustomerInquiryInput {
  return {
    principal:
      null,
    accessRepositories:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "accessRepositories"
      ],
    workspaceRepository:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "workspaceRepository"
      ],
    inquiryRepository:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "inquiryRepository"
      ],
    requestedTenantId:
      "tenant-ppa-industrial",
    idempotencyKey:
      "asha-inquiry-request-001",
    channel:
      "WEB",
    customerName:
      "PPA Customer",
    customerEmail:
      "customer@example.com",
    customerPhone:
      null,
    message:
      "Please help me select industrial safety equipment.",
    ...overrides,
  };
}

function authenticatedResult(
  overrides:
    Partial<AuthenticatedCustomerInquiryResult> = {},
): AuthenticatedCustomerInquiryResult {
  return {
    outcome:
      "CREATED",
    inquiry: {
      id:
        "inquiry-asha-001",
      tenantId:
        "tenant-ppa-industrial",
      customerName:
        "PPA Customer",
      customerEmail:
        "customer@example.com",
      customerPhone:
        null,
      channel:
        "WEB",
      message:
        "Please help me select industrial safety equipment.",
      status:
        "NEW",
      createdAt:
        "2026-07-15T10:01:00.000Z",
    },
    intakeAuthority: {
      createdByUserId:
        "owner-prashant-001",
      sourceSessionId:
        "session-asha-001",
      role:
        "OWNER",
    },
    safetyBoundary: {
      recommendationStatus:
        "NOT_GENERATED",
      ownerApprovalRequiredBeforeExecution:
        true,
      executionMode:
        "SANDBOX_ONLY",
      liveProviderExecutionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    },
    ...overrides,
  };
}

describe(
  "Asha controlled inquiry intake",
  () => {
    it(
      "routes an active qualified Asha employee through the authenticated inquiry creator",
      async () => {
        const manifest =
          qualifiedManifest();

        const runtime =
          activeRuntime(manifest);

        const inquiry =
          inquiryInput();

        const creator =
          vi.fn<
            AshaAuthenticatedInquiryCreator
          >(
            async () =>
              authenticatedResult(),
          );

        const receipt =
          await executeAshaControlledInquiryIntake({
            manifest,
            runtime,
            inquiry,
            createInquiry:
              creator,
          });

        expect(creator).toHaveBeenCalledTimes(
          1,
        );

        expect(
          creator,
        ).toHaveBeenCalledWith(
          inquiry,
        );

        expect(
          receipt.authenticatedInquiry
            .outcome,
        ).toBe("CREATED");

        expect(
          receipt.tenantId,
        ).toBe(
          "tenant-ppa-industrial",
        );

        expect(
          receipt.workforceAuthority
            .toolId,
        ).toBe(
          "tool-inquiry-draft",
        );

        expect(
          receipt.workforceAuthority
            .controlledWorkAuthorized,
        ).toBe(true);

        expect(
          receipt.safetyBoundary
            .recommendationGenerationAuthorized,
        ).toBe(false);

        expect(
          receipt.safetyBoundary
            .externalMessageDeliveryAuthorized,
        ).toBe(false);
      },
    );

    it(
      "preserves idempotent existing inquiry outcomes",
      async () => {
        const manifest =
          qualifiedManifest();

        const receipt =
          await executeAshaControlledInquiryIntake({
            manifest,
            runtime:
              activeRuntime(manifest),
            inquiry:
              inquiryInput(),
            createInquiry:
              async () =>
                authenticatedResult({
                  outcome:
                    "EXISTING",
                }),
          });

        expect(
          receipt.authenticatedInquiry
            .outcome,
        ).toBe("EXISTING");
      },
    );

    it(
      "creates deterministic immutable intake evidence",
      async () => {
        const manifest =
          qualifiedManifest();

        const runtime =
          activeRuntime(manifest);

        const creator:
          AshaAuthenticatedInquiryCreator =
            async () =>
              authenticatedResult();

        const first =
          await executeAshaControlledInquiryIntake({
            manifest,
            runtime,
            inquiry:
              inquiryInput(),
            createInquiry:
              creator,
          });

        const second =
          await executeAshaControlledInquiryIntake({
            manifest,
            runtime,
            inquiry:
              inquiryInput(),
            createInquiry:
              creator,
          });

        expect(
          first.receiptDigest,
        ).toBe(
          second.receiptDigest,
        );

        expect(
          first.receiptDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authenticatedInquiry,
          ),
        ).toBe(true);
      },
    );

    it(
      "blocks Asha before qualification",
      async () => {
        const source =
          ASHA_INQUIRY_INTAKE_TEMPLATE
            .manifestInput;

        const unqualified =
          createAIEmployeeManifest({
            ...source,
            skills: [
              ...source.skills,
            ],
            toolGrants: [
              ...source.toolGrants,
            ],
            knowledgePolicy: {
              ...source.knowledgePolicy,
              sourceTypes: [
                ...source
                  .knowledgePolicy
                  .sourceTypes,
              ],
            },
            approvalPolicy: {
              ...source.approvalPolicy,
              requiredFor: [
                ...source
                  .approvalPolicy
                  .requiredFor,
              ],
            },
            kpis: [
              ...source.kpis,
            ],
            escalationPolicy: {
              ...source.escalationPolicy,
              escalateOn: [
                ...source
                  .escalationPolicy
                  .escalateOn,
              ],
            },
            auditPolicy: {
              ...source.auditPolicy,
            },
          });

        const creator =
          vi.fn<
            AshaAuthenticatedInquiryCreator
          >();

        await expect(
          executeAshaControlledInquiryIntake({
            manifest:
              unqualified,
            runtime: {
              ...activeRuntime(),
              employeeId:
                unqualified.employeeId,
              templateId:
                unqualified.templateId,
              manifestDigest:
                unqualified.manifestDigest,
            },
            inquiry:
              inquiryInput(),
            createInquiry:
              creator,
          }),
        ).rejects.toThrow(
          "must be qualified",
        );

        expect(creator).not.toHaveBeenCalled();
      },
    );

    it(
      "blocks a paused runtime",
      async () => {
        const manifest =
          qualifiedManifest();

        const paused =
          createAIEmployeeRuntimeContract({
            manifest,
            runtimeId:
              "runtime-asha-paused-001",
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            ownerActivated:
              false,
            startedAt:
              "2026-07-15T10:00:00.000Z",
          });

        await expect(
          executeAshaControlledInquiryIntake({
            manifest,
            runtime:
              paused,
            inquiry:
              inquiryInput(),
            createInquiry:
              async () =>
                authenticatedResult(),
          }),
        ).rejects.toThrow(
          "explicitly owner-activated",
        );
      },
    );

    it(
      "blocks any non-Asha employee identity",
      async () => {
        const manifest =
          qualifiedManifest({
            employeeId:
              "employee-other-inquiry-v1",
            templateId:
              "template-other-inquiry-v1",
          });

        await expect(
          executeAshaControlledInquiryIntake({
            manifest,
            runtime:
              activeRuntime(manifest),
            inquiry:
              inquiryInput(),
            createInquiry:
              async () =>
                authenticatedResult(),
          }),
        ).rejects.toThrow(
          "Only the official Asha",
        );
      },
    );

    it(
      "blocks manifest and runtime digest mismatch",
      async () => {
        const manifest =
          qualifiedManifest();

        const runtime = {
          ...activeRuntime(manifest),
          manifestDigest:
            "f".repeat(64),
        } as AIEmployeeRuntimeContract;

        await expect(
          executeAshaControlledInquiryIntake({
            manifest,
            runtime,
            inquiry:
              inquiryInput(),
            createInquiry:
              async () =>
                authenticatedResult(),
          }),
        ).rejects.toThrow(
          "runtime identity does not match",
        );
      },
    );

    it(
      "blocks missing or altered canonical inquiry tool authorization",
      async () => {
        const source =
          ASHA_INQUIRY_INTAKE_TEMPLATE
            .manifestInput;

        const manifest =
          qualifiedManifest({
            toolGrants:
              source.toolGrants.filter(
                (grant) =>
                  grant.toolId !==
                  "tool-inquiry-draft",
              ),
          });

        await expect(
          executeAshaControlledInquiryIntake({
            manifest,
            runtime:
              activeRuntime(manifest),
            inquiry:
              inquiryInput(),
            createInquiry:
              async () =>
                authenticatedResult(),
          }),
        ).rejects.toThrow(
          "does not match the canonical template",
        );
      },
    );

    it(
      "blocks a requested cross-tenant inquiry before calling persistence",
      async () => {
        const manifest =
          qualifiedManifest();

        const creator =
          vi.fn<
            AshaAuthenticatedInquiryCreator
          >();

        await expect(
          executeAshaControlledInquiryIntake({
            manifest,
            runtime:
              activeRuntime(manifest),
            inquiry:
              inquiryInput({
                requestedTenantId:
                  "tenant-other-business",
              }),
            createInquiry:
              creator,
          }),
        ).rejects.toThrow(
          "cannot submit an inquiry for another tenant",
        );

        expect(creator).not.toHaveBeenCalled();
      },
    );

    it(
      "blocks a persisted cross-tenant inquiry result",
      async () => {
        const manifest =
          qualifiedManifest();

        await expect(
          executeAshaControlledInquiryIntake({
            manifest,
            runtime:
              activeRuntime(manifest),
            inquiry:
              inquiryInput(),
            createInquiry:
              async () =>
                authenticatedResult({
                  inquiry: {
                    ...authenticatedResult()
                      .inquiry,
                    tenantId:
                      "tenant-other-business",
                  },
                }),
          }),
        ).rejects.toThrow(
          "tenant does not match",
        );
      },
    );

    it(
      "blocks an unsafe authenticated inquiry safety boundary",
      async () => {
        const manifest =
          qualifiedManifest();

        const unsafe =
          {
            ...authenticatedResult(),
            safetyBoundary: {
              ...authenticatedResult()
                .safetyBoundary,
              liveProviderExecutionAuthorized:
                true,
            },
          } as unknown as
            AuthenticatedCustomerInquiryResult;

        await expect(
          executeAshaControlledInquiryIntake({
            manifest,
            runtime:
              activeRuntime(manifest),
            inquiry:
              inquiryInput(),
            createInquiry:
              async () =>
                unsafe,
          }),
        ).rejects.toThrow(
          "safety boundary is invalid",
        );
      },
    );

    it(
      "propagates authenticated inquiry denial without fabricating success",
      async () => {
        const manifest =
          qualifiedManifest();

        const denial =
          new Error(
            "Authenticated inquiry denied.",
          );

        await expect(
          executeAshaControlledInquiryIntake({
            manifest,
            runtime:
              activeRuntime(manifest),
            inquiry:
              inquiryInput(),
            createInquiry:
              async () => {
                throw denial;
              },
          }),
        ).rejects.toBe(denial);
      },
    );

    it(
      "keeps live execution, external delivery, payment, and public launch blocked",
      async () => {
        const manifest =
          qualifiedManifest();

        const receipt =
          await executeAshaControlledInquiryIntake({
            manifest,
            runtime:
              activeRuntime(manifest),
            inquiry:
              inquiryInput(),
            createInquiry:
              async () =>
                authenticatedResult(),
          });

        expect(
          receipt.safetyBoundary
            .liveProviderExecutionAuthorized,
        ).toBe(false);

        expect(
          receipt.safetyBoundary
            .externalMessageDeliveryAuthorized,
        ).toBe(false);

        expect(
          receipt.safetyBoundary
            .paymentExecutionAuthorized,
        ).toBe(false);

        expect(
          receipt.safetyBoundary
            .publicLaunchAuthorized,
        ).toBe(false);

        expect(
          receipt.safetyBoundary
            .ownerApprovalRequiredBeforeExecution,
        ).toBe(true);

        expect(
          receipt.safetyBoundary
            .executionMode,
        ).toBe(
          "SANDBOX_ONLY",
        );
      },
    );
  },
);
