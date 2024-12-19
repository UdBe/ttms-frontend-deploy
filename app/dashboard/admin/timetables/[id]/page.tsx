"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { APICaller } from "@/utils/apiCaller";
import { Icons } from "@/components/ui/icon";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useWorkflow } from "../../context";

interface Room {
  room_number: string;
  block: string;
  capacity: number;
  available: boolean;
}

interface Course {
  course_code: string;
  name: string;
  l: number;
  t: number;
  p: number;
  semester: number;
}

interface Faculty {
  id: number;
  name: string;
}

interface Preference {
  courseCode: string;
  courseName: string;
  priority: number;
}

interface WorkflowDetails {
  id: number;
  semester_name: string;
  publish: boolean;
  start_date: string;
  created_at: string;
  preference_opened: boolean;
  rooms: Room[];
  courses: Course[];
  faculties: Faculty[];
}

export default function WorkflowDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [workflowDetails, setWorkflowDetails] =
    useState<WorkflowDetails | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [facultyPreferences, setFacultyPreferences] = useState<Preference[]>(
    [],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const { setRerun } = useWorkflow();

  useEffect(() => {
    const fetchWorkflowDetails = async () => {
      try {
        const { data } = await APICaller({
          path: "/workflow/" + id,
          method: "GET",
          auth: true,
        });
        setWorkflowDetails(data);
        // setSelectedWorflowData(data);
        setFormOpen(data?.preference_opened);
      } catch (error) {
        console.error("Error fetching workflow details:", error);
      }
    };

    fetchWorkflowDetails();
  }, [id]);

  async function activatePreference(name: string) {
    try {
      setLoading(true);
      const { response } = await APICaller({
        path: `/workflow/${id}/preference/activate`,
        method: "GET",
        auth: true,
      });
      setLoading(false);
      if (response.status === 200) {
        setFormOpen(true);
        setRerun(true);
        toast({
          title: "Success: Preference form activated",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                Preference form activated
                <br />
                Workflow: {name}
              </code>
            </pre>
          ),
        });
      }
    } catch {
      setFormOpen(false);
      setLoading(false);
      toast({
        title: "Error: Preference form activation failed",
        description: "Preference form is already opened for another workflow.",
        variant: "destructive",
      });
    }
  }

  async function closePreference(name: string) {
    try {
      setLoading(true);
      const { response } = await APICaller({
        path: `/workflow/${id}/preference/deactivate`,
        method: "GET",
        auth: true,
      });
      setLoading(false);
      if (response.status === 200) {
        setFormOpen(false);
        setRerun(true);
        toast({
          title: "Success: Preference form closed",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                Preference form closed
                <br />
                Workflow: {name}
              </code>
            </pre>
          ),
        });
      }
    } catch {
      setLoading(false);
      setFormOpen(true);
      toast({
        title: "Error: Preference form closure failed",
        description: "Internal Server Error",
        variant: "destructive",
      });
    }
  }

  const deleteWorkflow = async () => {
    const { response } = await APICaller({
      path: "/workflow/" + id,
      method: "DELETE",
      auth: true,
    });
    if (response.status === 200) {
      setRerun(true);
      router.push("/dashboard/admin/workflow");
    } else {
      toast({
        title: "Failed to delete workflow",
      });
    }
  };

  const startLoadGeneration = async () => {
    try {
      setLoading(true);
      const { response } = await APICaller({
        path: "/load/generate",
        method: "POST",
        auth: true,
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      toast({
        title: "Error: Load Generation failed",
        description: "Internal Server Error",
        variant: "destructive",
      });
    }
  };

  if (!workflowDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-4">
          {workflowDetails.semester_name} Timetable Details
        </h1>
        <div className="flex flex-row w-fit justify-between">
          <Button variant="default" className="mr-2">
            Publish
          </Button>
          <Button
            variant="outline"
            className="mr-2"
            onClick={
              !formOpen
                ? () => activatePreference(workflowDetails.semester_name)
                : () => closePreference(workflowDetails.semester_name)
            }
          >
            {formOpen ? (
              <>
                {loading ? (
                  <Spinner speed="fast" size="md" />
                ) : (
                  <>
                    <Icons.unlock className="mr-2" />
                    <p>Deactivate Preferences</p>
                  </>
                )}
              </>
            ) : (
              <>
                {loading ? (
                  <Spinner speed="fast" size="md" />
                ) : (
                  <>
                    <Icons.lock className="mr-2" />
                    <p>Activate Preferences</p>
                  </>
                )}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="mr-2"
            onClick={startLoadGeneration}
          >
            {loading ? (
              <Spinner speed="fast" size="md" />
            ) : (
              <>
                <Icons.rerun className="mr-2" />
                Generate Load
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={() => setIsModalOpen(true)}>
            <Icons.delete className="text-red-800" />{" "}
          </Button>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion of Workflow</DialogTitle>
            <DialogDescription>
              Warning!! This will delete all data related to this workflow.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteWorkflow}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <h2 className="text-xl font-semibold mt-6 mb-2">Selected Rooms</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Block</TableHead>
            <TableHead>Room Number</TableHead>
            <TableHead>Capacity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflowDetails.rooms &&
            workflowDetails.rooms.map((room, index) => (
              <TableRow key={index}>
                <TableCell>{room.block}</TableCell>
                <TableCell>{room.room_number}</TableCell>
                <TableCell>{room.capacity}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <h2 className="text-xl font-semibold mt-6 mb-2">Selected Courses</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Code</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>L</TableHead>
            <TableHead>T</TableHead>
            <TableHead>P</TableHead>
            <TableHead>Semester</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflowDetails.courses &&
            workflowDetails.courses.map((course, index) => (
              <TableRow key={index}>
                <TableCell>{course.course_code}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.l}</TableCell>
                <TableCell>{course.t}</TableCell>
                <TableCell>{course.p}</TableCell>
                <TableCell>{course.semester}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <h2 className="text-xl font-semibold mt-6 mb-2">Faculty Preferences</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Faculty Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflowDetails.faculties &&
            workflowDetails.faculties.map((faculty) => (
              <TableRow key={faculty.id}>
                <TableCell>{faculty.name}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        // onClick={() => handleFacultyClick(faculty)}
                      >
                        View Preferences
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {faculty.name + "'"}s Preferences
                        </DialogTitle>
                      </DialogHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course Code</TableHead>
                            <TableHead>Course Name</TableHead>
                            <TableHead>Priority</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {facultyPreferences.map((pref, index) => (
                            <TableRow key={index}>
                              <TableCell>{pref.courseCode}</TableCell>
                              <TableCell>{pref.courseName}</TableCell>
                              <TableCell>{pref.priority}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
