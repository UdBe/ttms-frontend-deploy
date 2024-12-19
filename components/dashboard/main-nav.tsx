"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { getUser } from "@/lib/dal";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

function getCurrentPath(path: string): string {
  if (path.includes("/admin")) {
    return "admin";
  } else if (path.includes("/preferences")) {
    return "preferences";
  } else if (path.includes("/reports")) {
    return "reports";
  } else if (path.includes("/users")) {
    return "users";
  } else if (path.includes("/notifications")) {
    return "notifications";
  }
  return "dashboard";
}

export function MainNav({ className }: { className: string }) {
  const [pref, setPref] = useState(false);
  const [designation, setDesignation] = useState("");
  const [activeTab, setActiveTab] = useState(getCurrentPath(usePathname()));

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setDesignation(user.user.designation);
      const val = user.data.settings.filter((v: any) => {
        if (v.key == "PreferenceOpen") return v;
      });
      if (val[0].value[0] === "false") {
        setPref(false);
      } else setPref(true);
    })();
  });

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link
        href="/dashboard"
        className={`text-sm font-medium ${activeTab === "dashboard" ? `` : `text-muted-foreground`} transition-colors hover:text-primary`}
        onClick={() => {
          setActiveTab("dashboard");
        }}
      >
        Dashboard
      </Link>
      {pref && (
        <Link
          href="/dashboard/preferences"
          className={`text-sm font-medium ${activeTab === "preferences" ? `` : `text-muted-foreground`} transition-colors hover:text-primary`}
          onClick={() => {
            setActiveTab("preferences");
          }}
        >
          Preferences
        </Link>
      )}
      {(designation === "Dean" || designation === "HOD") && (
        <>
          <Link
            href="/dashboard/admin"
            className={`text-sm font-medium ${activeTab === "admin" ? `` : `text-muted-foreground`} transition-colors hover:text-primary`}
            onClick={() => {
              setActiveTab("admin");
            }}
          >
            Admin
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium ${activeTab === "reports" ? `` : `text-muted-foreground`} transition-colors hover:text-primary`}
            onClick={() => {
              setActiveTab("reports");
            }}
          >
            Reports
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium ${activeTab === "users" ? `` : `text-muted-foreground`} transition-colors hover:text-primary`}
            onClick={() => {
              setActiveTab("users");
            }}
          >
            Users
          </Link>
        </>
      )}
      <Link
        href="/dashboard/notifications"
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
