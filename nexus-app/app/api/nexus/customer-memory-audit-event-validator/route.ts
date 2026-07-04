import { NextRequest, NextResponse } from "next/server";

import {
  validateCustomerMemoryAuditEventPreview,
  type CustomerMemoryAuditEventValidationInput,
} from "../../../../lib/nexus/customerMemoryAuditEventValidator";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: CustomerMemoryAuditEventValidationInput = {
  businessId: "demo-business",
  customerId: "demo-customer",
  conversationId: "demo-conversation",
  ownerId: "demo-owner",
  auditEventPreviewId:
    "audit-preview-demo-business-demo-customer-demo-conversation-final-response-safety-preview",
  auditEventType: "final-response-safety-preview",
  auditMode: "audit-event-validation-preview",
  requestedAction: "validate-audit-event-preview-only",
  riskLevel: "low",
  safetyDecision: "safe-preview",
  ownerApprovalRequired: false,
  auditEventContractDecision: "contract-ready",
  isAuditEventContractReady: true,
  proposedFinalResponsePreview:
    "Thank you for the update. We will review the request and share the next safe business step after owner approval if required.",
  hasRealDatabaseAccess: false,
  hasAuditWriteIntent: false,
  hasAuditPersistenceIntent: false,
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
      subjectId: "demo-audit-validation-subject-1",
      subjectType: "final-response-safety-preview",
      label: "Validated audit event preview subject",
      source: "audit-event-contract-preview",
      riskLevel: "low",
      decision: "safe-preview",
      confidence: 0.92,
      validatedByContract: true,
      auditAllowed: true,
      containsSensitiveData: false,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    route: "/api/nexus/customer-memory-audit-event-validator",
    method: "GET",
    ...validateCustomerMemoryAuditEventPreview(SAMPLE_INPUT),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerMemoryAuditEventValidationInput;

    return NextResponse.json({
      route: "/api/nexus/customer-memory-audit-event-validator",
      method: "POST",
      ...validateCustomerMemoryAuditEventPreview(body),
    });
  } catch {
    return NextResponse.json(
      {
        route: "/api/nexus/customer-memory-audit-event-validator",
        method: "POST",
        ...validateCustomerMemoryAuditEventPreview({
          businessId: "",
          customerId: "",
          conversationId: "",
          ownerId: "",
          auditEventPreviewId: "",
          auditEventType: "final-response-safety-preview",
          auditMode: "audit-event-validation-preview",
          requestedAction: "invalid-json-payload",
          riskLevel: "low",
          safetyDecision: "blocked",
          ownerApprovalRequired: false,
          auditEventContractDecision: "blocked",
          isAuditEventContractReady: false,
          proposedFinalResponsePreview: "",
          hasRealDatabaseAccess: false,
          hasAuditWriteIntent: false,
          hasAuditPersistenceIntent: false,
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
