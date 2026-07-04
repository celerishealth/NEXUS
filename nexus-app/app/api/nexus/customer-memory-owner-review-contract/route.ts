import { NextRequest, NextResponse } from "next/server";

import {
  createCustomerMemoryOwnerReviewContract,
  type CustomerMemoryOwnerReviewContractInput,
} from "../../../../lib/nexus/customerMemoryOwnerReviewContract";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryOwnerReviewContractInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  ownerId: "demo-owner",
  ownerReviewMode: "owner-review-preview",
  requestedAction: "preview-owner-review-contract-only",
  riskLevel: "medium",
  ownerApprovalRequired: true,
  hasRealDatabaseAccess: false,
  hasWriteIntent: false,
  hasMessageSendingIntent: false,
  hasPaymentIntent: false,
  hasApprovalExecutionIntent: false,
  hasRejectExecutionIntent: false,
  hasPromptExecutionIntent: false,
  hasAiModelExecutionIntent: false,
  hasResponseGenerationIntent: false,
  hasResponseSendIntent: false,
  responseDraftValidationDecision: "passed",
  isResponseDraftValid: true,
  proposedResponseDraftPreview:
    "Thank you for the update. This request needs owner review before any final business action is taken.",
  ownerReviewContextBlocks: [
    {
      blockId: "demo-owner-review-context-1",
      label: "Validated owner review context preview",
      value: "Customer prefers concise business updates and this case requires owner review before action.",
      source: "response-draft-validation-preview",
      confidence: 0.92,
      validatedForOwnerReview: true,
      ownerReviewAllowed: true,
      containsSensitiveData: false,
      requiresOwnerApproval: true,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-owner-review-contract",
    method: "GET",
    ...createCustomerMemoryOwnerReviewContract(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryOwnerReviewContractInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-owner-review-contract",
      method: "POST",
      ...createCustomerMemoryOwnerReviewContract(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-owner-review-contract",
        method: "POST",
        ...createCustomerMemoryOwnerReviewContract({
          businessId: "",
          customerId: "",
          conversationId: "",
          ownerId: "",
          ownerReviewMode: "owner-review-preview",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          ownerApprovalRequired: false,
          hasRealDatabaseAccess: false,
          hasWriteIntent: false,
          hasMessageSendingIntent: false,
          hasPaymentIntent: false,
          hasApprovalExecutionIntent: false,
          hasRejectExecutionIntent: false,
          hasPromptExecutionIntent: false,
          hasAiModelExecutionIntent: false,
          hasResponseGenerationIntent: false,
          hasResponseSendIntent: false,
          responseDraftValidationDecision: "blocked",
          isResponseDraftValid: false,
          proposedResponseDraftPreview: "",
          ownerReviewContextBlocks: [],
        }),
      },
      { status: 400 },
    );
  }
}
