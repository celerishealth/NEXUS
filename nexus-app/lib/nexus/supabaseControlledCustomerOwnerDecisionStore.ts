import type {
  ControlledCustomerOwnerDecisionRecord,
  ControlledCustomerOwnerDecisionStore,
  ControlledCustomerOwnerDecisionStoreResult,
} from "./controlledCustomerOwnerDecisionService";

const RPC_NAME =
  "nexus_decide_controlled_customer_recommendation";

const DEFAULT_TIMEOUT_MS = 5_000;
const MINIMUM_SERVICE_ROLE_KEY_LENGTH = 32;

type FetchFunction = typeof fetch;

export interface SupabaseControlledCustomerOwnerDecisionStoreOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchFunction?: FetchFunction;
  timeoutMs?: number;
}

interface RpcRow {
  status?: unknown;
  decision_id?: unknown;
  stored_decision?: unknown;
  recommendation_status?: unknown;
  inquiry_status?: unknown;
  stored_decided_at_epoch?: unknown;
}

function normalizeRequiredString(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

function normalizeOptionalString(
  value: unknown,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return normalizeRequiredString(value);
}

function normalizeInteger(
  value: unknown,
): number | null {
  if (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    /^[0-9]+$/.test(value)
  ) {
    const parsed = Number(value);

    if (
      Number.isSafeInteger(parsed) &&
      parsed >= 0
    ) {
      return parsed;
    }
  }

  return null;
}

function normalizeUrl(
  value: unknown,
): string | null {
  const normalized =
    normalizeRequiredString(value);

  if (!normalized) {
    return null;
  }

  try {
    const parsed = new URL(normalized);

    if (
      parsed.protocol !== "https:" &&
      parsed.protocol !== "http:"
    ) {
      return null;
    }

    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

function normalizeTimeout(
  value: unknown,
): number | null {
  if (value === undefined) {
    return DEFAULT_TIMEOUT_MS;
  }

  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 100 ||
    value > 30_000
  ) {
    return null;
  }

  return value;
}

function isRecordValid(
  record: ControlledCustomerOwnerDecisionRecord,
): boolean {
  return (
    normalizeRequiredString(record?.decisionId) !== null &&
    normalizeRequiredString(record?.tenantId) !== null &&
    normalizeRequiredString(record?.inquiryId) !== null &&
    normalizeRequiredString(record?.recommendationId) !== null &&
    normalizeRequiredString(record?.ownerId) !== null &&
    (
      record.sessionId === null ||
      normalizeOptionalString(record.sessionId) !== null
    ) &&
    (
      record.decision === "approve" ||
      record.decision === "reject"
    ) &&
    normalizeRequiredString(record?.decisionReason) !== null &&
    normalizeRequiredString(record?.recommendationText) !== null &&
    normalizeRequiredString(record?.rationale) !== null &&
    typeof record.confidence === "number" &&
    Number.isFinite(record.confidence) &&
    record.confidence >= 0 &&
    record.confidence <= 1 &&
    Array.isArray(record.riskFlags) &&
    /^[a-f0-9]{64}$/.test(
      record.recommendationInputFingerprint,
    ) &&
    /^[a-f0-9]{64}$/.test(
      record.recommendationContentHash,
    ) &&
    Number.isSafeInteger(record.decidedAt) &&
    record.decidedAt >= 0
  );
}

function extractSingleRow(
  value: unknown,
): RpcRow | null {
  if (
    !Array.isArray(value) ||
    value.length !== 1
  ) {
    return null;
  }

  const row = value[0];

  if (
    typeof row !== "object" ||
    row === null ||
    Array.isArray(row)
  ) {
    return null;
  }

  return row as RpcRow;
}

export class SupabaseControlledCustomerOwnerDecisionStore
implements ControlledCustomerOwnerDecisionStore {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly fetchFunction: FetchFunction;
  private readonly timeoutMs: number;

  constructor(
    options:
      SupabaseControlledCustomerOwnerDecisionStoreOptions,
  ) {
    const supabaseUrl =
      normalizeUrl(options?.supabaseUrl);

    const serviceRoleKey =
      normalizeRequiredString(
        options?.serviceRoleKey,
      );

    const timeoutMs =
      normalizeTimeout(options?.timeoutMs);

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      serviceRoleKey.length <
        MINIMUM_SERVICE_ROLE_KEY_LENGTH ||
      timeoutMs === null
    ) {
      throw new Error(
        "Invalid server-only owner decision store configuration.",
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.serviceRoleKey = serviceRoleKey;
    this.fetchFunction =
      options.fetchFunction ?? fetch;
    this.timeoutMs = timeoutMs;
  }

  async decideRecommendation(
    record: ControlledCustomerOwnerDecisionRecord,
  ): Promise<ControlledCustomerOwnerDecisionStoreResult> {
    if (!isRecordValid(record)) {
      return {
        status: "store-unavailable",
      };
    }

    const controller = new AbortController();

    const timeoutHandle = setTimeout(
      () => controller.abort(),
      this.timeoutMs,
    );

    try {
      const response =
        await this.fetchFunction(
          `${this.supabaseUrl}/rest/v1/rpc/${RPC_NAME}`,
          {
            method: "POST",
            headers: {
              apikey:
                this.serviceRoleKey,
              Authorization:
                `Bearer ${this.serviceRoleKey}`,
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              p_decision_id:
                record.decisionId,
              p_tenant_id:
                record.tenantId,
              p_inquiry_id:
                record.inquiryId,
              p_recommendation_id:
                record.recommendationId,
              p_owner_id:
                record.ownerId,
              p_session_id:
                normalizeOptionalString(
                  record.sessionId,
                ),
              p_decision:
                record.decision,
              p_decision_reason:
                record.decisionReason,
              p_recommendation_text:
                record.recommendationText,
              p_rationale:
                record.rationale,
              p_confidence:
                record.confidence,
              p_risk_flags:
                record.riskFlags,
              p_recommendation_input_fingerprint:
                record.recommendationInputFingerprint,
              p_recommendation_content_hash:
                record.recommendationContentHash,
              p_decided_at_epoch:
                record.decidedAt,
            }),
            cache: "no-store",
            signal: controller.signal,
          },
        );

      if (!response.ok) {
        return {
          status: "store-unavailable",
        };
      }

      let payload: unknown;

      try {
        payload = await response.json();
      } catch {
        return {
          status: "store-unavailable",
        };
      }

      const row = extractSingleRow(payload);

      if (!row || typeof row.status !== "string") {
        return {
          status: "store-unavailable",
        };
      }

      const decisionId =
        normalizeRequiredString(
          row.decision_id,
        ) ?? undefined;

      const storedDecision =
        normalizeRequiredString(
          row.stored_decision,
        ) ?? undefined;

      const recommendationStatus =
        normalizeRequiredString(
          row.recommendation_status,
        ) ?? undefined;

      const inquiryStatus =
        normalizeRequiredString(
          row.inquiry_status,
        ) ?? undefined;

      const decidedAt =
        normalizeInteger(
          row.stored_decided_at_epoch,
        ) ?? undefined;

      if (
        row.status === "decided" ||
        row.status === "already-decided"
      ) {
        if (
          !decisionId ||
          (
            storedDecision !== "approve" &&
            storedDecision !== "reject"
          ) ||
          (
            recommendationStatus !== "approved" &&
            recommendationStatus !== "rejected"
          ) ||
          inquiryStatus !== recommendationStatus ||
          decidedAt === undefined
        ) {
          return {
            status: "store-unavailable",
          };
        }

        return {
          status: row.status,
          decisionId,
          decision: storedDecision,
          recommendationStatus,
          inquiryStatus,
          decidedAt,
        };
      }

      if (
        row.status === "recommendation-unavailable" ||
        row.status === "inquiry-unavailable" ||
        row.status === "recommendation-snapshot-conflict" ||
        row.status === "recommendation-state-conflict" ||
        row.status === "inquiry-state-conflict" ||
        row.status === "decision-conflict"
      ) {
        return {
          status: row.status,
          ...(decisionId
            ? {
                existingDecisionId:
                  decisionId,
              }
            : {}),
          ...(storedDecision
            ? {
                existingDecision:
                  storedDecision,
              }
            : {}),
          ...(recommendationStatus
            ? {
                currentRecommendationStatus:
                  recommendationStatus,
              }
            : {}),
          ...(inquiryStatus
            ? {
                currentInquiryStatus:
                  inquiryStatus,
              }
            : {}),
        };
      }

      return {
        status: "store-unavailable",
      };
    } catch {
      return {
        status: "store-unavailable",
      };
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}
