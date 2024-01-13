import InviteEmail from "@/emails/invite";
import { resend } from "@/lib/resend";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const res = await request.json();

  const { record } = res;

  const { id, email, send } = record;

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  // send email to user with link to /invite/[id]

  if (send) {
    try {
      /*  await resend.emails.send({
        from: "Neorepo <team@mail.neorepo.com>",
        to: [email],
        subject: "Your invitation to Suparepo",
        react: InviteEmail({
          toEmail: email,
          inviteUrl: `${baseUrl}/invitation/${id}`,
        }),
      });*/
      const supabase = createServerComponentClient<Database>({
        cookies,
      });
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(
        email
      );
      console.log(data, error);
    } catch (error) {
      return new Response((error as Error).message, {
        status: 500,
      });
    }
  }

  return new Response("Success", {
    status: 200,
  });
}
