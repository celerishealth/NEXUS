import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision,
} from "../ashaOwnerLimitedInternalPilotInquiryThreeReviewDecision";
import {
  createCoreLaunchEmployeeTemplateRegistry,
  type AIEmployeeTemplateRegistry,
} from "../employeeTemplateRegistry";
import type {
  MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision,
} from "../meeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision";
import type {
  RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,
} from "../riyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision";
import {
  createSalesCoreLaunchPilotCompletionRecord,
  validateSalesCoreLaunchPilotCompletionRecord,
  type CreateSalesCoreLaunchPilotCompletionRecordInput,
  type SalesCoreLaunchPilotCompletionRecord,
} from "../salesCoreLaunchPilotCompletionRecord";

function canonicalize(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) =>
          canonicalize(item),
        )
        .join(",") +
      "]"
    );
  }

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
          canonicalize(record[key]),
      )
      .join(",") +
    "}"
  );
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(canonicalize(value))
    .digest("hex");
}

function createDecision(
  employeeId: string,
  employeeCode: string,
  decisionId: string,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  const core = {
    decisionId,
    employeeId,
    employeeCode,
    department:
      "SALES",
    tenantId:
      "tenant-ppa-industrial-solution",
    ownerId:
      "owner-prashant-srivastav",
    limitedInternalPilotCompleted:
      true,
    nextStep:
      "LIMITED_INTERNAL_PILOT_COMPLETE",
    ...overrides,
  };

  return {
    ...core,
    decisionDigest:
      sha256(core),
  };
}

function createAshaDecision(
  overrides: Record<string, unknown> = {},
): AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision {
  return createDecision(
    "employee-asha-inquiry-intake-v1",
    "nx-sales-003",
    "asha-final-pilot-review-001",
    overrides,
  ) as unknown as
    AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision;
}

function createRiyaDecision(
  overrides: Record<string, unknown> = {},
): RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision {
  return createDecision(
    "employee-riya-recommendation-specialist-v1",
    "nx-sales-004",
    "riya-final-pilot-review-001",
    overrides,
  ) as unknown as
    RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision;
}

function createMeeraDecision(
  overrides: Record<string, unknown> = {},
): MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision {
  return createDecision(
    "employee-meera-quotation-proposal-specialist-v1",
    "nx-sales-005",
    "meera-final-pilot-review-001",
    overrides,
  ) as unknown as
    MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision;
}

function createInput(
  overrides:
    Partial<CreateSalesCoreLaunchPilotCompletionRecordInput> = {},
): CreateSalesCoreLaunchPilotCompletionRecordInput {
  return {
    completionId:
      "sales-core-launch-pilot-completion-001",
    registry:
      createCoreLaunchEmployeeTemplateRegistry(
        "2026-07-18T09:00:00.000Z",
      ),
    ashaDecision:
      createAshaDecision(),
    riyaDecision:
      createRiyaDecision(),
    meeraDecision:
      createMeeraDecision(),
    recordedAt:
      "2026-07-18T09:05:00.000Z",
    ...overrides,
  };
}

describe(
  "Sales core-launch pilot completion record",
  () => {
    it(
      "records completion for the exact three-employee Sales launch sequence",
      () => {
        const result =
          createSalesCoreLaunchPilotCompletionRecord(
            createInput(),
          );

        expect(
          result.completionState,
        ).toBe(
          "SALES_CORE_LAUNCH_PILOT_COMPLETION_RECORDED",
        );

        expect(
          result.completedEmployees.map(
            (employee) => [
              employee.employeeCode,
              employee.launchSequence,
            ],
          ),
        ).toEqual([
          ["nx-sales-003", 3],
          ["nx-sales-004", 4],
          ["nx-sales-005", 5],
        ]);

        expect(
          result.allLimitedInternalPilotsCompleted,
        ).toBe(true);

        expect(
          result.nextStep,
        ).toBe(
          "AWAIT_OWNER_SALES_CORE_LAUNCH_READINESS_DECISION",
        );

        expect(
          result.completionDigest,
        ).toMatch(/^[0-9a-f]{64}$/);

        expect(() =>
          validateSalesCoreLaunchPilotCompletionRecord(
            result,
          ),
        ).not.toThrow();
      },
    );

    it(
      "produces a deterministic completion digest",
      () => {
        const first =
          createSalesCoreLaunchPilotCompletionRecord(
            createInput(),
          );

        const second =
          createSalesCoreLaunchPilotCompletionRecord(
            createInput(),
          );

        expect(
          second.completionDigest,
        ).toBe(
          first.completionDigest,
        );
      },
    );

    it(
      "blocks a tampered source decision digest",
      () => {
        const asha =
          createAshaDecision();

        const tampered = {
          ...asha,
          ownerId:
            "owner-unauthorized",
        } as
          AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision;

        expect(() =>
          createSalesCoreLaunchPilotCompletionRecord(
            createInput({
              ashaDecision:
                tampered,
            }),
          ),
        ).toThrow(
          "Asha final pilot decision digest verification failed.",
        );
      },
    );

    it(
      "blocks an incomplete employee pilot",
      () => {
        expect(() =>
          createSalesCoreLaunchPilotCompletionRecord(
            createInput({
              ashaDecision:
                createAshaDecision({
                  limitedInternalPilotCompleted:
                    false,
                }),
            }),
          ),
        ).toThrow(
          "Asha final pilot decision limited internal pilot is not complete.",
        );
      },
    );

    it(
      "blocks cross-tenant completion aggregation",
      () => {
        expect(() =>
          createSalesCoreLaunchPilotCompletionRecord(
            createInput({
              riyaDecision:
                createRiyaDecision({
                  tenantId:
                    "tenant-other-business",
                }),
            }),
          ),
        ).toThrow(
          "Sales completion decisions must share one tenant and owner.",
        );
      },
    );

    it(
      "blocks a modified canonical employee launch sequence",
      () => {
        const registry =
          createCoreLaunchEmployeeTemplateRegistry(
            "2026-07-18T09:00:00.000Z",
          );

        const unsignedRegistry = {
          ...registry,
          templates:
            registry.templates.map(
              (template) =>
                template.employeeId ===
                "employee-riya-recommendation-specialist-v1"
                  ? {
                      ...template,
                      launchSequence:
                        6,
                    }
                  : template,
            ),
        } as Record<string, unknown>;

        delete unsignedRegistry.registryDigest;

        const modifiedRegistry = {
          ...unsignedRegistry,
          registryDigest:
            sha256(unsignedRegistry),
        } as unknown as
          AIEmployeeTemplateRegistry;

        expect(() =>
          createSalesCoreLaunchPilotCompletionRecord(
            createInput({
              registry:
                modifiedRegistry,
            }),
          ),
        ).toThrow(
          "Sales core-launch registry binding is invalid for employee-riya-recommendation-specialist-v1.",
        );
      },
    );

    it(
      "detects mutation of a completed record",
      () => {
        const record =
          createSalesCoreLaunchPilotCompletionRecord(
            createInput(),
          );

        const tampered = {
          ...record,
          ownerId:
            "owner-unauthorized",
        } as
          SalesCoreLaunchPilotCompletionRecord;

        expect(() =>
          validateSalesCoreLaunchPilotCompletionRecord(
            tampered,
          ),
        ).toThrow(
          "Sales core-launch pilot completion record digest verification failed.",
        );
      },
    );

    it(
      "keeps production and external authority blocked even after re-signing",
      () => {
        const record =
          createSalesCoreLaunchPilotCompletionRecord(
            createInput(),
          );

        const unsigned = {
          ...record,
        } as Record<string, unknown>;

        delete unsigned.completionDigest;

        unsigned.authorityBoundary = {
          ...record.authorityBoundary,
          productionAuthorityGranted:
            true,
        };

        const modified = {
          ...unsigned,
          completionDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchPilotCompletionRecord;

        expect(() =>
          validateSalesCoreLaunchPilotCompletionRecord(
            modified,
          ),
        ).toThrow(
          "Sales core-launch authority boundary is invalid.",
        );
      },
    );
  },
);
