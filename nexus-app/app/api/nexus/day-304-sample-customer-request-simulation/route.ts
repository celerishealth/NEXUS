import { NextResponse } from "next/server";
import {
  getNexusDay304SampleCustomerRequestSimulation,
  validateNexusDay304SampleCustomerRequestSimulation
} from "@/lib/nexus/day304SampleCustomerRequestSimulation";

export const dynamic = "force-static";

export async function GET() {
  const simulation = getNexusDay304SampleCustomerRequestSimulation();
  const validation = validateNexusDay304SampleCustomerRequestSimulation();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-304-sample-customer-request-simulation-preview-only",
    screen: simulation.routePath,
    safety: {
      readOnly: true,
      previewOnly: true,
      sampleDataOnly: true,
      launchAuthorization: false,
      subscriptionActivation: false,
      paymentExecution: false,
      invoiceCreation: false,
      entitlementWrites: false,
      customerDataWrites: false,
      realDbMemoryReadWrite: false,
      auditPersistence: false,
      approveRejectExecution: false,
      ownerOverrideExecution: false,
      recoveryRollbackExecution: false,
      messageSending: false,
      thirdPartyMutation: false,
      aiModelCalls: false,
      globalTradeOrderPlacement: false,
      shipmentBooking: false,
      customerCommitmentExecution: false,
      vendorCustomerMessageSending: false,
      gstExecution: false,
      ewayBillGeneration: false,
      governmentApiMutation: false,
      complianceFiling: false,
      illegalMatter: false,
      greyZoneExecution: false,
      complianceShortcut: false
    },
    validation,
    simulation
  });
}
