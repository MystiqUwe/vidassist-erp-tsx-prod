import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

export async function createSupabaseAdmin() {
  const SERVICE_ROLE = process.env.SERVICE_ROLE;
  console.log("SERVICE_ROLE: ", SERVICE_ROLE);
  console.log(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  if (!SERVICE_ROLE) throw new Error("SERVICE_ROLE is not defined");
  return createClient<Database>(
    "https://qzxmqblntotduylawgrf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6eG1xYmxudG90ZHV5bGF3Z3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNDkwOTcxOSwiZXhwIjoyMDIwNDg1NzE5fQ.vmgCG_GbzV3nFBff6zxfEUHu2RJEpBfjzSxbUhNhJjU",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
