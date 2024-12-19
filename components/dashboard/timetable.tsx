"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { APICaller } from "@/utils/apiCaller";
import { TopTabs } from "./top-tabs";
import { getUser } from "@/lib/dal";
import { Button } from "../ui/button";

interface TimetableData {
  course_name: string;
  course_code: string;
  subgroup: string;
  faculty_name: string;
  room_name: string;
  room_block: string;
  start_time: string;
  component: string;
}

const Timetable = ({
  tabs,
  subgroup,
  teacher,
}: {
  tabs: boolean;
  subgroup?: string;
  teacher?: boolean;
}) => {
  const [data, setData] = useState<{ [key: string]: TimetableData }>({});
  const [selectedLecture, setSelectedLecture] = useState<TimetableData | null>(
    null,
  );

  const [courseTeaching, setCourseTeaching] = useState(0);
  const [lectures, setLectures] = useState(0);
  const [tutorials, setTutorials] = useState(0);
  const [labs, setLabs] = useState(0);

  if (subgroup == undefined && teacher == undefined) {
    throw new Error(
      "Either subgroup or teacher must be defined in props to render timetable",
    );
  }

  if (subgroup != undefined && teacher != undefined) {
    throw new Error(
      "Both subgroup and teacher cannot be defined in props to render timetable",
    );
  }

  const times = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const colorMap = new Map();
  colorMap.set("Lecture", "bg-red-100 text-white-800");
  colorMap.set("Tutorial", "bg-blue-100 text-white-800");
  colorMap.set("Practical", "bg-green-100 text-white-800");

  const handleDataEntry = (time: string, day: string, value: TimetableData) => {
    if (value.component === "Practical") {
      const hour = parseInt(time.split(":")[0]) + 1;
      const blockTime = `${hour.toString().padStart(2, "0")}:00`;
      setData((prev) => ({ ...prev, [`${day}-${time}`]: value }));
      setData((prev) => ({ ...prev, [`${day}-${blockTime}`]: value }));
      return;
    }
    setData((prev) => ({ ...prev, [`${day}-${time}`]: value }));
  };

  useEffect(() => {
    const c = new Map();
    (async () => {
      let path = "";
      if (subgroup != undefined && subgroup != "") {
        path = "/timetable/student/" + subgroup;
      } else if (teacher != undefined && teacher == true) {
        const { user } = await getUser();
        const id = user?.empid;
        path = "/timetable/faculty/" + id;
      }
      const { data: apiData } = await APICaller({
        path,
        method: "GET",
      });

      if (apiData === null) {
        return;
      }

      apiData.forEach((entry: any) => {
        const duration = entry.component == "Practical" ? 2 : 1;
        handleDataEntry(entry.start_time, days[entry.day - 1], {
          course_name: entry.course_name,
          course_code: entry.course_code,
          subgroup: entry.subgroup,
          room_name: entry.room_name,
          room_block: entry.room_block,
          start_time: entry.start_time,
          component: entry.component,
          faculty_name: entry.faculty_name,
        });
        console.log(data);
        if (!c.get(entry.course_code)) {
          c.set(entry.course_code, true);
        }

        if (entry.component == "Practical") {
          setLabs((lab) => {
            lab += entry.ltp;
            return lab;
          });
        } else if (entry.component == "Tutorial") {
          setTutorials((tut) => {
            tut += entry.ltp;
            return tut;
          });
        } else if (entry.component == "Lecture") {
          setLectures((lec) => {
            lec += entry.ltp;
            return lec;
          });
        }
      });
      setCourseTeaching(c.size);
    })();
  }, []);

  const handleLectureClick = (lecture: TimetableData) => {
    setSelectedLecture(lecture);
  };

  const closeModal = () => {
    setSelectedLecture(null);
  };

  return (
    <>
      {tabs && (
        <TopTabs
          coursesTeaching={courseTeaching}
          lectures={lectures}
          tutorials={tutorials}
          labs={labs}
        />
      )}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="flex justify-between">
              <TableHead className="w-1/6"></TableHead>
              {days.map((day) => (
                <TableHead key={day} className="w-1/6 text-center">
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {times.map((time) => (
              <TableRow key={time} className="flex justify-between">
                <TableHead className="w-1/6">{time}</TableHead>
                {days.map((day) => (
                  <TableCell key={`${day}-${time}`} className="w-1/6">
                    {data[`${day}-${time}`] ? (
                      <div
                        className={`${colorMap.get(data[`${day}-${time}`].component)} p-2 rounded cursor-pointer text-center`}
                        onClick={() =>
                          handleLectureClick(data[`${day}-${time}`])
                        }
                      >
                        {data[`${day}-${time}`].component[0] +
                          " " +
                          data[`${day}-${time}`].course_code +
                          " " +
                          data[`${day}-${time}`].room_block[0] +
                          data[`${day}-${time}`].room_name}
                      </div>
                    ) : (
                      ""
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedLecture && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedLecture.component} Details
            </h2>
            <p>
              <strong>Course Name:</strong> {selectedLecture.course_name}
            </p>
            <p>
              <strong>Course Code:</strong> {selectedLecture.course_code}
            </p>
            <p>
              <strong>Course Component:</strong> {selectedLecture.component}
            </p>
            <p>
              <strong>Subgroup:</strong> {selectedLecture.subgroup}
            </p>
            <p>
              <strong>Teacher:</strong> {selectedLecture.faculty_name}
            </p>
            <p>
              <strong>Room:</strong> {selectedLecture.room_name}
            </p>
            <p>
              <strong>Time:</strong> {selectedLecture.start_time}
            </p>
            {teacher && (
              <div className="flex flex-row w-full justify-around align-middle">
                <Button variant="secondary" className="mt-4 px-4 py-2 rounded">
                  Cancel Class
                </Button>
                <Button variant="secondary" className="mt-4 px-4 py-2 rounded">
                  Reschedule Class
                </Button>
              </div>
            )}
            <Button
              variant="destructive"
              onClick={closeModal}
              className="w-full mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export { Timetable };
