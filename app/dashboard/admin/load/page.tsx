"use client";

import { useState, useRef } from "react";
import { useTeacherLoad } from "@/hooks/useTeacherLoad";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, Component, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { SuggestionsDropdown } from "@/components/SuggestionsDropdown";

export default function TeacherLoadManager() {
  const { teachers, searchQuery, setSearchQuery, updateTeacherLoad, courses } =
    useTeacherLoad();
  const [editingTeacher, setEditingTeacher] = useState<{
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
  } | null>(null);
  const [editedSubjects, setEditedSubjects] = useState<
    {
      name: string;
      component: string;
      id: number;
      course_code: string;
      subgroup: string;
      old_component?: string;
      old_id?: number;
    }[]
  >([]);

  const handleEdit = (teacher: {
    id: number;
    name: string;
    load: number;
    subjects: {
      name: string;
      component: string;
      id: number;
      course_code: string;
      subgroup: string;
      old_component?: string;
      old_id?: number;
    }[];
  }) => {
    setEditingTeacher(teacher);
    setEditedSubjects([...teacher.subjects]);
  };

  const handleSave = async () => {
    if (editingTeacher) {
      const success = await updateTeacherLoad(editingTeacher.id, editedSubjects);
      if (success) {
        setEditingTeacher(null);
      }
    }
  };

  const handleSubjectChange = (
    index: number,
    field: "name" | "component",
    value: string,
    current_id?: number,
    current_component?: string
  ) => {
    const updatedSubjects = [...editedSubjects];
    if (field === "name") {
      updatedSubjects[index].name = value;
      if (current_id && current_component) {
        updatedSubjects[index].old_component = current_component;
        updatedSubjects[index].old_id = current_id;
      }
    } else {
      updatedSubjects[index].component = value;
      if (current_component && current_id) {
        updatedSubjects[index].old_component = current_component;
        updatedSubjects[index].old_id = current_id;
      }
    }
    setEditedSubjects(updatedSubjects);
  };

  const handleAddSubject = () => {
    // Add a new subject row with default values (adjust as needed)
    setEditedSubjects((prev) => [
      ...prev,
      {
        name: "",
        component: "Lecture",
        id: 0,
        course_code: "",
        subgroup: "",
      },
    ]);
  };

  const handleRemoveSubject = (index: number) => {
    const updatedSubjects = [...editedSubjects];
    updatedSubjects.splice(index, 1);
    setEditedSubjects(updatedSubjects);
  };

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row align-middle justify-between">
        <h1 className="text-2xl font-bold mb-4">Teacher Load Manager</h1>
        <SuggestionsDropdown />
      </div>
      <Input
        type="text"
        placeholder="Search teachers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Faculty ID</TableHead>
            <TableHead>Faculty Name</TableHead>
            <TableHead>Subjects</TableHead>
            <TableHead>Total Load</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.id}</TableCell>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>
                {teacher.subjects.map((subject, index) => (
                  <div key={index}>
                    {subject.course_code}: {subject.component}
                  </div>
                ))}
              </TableCell>
              <TableCell>{teacher.load}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleEdit(teacher)}>
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Edit Teacher Load - {editingTeacher?.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2 py-2">
                      {editedSubjects.map((subject, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 items-center gap-2"
                        >
                          <Label htmlFor={`Courses`}>Subject</Label>
                          <div className="flex flex-row align-middle justify-around space-x-2 col-span-2">
                            {/* Course Selector */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild className="w-full">
                                <Button
                                  ref={triggerRef}
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between"
                                >
                                  {subject.course_code || "Select Course"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="min-w-full w-full">
                                <DropdownMenuLabel>Courses</DropdownMenuLabel>
                                {courses.map((course) => {
                                  return (
                                    <DropdownMenuItem
                                      key={course.id}
                                      onSelect={() =>
                                        handleSubjectChange(
                                          index,
                                          "name",
                                          course.code,
                                          course.id,
                                          subject.component
                                        )
                                      }
                                    >
                                      {course.name}
                                    </DropdownMenuItem>
                                  );
                                })}
                              </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Component Selector */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild className="w-full">
                                <Button
                                  ref={triggerRef}
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between"
                                >
                                  {subject.component}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="min-w-full w-full">
                                <DropdownMenuLabel>
                                  Component Selector
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                  key="lecture"
                                  onSelect={() =>
                                    handleSubjectChange(
                                      index,
                                      "component",
                                      "Lecture",
                                      subject.id,
                                      subject.component
                                    )
                                  }
                                >
                                  Lecture
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  key="tutorial"
                                  onSelect={() =>
                                    handleSubjectChange(
                                      index,
                                      "component",
                                      "Tutorial",
                                      subject.id,
                                      subject.component
                                    )
                                  }
                                >
                                  Tutorial
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  key="practical"
                                  onSelect={() =>
                                    handleSubjectChange(
                                      index,
                                      "component",
                                      "Practical",
                                      subject.id,
                                      subject.component
                                    )
                                  }
                                >
                                  Practical
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {/* Remove Subject Button */}
                            <Button variant="destructive" onClick={() => handleRemoveSubject(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Add New Subject Button */}
                    <div className="flex flex-row justify-end mt-2">
                      <Button variant="outline" onClick={handleAddSubject}>
                        <Plus className="mr-2 h-4 w-4" /> Add Subject
                      </Button>
                    </div>
                    <Button onClick={handleSave} className="mt-4">
                      Save Changes
                    </Button>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Toaster />
    </div>
  );
}