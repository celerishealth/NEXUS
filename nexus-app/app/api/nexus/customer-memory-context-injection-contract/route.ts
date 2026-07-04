import { NextRequest, NextResponse } from "next/server";

import {
  createCustomerMemoryContextInjectionContract,
  type CustomerMemoryContextInjectionContractInput,
} from "../../../../lib/nexus/customerMemoryContextInjectionContract";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryContextInjectionContractInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  requestedAction: "preview-context-injection-only",
  riskLevel: "low",
  ownerApprovalRequired: false,
  hasRealDatabaseAccess: false,
  hasWriteIntent: false,
  hasMessageSendingIntent: false,
  hasPaymentIntent: false,
  assembledContextBlocks: [
    {
      blockId: "demo-injection-1",
      label: "Safe customer preference preview",
      value: "Customer prefers concise business updates.",
      source: "context-assembly-validation-preview",
      confidence: 0.92,
      injectionAllowed: true,
      containsSensitiveData: false,
      requiresOwnerApproval: false,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-context-injection-contract",
    method: "GET",
    ...createCustomerMemoryContextInjectionContract(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryContextInjectionContractInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-context-injection-contract",
      method: "POST",
      ...createCustomerMemoryContextInjectionContract(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-context-injection-contract",
        method: "POST",
        ...createCustomerMemoryContextInjectionContract({
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
          assembledContextBlocks: [],
        }),
      },
      { status: 400 },
    );
  }
}
