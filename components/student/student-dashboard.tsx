"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Timetable } from "@/components/dashboard/timetable";
import { Button } from "@/components/ui/button";
import { StudentNav } from "./stuent-nav";
import { useSearchParams } from "next/navigation";

export function StudentDashboard() {
  const query = useSearchParams();
  const subgroup = query.get("subgroup") || "";
  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {subgroup} Timetable
          </h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button className="w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <p className="text-center p-0 w-full">Download</p>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export As</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Google Calendar</DropdownMenuItem>
                  <DropdownMenuItem>Excel</DropdownMenuItem>
                  <DropdownMenuItem>PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Button>
          </div>
        </div>
        <div className="w-full mt-2">
          <Timetable tabs={false} subgroup={subgroup} />
        </div>
      </div>
    </>
  );
}
