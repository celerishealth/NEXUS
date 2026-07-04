import { NextRequest, NextResponse } from "next/server";

import {
  runCustomerMemoryFinalResponseSafetyGate,
  type CustomerMemoryFinalResponseSafetyGateInput,
} from "../../../../lib/nexus/customerMemoryFinalResponseSafetyGate";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryFinalResponseSafetyGateInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  ownerId: "demo-owner",
  finalResponseMode: "safe-preview",
  requestedAction: "preview-final-response-safety-gate-only",
  riskLevel: "low",
  ownerApprovalRequired: false,
  ownerReviewValidationDecision: "passed",
  isOwnerReviewValid: true,
  proposedFinalResponsePreview:
    "Thank you for the update. We will review the request and share the next safe business step after owner approval if required.",
  hasRealDatabaseAccess: false,
  hasWriteIntent: false,
  hasCustomerDataWriteIntent: false,
  hasMemoryWriteIntent: false,
  hasMessageSendingIntent: false,
  hasPaymentIntent: false,
  hasApprovalExecutionIntent: false,
  hasRejectExecutionIntent: false,
  hasOwnerDecisionExecutionIntent: false,
  hasPromptExecutionIntent: false,
  hasAiModelExecutionIntent: false,
  hasResponseGenerationIntent: false,
  hasResponseSendIntent: false,
  finalResponseSafetyBlocks: [
    {
      blockId: "demo-final-response-safety-1",
      label: "Validated final response safety preview",
      value: "Customer prefers concise business updates and this preview remains non-executing.",
      source: "owner-review-validation-preview",
      confidence: 0.92,
      validatedByOwnerReview: true,
      finalResponseAllowed: true,
      containsSensitiveData: false,
      requiresOwnerApproval: false,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-final-response-safety-gate",
    method: "GET",
    ...runCustomerMemoryFinalResponseSafetyGate(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryFinalResponseSafetyGateInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-final-response-safety-gate",
      method: "POST",
      ...runCustomerMemoryFinalResponseSafetyGate(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-final-response-safety-gate",
        method: "POST",
        ...runCustomerMemoryFinalResponseSafetyGate({
          businessId: "",
          customerId: "",
          conversationId: "",
          ownerId: "",
          finalResponseMode: "safe-preview",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          ownerApprovalRequired: false,
          ownerReviewValidationDecision: "blocked",
          isOwnerReviewValid: false,
          proposedFinalResponsePreview: "",
          hasRealDatabaseAccess: false,
          hasWriteIntent: false,
          hasCustomerDataWriteIntent: false,
          hasMemoryWriteIntent: false,
          hasMessageSendingIntent: false,
          hasPaymentIntent: false,
          hasApprovalExecutionIntent: false,
          hasRejectExecutionIntent: false,
          hasOwnerDecisionExecutionIntent: false,
          hasPromptExecutionIntent: false,
          hasAiModelExecutionIntent: false,
          hasResponseGenerationIntent: false,
          hasResponseSendIntent: false,
          finalResponseSafetyBlocks: [],
        }),
      },
      { status: 400 },
    );
  }
}
