import { NextRequest, NextResponse } from "next/server";

import {
  createCustomerMemoryResponseDraftContract,
  type CustomerMemoryResponseDraftContractInput,
} from "../../../../lib/nexus/customerMemoryResponseDraftContract";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryResponseDraftContractInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  responseDraftMode: "safe-preview",
  requestedAction: "preview-response-draft-contract-only",
  riskLevel: "low",
  ownerApprovalRequired: false,
  hasRealDatabaseAccess: false,
  hasWriteIntent: false,
  hasMessageSendingIntent: false,
  hasPaymentIntent: false,
  hasApprovalExecutionIntent: false,
  hasPromptExecutionIntent: false,
  hasAiModelExecutionIntent: false,
  hasResponseSendIntent: false,
  promptContextValidationDecision: "passed",
  isPromptContextValid: true,
  validatedPromptContextBlocks: [
    {
      blockId: "demo-response-draft-context-1",
      label: "Safe response draft context preview",
      value: "Customer prefers concise business updates.",
      source: "prompt-context-validation-preview",
      confidence: 0.92,
      validatedPromptContext: true,
      responseDraftAllowed: true,
      containsSensitiveData: false,
      requiresOwnerApproval: false,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-response-draft-contract",
    method: "GET",
    ...createCustomerMemoryResponseDraftContract(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryResponseDraftContractInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-response-draft-contract",
      method: "POST",
      ...createCustomerMemoryResponseDraftContract(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-response-draft-contract",
        method: "POST",
        ...createCustomerMemoryResponseDraftContract({
          businessId: "",
          customerId: "",
          conversationId: "",
          responseDraftMode: "safe-preview",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          ownerApprovalRequired: false,
          hasRealDatabaseAccess: false,
          hasWriteIntent: false,
          hasMessageSendingIntent: false,
          hasPaymentIntent: false,
          hasApprovalExecutionIntent: false,
          hasPromptExecutionIntent: false,
          hasAiModelExecutionIntent: false,
          hasResponseSendIntent: false,
          promptContextValidationDecision: "blocked",
          isPromptContextValid: false,
          validatedPromptContextBlocks: [],
        }),
      },
      { status: 400 },
    );
  }
}
