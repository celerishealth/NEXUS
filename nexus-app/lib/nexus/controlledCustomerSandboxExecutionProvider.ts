export interface ControlledCustomerSandboxExecutionInput {
  tenantId: string;
  inquiryId: string;
  recommendationId: string;
  recommendationText: string;
  rationale: string;
  confidence: number;
  riskFlags: readonly string[];
}

export interface ControlledCustomerSandboxExecutionDraft {
  responseDraft: string;
  internalNotes: string;
  riskFlags: readonly string[];
}

export interface ControlledCustomerSandboxExecutionProvider {
  readonly mode: "sandbox";
  readonly executorName: string;
  readonly executorVersion: string;

  execute(
    input: ControlledCustomerSandboxExecutionInput,
  ): Promise<ControlledCustomerSandboxExecutionDraft>;
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export class DeterministicCustomerSandboxExecutionProvider
implements ControlledCustomerSandboxExecutionProvider {
  readonly mode = "sandbox" as const;

  readonly executorName =
    "nexus-customer-response-sandbox";

  readonly executorVersion =
    "sandbox-execution-v1";

  async execute(
    input: ControlledCustomerSandboxExecutionInput,
  ): Promise<ControlledCustomerSandboxExecutionDraft> {
    const recommendationText =
      normalizeText(input.recommendationText);

    const riskFlags =
      Array.from(
        new Set(
          input.riskFlags.map(
            (flag) => normalizeText(flag),
          ),
        ),
      ).filter(Boolean);

    if (input.confidence < 0.65) {
      riskFlags.push(
        "owner-review-low-confidence",
      );
    }

    const responseDraft =
      [
        "Thank you for your inquiry.",
        recommendationText,
        "This draft is awaiting final delivery authorization and has not been sent.",
      ].join(" ");

    const internalNotes =
      [
        "Deterministic sandbox execution completed.",
        `Confidence: ${input.confidence.toFixed(2)}.`,
        "No email, WhatsApp, customer message, payment, order, or live provider action was executed.",
      ].join(" ");

    return {
      responseDraft,
      internalNotes,
      riskFlags:
        Array.from(new Set(riskFlags)),
    };
  }
}
