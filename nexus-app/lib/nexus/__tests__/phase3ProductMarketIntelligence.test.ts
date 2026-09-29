import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildPhase3ProductMarketIntelligenceSnapshot,
} from "../phase3ProductMarketIntelligence";

describe(
  "Phase 3 Product & Market Intelligence",
  () => {
    const snapshot =
      buildPhase3ProductMarketIntelligenceSnapshot({
        generatedAt:
          "2026-09-29T21:15:00+05:30",

        marketResearchSignals: [
          {
            signalId: "signal-1",
            sectorId: "industrial-safety",
            sourceType:
              "MARKET_OBSERVATION",
            summary:
              "Repeated operational pain",
            confidence: 90,
          },
          {
            signalId: "signal-2",
            sectorId: "industrial-safety",
            sourceType:
              "CUSTOMER_INTERVIEW",
            summary:
              "High urgency workflow",
            confidence: 80,
          },
        ],

        sectors: [
          {
            sectorId:
              "industrial-safety",
            marketNeedScore: 95,
            willingnessToPayScore: 85,
            urgencyScore: 90,
            competitionGapScore: 75,
            deliveryFitScore: 92,
          },
          {
            sectorId:
              "generic-small-business",
            marketNeedScore: 60,
            willingnessToPayScore: 50,
            urgencyScore: 55,
            competitionGapScore: 40,
            deliveryFitScore: 80,
          },
        ],

        interviews: [
          {
            interviewId: "interview-1",
            sectorId:
              "industrial-safety",
            customerType:
              "industrial-distributor",
            problem:
              "Manual inquiry and follow-up loss",
            urgencyScore: 95,
            evidenceStrength: 90,
          },
        ],

        competitors: [
          {
            competitorId: "manual-work",
            sectorId:
              "industrial-safety",
            alternativeType:
              "MANUAL_WORKFLOW",
            strengthScore: 35,
            gapSummary:
              "Slow fragmented follow-up",
          },
        ],

        backlog: [
          {
            itemId: "item-low",
            title: "Decorative dashboard",
            customerValueScore: 30,
            evidenceScore: 20,
            strategicFitScore: 40,
          },
          {
            itemId: "item-high",
            title:
              "Owner-controlled inquiry workflow",
            customerValueScore: 95,
            evidenceScore: 90,
            strategicFitScore: 95,
          },
        ],

        uxFindings: [
          {
            findingId: "ux-1",
            userType: "owner",
            summary:
              "Too many decisions visible",
            severity: "HIGH",
            evidenceStrength: 90,
          },
        ],

        analyticsSignals: [
          {
            metricId: "metric-1",
            metricName:
              "qualified inquiry rate",
            value: 80,
            direction: "UP",
            customerValueRelevance: 0.9,
          },
        ],
      });

    it(
      "supports continuous market research",
      () => {
        expect(
          snapshot.continuousMarketResearch,
        ).toEqual({
          signalCount: 2,
          averageConfidence: 85,
        });
      },
    );

    it(
      "scores and recommends the strongest sector",
      () => {
        expect(
          snapshot.sectorOpportunityScoring[0]
            .sectorId,
        ).toBe("industrial-safety");

        expect(
          snapshot.entrySectorRecommendation,
        ).toMatchObject({
          sectorId:
            "industrial-safety",
          recommendationOnly: true,
        });
      },
    );

    it(
      "preserves customer interview evidence",
      () => {
        expect(
          snapshot.customerInterviewEvidence
            .strongestProblem,
        ).toMatchObject({
          interviewId: "interview-1",
          problem:
            "Manual inquiry and follow-up loss",
        });
      },
    );

    it(
      "analyzes competitor alternatives",
      () => {
        expect(
          snapshot
            .competitorAlternativeAnalysis
            .highestGapOpportunity,
        ).toMatchObject({
          competitorId: "manual-work",
          opportunityScore: 65,
        });
      },
    );

    it(
      "creates a bounded pilot customer profile",
      () => {
        expect(
          snapshot.pilotCustomerProfile,
        ).toEqual({
          sectorId:
            "industrial-safety",
          customerType:
            "industrial-distributor",
          minimumPainScore: 70,
          minimumUrgencyScore: 70,
          requiresFounderApproval: true,
        });
      },
    );

    it(
      "ranks backlog by customer value and evidence",
      () => {
        expect(
          snapshot.customerValueRankedBacklog[0]
            .itemId,
        ).toBe("item-high");
      },
    );

    it(
      "summarizes UX research",
      () => {
        expect(
          snapshot.uxResearch,
        ).toEqual({
          findingCount: 1,
          criticalOrHighCount: 1,
        });
      },
    );

    it(
      "summarizes product analytics",
      () => {
        expect(
          snapshot.productAnalytics,
        ).toEqual({
          signalCount: 1,
          customerValueWeightedSignal: 72,
        });
      },
    );

    it(
      "keeps commercial and execution authority with founder",
      () => {
        expect(
          snapshot.authorityBoundary,
        ).toEqual({
          recommendationOnly: true,
          commercialFocusRequiresFounderApproval:
            true,
          autonomousExternalResearchAuthorized:
            false,
          autonomousCustomerContactAuthorized:
            false,
          productionMutationAuthorized:
            false,
          databaseMutationAuthorized:
            false,
        });
      },
    );
  },
);