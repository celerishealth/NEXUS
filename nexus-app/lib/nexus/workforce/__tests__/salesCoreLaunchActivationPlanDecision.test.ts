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
  createSalesCoreLaunchActivationPlanDecision,
  validateSalesCoreLaunchActivationPlanDecision,
  type CreateSalesCoreLaunchActivationPlanDecisionInput,
  type SalesCoreLaunchActivationPlanDecision,
} from "../salesCoreLaunchActivationPlanDecision";
import {
  createSalesCoreLaunchActivationPlanningRecord,
  type SalesCoreLaunchActivationPlanningRecord,
} from "../salesCoreLaunchActivationPlanningRecord";
import {
  createSalesCoreLaunchPilotCompletionRecord,
} from "../salesCoreLaunchPilotCompletionRecord";
import {
  createSalesCoreLaunchReadinessDecision,
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

function createPlanning():
  SalesCoreLaunchActivationPlanningRecord {
  const completion =
    createSalesCoreLaunchPilotCompletionRecord({
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

  const readiness =
    createSalesCoreLaunchReadinessDecision({
      salesCoreLaunchPilotCompletion:
        completion,

      decisionId:
        "sales-core-launch-readiness-decision-001",

      ownerId:
        "owner-prashant-srivastav",

      decision:
        "APPROVE_SALES_CORE_LAUNCH_READINESS",

      reason:
        "Owner verified the Sales pilot evidence and approves reversible internal activation planning only.",

      decidedAt:
        "2026-07-18T09:10:00.000Z",
    });

  return createSalesCoreLaunchActivationPlanningRecord({
    planningId:
      "sales-core-launch-activation-planning-001",

    salesCoreLaunchReadinessDecision:
      readiness,

    preparedAt:
      "2026-07-18T09:15:00.000Z",
  });
}

function createInput(
  overrides:
    Partial<CreateSalesCoreLaunchActivationPlanDecisionInput> = {},
): CreateSalesCoreLaunchActivationPlanDecisionInput {
  return {
    salesCoreLaunchActivationPlanning:
      createPlanning(),

    decisionId:
      "sales-core-launch-activation-plan-decision-001",

    ownerId:
      "owner-prashant-srivastav",

    decision:
      "APPROVE_SALES_CORE_LAUNCH_ACTIVATION_PLAN",

    reason:
      "Owner approves preparation of bounded owner-activated runtimes while all execution and external authority remain blocked.",

    decidedAt:
      "2026-07-18T09:20:00.000Z",

    ...overrides,
  };
}

describe(
  "Sales core-launch activation-plan decision",
  () => {
    it(
      "records owner approval and grants preparation eligibility only",
      () => {
        const result =
          createSalesCoreLaunchActivationPlanDecision(
            createInput(),
          );

        expect(
          result.decisionState,
        ).toBe(
          "OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION_RECORDED",
        );

        expect(
          result.activationPlanApproved,
        ).toBe(true);

        expect(
          result.runtimeActivationPreparationEligible,
        ).toBe(true);

        expect(
          result.employeeActivationEligibility.map(
            (employee) => [
              employee.employeeCode,
              employee.launchSequence,
              employee.runtimeActivationEligible,
            ],
          ),
        ).toEqual([
          ["nx-sales-003", 3, true],
          ["nx-sales-004", 4, true],
          ["nx-sales-005", 5, true],
        ]);

        expect(
          result.nextStep,
        ).toBe(
          "PREPARE_SALES_CORE_LAUNCH_OWNER_ACTIVATED_RUNTIMES",
        );

        expect(
          result.decisionDigest,
        ).toMatch(/^[0-9a-f]{64}$/);

        expect(() =>
          validateSalesCoreLaunchActivationPlanDecision(
            result,
          ),
        ).not.toThrow();
      },
    );

    it(
      "records rejection and retains activation planning only",
      () => {
        const result =
          createSalesCoreLaunchActivationPlanDecision(
            createInput({
              decision:
                "REJECT_AND_RETAIN_SALES_CORE_LAUNCH_ACTIVATION_PLANNING",

              reason:
                "Owner retains the verified activation plan but declines runtime preparation eligibility at this time.",
            }),
          );

        expect(
          result.activationPlanApproved,
        ).toBe(false);

        expect(
          result.runtimeActivationPreparationEligible,
        ).toBe(false);

        expect(
          result.nextStep,
        ).toBe(
          "RETAIN_SALES_CORE_LAUNCH_ACTIVATION_PLANNING_ONLY",
        );
      },
    );

    it(
      "produces a deterministic decision digest",
      () => {
        const first =
          createSalesCoreLaunchActivationPlanDecision(
            createInput(),
          );

        const second =
          createSalesCoreLaunchActivationPlanDecision(
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
      "blocks a non-owner activation-plan decision",
      () => {
        expect(() =>
          createSalesCoreLaunchActivationPlanDecision(
            createInput({
              ownerId:
                "owner-unauthorized",
            }),
          ),
        ).toThrow(
          "Sales core-launch activation-plan decision owner does not match the planning owner.",
        );
      },
    );

    it(
      "blocks a decision that precedes activation planning",
      () => {
        expect(() =>
          createSalesCoreLaunchActivationPlanDecision(
            createInput({
              decidedAt:
                "2026-07-18T09:14:59.000Z",
            }),
          ),
        ).toThrow(
          "Sales core-launch activation-plan decision cannot precede activation planning.",
        );
      },
    );

    it(
      "blocks tampered activation-planning evidence",
      () => {
        const planning =
          createPlanning();

        const tampered = {
          ...planning,
          ownerId:
            "owner-unauthorized",
        } as
          SalesCoreLaunchActivationPlanningRecord;

        expect(() =>
          createSalesCoreLaunchActivationPlanDecision(
            createInput({
              salesCoreLaunchActivationPlanning:
                tampered,
            }),
          ),
        ).toThrow(
          "Sales core-launch activation planning record digest verification failed.",
        );
      },
    );

    it(
      "detects mutation of the recorded decision",
      () => {
        const record =
          createSalesCoreLaunchActivationPlanDecision(
            createInput(),
          );

        const tampered = {
          ...record,
          ownerId:
            "owner-unauthorized",
        } as
          SalesCoreLaunchActivationPlanDecision;

        expect(() =>
          validateSalesCoreLaunchActivationPlanDecision(
            tampered,
          ),
        ).toThrow(
          "Sales core-launch activation-plan decision digest verification failed.",
        );
      },
    );

    it(
      "keeps runtime activation and consequential authority blocked after re-signing",
      () => {
        const record =
          createSalesCoreLaunchActivationPlanDecision(
            createInput(),
          );

        const unsigned = {
          ...record,
        } as Record<string, unknown>;

        delete unsigned.decisionDigest;

        unsigned.authorityBoundary = {
          ...record.authorityBoundary,
          runtimeActivationAuthorized:
            true,
        };

        const modified = {
          ...unsigned,
          decisionDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchActivationPlanDecision;

        expect(() =>
          validateSalesCoreLaunchActivationPlanDecision(
            modified,
          ),
        ).toThrow(
          "Sales core-launch activation-plan authority boundary is invalid.",
        );
      },
    );
  },
);
