import ProfileComponent from "@/components/app/ProfileComponent";
import SettingsShell from "@/components/app/SettingsShell";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Profile({
  params,
}: {
  params: { slug: string };
}) {
  const { slug: organisationIdString } = params;

  // convert  organisation to number
  const organisationId = organisationIdString;

  // setup supabase
  const supabase = createServerComponentClient<Database>({ cookies });

  // get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // get the organisation IDs the user is a member of
  const { data: membershipsData, error: membershipsError } = await supabase
    .from("members")
    .select("organisation_id")
    .eq("user_id", user.id);

  if (membershipsError) {
    console.error(
      "Error fetching user organisation memberships:",
      membershipsError
    );
    return;
  }

  // Extract the organisation IDs from the result
  const organisationIds = membershipsData.map(
    (membership) => membership.organisation_id
  );

  // Fetch the organisations using the team IDs
  const { data: organisationsData, error: organisationsError } = await supabase
    .from("organisations")
    .select("*")
    .in("id", organisationIds);

  if (organisationsError) {
    console.error("Error fetching organisations:", organisationsError);
    return;
  }

  if (!organisationsData) {
    redirect("/signin");
  }

  const organisation = organisationsData.find(
    (organisation) => organisation.id === organisationId
  );

  if (!organisation || !profile) return null;

  return (
    <SettingsShell
      profile={profile}
      allOrganisations={organisationsData}
      organisation={organisation}
      title="Profile"
      description="Manage your personal info"
    >
      <ProfileComponent profile={profile} />
    </SettingsShell>
  );
}
