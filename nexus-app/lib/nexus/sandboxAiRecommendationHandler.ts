import { createHash } from "node:crypto";

import {
  SandboxHandlerExecutionError,
  type SandboxActionHandlerDefinition,
  type SandboxHandlerContext,
  type SandboxHandlerOutput,
} from "./sandboxWorkerExecutionBoundary";

import {
  SANDBOX_AI_RECOMMENDATION_ACTION,
  SandboxAiBoundaryValidationError,
  SandboxAiOutputValidationError,
  buildSandboxAiRecommendationRequest,
  validateSandboxAiRecommendationOutput,
  type SandboxAiRecommendationRequestEnvelope,
} from "./sandboxAiRecommendationBoundary";

export interface SandboxSimulatedAiClient {
  readonly executionMode: "sandbox_simulated";
  readonly networkAccess: "none";
  readonly toolAccess: "none";

  generate(
    request: SandboxAiRecommendationRequestEnvelope,
  ): Promise<unknown>;
}

export interface CreateSandboxAiRecommendationHandlerInput {
  readonly client: SandboxSimulatedAiClient;
}

export interface SandboxAiRecommendationHandlerResultPayload
  extends Readonly<Record<string, unknown>> {
  readonly version: "nexus.sandbox.ai.recommendation.result.v1";
  readonly recommendation:
    | "approve"
    | "reject"
    | "needs_information";
  readonly rationale: string;
  readonly confidence: number;
  readonly missingInformation: readonly string[];
  readonly riskFlags: readonly string[];
  readonly requestRiskSignals: readonly string[];
  readonly ownerApprovalRequired: true;
  readonly toolAccess: "none";
  readonly liveProviderExecution: "blocked";
  readonly externalDelivery: "blocked";
  readonly paymentExecution: "blocked";
  readonly requestDigest: string;
  readonly outputDigest: string;
}

export class SandboxAiHandlerConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxAiHandlerConfigurationError";
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EXPECTED_PAYLOAD_KEYS = Object.freeze([
  "businessContext",
  "customerMessage",
  "resultId",
]);

function isPlainObject(
  value: unknown,
): value is Readonly<Record<string, unknown>> {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

function requireClient(
  input: CreateSandboxAiRecommendationHandlerInput,
): SandboxSimulatedAiClient {
  if (
    !input ||
    typeof input !== "object" ||
    !input.client ||
    typeof input.client !== "object"
  ) {
    throw new SandboxAiHandlerConfigurationError(
      "A sandbox simulated AI client is required.",
    );
  }

  const client = input.client;

  if (
    client.executionMode !== "sandbox_simulated"
  ) {
    throw new SandboxAiHandlerConfigurationError(
      "AI client executionMode must be sandbox_simulated.",
    );
  }

  if (client.networkAccess !== "none") {
    throw new SandboxAiHandlerConfigurationError(
      "Sandbox AI client network access must be none.",
    );
  }

  if (client.toolAccess !== "none") {
    throw new SandboxAiHandlerConfigurationError(
      "Sandbox AI client tool access must be none.",
    );
  }

  if (typeof client.generate !== "function") {
    throw new SandboxAiHandlerConfigurationError(
      "Sandbox AI client generate operation is required.",
    );
  }

  return client;
}

function throwInvalidPayload(): never {
  throw new SandboxHandlerExecutionError(
    "sandbox_ai_invalid_payload",
    false,
  );
}

function requireExactPayload(
  value: Readonly<Record<string, unknown>>,
): {
  readonly resultId: string;
  readonly customerMessage: string;
  readonly businessContext: Readonly<Record<string, unknown>>;
} {
  if (!isPlainObject(value)) {
    return throwInvalidPayload();
  }

  const actualKeys = Object.keys(value).sort();

  if (
    actualKeys.length !== EXPECTED_PAYLOAD_KEYS.length ||
    actualKeys.some(
      (key, index) =>
        key !== EXPECTED_PAYLOAD_KEYS[index],
    )
  ) {
    return throwInvalidPayload();
  }

  const resultId = value.resultId;
  const customerMessage = value.customerMessage;
  const businessContext = value.businessContext;

  if (
    typeof resultId !== "string" ||
    !UUID_PATTERN.test(resultId.trim())
  ) {
    return throwInvalidPayload();
  }

  if (
    typeof customerMessage !== "string" ||
    customerMessage.trim().length < 1
  ) {
    return throwInvalidPayload();
  }

  if (!isPlainObject(businessContext)) {
    return throwInvalidPayload();
  }

  return Object.freeze({
    resultId: resultId.trim().toLowerCase(),
    customerMessage,
    businessContext,
  });
}

function digestCanonical(value: string): string {
  return createHash("sha256")
    .update(value, "utf8")
    .digest("hex");
}

function buildResultPayload(
  request: SandboxAiRecommendationRequestEnvelope,
  validated: ReturnType<
    typeof validateSandboxAiRecommendationOutput
  >,
): SandboxAiRecommendationHandlerResultPayload {
  return Object.freeze({
    version:
      "nexus.sandbox.ai.recommendation.result.v1",
    recommendation: validated.recommendation,
    rationale: validated.rationale,
    confidence: validated.confidence,
    missingInformation:
      validated.missingInformation,
    riskFlags: validated.riskFlags,
    requestRiskSignals: request.riskSignals,
    ownerApprovalRequired: true,
    toolAccess: "none",
    liveProviderExecution: "blocked",
    externalDelivery: "blocked",
    paymentExecution: "blocked",
    requestDigest: digestCanonical(
      request.requestCanonical,
    ),
    outputDigest: digestCanonical(
      validated.outputCanonical,
    ),
  });
}

/**
 * Creates the concrete Day 759 worker handler for sandbox AI
 * recommendations.
 *
 * Safety properties:
 * - The client must explicitly declare simulated sandbox mode.
 * - Network and tool access must both be none.
 * - Claimed payload shape is exact and fail-closed.
 * - Trusted policy and untrusted data remain separated by Day 758.
 * - Raw simulated output is treated as untrusted and strictly validated.
 * - Unknown client failures expose only a safe retryable code.
 * - Result evidence includes deterministic SHA-256 request/output digests.
 * - Owner approval and all external-effect blocks remain locked.
 */
export function createSandboxAiRecommendationHandler(
  input: CreateSandboxAiRecommendationHandlerInput,
): SandboxActionHandlerDefinition {
  const client = requireClient(input);

  const definition: SandboxActionHandlerDefinition =
    {
      actionKind:
        SANDBOX_AI_RECOMMENDATION_ACTION,

      async handler(
        context: SandboxHandlerContext,
      ): Promise<SandboxHandlerOutput> {
        const payload = requireExactPayload(
          context.payload,
        );

        let request:
          SandboxAiRecommendationRequestEnvelope;

        try {
          request =
            buildSandboxAiRecommendationRequest({
              tenantId: context.tenantId,
              outboxId: context.outboxId,
              inquiryId: context.aggregateId,
              actionKind: context.actionKind,
              customerMessage:
                payload.customerMessage,
              businessContext:
                payload.businessContext,
            });
        } catch (error) {
          if (
            error instanceof
            SandboxAiBoundaryValidationError
          ) {
            throw new SandboxHandlerExecutionError(
              "sandbox_ai_invalid_payload",
              false,
            );
          }

          throw new SandboxHandlerExecutionError(
            "sandbox_ai_boundary_failure",
            false,
          );
        }

        let rawOutput: unknown;

        try {
          rawOutput = await client.generate(
            request,
          );
        } catch {
          throw new SandboxHandlerExecutionError(
            "sandbox_ai_simulation_failed",
            true,
          );
        }

        let validated:
          ReturnType<
            typeof validateSandboxAiRecommendationOutput
          >;

        try {
          validated =
            validateSandboxAiRecommendationOutput(
              request,
              rawOutput,
            );
        } catch (error) {
          if (
            error instanceof
            SandboxAiOutputValidationError
          ) {
            throw new SandboxHandlerExecutionError(
              "sandbox_ai_invalid_output",
              false,
            );
          }

          throw new SandboxHandlerExecutionError(
            "sandbox_ai_output_boundary_failure",
            false,
          );
        }

        return Object.freeze({
          resultId: payload.resultId,
          payload: buildResultPayload(
            request,
            validated,
          ),
        });
      },
    };

  return Object.freeze(definition);
}
