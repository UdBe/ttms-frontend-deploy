"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Progress from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { APICaller } from "@/utils/apiCaller";

export default function TimeTableGenerator() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartGeneration = () => {
    setIsModalOpen(false);
    setIsGenerating(true);
    simulateGeneration();
  };

  const simulateGeneration = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 500);
  };

  const startTimeTableGeneration = async () => {
    setIsGenerating(true);
    const response = await APICaller({
      path: "/timetable/generate",
      auth: true,
      method: "POST",
    });
    setIsGenerating(false);
  };

  return (
    <main className="flex min-h-screen:calc(100vh - 3rem) flex-col items-center justify-start space-y-3 p-3">
      <Card className="w-full p-5 text-center">
        <Button
          onClick={startTimeTableGeneration}
          disabled={isGenerating}
          className="mb-4"
        >
          Generate Time Table
        </Button>

        {isGenerating && (
          <div className="text-center">
            <div className="loader mb-4" aria-label="Loading">
              <div className="loader-inner"></div>
            </div>
            <Progress value={progress} className="w-64 mb-2 text-center" />
            <p>Generating Time Table: {progress}% complete</p>
          </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Time Table Generation</DialogTitle>
              <DialogDescription>
                Please verify all other information before proceeding with time
                table generation.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStartGeneration}>Start Generation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <style jsx>{`
          .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #e2e8f0;
            border-top: 5px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </Card>
    </main>
  );
}
