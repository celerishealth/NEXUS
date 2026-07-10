export type PublicSupabaseConfig = {
  url: string;
  anonKey: string;
};

function requireValue(name: string, value: string | undefined): string {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(`Missing required Supabase configuration: ${name}`);
  }

  return normalizedValue;
}

export function getPublicSupabaseConfig(): PublicSupabaseConfig {
  return {
    url: requireValue(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    anonKey: requireValue(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  };
}
