export const NEXUS_TOP_CUSTOMER_VALUE_GATE_QUESTION =
  "Kya ye paying customer lane ya existing customer ko result dene me help karta hai?" as const;

export type NexusTopCustomerValueGateAnswer =
  | "YES"
  | "NO";

export interface NexusTopCustomerValueGateInput {
  readonly payingCustomerAcquisitionHelp:
    boolean | null;
  readonly existingCustomerResultHelp:
    boolean | null;
  readonly evidenceReference:
    string | null;
}

export interface NexusTopCustomerValueGateDecision {
  readonly question:
    typeof NEXUS_TOP_CUSTOMER_VALUE_GATE_QUESTION;
  readonly answer:
    NexusTopCustomerValueGateAnswer;
  readonly customerValueEvidencePresent:
    boolean;
  readonly payingCustomerAcquisitionHelp:
    boolean;
  readonly existingCustomerResultHelp:
    boolean;
  readonly action:
    | "CONTINUE_TO_EXISTING_NEXUS_GATES"
    | "REJECT_OR_DEPRIORITIZE";
  readonly existingSafetyOwnerTenantAuditLegalGatesStillRequired:
    true;
  readonly bypassAllowed: false;
}

export function evaluateNexusTopCustomerValueGate(
  input: NexusTopCustomerValueGateInput,
): NexusTopCustomerValueGateDecision {
  const evidenceReference =
    input.evidenceReference?.trim() ?? "";

  const customerValueEvidencePresent =
    evidenceReference.length > 0;

  const payingCustomerAcquisitionHelp =
    input.payingCustomerAcquisitionHelp ===
    true;

  const existingCustomerResultHelp =
    input.existingCustomerResultHelp ===
    true;

  const passed =
    customerValueEvidencePresent &&
    (
      payingCustomerAcquisitionHelp ||
      existingCustomerResultHelp
    );

  return Object.freeze({
    question:
      NEXUS_TOP_CUSTOMER_VALUE_GATE_QUESTION,
    answer:
      passed ? "YES" : "NO",
    customerValueEvidencePresent,
    payingCustomerAcquisitionHelp,
    existingCustomerResultHelp,
    action:
      passed
        ? "CONTINUE_TO_EXISTING_NEXUS_GATES"
        : "REJECT_OR_DEPRIORITIZE",
    existingSafetyOwnerTenantAuditLegalGatesStillRequired:
      true,
    bypassAllowed:
      false,
  } as const);
}