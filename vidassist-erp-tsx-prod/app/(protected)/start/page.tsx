import Start from "@/components/app/Start";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

export const dynamic = "force-dynamic";

export default async function StartPage() {
  // setup supabase
  const supabase = createServerComponentClient({ cookies });

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

  // if user has not onboarded, redirect to onboarding

  if (!profile.has_onboarded) {
    redirect(`/onboarding`);
  }

  const email = user.email;

  // get the organisations the user is a member of

  // const { data: organisation } = await supabase.from("organisations").select("*");

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
  const organisationsIds = membershipsData.map(
    (membership) => membership.organisation_id
  );

  // Fetch the organisation using the organisation IDs
  const { data: organisationsData, error: organisationsError } = await supabase
    .from("organisations")
    .select("*")
    .in("id", organisationsIds);

  if (organisationsError) {
    console.error("Error fetching organisations:", organisationsError);
    return;
  }

  if (!organisationsData) {
    redirect("/signin");
  }

  // Get invites for the user

  const { data: invitesData, error: invitesError } = await supabase
    .from("invites")
    .select("*")
    .eq("email", email);

  if (invitesError) {
    console.error("Error fetching user invites:", invitesError);
    return;
  }

  if (!invitesData) {
    redirect("/signin");
  }

  // Extract the organisation IDs from the result

  const organisationIdsFromInvites = invitesData.map(
    (invite) => invite.organisation_id
  );

  // Fetch the organisation using the organtisation IDs

  const {
    data: organisationsDataFromInvites,
    error: organisationsErrorFromInvites,
  } = await supabase
    .from("organisations")
    .select("*")
    .in("id", organisationIdsFromInvites);

  if (organisationsErrorFromInvites) {
    console.error(
      "Error fetching organisations:",
      organisationsErrorFromInvites
    );
    return;
  }

  if (!organisationsDataFromInvites) {
    redirect("/signin");
  }

  const filteredorganisationsDataFromInvites =
    organisationsDataFromInvites.filter(
      (organisationFromInvite) =>
        !organisationsIds.includes(organisationFromInvite.id)
    );

  return (
    <div className="h-screen">
      <Start
        organisations={organisationsData}
        invites={invitesData}
        organisationsFromInvites={filteredorganisationsDataFromInvites}
      />
    </div>
  );
}
