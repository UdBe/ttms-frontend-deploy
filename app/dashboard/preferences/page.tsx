"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { APICaller } from "@/utils/apiCaller";
import { useToast } from "@/hooks/use-toast";
import { CheckIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

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

function Preferences() {
  const [choices, setChoices] = useState<Choices>({
    firstChoice: null,
    secondChoice: null,
    thirdChoice: null,
    fourthChoice: null,
    fifthChoice: null,
  });
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState<Course[]>();

  const { toast } = useToast();
  const handleDropdownChange = (choice: keyof Choices, value: Course) => {
    setChoices((prevChoices) => ({ ...prevChoices, [choice]: value }));
  };

  useEffect(() => {
    (async () => {
      try {
        const { response, data } = await APICaller({
          method: "GET",
          path: "/preference/course",
          auth: true,
        });
        if (response.status === 200) {
          const c = data.map((d: any) => {
            return {
              id: d.id,
              name: `${d.course_code}: ${d.name}`,
            };
          });
          setCourse(c);
        }
      } catch {
        toast({
          title: "Error",
          description: "An error occured while fetching courses",
          variant: "destructive",
        });
      }
    })();
  });

  const handleSubmit = () => {
    if (Object.values(choices).some((choice) => choice === null)) {
      toast({
        title: "Error",
        description: "Please select all five preferences before saving.",
        variant: "destructive",
      });
      return;
    }
    console.log(choices);
    const drafts = localStorage.getItem("drafts");
    if (drafts) {
      const parsedDrafts = JSON.parse(drafts);
      parsedDrafts.push(choices);
      localStorage.setItem("drafts", JSON.stringify(parsedDrafts));
    } else {
      localStorage.setItem("drafts", JSON.stringify([choices]));
    }
    toast({
      title: "Success",
      description: "Preferences saved as draft",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Faculty Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Faculty members are requested to fill in the preferences for the
          upcoming semester by selecting courses.
        </p>
      </div>
      <Separator />
      <div className="max-w-lg space-y-4">
        <form>
          {[
            "firstChoice",
            "secondChoice",
            "thirdChoice",
            "fourthChoice",
            "fifthChoice",
          ].map((choice) => (
            <DropdownMenu key={choice}>
              <DropdownMenuTrigger asChild className="w-full">
                <Button size="lg" className="w-full">
                  {choices[choice as keyof Choices]?.name ||
                    `Select ${choice.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                </Button>
              </DropdownMenuTrigger>
              <div className="mb-2 w-full"></div>
              <DropdownMenuContent className="w-full">
                {course ? (
                  course.map((option: Course) => (
                    <DropdownMenuItem
                      key={option.id}
                      onSelect={() =>
                        handleDropdownChange(choice as keyof Choices, option)
                      }
                    >
                      {choices[choice as keyof Choices]?.name ===
                        option.name && (
                        <DropdownMenuShortcut>
                          <CheckIcon />
                        </DropdownMenuShortcut>
                      )}
                      {option.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="w-full text-center">
                    <Spinner size="md" speed="fast" />
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild className="w-full">
              <Button type="button" className="w-full" onClick={handleSubmit}>
                Save as Draft
              </Button>
            </AlertDialogTrigger>
          </AlertDialog>
        </form>
      </div>
    </div>
  );
}

export default Preferences;
