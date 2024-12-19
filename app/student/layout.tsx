"use client";
import { StudentNav } from "@/components/student/stuent-nav";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentDashboardPage({ children }: StudentLayoutProps) {
  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Suspense>
            <StudentNav className="mx-6" />
          </Suspense>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
