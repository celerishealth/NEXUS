import { NextResponse } from "next/server";

import {
  validateCustomerMemoryPromptContextPreview,
  type CustomerMemoryPromptContextValidationInput,
} from "../../../../lib/nexus/customerMemoryPromptContextValidator";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryPromptContextValidationInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  promptContextMode: "safe-preview",
  requestedAction: "validate-prompt-context-only",
  riskLevel: "low",
  ownerApprovalRequired: false,
  hasRealDatabaseAccess: false,
  hasWriteIntent: false,
  hasMessageSendingIntent: false,
  hasPaymentIntent: false,
  hasApprovalExecutionIntent: false,
  hasPromptExecutionIntent: false,
  hasAiModelExecutionIntent: false,
  promptContextContractDecision: "contract-ready",
  isPromptContextContractReady: true,
  promptContextBlocks: [
    {
      blockId: "demo-validated-prompt-context-1",
      label: "Validated prompt context preview",
      value: "Customer prefers concise business updates.",
      source: "prompt-context-contract-preview",
      confidence: 0.92,
      validatedByContract: true,
      promptContextAllowed: true,
      containsSensitiveData: false,
      requiresOwnerApproval: false,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-prompt-context-validator",
    method: "GET",
    ...validateCustomerMemoryPromptContextPreview(SAMPLE_INPUT),
  });
}
