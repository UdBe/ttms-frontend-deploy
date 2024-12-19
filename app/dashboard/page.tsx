"use client";
import { Metadata } from "next";
import { jsPDF } from "jspdf";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function DashboardPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  const donwloadPDFTimetable = async () => {
    if (!contentRef.current) return;

    const content = contentRef.current;
    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;

    const pxToMm = (px: number) => px * 0.264583;
    const widthMm = pxToMm(contentWidth) * 50;
    const heightMm = pxToMm(contentHeight) * 50;
    const pdf = new jsPDF({
      orientation: widthMm > heightMm ? "landscape" : "portrait",
      unit: "mm",
      format: [widthMm, heightMm],
    });

    await pdf.html(content, {
      callback: (doc: any) => {
        doc.save("content.pdf");
      },
      x: 0,
      y: 0,
    });
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>
              {}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <p className="text-center p-0">Export</p>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export As</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Google Calendar</DropdownMenuItem>
                  <DropdownMenuItem>Excel</DropdownMenuItem>
                  <DropdownMenuItem onClick={donwloadPDFTimetable}>
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Prior Data
            </TabsTrigger>
          </TabsList>
          <div className="w-full mt-2" ref={contentRef}>
            <Timetable tabs={true} teacher={true} />
          </div>
        </Tabs>
      </div>
    </>
  );
}
