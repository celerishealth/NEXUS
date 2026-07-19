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
} from "../employeeTemplateRegistry";
import type {
  MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision,
} from "../meeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision";
import type {
  RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,
} from "../riyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision";
import {
  createSalesCoreLaunchPilotCompletionRecord,
  type SalesCoreLaunchPilotCompletionRecord,
} from "../salesCoreLaunchPilotCompletionRecord";
import {
  createSalesCoreLaunchReadinessDecision,
  validateSalesCoreLaunchReadinessDecision,
  type CreateSalesCoreLaunchReadinessDecisionInput,
  type SalesCoreLaunchReadinessDecision,
} from "../salesCoreLaunchReadinessDecision";

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

function createFinalPilotDecision(
  employeeId: string,
  employeeCode: string,
  decisionId: string,
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
  };

  return {
    ...core,
    decisionDigest:
      sha256(core),
  };
}

function createCompletion():
  SalesCoreLaunchPilotCompletionRecord {
  return createSalesCoreLaunchPilotCompletionRecord({
    completionId:
      "sales-core-launch-pilot-completion-001",

    registry:
      createCoreLaunchEmployeeTemplateRegistry(
        "2026-07-18T09:00:00.000Z",
      ),

    ashaDecision:
      createFinalPilotDecision(
        "employee-asha-inquiry-intake-v1",
        "nx-sales-003",
        "asha-final-pilot-review-001",
      ) as unknown as
        AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision,

    riyaDecision:
      createFinalPilotDecision(
        "employee-riya-recommendation-specialist-v1",
        "nx-sales-004",
        "riya-final-pilot-review-001",
      ) as unknown as
        RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,

    meeraDecision:
      createFinalPilotDecision(
        "employee-meera-quotation-proposal-specialist-v1",
        "nx-sales-005",
        "meera-final-pilot-review-001",
      ) as unknown as
        MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision,

    recordedAt:
      "2026-07-18T09:05:00.000Z",
  });
}

function createInput(
  overrides:
    Partial<CreateSalesCoreLaunchReadinessDecisionInput> = {},
): CreateSalesCoreLaunchReadinessDecisionInput {
  return {
    salesCoreLaunchPilotCompletion:
      createCompletion(),

    decisionId:
      "sales-core-launch-readiness-decision-001",

    ownerId:
      "owner-prashant-srivastav",

    decision:
      "APPROVE_SALES_CORE_LAUNCH_READINESS",

    reason:
      "Owner verified the complete bounded Sales pilot evidence and approves internal launch readiness only.",

    decidedAt:
      "2026-07-18T09:10:00.000Z",

    ...overrides,
  };
}

describe(
  "Sales core-launch readiness decision",
  () => {
    it(
      "records owner approval from the verified Sales pilot completion",
      () => {
        const result =
          createSalesCoreLaunchReadinessDecision(
            createInput(),
          );

        expect(
          result.decisionState,
        ).toBe(
          "OWNER_SALES_CORE_LAUNCH_READINESS_DECISION_RECORDED",
        );

        expect(
          result.salesCoreLaunchReadinessApproved,
        ).toBe(true);

        expect(
          result.reviewedEvidence
            .completedEmployeeCodes,
        ).toEqual([
          "nx-sales-003",
          "nx-sales-004",
          "nx-sales-005",
        ]);

        expect(
          result.reviewedEvidence
            .completedLaunchSequence,
        ).toEqual([
          3,
          4,
          5,
        ]);

        expect(
          result.nextStep,
        ).toBe(
          "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLANNING",
        );

        expect(
          result.decisionDigest,
        ).toMatch(/^[0-9a-f]{64}$/);

        expect(() =>
          validateSalesCoreLaunchReadinessDecision(
            result,
          ),
        ).not.toThrow();
      },
    );

    it(
      "records rejection without discarding verified completion evidence",
      () => {
        const result =
          createSalesCoreLaunchReadinessDecision(
            createInput({
              decision:
                "REJECT_AND_RETAIN_SALES_CORE_LAUNCH_PILOT_COMPLETION",

              reason:
                "Owner retains the verified Sales pilot completion but does not approve launch readiness at this time.",
            }),
          );

        expect(
          result.salesCoreLaunchReadinessApproved,
        ).toBe(false);

        expect(
          result.nextStep,
        ).toBe(
          "RETAIN_SALES_CORE_LAUNCH_PILOT_COMPLETION_ONLY",
        );

        expect(
          result.sourceCompletionId,
        ).toBe(
          "sales-core-launch-pilot-completion-001",
        );
      },
    );

    it(
      "produces a deterministic decision digest",
      () => {
        const first =
          createSalesCoreLaunchReadinessDecision(
            createInput(),
          );

        const second =
          createSalesCoreLaunchReadinessDecision(
            createInput(),
          );

        expect(
          second.decisionDigest,
        ).toBe(
          first.decisionDigest,
        );
      },
    );

    it(
      "blocks a non-owner readiness decision",
      () => {
        expect(() =>
          createSalesCoreLaunchReadinessDecision(
            createInput({
              ownerId:
                "owner-unauthorized",
            }),
          ),
        ).toThrow(
          "Sales core-launch readiness decision owner does not match the completion owner.",
        );
      },
    );

    it(
      "blocks a readiness decision that precedes pilot completion",
      () => {
        expect(() =>
          createSalesCoreLaunchReadinessDecision(
            createInput({
              decidedAt:
                "2026-07-18T09:04:59.000Z",
            }),
          ),
        ).toThrow(
          "Sales core-launch readiness decision cannot precede pilot completion.",
        );
      },
    );

    it(
      "blocks tampered completion evidence",
      () => {
        const completion =
          createCompletion();

        const tampered = {
          ...completion,
          ownerId:
            "owner-unauthorized",
        } as
          SalesCoreLaunchPilotCompletionRecord;

        expect(() =>
          createSalesCoreLaunchReadinessDecision(
            createInput({
              salesCoreLaunchPilotCompletion:
                tampered,
            }),
          ),
        ).toThrow(
          "Sales core-launch pilot completion record digest verification failed.",
        );
      },
    );

    it(
      "detects mutation of a recorded readiness decision",
      () => {
        const record =
          createSalesCoreLaunchReadinessDecision(
            createInput(),
          );

        const tampered = {
          ...record,
          ownerId:
            "owner-unauthorized",
        } as
          SalesCoreLaunchReadinessDecision;

        expect(() =>
          validateSalesCoreLaunchReadinessDecision(
            tampered,
          ),
        ).toThrow(
          "Sales core-launch readiness decision digest verification failed.",
        );
      },
    );

    it(
      "keeps production and external authority blocked after re-signing",
      () => {
        const record =
          createSalesCoreLaunchReadinessDecision(
            createInput(),
          );

        const unsigned = {
          ...record,
        } as Record<string, unknown>;

        delete unsigned.decisionDigest;

        unsigned.authorityBoundary = {
          ...record.authorityBoundary,
          productionAuthorityGranted:
            true,
        };

        const modified = {
          ...unsigned,
          decisionDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchReadinessDecision;

        expect(() =>
          validateSalesCoreLaunchReadinessDecision(
            modified,
          ),
        ).toThrow(
          "Sales core-launch readiness authority boundary is invalid.",
        );
      },
    );
  },
);
