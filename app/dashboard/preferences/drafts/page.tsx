"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

interface Course {
  id: number;
  name: string;
}

interface Choices {
  firstChoice: Course | null;
  secondChoice: Course | null;
  thirdChoice: Course | null;
  fourthChoice: Course | null;
  fifthChoice: Course | null;
}

export default function DraftManager() {
  const [drafts, setDrafts] = useState<Choices[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<Choices | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const storedDrafts = localStorage.getItem("drafts");
    if (storedDrafts) {
      console.log(JSON.parse(storedDrafts));
      setDrafts(JSON.parse(storedDrafts));
    }
  }, []);

  const handleDraftClick = (draft: Choices) => {
    console.log(draft);
    setSelectedDraft(draft);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    setIsAlertOpen(true);
  };

  const confirmSubmit = () => {
    if (selectedDraft) {
      console.log("Submitting draft:", selectedDraft);
      localStorage.removeItem("drafts");
      setDrafts([]);
    }

    setIsAlertOpen(false);
    setIsModalOpen(false);
    setSelectedDraft(null);
  };

  const renderChoices = (choices: Choices) => {
    return Object.entries(choices).map(([key, value]) => {
      if (value) {
        return (
          <div key={key} className="mb-2">
            <p>{`${value.name} (ID: ${value.id})`}</p>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Drafts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drafts.length > 0 ? (
          drafts.map((draft, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleDraftClick(draft)}
            >
              <CardHeader>
                <CardTitle>Draft {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>View</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No drafts available</p>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Draft Choices</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedDraft && renderChoices(selectedDraft)}
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This draft can only be submitted
              once.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
