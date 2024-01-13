import { Box, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "../../providers/supabase-provider";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

type CreateOrganisationModalProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function CreateOrganisationModal({
  children,
  open: _open,
  onOpenChange,
}: CreateOrganisationModalProps) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(_open);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateOrganisation = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session || !session.user) return;

    const user = session.user;

    if (!name) {
      toast({
        variant: "destructive",
        title: "Organisation name required.",
        description: "Please enter a organisation name.",
      });
      return;
    }

    setLoading(true);

    const { data: organisations, error } = await supabase
      .from("organisations")
      .insert({ name })
      .select();

    if (error || !organisations) {
      console.error("Error creating organisation:", error);
      return;
    }

    const organisation = organisations[0]; // Newly created organisation instance

    if (!organisation) {
      console.error("No organisation data received");
      return;
    }

    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .insert({
        user_id: user.id,
        organisation_id: organisation.id,
        role: "ADMIN",
      })
      .select();

    if (memberError || !memberData) {
      console.error("Error adding member:", memberError);
      return;
    }

    router.push(`/${organisation.id}`);

    toast({
      title: "organisation created.",
      description: `You have successfully created the organisation ${organisation.name}.`,
    });
    setName("");
    setLoading(false);
  }, [name, router, supabase, toast]);

  const handleOpenChange = useCallback(
    (val: boolean) => {
      setOpen(val);
      onOpenChange?.(val);
    },
    [onOpenChange]
  );

  // this component can either manage itself or allow itself to be managed
  useEffect(() => {
    if (_open != null) {
      setOpen(_open);
    }
  }, [_open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="">
        <DialogHeader>
          <Box className="h-12 w-12 rounded-lg border p-3 shadow-sm" />
          <DialogTitle className="text-lg font-medium">
            Create organisation
          </DialogTitle>
          <DialogDescription className="">
            Collaborate with others and manage your tasks together.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleCreateOrganisation();
            handleOpenChange(false);
          }}
          className="flex flex-col gap-y-5"
        >
          <label className="w-full">
            <p className="mb-2 font-medium">organisation name</p>
            <Input
              className="w-full"
              placeholder="My organisation Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </label>
          <DialogFooter>
            <Button className="" disabled={loading} type="submit">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating" : "Create organisation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
