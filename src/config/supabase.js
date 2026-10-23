const defaultSupabaseUrl = "https://xslhwdmusvomewimcasf.supabase.co";

export const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL || defaultSupabaseUrl
).replace(/\/+$/, "");

export const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

export function requireSupabaseKey() {
  if (!supabaseKey) {
    throw new Error(
      "Missing VITE_SUPABASE_PUBLISHABLE_KEY. Add it to .env and restart the Vite server.",
    );
  }

  return supabaseKey;
}
