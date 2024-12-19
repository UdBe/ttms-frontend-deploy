import { StudentDashboard } from "@/components/student/student-dashboard";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "View Timetable",
};

export default function StudentDashboardPage() {
  return (
    <div className="hidden flex-col md:flex">
      <Suspense fallback={<div>Loading...</div>}>
        <StudentDashboard />
      </Suspense>
    </div>
  );
}
