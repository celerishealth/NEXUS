export const DATABASE_IDENTITY_MAX_LENGTH =
  128;

const CONTROL_CHARACTER_PATTERN =
  /[\u0000-\u001f\u007f]/;

export function normalizeDatabaseIdentity(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized =
    value.trim();

  if (
    normalized.length < 1 ||
    normalized.length > DATABASE_IDENTITY_MAX_LENGTH ||
    CONTROL_CHARACTER_PATTERN.test(normalized)
  ) {
    return null;
  }

  return normalized;
}
