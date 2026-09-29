export type Phase4LeadStage =
  | "NEW"
  | "QUALIFIED"
  | "PROPOSAL_READY"
  | "FOLLOWUP"
  | "WON"
  | "LOST";

export type Phase4PaymentState =
  | "NOT_REQUESTED"
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED";

export interface Phase4LeadOpportunity {
  opportunityId: string;
  customerName: string;
  stage: Phase4LeadStage;
  estimatedValue: number;
  qualified: boolean;
  proposalReady: boolean;
  followupDue: boolean;
}

export interface Phase4PaymentEvent {
  paymentId: string;
  opportunityId: string;
  state: Phase4PaymentState;
  amount: number;
}

export interface Phase4RevenueGrowthInput {
  generatedAt: string;
  opportunities: readonly Phase4LeadOpportunity[];
  payments: readonly Phase4PaymentEvent[];
}

export interface Phase4RevenueGrowthSnapshot {
  schemaVersion:
    "nexus-phase4-revenue-growth-system-v1";

  authorityBoundary: {
    customerContactAuthorized: false;
    quotationSendAuthorized: false;
    paymentExecutionAuthorized: false;
    moneyCollectionAuthorized: false;
    databaseMutationAuthorized: false;
    productionMutationAuthorized: false;
    ownerFinalCommercialAuthority: true;
  };

  leadOpportunityPipeline: {
    total: number;
    new: number;
    qualified: number;
    proposalReady: number;
    followup: number;
    won: number;
    lost: number;
    estimatedPipelineValue: number;
  };

  paymentSuccessFailure: {
    succeededCount: number;
    failedCount: number;
    pendingCount: number;
    succeededAmount: number;
    failedAmount: number;
  };

  conversionMetrics: {
    leadToQualifiedRate: number | null;
    qualifiedToProposalRate: number | null;
    proposalToWonRate: number | null;
    overallWinRate: number | null;
  };

  revenueDashboard: {
    pipelineValue: number;
    wonValue: number;
    collectedAmount: number;
    failedPaymentAmount: number;
    openOpportunityCount: number;
    ownerReviewRequiredCount: number;
  };
}

function finiteNonNegative(
  value: number,
  field: string,
): number {
  if(
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ){
    throw new Error(
      `Invalid Phase 4 numeric field: ${field}`,
    );
  }

  return value;
}

function rate(
  numerator: number,
  denominator: number,
): number | null {
  if(denominator === 0){
    return null;
  }

  return Number(
    ((numerator / denominator) * 100)
      .toFixed(2),
  );
}

export function buildPhase4RevenueGrowthSnapshot(
  input: Phase4RevenueGrowthInput,
): Phase4RevenueGrowthSnapshot {

  if(
    typeof input.generatedAt !== "string" ||
    input.generatedAt.trim().length === 0
  ){
    throw new Error(
      "Invalid Phase 4 generatedAt.",
    );
  }

  const total=
    input.opportunities.length;

  const newCount=
    input.opportunities.filter(
      (x) => x.stage === "NEW",
    ).length;

  const qualified=
    input.opportunities.filter(
      (x) =>
        x.qualified === true ||
        x.stage === "QUALIFIED" ||
        x.stage === "PROPOSAL_READY" ||
        x.stage === "FOLLOWUP" ||
        x.stage === "WON",
    ).length;

  const proposalReady=
    input.opportunities.filter(
      (x) =>
        x.proposalReady === true ||
        x.stage === "PROPOSAL_READY" ||
        x.stage === "FOLLOWUP" ||
        x.stage === "WON",
    ).length;

  const followup=
    input.opportunities.filter(
      (x) =>
        x.followupDue === true ||
        x.stage === "FOLLOWUP",
    ).length;

  const won=
    input.opportunities.filter(
      (x) => x.stage === "WON",
    );

  const lost=
    input.opportunities.filter(
      (x) => x.stage === "LOST",
    );

  const estimatedPipelineValue=
    input.opportunities
      .filter(
        (x) =>
          x.stage !== "WON" &&
          x.stage !== "LOST",
      )
      .reduce(
        (sum, x) =>
          sum +
          finiteNonNegative(
            x.estimatedValue,
            "estimatedValue",
          ),
        0,
      );

  const wonValue=
    won.reduce(
      (sum, x) =>
        sum +
        finiteNonNegative(
          x.estimatedValue,
          "wonValue",
        ),
      0,
    );

  const succeededPayments=
    input.payments.filter(
      (x) => x.state === "SUCCEEDED",
    );

  const failedPayments=
    input.payments.filter(
      (x) => x.state === "FAILED",
    );

  const pendingPayments=
    input.payments.filter(
      (x) => x.state === "PENDING",
    );

  const succeededAmount=
    succeededPayments.reduce(
      (sum, x) =>
        sum +
        finiteNonNegative(
          x.amount,
          "succeededAmount",
        ),
      0,
    );

  const failedAmount=
    failedPayments.reduce(
      (sum, x) =>
        sum +
        finiteNonNegative(
          x.amount,
          "failedAmount",
        ),
      0,
    );

  const openOpportunityCount=
    input.opportunities.filter(
      (x) =>
        x.stage !== "WON" &&
        x.stage !== "LOST",
    ).length;

  const ownerReviewRequiredCount=
    input.opportunities.filter(
      (x) =>
        x.stage === "PROPOSAL_READY" ||
        x.followupDue === true,
    ).length +
    failedPayments.length;

  return Object.freeze({
    schemaVersion:
      "nexus-phase4-revenue-growth-system-v1",

    authorityBoundary:
      Object.freeze({
        customerContactAuthorized: false,
        quotationSendAuthorized: false,
        paymentExecutionAuthorized: false,
        moneyCollectionAuthorized: false,
        databaseMutationAuthorized: false,
        productionMutationAuthorized: false,
        ownerFinalCommercialAuthority: true,
      }),

    leadOpportunityPipeline:
      Object.freeze({
        total,
        new: newCount,
        qualified,
        proposalReady,
        followup,
        won: won.length,
        lost: lost.length,
        estimatedPipelineValue:
          Number(
            estimatedPipelineValue
              .toFixed(2),
          ),
      }),

    paymentSuccessFailure:
      Object.freeze({
        succeededCount:
          succeededPayments.length,
        failedCount:
          failedPayments.length,
        pendingCount:
          pendingPayments.length,
        succeededAmount:
          Number(
            succeededAmount.toFixed(2),
          ),
        failedAmount:
          Number(
            failedAmount.toFixed(2),
          ),
      }),

    conversionMetrics:
      Object.freeze({
        leadToQualifiedRate:
          rate(qualified,total),

        qualifiedToProposalRate:
          rate(
            proposalReady,
            qualified,
          ),

        proposalToWonRate:
          rate(
            won.length,
            proposalReady,
          ),

        overallWinRate:
          rate(
            won.length,
            total,
          ),
      }),

    revenueDashboard:
      Object.freeze({
        pipelineValue:
          Number(
            estimatedPipelineValue
              .toFixed(2),
          ),

        wonValue:
          Number(
            wonValue.toFixed(2),
          ),

        collectedAmount:
          Number(
            succeededAmount.toFixed(2),
          ),

        failedPaymentAmount:
          Number(
            failedAmount.toFixed(2),
          ),

        openOpportunityCount,

        ownerReviewRequiredCount,
      }),
  });
}