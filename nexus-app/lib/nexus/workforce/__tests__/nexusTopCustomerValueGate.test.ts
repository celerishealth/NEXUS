import {
  describe,
  expect,
  it,
} from "vitest";

import {
  NEXUS_TOP_CUSTOMER_VALUE_GATE_QUESTION,
  evaluateNexusTopCustomerValueGate,
} from "../nexusTopCustomerValueGate";

describe(
  "NEXUS top customer value gate",
  () => {
    it(
      "allows evidence-backed work that helps acquire a paying customer",
      () => {
        const decision =
          evaluateNexusTopCustomerValueGate({
            payingCustomerAcquisitionHelp:
              true,
            existingCustomerResultHelp:
              false,
            evidenceReference:
              "verified-paying-customer-path",
          });

        expect(decision.answer).toBe(
          "YES",
        );
        expect(decision.action).toBe(
          "CONTINUE_TO_EXISTING_NEXUS_GATES",
        );
        expect(decision.question).toBe(
          NEXUS_TOP_CUSTOMER_VALUE_GATE_QUESTION,
        );
        expect(
          decision.existingSafetyOwnerTenantAuditLegalGatesStillRequired,
        ).toBe(true);
        expect(
          decision.bypassAllowed,
        ).toBe(false);
      },
    );

    it(
      "allows evidence-backed work that improves an existing customer result",
      () => {
        const decision =
          evaluateNexusTopCustomerValueGate({
            payingCustomerAcquisitionHelp:
              false,
            existingCustomerResultHelp:
              true,
            evidenceReference:
              "verified-existing-customer-result",
          });

        expect(decision.answer).toBe(
          "YES",
        );
      },
    );

    it(
      "rejects work with no paying-customer or customer-result contribution",
      () => {
        const decision =
          evaluateNexusTopCustomerValueGate({
            payingCustomerAcquisitionHelp:
              false,
            existingCustomerResultHelp:
              false,
            evidenceReference:
              "verified-no-customer-value",
          });

        expect(decision.answer).toBe(
          "NO",
        );
        expect(decision.action).toBe(
          "REJECT_OR_DEPRIORITIZE",
        );
      },
    );

    it(
      "fails closed when customer value is unknown or unsupported",
      () => {
        expect(
          evaluateNexusTopCustomerValueGate({
            payingCustomerAcquisitionHelp:
              null,
            existingCustomerResultHelp:
              null,
            evidenceReference:
              "unknown-customer-value",
          }).answer,
        ).toBe("NO");

        expect(
          evaluateNexusTopCustomerValueGate({
            payingCustomerAcquisitionHelp:
              true,
            existingCustomerResultHelp:
              false,
            evidenceReference:
              null,
          }).answer,
        ).toBe("NO");
      },
    );
  },
);