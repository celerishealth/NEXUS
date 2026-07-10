import {
  getProtectedApiReplayStore,
} from "../../../../lib/nexus/protectedApiReplayStore.mjs";
import {
  inspectProtectedApiSignedEnvelope,
} from "../../../../lib/nexus/protectedApiSignedEnvelope.mjs";
import {
  inspectProtectedApiRequest,
} from "../../../../lib/nexus/protectedApiRequestGuard.mjs";
import { NextResponse } from "next/server";

import {
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "../../../../lib/nexus/ownerAuthorizedActionAdmission.mjs";

import {
  createProviderIndependentRecoveryHandoff,
} from "../../../../lib/nexus/providerIndependentRecoveryHandoff.mjs";

import {
  claimControlledExecutionIntent,
  createControlledExecutionIntent,
} from "../../../../lib/nexus/controlledExecutionIntent.mjs";

import {
  createDeterministicDryRunDispatchPlan,
  simulateDryRunDispatch,
} from "../../../../lib/nexus/dryRunDispatchPlan.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEMO_SECRET =
  "nexus-day-663-dry-run-dispatch-demo-secret";

function createPipeline() {
  const now = "2026-07-10T10:00:00.000Z";

  const action = {
    tenantId: "tenant-demo-663",
    actionId: "action-demo-663",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest: "sha256:day-663-preview-payload",
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-demo-663",
    authorityEpoch: "authority-epoch-663",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-demo-663",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-demo-663",
    issuedAt: "2026-07-10T09:55:00.000Z",
    expiresAt: "2026-07-10T10:15:00.000Z",
    signingSecret: DEMO_SECRET,
  });

  const admission =
    evaluateOwnerAuthorizedActionAdmission({
      action,
      authority,
      resolution,
      replay: {
        consumedResolutionIds: [],
        consumedNonces: [],
        retryCount: 0,
        permanentOutcome: false,
      },
      signingSecret: DEMO_SECRET,
      now,
    });

  const handoff =
    createProviderIndependentRecoveryHandoff({
      action,
      admission,
      adapters: [
        {
          adapterId: "adapter-alpha",
          providerId: "provider-alpha",
          status: "HEALTHY",
          priority: 1,
          capabilities: ["SAFE_DRAFT_ADMISSION"],
        },
        {
          adapterId: "adapter-beta",
          providerId: "provider-beta",
          status: "HEALTHY",
          priority: 2,
          capabilities: ["SAFE_DRAFT_ADMISSION"],
        },
      ],
      recovery: {
        retryCount: 0,
        permanentOutcome: false,
      },
      now,
    });

  const intent = createControlledExecutionIntent({
    action,
    admission,
    handoff,
    now,
  });

  const claim = claimControlledExecutionIntent({
    intent,
    claim: {
      claimId: "claim-demo-663",
      intentId: intent.intentId,
      tenantId: action.tenantId,
      actionId: action.actionId,
      ownerId: authority.ownerId,
      role: "OWNER",
      issuedAt: "2026-07-10T09:59:00.000Z",
      expiresAt: "2026-07-10T10:10:00.000Z",
    },
    replay: {
      consumedClaimIds: [],
      activeClaimExists: false,
    },
    now,
  });

  const adapterManifests = [
    {
      adapterId: "adapter-alpha",
      providerId: "provider-alpha",
      contractVersion: "nexus.adapter.contract.v1",
      status: "READY",
      supportsDryRun: true,
      externalInvocationRequired: false,
    },
    {
      adapterId: "adapter-beta",
      providerId: "provider-beta",
      contractVersion: "nexus.adapter.contract.v1",
      status: "READY",
      supportsDryRun: true,
      externalInvocationRequired: false,
    },
  ];

  const plan =
    createDeterministicDryRunDispatchPlan({
      action,
      handoff,
      intent,
      claim,
      adapterManifests,
      now,
    });

  return {
    now,
    action,
    authority,
    admission,
    handoff,
    intent,
    claim,
    adapterManifests,
    plan,
  };
}

export async function GET() {
  const pipeline = createPipeline();

  const outcomes = Object.fromEntries(
    pipeline.plan.dispatchAttempts.map(
      (attempt, index) => [
        attempt.attemptId,
        index === 0
          ? "SIMULATED_RETRYABLE_FAILURE"
          : "SIMULATED_SUCCESS",
      ],
    ),
  );

  const simulation = simulateDryRunDispatch({
    plan: pipeline.plan,
    outcomes,
    now: pipeline.now,
  });

  return NextResponse.json({
    service:
      "NEXUS Deterministic Provider Dry-Run Dispatch and Failover Simulation v1",
    safetyBoundary: {
      localSimulationOnly: true,
      executionAuthorized: false,
      externalExecutionPerformed: false,
      providerInvocationPerformed: false,
      persistencePerformed: false,
      paymentAutomationAuthorized: false,
      whatsappAutoSendAuthorized: false,
      uncontrolledAiActionAuthorized: false,
    },
    pipeline: {
      admission: pipeline.admission,
      recoveryHandoff: pipeline.handoff,
      controlledIntent: pipeline.intent,
      ownerClaim: pipeline.claim,
      dryRunPlan: pipeline.plan,
      failoverSimulation: simulation,
    },
  });
}

export async function POST(request) {
  const requestGuard =
    await inspectProtectedApiRequest(
      request,
    );

  if (!requestGuard.ok) {
    return NextResponse.json(
      requestGuard.error,
      {
        status:
          requestGuard.status,
        headers:
          requestGuard.headers,
      },
    );
  }
  const signedEnvelopeGuard =
    await inspectProtectedApiSignedEnvelope(
      request,
      {
        requestId:
          requestGuard.requestId,
        replayMode:
          process.env
            .NEXUS_PROTECTED_API_REPLAY_MODE,
        replayStore:
          getProtectedApiReplayStore(),
      },
    );

  if (!signedEnvelopeGuard.ok) {
    return NextResponse.json(
      signedEnvelopeGuard.error,
      {
        status:
          signedEnvelopeGuard.status,
        headers:
          signedEnvelopeGuard.headers,
      },
    );
  }
  const signingSecret =
    process.env.NEXUS_OWNER_RESOLUTION_SIGNING_SECRET?.trim();

  if (!signingSecret) {
    return NextResponse.json(
      {
        created: false,
        completed: false,
        mode: "FAIL_CLOSED",
        reasonCodes: ["SIGNING_AUTHORITY_UNAVAILABLE"],
        executionAuthorized: false,
        externalExecutionPerformed: false,
        providerInvocationPerformed: false,
        persistencePerformed: false,
      },
      { status: 503 },
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        created: false,
        completed: false,
        mode: "FAIL_CLOSED",
        reasonCodes: ["REQUEST_BODY_INVALID"],
        executionAuthorized: false,
        externalExecutionPerformed: false,
        providerInvocationPerformed: false,
        persistencePerformed: false,
      },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  const admission =
    evaluateOwnerAuthorizedActionAdmission({
      action: body?.action,
      authority: body?.authority,
      resolution: body?.resolution,
      replay: body?.admissionReplay,
      signingSecret,
      now,
    });

  const handoff =
    createProviderIndependentRecoveryHandoff({
      action: body?.action,
      admission,
      adapters: body?.adapters,
      recovery: body?.recovery,
      now,
    });

  const intent = createControlledExecutionIntent({
    action: body?.action,
    admission,
    handoff,
    now,
  });

  const claim = claimControlledExecutionIntent({
    intent,
    claim: body?.claim,
    replay: body?.claimReplay,
    now,
  });

  const plan =
    createDeterministicDryRunDispatchPlan({
      action: body?.action,
      handoff,
      intent,
      claim,
      adapterManifests: body?.adapterManifests,
      now,
    });

  const simulation = body?.outcomes
    ? simulateDryRunDispatch({
        plan,
        outcomes: body.outcomes,
        now,
      })
    : null;

  const accepted =
    plan.created === true &&
    (!simulation || simulation.completed === true);

  return NextResponse.json(
    {
      admission,
      handoff,
      intent,
      claim,
      plan,
      simulation,
    },
    {
      status: accepted ? 200 : 403,
    },
  );
}



