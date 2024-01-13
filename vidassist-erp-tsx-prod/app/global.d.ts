import type { Database } from "@/types/supabase";

declare global {
  type Organisation = Database["public"]["Tables"]["organisation"]["Row"];
  type Member = Database["public"]["Tables"]["members"]["Row"];
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];
  type Invite = Database["public"]["Tables"]["invites"]["Row"];
}
