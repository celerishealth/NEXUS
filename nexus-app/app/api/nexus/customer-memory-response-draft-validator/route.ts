import { NextRequest, NextResponse } from "next/server";

import {
  validateCustomerMemoryResponseDraftPreview,
  type CustomerMemoryResponseDraftValidationInput,
} from "../../../../lib/nexus/customerMemoryResponseDraftValidator";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryResponseDraftValidationInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  responseDraftMode: "safe-preview",
  requestedAction: "validate-response-draft-preview-only",
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
  hasResponseGenerationIntent: false,
  responseDraftContractDecision: "contract-ready",
  isResponseDraftContractReady: true,
  proposedResponseDraftPreview:
    "Thank you for the update. We will review the request and share the next safe business step after owner approval if required.",
  responseDraftContextBlocks: [
    {
      blockId: "demo-response-draft-validation-1",
      label: "Validated response draft context preview",
      value: "Customer prefers concise business updates.",
      source: "response-draft-contract-preview",
      confidence: 0.92,
      validatedByContract: true,
      responseDraftAllowed: true,
      containsSensitiveData: false,
      requiresOwnerApproval: false,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-response-draft-validator",
    method: "GET",
    ...validateCustomerMemoryResponseDraftPreview(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryResponseDraftValidationInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-response-draft-validator",
      method: "POST",
      ...validateCustomerMemoryResponseDraftPreview(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-response-draft-validator",
        method: "POST",
        ...validateCustomerMemoryResponseDraftPreview({
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
          hasResponseGenerationIntent: false,
          responseDraftContractDecision: "blocked",
          isResponseDraftContractReady: false,
          proposedResponseDraftPreview: "",
          responseDraftContextBlocks: [],
        }),
      },
      { status: 400 },
    );
  }
}
