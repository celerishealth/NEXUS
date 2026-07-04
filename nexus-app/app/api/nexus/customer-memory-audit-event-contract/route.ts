import { NextRequest, NextResponse } from "next/server";

import {
  createCustomerMemoryAuditEventContract,
  type CustomerMemoryAuditEventContractInput,
} from "../../../../lib/nexus/customerMemoryAuditEventContract";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryAuditEventContractInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  ownerId: "demo-owner",
  auditEventType: "final-response-safety-preview",
  auditMode: "audit-event-contract-preview",
  requestedAction: "preview-audit-event-contract-only",
  riskLevel: "low",
  safetyDecision: "safe-preview",
  ownerApprovalRequired: false,
  finalResponseSafetyGateDecision: "safe-preview",
  isFinalResponseSafeForPreview: true,
  proposedFinalResponsePreview:
    "Thank you for the update. We will review the request and share the next safe business step after owner approval if required.",
  hasRealDatabaseAccess: false,
  hasAuditWriteIntent: false,
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
  auditSubjects: [
    {
      subjectId: "demo-audit-subject-1",
      subjectType: "final-response-safety-preview",
      label: "Final response safety gate preview",
      source: "final-response-safety-gate-preview",
      riskLevel: "low",
      decision: "safe-preview",
      confidence: 0.92,
      auditAllowed: true,
      containsSensitiveData: false,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-audit-event-contract",
    method: "GET",
    ...createCustomerMemoryAuditEventContract(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryAuditEventContractInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-audit-event-contract",
      method: "POST",
      ...createCustomerMemoryAuditEventContract(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-audit-event-contract",
        method: "POST",
        ...createCustomerMemoryAuditEventContract({
          businessId: "",
          customerId: "",
          conversationId: "",
          ownerId: "",
          auditEventType: "final-response-safety-preview",
          auditMode: "audit-event-contract-preview",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          safetyDecision: "blocked",
          ownerApprovalRequired: false,
          finalResponseSafetyGateDecision: "blocked",
          isFinalResponseSafeForPreview: false,
          proposedFinalResponsePreview: "",
          hasRealDatabaseAccess: false,
          hasAuditWriteIntent: false,
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
          auditSubjects: [],
        }),
      },
      { status: 400 },
    );
  }
}
