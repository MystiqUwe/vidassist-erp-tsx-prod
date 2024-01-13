import GeneralComponent from "@/components/app/GeneralComponent";
import SettingsShell from "@/components/app/SettingsShell";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function GeneralPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug: organisationIdString } = params;

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

  if (!profile) {
    redirect("/signin");
  }

  // get the organisation with the given ID
  const { data: organisation, error: organisationError } = await supabase
    .from("organisations")
    .select("*")
    .eq("id", organisationId)
    .single();

  if (organisationError) {
    console.error("Error fetching organisation:", organisationError);
    return;
  }

  // get the user's membership for the team

  const { data: userMembership, error: userMembershipError } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id)
    .eq("organisation_id", organisationId)
    .single();

  if (userMembershipError) {
    console.error("Error fetching user membership:", userMembershipError);
    return;
  }

  // get the organisation IDs the user is a member of
  const { data: membershipsData, error: membershipsError } = await supabase
    .from("members")
    .select("organisation_id")
    .eq("user_id", user.id);

  if (membershipsError) {
    console.error("Error fetching user team memberships:", membershipsError);
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

  return (
    <SettingsShell
      profile={profile}
      allOrganisations={organisationsData}
      organisation={organisation}
      title="General"
      description="Your team settings"
    >
      <GeneralComponent
        organisation={organisation}
        userMembership={userMembership}
      />
    </SettingsShell>
  );
}
