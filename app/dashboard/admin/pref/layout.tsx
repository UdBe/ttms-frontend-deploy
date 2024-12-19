"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
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
} from "@/components/ui/dialog";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GuageGraph } from "@/components/ui/gauge-graph";
import { useWorkflow } from "../context";
import { updateSessionKey } from "@/lib/session";

type FacultyMember = {
  id: string;
  name: string;
  department: string;
  email: string;
  phoneNumber: string;
  preferencesFilled: boolean;
  preferences: string[];
};

const grid = 8;
const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  position: "relative",
  top: 0,
  left: 0,
  background: isDragging ? "lightgreen" : "grey",

  ...draggableStyle,
});

export default function ActivatePreferenceForm() {
  const [loading, setLoading] = useState<{
    status: boolean;
    for: "activate" | "close" | "reminders" | "general";
  }>({
    status: false,
    for: "general",
  });
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [totalFaculty, setTotalFaculty] = useState(0);
  const [filledBy, setFilledBy] = useState(0);
  const { workflows } = useWorkflow();

  const activeWorkflow = workflows.filter((w) => {
    if (w.preference_opened == true) {
      return w;
    }
  });
  useEffect(() => {
    setActive(() => {
      if (activeWorkflow.length > 0) {
        setTotalFaculty(activeWorkflow[0].preference_total_faculty);
        if (activeWorkflow[0].preference_filled_by) {
          setFilledBy(activeWorkflow[0].preference_filled_by);
        } else {
          setFilledBy(0);
        }
        return true;
      } else return false;
    });

    const fetchFacultyMembers = async () => {
      // Replace this with actual API call
      const mockData: FacultyMember[] = [
        {
          id: "1",
          name: "John Doe",
          department: "Computer Science",
          email: "john@example.com",
          phoneNumber: "123-456-7890",
          preferencesFilled: true,
          preferences: ["AI", "Machine Learning", "Data Science"],
        },
        {
          id: "2",
          name: "Jane Smith",
          department: "Physics",
          email: "jane@example.com",
          phoneNumber: "098-765-4321",
          preferencesFilled: false,
          preferences: [],
        },
      ];
      setFacultyMembers(mockData);
    };

    fetchFacultyMembers();
  }, []);

  function sendReminders() {
    toast({
      title: "Reminders sent",
      description: `Reminder emails have been sent to ${totalFaculty - filledBy} faculty members who haven't filled the preference form.`,
    });
  }

  function openModal(faculty: FacultyMember) {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  }

  function onDragEnd(result: any) {
    console.log(result);
    if (!result.destination || !selectedFaculty) return;

    const newPreferences = Array.from(selectedFaculty.preferences);
    const [reorderedItem] = newPreferences.splice(result.source.index, 1);
    newPreferences.splice(result.destination.index, 0, reorderedItem);

    setSelectedFaculty({ ...selectedFaculty, preferences: newPreferences });
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start space-y-6 p-6">
      <div className="flex w-full space-x-6">
        <Card className=" p-5 text-center w-full relative">
          {!active && (
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4">No form is active</h2>
                <p>Please activate a preference form to enable this feature.</p>
              </div>
            </div>
          )}
          <h2 className="text-xl font-bold mb-4">
            {active
              ? `Workflow: ${activeWorkflow[0].semester_name}`
              : "No active forms"}
          </h2>
          <div className="flex flex-col items-center space-y-4">
            <GuageGraph max={totalFaculty} value={filledBy} />
            <p className="text-center">
              {filledBy} out of {totalFaculty} faculty members have filled the
              preferences form.
            </p>
          </div>
          <Button onClick={sendReminders} disabled={!active}>
            Send Reminders
          </Button>
        </Card>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Preferences Filled</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facultyMembers.map((faculty) => (
            <TableRow key={faculty.id}>
              <TableCell>{faculty.name}</TableCell>
              <TableCell>{faculty.department}</TableCell>
              <TableCell>{faculty.preferencesFilled ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Button onClick={() => openModal(faculty)} disabled={!active}>
                  View Preferences
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedFaculty?.name + "'"}s Preferences
            </DialogTitle>
          </DialogHeader>
          <div>
            <p>Email: {selectedFaculty?.email}</p>
            <p>Phone: {selectedFaculty?.phoneNumber}</p>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="preferences">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {selectedFaculty?.preferences.map((pref, index) => (
                    <Draggable key={pref} draggableId={pref} index={index}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 mb-2 bg-gray-100 rounded"
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          {pref}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </DialogContent>
      </Dialog>
    </main>
  );
}
