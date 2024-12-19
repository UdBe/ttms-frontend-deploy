"use client";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

function getCurrentPath(path: string): string {
  if (path.includes("/notifications")) {
    return "notifications";
  }
  return "student";
}

export function StudentNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [activeTab, setActiveTab] = useState(getCurrentPath(usePathname()));
  const query = useSearchParams();
  const sg = query.get("subgroup") || "";
  const [subgroup, setSelectedSubgroup] = useState(sg);
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href={`/student?subgroup=${subgroup}`}
        className={`text-sm font-medium ${activeTab === "student" ? `` : `text-muted-foreground`} transition-colors hover:text-primary`}
        onClick={() => {
          setActiveTab("student");
        }}
      >
        Timetable
      </Link>
      <Link
        href={`/student/notifications?subgroup=${subgroup}`}
        className={`text-sm font-medium ${activeTab === "notifications" ? `` : `text-muted-foreground`} transition-colors hover:text-primary`}
        onClick={() => {
          setActiveTab("notifications");
        }}
      >
        Notifications
      </Link>
    </nav>
  );
}
