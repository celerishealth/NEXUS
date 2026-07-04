import { NextRequest, NextResponse } from "next/server";

import {
  validateCustomerMemoryContextInjectionPreview,
  type CustomerMemoryContextInjectionValidationInput,
} from "../../../../lib/nexus/customerMemoryContextInjectionValidator";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryContextInjectionValidationInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  requestedAction: "validate-context-injection-only",
  riskLevel: "low",
  ownerApprovalRequired: false,
  hasRealDatabaseAccess: false,
  hasWriteIntent: false,
  hasMessageSendingIntent: false,
  hasPaymentIntent: false,
  hasApprovalExecutionIntent: false,
  hasPromptExecutionIntent: false,
  contractDecision: "contract-ready",
  isContractReady: true,
  injectionBlocks: [
    {
      blockId: "demo-validated-injection-1",
      label: "Validated customer preference preview",
      value: "Customer prefers concise business updates.",
      source: "context-injection-contract-preview",
      confidence: 0.92,
      injectionAllowed: true,
      containsSensitiveData: false,
      requiresOwnerApproval: false,
      approvedByContract: true,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-context-injection-validator",
    method: "GET",
    ...validateCustomerMemoryContextInjectionPreview(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryContextInjectionValidationInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-context-injection-validator",
      method: "POST",
      ...validateCustomerMemoryContextInjectionPreview(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-context-injection-validator",
        method: "POST",
        ...validateCustomerMemoryContextInjectionPreview({
          businessId: "",
          customerId: "",
          conversationId: "",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          ownerApprovalRequired: false,
          hasRealDatabaseAccess: false,
          hasWriteIntent: false,
          hasMessageSendingIntent: false,
          hasPaymentIntent: false,
          hasApprovalExecutionIntent: false,
          hasPromptExecutionIntent: false,
          contractDecision: "blocked",
          isContractReady: false,
          injectionBlocks: [],
        }),
      },
      { status: 400 },
    );
  }
}
