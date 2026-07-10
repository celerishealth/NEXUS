import type {
  ProviderContinuityJsonValue,
  ProviderContinuityRecordKind,
} from "./providerContinuityDurableStore"

export type DurableContinuityStateStatus =
  | "pending-owner-approval"
  | "approved"
  | "rejected"
  | "replay-authorized"
  | "completed"
  | "open"
  | "owner-acknowledged"
  | "resolved"
  | "active"
  | "released"
  | "in-flight"
  | "recorded"

export type DurableContinuityStatePayload = {
  status: DurableContinuityStateStatus
  operationId: string
  ownerId: string | null
  reason: string | null
  [key: string]: ProviderContinuityJsonValue
}

export interface DurableContinuityTransitionValidation {
  allowed: boolean
  code:
    | "STATE_TRANSITION_ALLOWED"
    | "STATE_ALREADY_APPLIED"
    | "INVALID_INITIAL_STATE"
    | "INVALID_STATE_TRANSITION"
    | "TERMINAL_STATE_REOPEN_BLOCKED"
}

const initialStates: Record<
  ProviderContinuityRecordKind,
  DurableContinuityStateStatus[]
> = {
  recovery: ["pending-owner-approval"],
  incident: ["open"],
  containment: ["active"],
  telemetry: ["recorded"],
  "replay-idempotency": ["in-flight"],
}

const allowedTransitions: Record<
  ProviderContinuityRecordKind,
  Partial<
    Record<
      DurableContinuityStateStatus,
      DurableContinuityStateStatus[]
    >
  >
> = {
  recovery: {
    "pending-owner-approval": [
      "approved",
      "rejected",
    ],
    approved: ["replay-authorized"],
    "replay-authorized": ["completed"],
  },
  incident: {
    open: ["owner-acknowledged"],
    "owner-acknowledged": ["resolved"],
  },
  containment: {
    active: ["released"],
  },
  telemetry: {},
  "replay-idempotency": {
    "in-flight": ["completed"],
  },
}

const terminalStates = new Set<
  DurableContinuityStateStatus
>([
  "rejected",
  "completed",
  "resolved",
  "released",
  "recorded",
])

const canonicalize = (
  value: ProviderContinuityJsonValue,
): string => {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value
      .map((item) => canonicalize(item))
      .join(",")}]`
  }

  const entries = Object.entries(value)
    .sort(([left], [right]) =>
      left.localeCompare(right),
    )
    .map(
      ([key, item]) =>
        `${JSON.stringify(key)}:${canonicalize(
          item,
        )}`,
    )

  return `{${entries.join(",")}}`
}

export const durableContinuityPayloadsMatch = (
  left: DurableContinuityStatePayload,
  right: DurableContinuityStatePayload,
): boolean =>
  canonicalize(left) === canonicalize(right)

export const validateDurableContinuityTransition = (
  kind: ProviderContinuityRecordKind,
  current:
    | DurableContinuityStatePayload
    | null,
  next: DurableContinuityStatePayload,
): DurableContinuityTransitionValidation => {
  if (!current) {
    if (
      initialStates[kind].includes(next.status)
    ) {
      return {
        allowed: true,
        code: "STATE_TRANSITION_ALLOWED",
      }
    }

    return {
      allowed: false,
      code: "INVALID_INITIAL_STATE",
    }
  }

  if (
    durableContinuityPayloadsMatch(
      current,
      next,
    )
  ) {
    return {
      allowed: true,
      code: "STATE_ALREADY_APPLIED",
    }
  }

  if (terminalStates.has(current.status)) {
    return {
      allowed: false,
      code: "TERMINAL_STATE_REOPEN_BLOCKED",
    }
  }

  const allowedNextStates =
    allowedTransitions[kind][current.status] ??
    []

  if (
    allowedNextStates.includes(next.status)
  ) {
    return {
      allowed: true,
      code: "STATE_TRANSITION_ALLOWED",
    }
  }

  return {
    allowed: false,
    code: "INVALID_STATE_TRANSITION",
  }
}
