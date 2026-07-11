export interface ControlledCustomerRecommendationProviderInput {
  tenantId: string;
  inquiryId: string;
  inquiryMessage: string;
}

export interface ControlledCustomerRecommendationDraft {
  recommendationText: string;
  rationale: string;
  confidence: number;
  riskFlags: readonly string[];
}

export interface ControlledCustomerRecommendationProvider {
  readonly mode: "sandbox";
  readonly providerName: string;
  readonly modelName: string;

  generateRecommendation(
    input: ControlledCustomerRecommendationProviderInput,
  ): Promise<ControlledCustomerRecommendationDraft>;
}

function normalizeMessage(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function containsAny(
  message: string,
  keywords: readonly string[],
): boolean {
  return keywords.some(
    (keyword) => message.includes(keyword),
  );
}

export class DeterministicSandboxRecommendationProvider
implements ControlledCustomerRecommendationProvider {
  readonly mode = "sandbox" as const;
  readonly providerName =
    "nexus-deterministic-sandbox";
  readonly modelName =
    "sandbox-recommendation-v1";

  async generateRecommendation(
    input: ControlledCustomerRecommendationProviderInput,
  ): Promise<ControlledCustomerRecommendationDraft> {
    const message =
      normalizeMessage(input.inquiryMessage);

    const lowerMessage =
      message.toLowerCase();

    const riskFlags: string[] = [];

    if (
      containsAny(lowerMessage, [
        "urgent",
        "immediately",
        "today",
        "asap",
      ])
    ) {
      riskFlags.push(
        "customer-expresses-urgency",
      );
    }

    if (
      containsAny(lowerMessage, [
        "refund",
        "complaint",
        "angry",
        "cancel",
      ])
    ) {
      riskFlags.push(
        "customer-service-escalation",
      );
    }

    if (
      containsAny(lowerMessage, [
        "guarantee",
        "100%",
        "promise",
      ])
    ) {
      riskFlags.push(
        "avoid-unverified-guarantee",
      );
    }

    let recommendationText =
      "Acknowledge the customer's requirement, confirm the missing business details, and present the safest matching option for owner review.";

    let rationale =
      "The inquiry does not contain enough verified product, price, availability, or policy data for a definitive response.";

    let confidence = 0.55;

    if (
      containsAny(lowerMessage, [
        "price",
        "cost",
        "budget",
        "quotation",
        "quote",
      ])
    ) {
      recommendationText =
        "Confirm the customer's required scope and budget, then prepare a transparent quotation using only owner-approved pricing and availability.";

      rationale =
        "The inquiry has commercial intent, but pricing and availability must remain owner-controlled.";

      confidence = 0.72;
    }

    if (
      containsAny(lowerMessage, [
        "best option",
        "recommend",
        "suggest",
        "which one",
      ])
    ) {
      recommendationText =
        "Ask for the customer's priority, budget, quantity, and timeline, then compare the eligible options and prepare one primary recommendation plus one safe alternative.";

      rationale =
        "A recommendation request requires preference and constraint clarification before a reliable option can be selected.";

      confidence = 0.76;
    }

    if (riskFlags.length > 0) {
      confidence = Math.min(
        confidence,
        0.68,
      );
    }

    return {
      recommendationText,
      rationale,
      confidence,
      riskFlags,
    };
  }
}
