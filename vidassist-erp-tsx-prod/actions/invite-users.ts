"use server";

import { createSupabaseAdmin } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

type invitesToCreate = {
  email: string;
  role: string;
}[];

type user = {
  email: string;
  full_name: string | null;
  has_onboarded: boolean;
  id: string;
};

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3001";

export async function inviteUsers(
  invitesToCreate: invitesToCreate,
  organisation: any,
  user: user
) {
  if (!invitesToCreate.length) {
    return false;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  for (const invite of invitesToCreate) {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(
      invite.email,
      {
        redirectTo: `${baseUrl}/invitation/${organisation.id}`,
      }
    );
    if (!error) {
      const { error } = await supabase.from("invites").insert({
        organisation_id: organisation.id,
        email: invite.email,
        role: invite.role,
        user_id: user.id,
      });
    }
    if (error) {
      console.error("Error adding invite:", error);
      return false;
    }
  }

  return true;
}
