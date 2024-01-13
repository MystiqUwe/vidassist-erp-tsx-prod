"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRightIcon, RocketIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import IconCircle from "./IconCircle";
import Logo from "./Logo";
import Testimonial from "./Testimonial";
import { useSupabase } from "@/providers/supabase-provider";

export default function Start({
  organisations,
  invites,
  organisationsFromInvites,
}: {
  organisations: Organisation[];
  invites: Invite[];
  organisationsFromInvites: Organisation[];
}) {
  const { supabase } = useSupabase();
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-auto overflow-y-auto">
        <div className="flex flex-1 flex-col overflow-y-auto px-8 lg:px-16">
          <div className="mt-8">
            <Logo variant="wordmark" />
          </div>
          <div className="my-auto">
            <div className="w-full max-w-lg mb-4">
              <IconCircle>
                <RocketIcon className="h-6 w-6 text-gray-600" />
              </IconCircle>
            </div>
            <div className="flex flex-col space-y-6">
              <WorkspaceCard />
              {organisations.length > 0 && (
                <OrganisationList organisations={organisations} />
              )}
              {organisationsFromInvites.length > 0 && (
                <InviteList
                  invites={invites}
                  organisationsFromInvites={organisationsFromInvites}
                />
              )}
            </div>
            <div className="mt-4">
              <Button
                variant={"outline"}
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden flex-1 items-center justify-center border-l bg-gray-50 lg:flex">
          <div className="mx-8">
            <Testimonial />
          </div>
        </div>
      </div>
    </div>
  );
}

const WorkspaceCard = () => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new organisation</CardTitle>
        <CardDescription>
          Start a new organisation for your team, project, or organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => router.push("/create")}>Create Workspace</Button>
      </CardContent>
    </Card>
  );
};

const OrganisationList = ({
  organisations,
}: {
  organisations: Organisation[];
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Your Teams</CardTitle>
      <CardDescription>Launch your workspace to get started.</CardDescription>
    </CardHeader>
    <CardContent>
      {organisations.map((organisation) => (
        <Link
          href={`/${organisation.id}`}
          key={organisation.id}
          className="flex justify-between items-center p-3 border-b hover:bg-gray-100 cursor-pointer"
        >
          <span>{organisation.name}</span>
          <ChevronRightIcon />
        </Link>
      ))}
    </CardContent>
  </Card>
);

const InviteList = ({
  invites,
  organisationsFromInvites,
}: {
  invites: Invite[];
  organisationsFromInvites: Organisation[];
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Your Invitations</CardTitle>
      <CardDescription>Check out your invitations</CardDescription>
    </CardHeader>
    <CardContent>
      {organisationsFromInvites.map((organisation) => {
        const invite = invites.find(
          (invite) => invite.organisation_id === organisation.id
        );

        if (!invite) return null;

        return (
          <Link
            href={`/invitation/${invite.id}`}
            key={invite.id}
            className="flex justify-between items-center p-3 border-b hover:bg-gray-100 cursor-pointer"
          >
            <span>{organisation.name}</span>
            <ChevronRightIcon />
          </Link>
        );
      })}
    </CardContent>
  </Card>
);
