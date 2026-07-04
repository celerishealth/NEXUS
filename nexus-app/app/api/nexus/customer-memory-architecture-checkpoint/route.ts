import { NextRequest, NextResponse } from "next/server";

import {
  createCustomerMemoryArchitectureCheckpointPreview,
  type CustomerMemoryArchitectureCheckpointInput,
} from "../../../../lib/nexus/customerMemoryArchitectureCheckpoint";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryArchitectureCheckpointInput = {
  businessId: "demo-business",
  ownerId: "demo-owner",
  checkpointMode: "customer-memory-architecture-review-preview",
  requestedAction: "preview-customer-memory-architecture-checkpoint-only",
  riskLevel: "low",
  ownerApprovalRequired: false,
  hasRealDatabaseAccess: false,
  hasAuditWriteIntent: false,
  hasAuditPersistenceIntent: false,
  hasRecoveryWriteIntent: false,
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
  hasRecoveryExecutionIntent: false,
  hasPipelineExecutionIntent: false,
  hasExternalSystemMutationIntent: false,
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-architecture-checkpoint",
    method: "GET",
    ...createCustomerMemoryArchitectureCheckpointPreview(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryArchitectureCheckpointInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-architecture-checkpoint",
      method: "POST",
      ...createCustomerMemoryArchitectureCheckpointPreview(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-architecture-checkpoint",
        method: "POST",
        ...createCustomerMemoryArchitectureCheckpointPreview({
          businessId: "",
          ownerId: "",
          checkpointMode: "customer-memory-architecture-review-preview",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          ownerApprovalRequired: false,
          hasRealDatabaseAccess: false,
          hasAuditWriteIntent: false,
          hasAuditPersistenceIntent: false,
          hasRecoveryWriteIntent: false,
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
          hasRecoveryExecutionIntent: false,
          hasPipelineExecutionIntent: false,
          hasExternalSystemMutationIntent: false,
          checkpointStages: [],
        }),
      },
      { status: 400 },
    );
  }
}
