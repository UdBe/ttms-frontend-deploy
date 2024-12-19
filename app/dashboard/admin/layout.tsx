"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { WorkflowProvider } from "./context";
interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Create Timetable Workflow
          </h2>
          <p className="text-muted-foreground">
            This workflow goes through process of generation of timetable for
            the upcoming semester. All changes are irreversible.
          </p>
        </div>
        <Separator className="my-6" />
        <WorkflowProvider>
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav />
              <Separator />
            </aside>
            <div className="flex-1 w-full">{children}</div>
          </div>
        </WorkflowProvider>
      </div>
    </>
  );
}
