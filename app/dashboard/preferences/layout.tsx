import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/preferences/sidebar-nav";

export const metadata: Metadata = {
  title: "Create Timetable",
  description: "Form using react-hook-form and Zod.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const sidebarNavItems = [
  {
    title: "Preference Form",
    href: "/dashboard/preferences",
  },
  {
    title: "Drafts",
    href: "/dashboard/preferences/drafts",
  },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Preferences Form{" "}
          </h2>
          <p className="text-muted-foreground">
            Select your subject preferences for the upcoming semester.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
