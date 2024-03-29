import { Check, ChevronDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CreateTeamModal from "./CreateOrganisationModal";

export default function OrganisationSelector({
  organisation,
  allOrganisations,
}: {
  organisation: Organisation;
  allOrganisations: Organisation[];
}) {
  const router = useRouter();

  const handleSelectTeam = useCallback(
    async (organisation: Organisation) => {
      await router.push(`/${organisation.id}`);
    },
    [router]
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <>
      <CreateTeamModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex select-none items-center justify-between rounded-lg bg-white p-2 shadow-outline transition hover:shadow-md-outline">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>{organisation?.name[0] ?? ""}</AvatarFallback>
              </Avatar>
              <p className="font-medium">{organisation?.name ?? "Loading"}</p>
            </div>
            <ChevronDown className="w-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="animate-slideDownAndFadeIn rounded-md bg-white text-gray-900 transition"
          align="start"
          sideOffset={4}
        >
          {allOrganisations && allOrganisations.length > 0 && (
            <div className="flex flex-col">
              {allOrganisations.map((t) => {
                const selected = t.id === organisation.id;
                return (
                  <DropdownMenuItem
                    key={t.id}
                    className="flex w-full items-center gap-x-2 px-3 py-2"
                    onClick={async () => {
                      await handleSelectTeam(t);
                    }}
                  >
                    <Avatar>
                      <AvatarFallback>{t.name[0]}</AvatarFallback>
                    </Avatar>
                    <p className="">{t.name}</p>
                    {selected && <Check className="w-4" />}
                  </DropdownMenuItem>
                );
              })}
            </div>
          )}
          <DropdownMenuItem
            className="flex gap-x-2 rounded-b px-3 text-gray-600"
            onClick={() => {
              setCreateModalOpen(true);
            }}
          >
            <Plus className="mx-3 w-4" />
            Create team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
