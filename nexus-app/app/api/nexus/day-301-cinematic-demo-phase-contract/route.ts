import { NextResponse } from "next/server";
import {
  getNexusDay301CinematicDemoPhaseContract,
  validateNexusDay301CinematicDemoPhaseContract
} from "@/lib/nexus/day301CinematicDemoPhaseContract";

export const dynamic = "force-static";

export async function GET() {
  const contract = getNexusDay301CinematicDemoPhaseContract();
  const validation = validateNexusDay301CinematicDemoPhaseContract();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-301-cinematic-demo-phase-contract-preview-only",
    safety: {
      readOnly: true,
      previewOnly: true,
      cinematicDemoPlanningOnly: true,
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
    contract
  });
}
