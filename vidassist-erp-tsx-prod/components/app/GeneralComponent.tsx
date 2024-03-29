"use client";

import ConfirmSettingsCard from "@/components/app/ConfirmSettingsCard";
import SettingsCard from "@/components/app/SettingsCard";
import { Input } from "@/components/ui/input";
import { useSupabase } from "@/providers/supabase-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../ui/use-toast";

export default function GeneralComponent({
  organisation,
  userMembership,
}: {
  organisation: Organisation;
  userMembership: Member;
}) {
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [name, setName] = useState(organisation?.name ?? "");
  const [nameLoading, setNameLoading] = useState(false);
  const router = useRouter();
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const role = userMembership.role;

  const isOwner = role === "owner";

  const handleLeaveTeam = async () => {
    setLeaveLoading(true);

    await supabase
      .from("members")
      .delete()
      .eq("user_id", userMembership.user_id)
      .eq("team_id", userMembership.organisation_id);

    toast({
      title: "Left organisation",
      description: "You have left the organisation",
    });
    setLeaveLoading(false);
  };

  const handleDeleteTeam = async () => {
    setDeleteLoading(true);

    await supabase.from("teams").delete().eq("id", organisation.id);

    toast({
      title: "Organisation deleted",
      description: "Your organisation has been deleted",
    });

    router.refresh();

    setDeleteLoading(false);
  };

  const handleUpdateName = async () => {
    setNameLoading(true);

    await supabase.from("teams").update({ name }).eq("id", organisation.id);

    toast({
      title: "Organisation name updated",
      description: "Your organisation name has been updated",
    });

    setNameLoading(false);

    router.refresh();
  };

  return (
    <div className="flex flex-col space-y-4">
      <SettingsCard
        title="Team name"
        description="This is your organisation's visible name within Demorepo. For example, the name of your company or department."
        button={{
          name: "Save",
          onClick: handleUpdateName,
          loading: nameLoading,
        }}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-sm"
          placeholder="Organisation name"
        />
      </SettingsCard>
      {/* <SettingsCard
          title="URL Slug"
          description={`This is your team's URL slug. It will be used to access your team's dashboard.`}
          button={{
            name: "Save",
            onClick: async () => {
              try {
                await updateSlugMutation.mutateAsync({
                  teamId: team.id,
                  slug,
                });

                await router.push(`/${slug}/settings/general`);
              } catch (e) {
                if (e instanceof TRPCClientError) {
                  toast.error(e.message);
                }
              }
            },
            loading: updateSlugMutation.isLoading,
          }}
        >
          <div className="flex items-center">
            <p className="flex h-10 items-center rounded-l-md border-y border-l border-gray-300 bg-gray-50 px-3 text-gray-500">
              https://demorepo.com/
            </p>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="max-w-sm rounded-l-none"
            />
          </div>
        </SettingsCard> */}
      {!isOwner && (
        <ConfirmSettingsCard
          title="Leave organisation"
          description="Revoke your access to this organisation. Any resources you have added to this organisation will remain"
          button={{
            name: "Leave organisation",
            onClick: handleLeaveTeam,
            loading: leaveLoading,
          }}
          alert={{
            title: "Are you sure?",
            description:
              "If you leave your organisation, you will have to be invited back in.",
          }}
        />
      )}
      <ConfirmSettingsCard
        title="Delete organisation"
        description="Permanently delete your organisation and all of its contents from the platform. This action is not reversible, so please continue with caution."
        button={{
          name: "Delete organisation",
          variant: "destructive",
          onClick: handleDeleteTeam,
          loading: deleteLoading,
        }}
        alert={{
          title: "Are you absolutely sure?",
          description: `This action cannot be undone. This will permanently delete your organisation and remove your data from our servers.`,
        }}
      />
    </div>
  );
}
