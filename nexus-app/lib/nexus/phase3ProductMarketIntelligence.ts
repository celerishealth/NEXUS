export interface Phase3MarketResearchSignal {
  signalId: string;
  sectorId: string;
  sourceType:
    | "CUSTOMER_INTERVIEW"
    | "COMPETITOR"
    | "MARKET_OBSERVATION"
    | "PRICING"
    | "PRODUCT_ANALYTICS"
    | "UX_RESEARCH";
  summary: string;
  confidence: number;
}

export interface Phase3SectorCandidate {
  sectorId: string;
  marketNeedScore: number;
  willingnessToPayScore: number;
  urgencyScore: number;
  competitionGapScore: number;
  deliveryFitScore: number;
}

export interface Phase3CustomerInterviewEvidence {
  interviewId: string;
  sectorId: string;
  customerType: string;
  problem: string;
  urgencyScore: number;
  evidenceStrength: number;
}

export interface Phase3CompetitorAlternative {
  competitorId: string;
  sectorId: string;
  alternativeType:
    | "DIRECT_COMPETITOR"
    | "MANUAL_WORKFLOW"
    | "SPREADSHEET"
    | "OUTSOURCED_SERVICE"
    | "DO_NOTHING"
    | "OTHER";
  strengthScore: number;
  gapSummary: string;
}

export interface Phase3PilotCustomerProfile {
  sectorId: string;
  customerType: string;
  minimumPainScore: number;
  minimumUrgencyScore: number;
  requiresFounderApproval: true;
}

export interface Phase3BacklogItem {
  itemId: string;
  title: string;
  customerValueScore: number;
  evidenceScore: number;
  strategicFitScore: number;
}

export interface Phase3UxResearchFinding {
  findingId: string;
  userType: string;
  summary: string;
  severity:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";
  evidenceStrength: number;
}

export interface Phase3ProductAnalyticsSignal {
  metricId: string;
  metricName: string;
  value: number;
  direction:
    | "UP"
    | "DOWN"
    | "FLAT";
  customerValueRelevance: number;
}

export interface Phase3ProductMarketIntelligenceInput {
  generatedAt: string;
  marketResearchSignals: readonly Phase3MarketResearchSignal[];
  sectors: readonly Phase3SectorCandidate[];
  interviews: readonly Phase3CustomerInterviewEvidence[];
  competitors: readonly Phase3CompetitorAlternative[];
  backlog: readonly Phase3BacklogItem[];
  uxFindings: readonly Phase3UxResearchFinding[];
  analyticsSignals: readonly Phase3ProductAnalyticsSignal[];
}

export interface Phase3ProductMarketIntelligenceSnapshot {
  schemaVersion:
    "nexus-phase3-product-market-intelligence-v1";

  generatedAt: string;

  authorityBoundary: {
    recommendationOnly: true;
    commercialFocusRequiresFounderApproval: true;
    autonomousExternalResearchAuthorized: false;
    autonomousCustomerContactAuthorized: false;
    productionMutationAuthorized: false;
    databaseMutationAuthorized: false;
  };

  continuousMarketResearch: {
    signalCount: number;
    averageConfidence: number | null;
  };

  sectorOpportunityScoring: readonly {
    sectorId: string;
    opportunityScore: number;
  }[];

  customerInterviewEvidence: {
    interviewCount: number;
    strongestProblem:
      | {
          interviewId: string;
          sectorId: string;
          problem: string;
          evidenceScore: number;
        }
      | null;
  };

  competitorAlternativeAnalysis: {
    alternativeCount: number;
    highestGapOpportunity:
      | {
          competitorId: string;
          sectorId: string;
          gapSummary: string;
          opportunityScore: number;
        }
      | null;
  };

  entrySectorRecommendation:
    | {
        sectorId: string;
        score: number;
        recommendationOnly: true;
      }
    | null;

  pilotCustomerProfile:
    | Phase3PilotCustomerProfile
    | null;

  customerValueRankedBacklog:
    readonly {
      itemId: string;
      title: string;
      score: number;
    }[];

  uxResearch: {
    findingCount: number;
    criticalOrHighCount: number;
  };

  productAnalytics: {
    signalCount: number;
    customerValueWeightedSignal: number | null;
  };
}

function finiteScore(
  value: number,
  name: string,
): number {
  if(
    typeof value !== "number" ||
    !Number.isFinite(value)
  ){
    throw new Error(
      `Invalid Phase 3 score: ${name}`,
    );
  }

  return value;
}

function average(
  values: readonly number[],
): number | null {
  if(values.length === 0){
    return null;
  }

  return Number(
    (
      values.reduce(
        (sum, value) => sum + value,
        0,
      ) / values.length
    ).toFixed(2),
  );
}

function sectorScore(
  sector: Phase3SectorCandidate,
): number {
  const weighted =
    finiteScore(
      sector.marketNeedScore,
      "marketNeedScore",
    ) * 0.25 +
    finiteScore(
      sector.willingnessToPayScore,
      "willingnessToPayScore",
    ) * 0.25 +
    finiteScore(
      sector.urgencyScore,
      "urgencyScore",
    ) * 0.2 +
    finiteScore(
      sector.competitionGapScore,
      "competitionGapScore",
    ) * 0.15 +
    finiteScore(
      sector.deliveryFitScore,
      "deliveryFitScore",
    ) * 0.15;

  return Number(weighted.toFixed(2));
}

function backlogScore(
  item: Phase3BacklogItem,
): number {
  return Number(
    (
      finiteScore(
        item.customerValueScore,
        "customerValueScore",
      ) * 0.5 +
      finiteScore(
        item.evidenceScore,
        "evidenceScore",
      ) * 0.3 +
      finiteScore(
        item.strategicFitScore,
        "strategicFitScore",
      ) * 0.2
    ).toFixed(2),
  );
}

export function buildPhase3ProductMarketIntelligenceSnapshot(
  input: Phase3ProductMarketIntelligenceInput,
): Phase3ProductMarketIntelligenceSnapshot {

  if(
    typeof input.generatedAt !== "string" ||
    input.generatedAt.trim().length === 0
  ){
    throw new Error(
      "Invalid Phase 3 generatedAt.",
    );
  }

  const sectorOpportunityScoring =
    [...input.sectors]
      .map(
        (sector) => ({
          sectorId: sector.sectorId,
          opportunityScore:
            sectorScore(sector),
        }),
      )
      .sort(
        (left, right) =>
          right.opportunityScore -
            left.opportunityScore ||
          left.sectorId.localeCompare(
            right.sectorId,
          ),
      );

  const strongestProblem =
    [...input.interviews]
      .map(
        (interview) => ({
          interviewId:
            interview.interviewId,
          sectorId:
            interview.sectorId,
          problem:
            interview.problem,
          evidenceScore:
            Number(
              (
                finiteScore(
                  interview.urgencyScore,
                  "interview.urgencyScore",
                ) * 0.5 +
                finiteScore(
                  interview.evidenceStrength,
                  "interview.evidenceStrength",
                ) * 0.5
              ).toFixed(2),
            ),
        }),
      )
      .sort(
        (left, right) =>
          right.evidenceScore -
            left.evidenceScore ||
          left.interviewId.localeCompare(
            right.interviewId,
          ),
      )[0] ?? null;

  const highestGapOpportunity =
    [...input.competitors]
      .map(
        (competitor) => ({
          competitorId:
            competitor.competitorId,
          sectorId:
            competitor.sectorId,
          gapSummary:
            competitor.gapSummary,
          opportunityScore:
            Number(
              (
                100 -
                finiteScore(
                  competitor.strengthScore,
                  "competitor.strengthScore",
                )
              ).toFixed(2),
            ),
        }),
      )
      .sort(
        (left, right) =>
          right.opportunityScore -
            left.opportunityScore ||
          left.competitorId.localeCompare(
            right.competitorId,
          ),
      )[0] ?? null;

  const bestSector =
    sectorOpportunityScoring[0] ?? null;

  const pilotCustomerProfile =
    bestSector === null
      ? null
      : Object.freeze({
          sectorId:
            bestSector.sectorId,
          customerType:
            strongestProblem?.sectorId ===
            bestSector.sectorId
              ? input.interviews.find(
                  (interview) =>
                    interview.interviewId ===
                    strongestProblem.interviewId,
                )?.customerType ??
                "UNVERIFIED_CUSTOMER_TYPE"
              : "UNVERIFIED_CUSTOMER_TYPE",
          minimumPainScore: 70,
          minimumUrgencyScore: 70,
          requiresFounderApproval:
            true as const,
        });

  const rankedBacklog =
    [...input.backlog]
      .map(
        (item) => ({
          itemId: item.itemId,
          title: item.title,
          score: backlogScore(item),
        }),
      )
      .sort(
        (left, right) =>
          right.score - left.score ||
          left.itemId.localeCompare(
            right.itemId,
          ),
      );

  const weightedAnalytics =
    input.analyticsSignals.length === 0
      ? null
      : Number(
          (
            input.analyticsSignals
              .reduce(
                (sum, signal) =>
                  sum +
                  finiteScore(
                    signal.value,
                    "analytics.value",
                  ) *
                  finiteScore(
                    signal.customerValueRelevance,
                    "analytics.customerValueRelevance",
                  ),
                0,
              ) /
            input.analyticsSignals.length
          ).toFixed(2),
        );

  return Object.freeze({
    schemaVersion:
      "nexus-phase3-product-market-intelligence-v1",

    generatedAt: input.generatedAt,

    authorityBoundary:
      Object.freeze({
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
      }),

    continuousMarketResearch:
      Object.freeze({
        signalCount:
          input.marketResearchSignals.length,
        averageConfidence:
          average(
            input.marketResearchSignals.map(
              (signal) =>
                finiteScore(
                  signal.confidence,
                  "marketResearch.confidence",
                ),
            ),
          ),
      }),

    sectorOpportunityScoring:
      Object.freeze(
        sectorOpportunityScoring,
      ),

    customerInterviewEvidence:
      Object.freeze({
        interviewCount:
          input.interviews.length,
        strongestProblem,
      }),

    competitorAlternativeAnalysis:
      Object.freeze({
        alternativeCount:
          input.competitors.length,
        highestGapOpportunity,
      }),

    entrySectorRecommendation:
      bestSector === null
        ? null
        : Object.freeze({
            sectorId:
              bestSector.sectorId,
            score:
              bestSector.opportunityScore,
            recommendationOnly:
              true as const,
          }),

    pilotCustomerProfile,

    customerValueRankedBacklog:
      Object.freeze(rankedBacklog),

    uxResearch:
      Object.freeze({
        findingCount:
          input.uxFindings.length,
        criticalOrHighCount:
          input.uxFindings.filter(
            (finding) =>
              finding.severity ===
                "CRITICAL" ||
              finding.severity ===
                "HIGH",
          ).length,
      }),

    productAnalytics:
      Object.freeze({
        signalCount:
          input.analyticsSignals.length,
        customerValueWeightedSignal:
          weightedAnalytics,
      }),
  });
}