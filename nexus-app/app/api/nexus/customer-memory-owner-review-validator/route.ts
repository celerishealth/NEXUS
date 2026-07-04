import { NextRequest, NextResponse } from "next/server";

import {
  validateCustomerMemoryOwnerReviewPreview,
  type CustomerMemoryOwnerReviewValidationInput,
} from "../../../../lib/nexus/customerMemoryOwnerReviewValidator";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryOwnerReviewValidationInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  ownerId: "demo-owner",
  ownerReviewMode: "mandatory-owner-review-preview",
  requestedAction: "validate-owner-review-preview-only",
  riskLevel: "high",
  ownerApprovalRequired: true,
  hasRealDatabaseAccess: false,
  hasWriteIntent: false,
  hasCustomerDataWriteIntent: false,
  hasMessageSendingIntent: false,
  hasPaymentIntent: false,
  hasApprovalExecutionIntent: false,
  hasRejectExecutionIntent: false,
  hasOwnerDecisionExecutionIntent: false,
  hasPromptExecutionIntent: false,
  hasAiModelExecutionIntent: false,
  hasResponseGenerationIntent: false,
  hasResponseSendIntent: false,
  ownerReviewContractDecision: "contract-ready",
  isOwnerReviewContractReady: true,
  proposedResponseDraftPreview:
    "Thank you for the update. This request needs owner review before any final business action is taken.",
  ownerReviewInstruction:
    "Manual owner review is required. Keep this preview non-executing until the later safety architecture allows a controlled decision path.",
  ownerReviewContextBlocks: [
    {
      blockId: "demo-owner-review-validation-1",
      label: "Validated owner review context preview",
      value: "Customer prefers concise business updates and this case is routed to manual owner review.",
      source: "owner-review-contract-preview",
      confidence: 0.92,
      validatedByContract: true,
      ownerReviewAllowed: true,
      containsSensitiveData: false,
      requiresOwnerApproval: true,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-owner-review-validator",
    method: "GET",
    ...validateCustomerMemoryOwnerReviewPreview(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryOwnerReviewValidationInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-owner-review-validator",
      method: "POST",
      ...validateCustomerMemoryOwnerReviewPreview(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-owner-review-validator",
        method: "POST",
        ...validateCustomerMemoryOwnerReviewPreview({
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
          hasCustomerDataWriteIntent: false,
          hasMessageSendingIntent: false,
          hasPaymentIntent: false,
          hasApprovalExecutionIntent: false,
          hasRejectExecutionIntent: false,
          hasOwnerDecisionExecutionIntent: false,
          hasPromptExecutionIntent: false,
          hasAiModelExecutionIntent: false,
          hasResponseGenerationIntent: false,
          hasResponseSendIntent: false,
          ownerReviewContractDecision: "blocked",
          isOwnerReviewContractReady: false,
          proposedResponseDraftPreview: "",
          ownerReviewInstruction: "",
          ownerReviewContextBlocks: [],
        }),
      },
      { status: 400 },
    );
  }
}
