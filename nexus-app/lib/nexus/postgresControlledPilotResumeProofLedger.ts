import {
  randomUUID,
} from "node:crypto";

import type {
  ControlledPilotResumeProofConsumptionRecord,
  ControlledPilotResumeProofConsumptionResult,
  ControlledPilotResumeProofLedger,
} from "./controlledPilotResumeConsumptionGate";

export interface ControlledPilotResumeLedgerQueryResult<
  Row,
> {
  rows: readonly Row[];
}

export interface ControlledPilotResumeLedgerDatabase {
  query<Row>(
    sql: string,
    values: readonly unknown[],
  ): Promise<ControlledPilotResumeLedgerQueryResult<Row>>;
}

interface ConsumptionLedgerRow {
  tokenId: unknown;
  tenantId: unknown;
  signalId: unknown;
  ownerId: unknown;
  issuedAt: unknown;
  expiresAt: unknown;
  consumedAt: unknown;
  consumptionAttemptId: unknown;
}

export const CONTROLLED_PILOT_RESUME_CONSUME_ONCE_SQL = `
insert into public.nexus_controlled_pilot_resume_proof_consumptions as ledger (
  token_id,
  tenant_id,
  signal_id,
  owner_id,
  issued_at_epoch,
  expires_at_epoch,
  consumed_at_epoch,
  consumption_attempt_id
)
values (
  $1::uuid,
  $2::text,
  $3::text,
  $4::text,
  $5::bigint,
  $6::bigint,
  $7::bigint,
  $8::uuid
)
on conflict (token_id)
do update
set token_id = ledger.token_id
returning
  ledger.token_id::text as "tokenId",
  ledger.tenant_id as "tenantId",
  ledger.signal_id as "signalId",
  ledger.owner_id as "ownerId",
  ledger.issued_at_epoch::text as "issuedAt",
  ledger.expires_at_epoch::text as "expiresAt",
  ledger.consumed_at_epoch::text as "consumedAt",
  ledger.consumption_attempt_id::text as "consumptionAttemptId"
`;

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

function normalizeEpochSecond(
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

function isDatabaseAvailable(
  value: unknown,
): value is ControlledPilotResumeLedgerDatabase {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (
      value as {
        query?: unknown;
      }
    ).query === "function"
  );
}

function isConsumptionRecordValid(
  record: ControlledPilotResumeProofConsumptionRecord,
): boolean {
  return (
    normalizeRequiredString(record?.tokenId) !== null &&
    normalizeRequiredString(record?.tenantId) !== null &&
    normalizeRequiredString(record?.signalId) !== null &&
    normalizeRequiredString(record?.ownerId) !== null &&
    normalizeEpochSecond(record?.issuedAt) !== null &&
    normalizeEpochSecond(record?.expiresAt) !== null &&
    normalizeEpochSecond(record?.consumedAt) !== null &&
    record.expiresAt > record.issuedAt &&
    record.consumedAt >= record.issuedAt &&
    record.consumedAt < record.expiresAt
  );
}

export class PostgresControlledPilotResumeProofLedger
implements ControlledPilotResumeProofLedger {
  constructor(
    private readonly database:
      ControlledPilotResumeLedgerDatabase,
    private readonly createAttemptId:
      () => string = randomUUID,
  ) {}

  async consumeOnce(
    record: ControlledPilotResumeProofConsumptionRecord,
  ): Promise<ControlledPilotResumeProofConsumptionResult> {
    if (
      !isDatabaseAvailable(this.database) ||
      !isConsumptionRecordValid(record)
    ) {
      return {
        status: "ledger-unavailable",
      };
    }

    const consumptionAttemptId =
      normalizeRequiredString(
        this.createAttemptId(),
      );

    if (!consumptionAttemptId) {
      return {
        status: "ledger-unavailable",
      };
    }

    let result:
      ControlledPilotResumeLedgerQueryResult<
        ConsumptionLedgerRow
      >;

    try {
      result =
        await this.database.query<
          ConsumptionLedgerRow
        >(
          CONTROLLED_PILOT_RESUME_CONSUME_ONCE_SQL,
          [
            record.tokenId,
            record.tenantId,
            record.signalId,
            record.ownerId,
            record.issuedAt,
            record.expiresAt,
            record.consumedAt,
            consumptionAttemptId,
          ],
        );
    } catch {
      return {
        status: "ledger-unavailable",
      };
    }

    if (
      !result ||
      !Array.isArray(result.rows) ||
      result.rows.length !== 1
    ) {
      return {
        status: "ledger-unavailable",
      };
    }

    const row = result.rows[0];

    const storedTokenId =
      normalizeRequiredString(row.tokenId);

    const storedTenantId =
      normalizeRequiredString(row.tenantId);

    const storedSignalId =
      normalizeRequiredString(row.signalId);

    const storedOwnerId =
      normalizeRequiredString(row.ownerId);

    const storedIssuedAt =
      normalizeEpochSecond(row.issuedAt);

    const storedExpiresAt =
      normalizeEpochSecond(row.expiresAt);

    const storedConsumedAt =
      normalizeEpochSecond(row.consumedAt);

    const storedAttemptId =
      normalizeRequiredString(
        row.consumptionAttemptId,
      );

    if (
      !storedTokenId ||
      !storedTenantId ||
      !storedSignalId ||
      !storedOwnerId ||
      storedIssuedAt === null ||
      storedExpiresAt === null ||
      storedConsumedAt === null ||
      !storedAttemptId
    ) {
      return {
        status: "ledger-unavailable",
      };
    }

    const sameBinding =
      storedTokenId === record.tokenId &&
      storedTenantId === record.tenantId &&
      storedSignalId === record.signalId &&
      storedOwnerId === record.ownerId &&
      storedIssuedAt === record.issuedAt &&
      storedExpiresAt === record.expiresAt;

    if (!sameBinding) {
      return {
        status: "binding-conflict",
      };
    }

    if (storedAttemptId === consumptionAttemptId) {
      return {
        status: "consumed",
        consumedAt: storedConsumedAt,
      };
    }

    return {
      status: "already-consumed",
      consumedAt: storedConsumedAt,
    };
  }
}
