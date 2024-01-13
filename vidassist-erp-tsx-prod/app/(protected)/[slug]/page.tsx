import HomeCard from "@/components/app/HomeCard";
import Shell from "@/components/app/Shell";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrganisationPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug: organisationIdString } = params;

  // convert organisationId to number
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

  const email = profile.email;

  // get the team IDs the user is a member of
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

  const organisation = organisationsData.find(
    (organisation) => organisation.id === organisationId
  );

  // Check invites

  const { data: invitesData, error: invitesError } = await supabase
    .from("invites")
    .select("*")
    .eq("email", email)
    .eq("organisation_id", organisationId);

  if (invitesError) {
    console.error("Error fetching invites:", invitesError);
    return;
  }

  if (!invitesData) {
    redirect("/signin");
  }
  if (organisation) {
    return (
      <Shell
        profile={profile}
        organisation={organisation}
        allOrganisations={organisationsData}
        pageName="Home"
        subtitle="Your page for critical information and summaries"
      >
        <HomeCard />
      </Shell>
    );
  }

  if (invitesData.length > 0) {
    redirect(`/invitation/${invitesData[0].id}`);
  }

  redirect("/start");
}
