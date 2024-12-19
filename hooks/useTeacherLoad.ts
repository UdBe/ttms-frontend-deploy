import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { APICaller } from "@/utils/apiCaller";
import { Course } from "@/app/dashboard/admin/courses/columns";

interface TeacherLoad {
  id: number;
  name: string;
  load: number;
  subjects: {
    name: string;
    component: string;
    id: number;
    course_code: string;
    subgroup: string;
  }[];
}

function getLoadMetrics(data: TeacherLoad[]) {
  let max = -Infinity;
  let min = Infinity;
  let count = 0;
  let sum = 0;
  data.forEach((teacher: TeacherLoad) => {
    if (teacher.load > max) max = teacher.load;
    if (teacher.load < min) min = teacher.load;
    count++;
    sum += teacher.load;
  });
  console.log("Max:", max);
  console.log("Min:", min);
  console.log("Average:", sum / count);
  console.log("Count:", count);
}

export function useTeacherLoad() {
  const [teachers, setTeachers] = useState<TeacherLoad[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherLoad[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const fetchTeachers = useCallback(async () => {
    try {
      const { data } = await APICaller({
        path: "/load/",
        method: "GET",
        auth: true,
      });
      setTeachers(data);
      setFilteredTeachers(data);
      getLoadMetrics(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch teacher data",
        variant: "destructive",
      });
    }
  }, []);

  const getCourses = useCallback(async () => {
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
    setCourses(courses);
  }, []);

  useEffect(() => {
    fetchTeachers();
    getCourses();
  }, [fetchTeachers, getCourses]);

  useEffect(() => {
    const filtered = teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredTeachers(filtered);
  }, [searchQuery, teachers]);

  const updateTeacherLoad = useCallback(
    async (
      teacherId: number,
      updatedSubjects: {
        name: string;
        component: string;
        id: number;
        course_code: string;
        subgroup: string;
        old_component?: string;
        old_id?: number;
      }[],
    ) => {
      try {
        let updates = <any>[];

        for (let i = 0; i < updatedSubjects.length; i++) {
          updates.push({
            oldSubject: {
              course_id: updatedSubjects[i].old_id || 0,
              faculty_id: teacherId,
              component: updatedSubjects[i].old_component || "",
              subgroup: updatedSubjects[i].subgroup,
            },
            newSubject: {
              course_id: updatedSubjects[i].id,
              faculty_id: teacherId,
              component: updatedSubjects[i].component,
              subgroup: updatedSubjects[i].subgroup,
            },
          });
        }
        console.log(updates);
        const { data } = await APICaller({
          path: "/load/",
          method: "PATCH",
          auth: true,
          body: updates,
        });
        console.log(data);
        if (data.conflict) {
          toast({
            title: "Conflict Detected",
            description: data.conflict,
            variant: "destructive",
          });
          return false;
        } else {
          setTeachers((prevTeachers) =>
            prevTeachers.map((teacher) =>
              teacher.id === teacherId
                ? { ...teacher, subjects: updatedSubjects }
                : teacher,
            ),
          );
          toast({
            title: "Success",
            description: "Teacher load updated successfully",
          });
          return true;
        }
      } catch (error) {
        console.error("Error updating teacher load:", error);
        toast({
          title: "Error",
          description: "Failed to update teacher load",
          variant: "destructive",
        });
        return false;
      }
    },
    [],
  );

  return {
    teachers: filteredTeachers,
    searchQuery,
    setSearchQuery,
    updateTeacherLoad,
    courses: courses,
  };
}
