"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useWorkflow } from "@/app/dashboard/admin/context";
import { getUser } from "@/lib/dal";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  workflowData?: any;
}

const sidebarNavItemsAdmin = [
  {
    title: "Timetables",
    href: "/dashboard/admin/timetables",
  },
  {
    title: "Rooms",
    href: "/dashboard/admin/rooms",
  },
  {
    title: "Courses",
    href: "/dashboard/admin/courses",
  },
  {
    title: "Teaching Load",
    href: "/dashboard/admin/load",
  },
  {
    title: "Generate Timetable",
    href: "/dashboard/admin/generate",
  },
];

const sidebarNavItemsHOD = [
  {
    title: "Preferences Admin",
    href: "/dashboard/admin/pref",
  },
];

export function SidebarNav({
  className,
  workflowData,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();

  const { workflows, selectedWorkflow, setSelectedWorkflow } = useWorkflow();

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
    undefined,
  );
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (user.user.designation === "Dean") {
        setItems(sidebarNavItemsAdmin);
      } else {
        setItems(sidebarNavItemsHOD);
      }
    })();
  }, []);

  const handleSelect = (selectedWorkflow: any) => {
    setSelectedWorkflow(selectedWorkflow);
  };

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item, i) => (
        <div key={item.href}>
          {i === 1 && (
            <>
              <Separator className="my-2" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="w-full">
                  <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedWorkflow
                      ? selectedWorkflow.semester_name
                      : "Select semester..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="min-w-full w-full"
                  style={{ width: triggerWidth }}
                >
                  <DropdownMenuLabel>Semester</DropdownMenuLabel>
                  {workflows.map((w: any) => (
                    <DropdownMenuItem
                      key={w.id}
                      onSelect={() => handleSelect(w)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedWorkflow?.id === w.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {w.semester_name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <Link
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-black text-white"
                : "hover:underline",
              "justify-start w-full mt-2",
            )}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </nav>
  );
}
