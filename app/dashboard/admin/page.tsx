"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUser } from "@/lib/dal";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (user.user.designation === "Dean") {
        router.push("/dashboard/admin/timetables");
      } else {
        router.push("/dashboard/admin/pref");
      }
    })();
  }, []);

  return <div className="space-y-6 w-full"></div>;
}
