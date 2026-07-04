import { NextRequest, NextResponse } from "next/server";

import {
  createCustomerMemoryPromptContextContract,
  type CustomerMemoryPromptContextContractInput,
} from "../../../../lib/nexus/customerMemoryPromptContextContract";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryPromptContextContractInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  promptContextMode: "safe-preview",
  requestedAction: "preview-prompt-context-only",
  riskLevel: "low",
  ownerApprovalRequired: false,
  hasRealDatabaseAccess: false,
  hasWriteIntent: false,
  hasMessageSendingIntent: false,
  hasPaymentIntent: false,
  hasApprovalExecutionIntent: false,
  hasPromptExecutionIntent: false,
  injectionValidationDecision: "passed",
  isInjectionValid: true,
  validatedInjectionBlocks: [
    {
      blockId: "demo-prompt-context-1",
      label: "Safe prompt context preview",
      value: "Customer prefers concise business updates.",
      source: "context-injection-validation-preview",
      confidence: 0.92,
      validatedForInjection: true,
      promptContextAllowed: true,
      containsSensitiveData: false,
      requiresOwnerApproval: false,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-prompt-context-contract",
    method: "GET",
    ...createCustomerMemoryPromptContextContract(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryPromptContextContractInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-prompt-context-contract",
      method: "POST",
      ...createCustomerMemoryPromptContextContract(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-prompt-context-contract",
        method: "POST",
        ...createCustomerMemoryPromptContextContract({
          businessId: "",
          customerId: "",
          conversationId: "",
          promptContextMode: "safe-preview",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          ownerApprovalRequired: false,
          hasRealDatabaseAccess: false,
          hasWriteIntent: false,
          hasMessageSendingIntent: false,
          hasPaymentIntent: false,
          hasApprovalExecutionIntent: false,
          hasPromptExecutionIntent: false,
          injectionValidationDecision: "blocked",
          isInjectionValid: false,
          validatedInjectionBlocks: [],
        }),
      },
      { status: 400 },
    );
  }
}
