import { NextRequest, NextResponse } from "next/server";

import {
  validateCustomerMemoryContextAssemblyPreview,
  type CustomerMemoryContextAssemblyValidationInput,
} from "../../../../lib/nexus/customerMemoryContextAssemblyValidator";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryContextAssemblyValidationInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  assemblyMode: "safe-preview",
  requestedAction: "preview-context-only",
  riskLevel: "low",
  ownerApprovalRequired: false,
  hasRealDatabaseAccess: false,
  hasWriteIntent: false,
  memoryContextBlocks: [
    {
      blockId: "demo-context-1",
      label: "Customer preference preview",
      value: "Customer prefers concise business updates.",
      source: "context-assembly-contract-preview",
      confidence: 0.92,
      isAllowedForContext: true,
      containsSensitiveData: false,
      requiresOwnerApproval: false,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-context-assembly-validator",
    method: "GET",
    ...validateCustomerMemoryContextAssemblyPreview(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryContextAssemblyValidationInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-context-assembly-validator",
      method: "POST",
      ...validateCustomerMemoryContextAssemblyPreview(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-context-assembly-validator",
        method: "POST",
        ...validateCustomerMemoryContextAssemblyPreview({
          businessId: "",
          customerId: "",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          ownerApprovalRequired: false,
          hasRealDatabaseAccess: false,
          hasWriteIntent: false,
          memoryContextBlocks: [],
        }),
      },
      { status: 400 },
    );
  }
}
