import Shell from "./Shell";

export default function SettingsShell({
  allOrganisations,
  organisation,
  children,
  title,
  description,
  profile,
}: {
  allOrganisations: Organisation[];
  organisation: Organisation;
  children: React.ReactNode;
  title: string;
  description: string;
  profile: Profile;
}) {
  return (
    <Shell
      organisation={organisation}
      allOrganisations={allOrganisations}
      pageName="Settings"
      subpage={title}
      subtitle={description}
      childrenClassname="max-w-5xl"
      profile={profile}
    >
      <div className="mx-auto grid h-full w-full">
        <div className="py-4">{children}</div>
      </div>
    </Shell>
  );
}
