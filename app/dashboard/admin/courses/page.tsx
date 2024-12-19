"use client";

import { Course, columns } from "./columns";
import { DataTable } from "@/components/admin/course-table";
import { APICaller } from "@/utils/apiCaller";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useWorkflow } from "../context";

export default function AddCoursesPage() {
  const [data, setData] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { selectedWorkflow } = useWorkflow();
  useEffect(() => {
    (async () => {
      const { data } = await APICaller({
        path: "/course/",
        method: "GET",
        auth: true,
      });
      const courses = data.map((c: any) => {
        return {
          id: c.id,
          code: c.course_code,
          name: c.name,
          dept: "CSED",
          sem: c.semester,
          L: c.l,
          T: c.t,
          P: c.p,
        };
      });
      setData(courses);
    })();
  }, []);

  const handleRowSelection = (selectedRows: Course[]) => {
    const ids = selectedRows.map((row) => `${row.id}`);
    setSelectedCourseIds(ids);
  };

  const handleAddCourses = async () => {
    if (selectedWorkflow === null) {
      toast({
        title: "Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              Select a workflow to add courses.
            </code>
          </pre>
        ),
        variant: "destructive",
      });
      return;
    }
    if (selectedCourseIds.length === 0) {
      toast({
        title: "Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">Select atleast 1 course to add.</code>
          </pre>
        ),
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { response } = await APICaller({
      path: `/workflow/${selectedWorkflow.id}/course`,
      method: "POST",
      auth: true,
      body: {
        courses: selectedCourseIds,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    setLoading(false);
    if (response.status === 200) {
      toast({
        title: "Success: Courses Added Successfully",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {selectedCourseIds.length}{" "}
              {selectedCourseIds.length <= 1 ? "Course" : "Courses"} Added
              Successfully
              <br />
              Workflow: {selectedWorkflow.semester_name}
            </code>
          </pre>
        ),
      });
      router.push("/dashboard/admin/generate");
    } else {
      toast({
        title: "Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              Error in adding courses.
              <br />
              Workflow: {selectedWorkflow.semester_name}
            </code>
          </pre>
        ),
        variant: "destructive",
      });
      console.log("error");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        onSelectionChange={handleRowSelection}
        handleAddCourses={handleAddCourses}
        loading={loading}
      />
    </div>
  );
}
