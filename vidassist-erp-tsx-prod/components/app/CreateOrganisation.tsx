"use client";

import { useSupabase } from "@/providers/supabase-provider";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import Step, { StepProps } from "./Steps";
import Testimonial from "./Testimonial";

export default function CreateOrganisation({ user }: { user: Profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabase();

  const CREATE_TEAM_STEP: Omit<StepProps, "loading"> = {
    title: "What is your organisation name?",
    icon: <Home className="h-6 w-6 text-gray-600" />,
    fieldType: "text",
    placeholder: "ex: Acme Corp",
    onSubmit: async (value: string) => {
      if (!value || !user) return;

      setLoading(true);

      const { data: organisations, error } = await supabase
        .from("organisations")
        .insert({ name: value })
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
    },
  };

  if (!user) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-auto overflow-y-auto">
        <div className="flex flex-1 flex-col overflow-y-auto px-8 lg:px-16">
          <div className="mt-8">
            <Logo variant="wordmark" />
          </div>
          <div className="my-auto">
            <div className="mb-32">
              <Step {...CREATE_TEAM_STEP} loading={loading} />
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
