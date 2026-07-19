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
  createSalesCoreLaunchActivationPlanningRecord,
  validateSalesCoreLaunchActivationPlanningRecord,
  type CreateSalesCoreLaunchActivationPlanningRecordInput,
  type SalesCoreLaunchActivationPlanningRecord,
} from "../salesCoreLaunchActivationPlanningRecord";
import {
  createSalesCoreLaunchPilotCompletionRecord,
} from "../salesCoreLaunchPilotCompletionRecord";
import {
  createSalesCoreLaunchReadinessDecision,
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
          canonicalize(
            record[key],
          ),
      )
      .join(",") +
    "}"
  );
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      canonicalize(value),
    )
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

function createReadinessDecision(
  approved = true,
): SalesCoreLaunchReadinessDecision {
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

  return createSalesCoreLaunchReadinessDecision({
    salesCoreLaunchPilotCompletion:
      completion,

    decisionId:
      "sales-core-launch-readiness-decision-001",

    ownerId:
      "owner-prashant-srivastav",

    decision:
      approved
        ? "APPROVE_SALES_CORE_LAUNCH_READINESS"
        : "REJECT_AND_RETAIN_SALES_CORE_LAUNCH_PILOT_COMPLETION",

    reason:
      approved
        ? "Owner verified the bounded Sales pilot evidence and approves reversible internal activation planning only."
        : "Owner retains the verified Sales pilot completion and declines activation planning at this time.",

    decidedAt:
      "2026-07-18T09:10:00.000Z",
  });
}

function createInput(
  overrides:
    Partial<CreateSalesCoreLaunchActivationPlanningRecordInput> = {},
): CreateSalesCoreLaunchActivationPlanningRecordInput {
  return {
    planningId:
      "sales-core-launch-activation-planning-001",

    salesCoreLaunchReadinessDecision:
      createReadinessDecision(),

    preparedAt:
      "2026-07-18T09:15:00.000Z",

    ...overrides,
  };
}

describe(
  "Sales core-launch activation planning record",
  () => {
    it(
      "records the exact reversible internal Sales activation plan",
      () => {
        const result =
          createSalesCoreLaunchActivationPlanningRecord(
            createInput(),
          );

        expect(
          result.planningState,
        ).toBe(
          "SALES_CORE_LAUNCH_ACTIVATION_PLANNING_RECORDED",
        );

        expect(
          result.plannedEmployees.map(
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
          result.activationSequence,
        ).toEqual([
          3,
          4,
          5,
        ]);

        expect(
          result.activationPlanningPrepared,
        ).toBe(true);

        expect(
          result.nextStep,
        ).toBe(
          "AWAIT_OWNER_SALES_CORE_LAUNCH_ACTIVATION_PLAN_DECISION",
        );

        expect(
          result.planningDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(() =>
          validateSalesCoreLaunchActivationPlanningRecord(
            result,
          ),
        ).not.toThrow();
      },
    );

    it(
      "produces a deterministic planning digest",
      () => {
        const first =
          createSalesCoreLaunchActivationPlanningRecord(
            createInput(),
          );

        const second =
          createSalesCoreLaunchActivationPlanningRecord(
            createInput(),
          );

        expect(
          second.planningDigest,
        ).toBe(
          first.planningDigest,
        );
      },
    );

    it(
      "blocks planning after a rejected readiness decision",
      () => {
        expect(() =>
          createSalesCoreLaunchActivationPlanningRecord(
            createInput({
              salesCoreLaunchReadinessDecision:
                createReadinessDecision(
                  false,
                ),
            }),
          ),
        ).toThrow(
          "Sales core-launch readiness approval is required before activation planning.",
        );
      },
    );

    it(
      "blocks planning before the readiness decision",
      () => {
        expect(() =>
          createSalesCoreLaunchActivationPlanningRecord(
            createInput({
              preparedAt:
                "2026-07-18T09:09:59.000Z",
            }),
          ),
        ).toThrow(
          "Sales activation planning cannot precede the readiness decision.",
        );
      },
    );

    it(
      "blocks tampered readiness evidence",
      () => {
        const source =
          createReadinessDecision();

        const tampered = {
          ...source,
          ownerId:
            "owner-unauthorized",
        } as
          SalesCoreLaunchReadinessDecision;

        expect(() =>
          createSalesCoreLaunchActivationPlanningRecord(
            createInput({
              salesCoreLaunchReadinessDecision:
                tampered,
            }),
          ),
        ).toThrow(
          "Sales core-launch readiness decision digest verification failed.",
        );
      },
    );

    it(
      "detects mutation of the planning record",
      () => {
        const record =
          createSalesCoreLaunchActivationPlanningRecord(
            createInput(),
          );

        const tampered = {
          ...record,
          ownerId:
            "owner-unauthorized",
        } as
          SalesCoreLaunchActivationPlanningRecord;

        expect(() =>
          validateSalesCoreLaunchActivationPlanningRecord(
            tampered,
          ),
        ).toThrow(
          "Sales core-launch activation planning record digest verification failed.",
        );
      },
    );

    it(
      "blocks a modified employee activation sequence after re-signing",
      () => {
        const record =
          createSalesCoreLaunchActivationPlanningRecord(
            createInput(),
          );

        const unsigned = {
          ...record,
        } as Record<string, unknown>;

        delete unsigned.planningDigest;

        unsigned.plannedEmployees =
          record.plannedEmployees.map(
            (employee, index) =>
              index === 1
                ? {
                    ...employee,
                    launchSequence:
                      6,
                  }
                : employee,
          );

        const modified = {
          ...unsigned,
          planningDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchActivationPlanningRecord;

        expect(() =>
          validateSalesCoreLaunchActivationPlanningRecord(
            modified,
          ),
        ).toThrow(
          "Sales activation planning employee binding is invalid.",
        );
      },
    );

    it(
      "keeps runtime activation and external authority blocked after re-signing",
      () => {
        const record =
          createSalesCoreLaunchActivationPlanningRecord(
            createInput(),
          );

        const unsigned = {
          ...record,
        } as Record<string, unknown>;

        delete unsigned.planningDigest;

        unsigned.authorityBoundary = {
          ...record.authorityBoundary,
          runtimeActivationAuthorized:
            true,
        };

        const modified = {
          ...unsigned,
          planningDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchActivationPlanningRecord;

        expect(() =>
          validateSalesCoreLaunchActivationPlanningRecord(
            modified,
          ),
        ).toThrow(
          "Sales core-launch activation planning authority boundary is invalid.",
        );
      },
    );
  },
);
