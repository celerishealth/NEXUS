import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildPhase4RevenueGrowthSnapshot,
} from "../phase4RevenueGrowthSystem";

describe(
  "Phase 4 Revenue Growth System",
  () => {
    const snapshot=
      buildPhase4RevenueGrowthSnapshot({
        generatedAt:
          "2026-09-29T21:30:00+05:30",

        opportunities: [
          {
            opportunityId: "o1",
            customerName: "A",
            stage: "NEW",
            estimatedValue: 100,
            qualified: false,
            proposalReady: false,
            followupDue: false,
          },
          {
            opportunityId: "o2",
            customerName: "B",
            stage: "QUALIFIED",
            estimatedValue: 200,
            qualified: true,
            proposalReady: false,
            followupDue: false,
          },
          {
            opportunityId: "o3",
            customerName: "C",
            stage: "PROPOSAL_READY",
            estimatedValue: 300,
            qualified: true,
            proposalReady: true,
            followupDue: true,
          },
          {
            opportunityId: "o4",
            customerName: "D",
            stage: "WON",
            estimatedValue: 400,
            qualified: true,
            proposalReady: true,
            followupDue: false,
          },
          {
            opportunityId: "o5",
            customerName: "E",
            stage: "LOST",
            estimatedValue: 500,
            qualified: false,
            proposalReady: false,
            followupDue: false,
          },
        ],

        payments: [
          {
            paymentId: "p1",
            opportunityId: "o4",
            state: "SUCCEEDED",
            amount: 400,
          },
          {
            paymentId: "p2",
            opportunityId: "o3",
            state: "FAILED",
            amount: 300,
          },
          {
            paymentId: "p3",
            opportunityId: "o2",
            state: "PENDING",
            amount: 200,
          },
        ],
      });

    it(
      "builds the lead opportunity pipeline",
      () => {
        expect(
          snapshot.leadOpportunityPipeline,
        ).toEqual({
          total: 5,
          new: 1,
          qualified: 3,
          proposalReady: 2,
          followup: 1,
          won: 1,
          lost: 1,
          estimatedPipelineValue: 600,
        });
      },
    );

    it(
      "tracks payment success and failure without executing payments",
      () => {
        expect(
          snapshot.paymentSuccessFailure,
        ).toEqual({
          succeededCount: 1,
          failedCount: 1,
          pendingCount: 1,
          succeededAmount: 400,
          failedAmount: 300,
        });

        expect(
          snapshot.authorityBoundary
            .paymentExecutionAuthorized,
        ).toBe(false);
      },
    );

    it(
      "calculates conversion metrics",
      () => {
        expect(
          snapshot.conversionMetrics,
        ).toEqual({
          leadToQualifiedRate: 60,
          qualifiedToProposalRate: 66.67,
          proposalToWonRate: 50,
          overallWinRate: 20,
        });
      },
    );

    it(
      "builds the owner-controlled revenue dashboard",
      () => {
        expect(
          snapshot.revenueDashboard,
        ).toEqual({
          pipelineValue: 600,
          wonValue: 400,
          collectedAmount: 400,
          failedPaymentAmount: 300,
          openOpportunityCount: 3,
          ownerReviewRequiredCount: 2,
        });
      },
    );

    it(
      "preserves commercial authority boundaries",
      () => {
        expect(
          snapshot.authorityBoundary,
        ).toEqual({
          customerContactAuthorized: false,
          quotationSendAuthorized: false,
          paymentExecutionAuthorized: false,
          moneyCollectionAuthorized: false,
          databaseMutationAuthorized: false,
          productionMutationAuthorized: false,
          ownerFinalCommercialAuthority: true,
        });
      },
    );
  },
);