"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, PlusCircle, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { APICaller } from "@/utils/apiCaller";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWorkflow } from "@/app/dashboard/admin/context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

const starttimetableFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  date: z.date({
    required_error: "A Start Date is required.",
  }),
  semester: z.boolean({
    required_error: "Semester type is required.",
  }),
});

type StartTimeTableFormValues = z.infer<typeof starttimetableFormSchema>;

const defaultValues: Partial<StartTimeTableFormValues> = {
  date: new Date(),
};

function CreateWorkflowModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const form = useForm<StartTimeTableFormValues>({
    resolver: zodResolver(starttimetableFormSchema),
    defaultValues,
  });
  const [loading, setLoading] = useState(false);
  const { setRerun } = useWorkflow();
  async function onSubmit(data: StartTimeTableFormValues) {
    setLoading(true);
    try {
      const { response } = await APICaller({
        path: "/workflow/",
        method: "POST",
        auth: true,
        body: {
          semester_name: data.name,
          start_date: data.date.toISOString(),
          semester: data.semester,
        },
      });
      if (response.status === 200) {
        setRerun(true);
        toast({
          title: "Success",
          description: "Workflow Created",
        });
        router.push("/dashboard/admin/rooms");
        onClose();
      } else {
        throw new Error("Failed to create workflow");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error Creating New Workflow",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester Name</FormLabel>
              <FormControl>
                <Input placeholder="Semester Name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be used to identify the upcoming
                semester. Eg. 2024ODDSEM
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Timeline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date <= new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                This Date marks the starting of the upcoming semester
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester Type</FormLabel>
              <br></br>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] px-4 py-2 text-left font-normal border rounded",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value === false
                        ? "Odd"
                        : field.value === true
                          ? "Even"
                          : "Select Semester"}
                      <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[240px]">
                    <DropdownMenuItem
                      onSelect={() => field.onChange(false)}
                      className={cn(
                        "cursor-pointer px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                        field.value === false &&
                          "bg-accent text-accent-foreground",
                      )}
                    >
                      Odd
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => field.onChange(true)}
                      className={cn(
                        "cursor-pointer px-2 py-2 hover:bg-accent hover:text-accent-foreground",
                        field.value === true &&
                          "bg-accent text-accent-foreground",
                      )}
                    >
                      Even
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormDescription>Select odd / even semester</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {loading ? <Spinner /> : "Create Semester"}
        </Button>
      </form>
    </Form>
  );
}

function StatusLight({
  isPublished,
  prefActive,
}: {
  isPublished: boolean;
  prefActive: boolean;
}) {
  let color = "bg-transparent";
  if (isPublished === true) {
    color = "bg-green-400";
  } else if (
    prefActive &&
    (isPublished === false || isPublished === undefined)
  ) {
    color = "bg-blue-400";
  }
  return (
    <div
      className={`w-2 h-2 rounded-full mr-2 ${color} animate-pulse shadow-[0_0_8px_2px_rgba(255,255,255,0.5)]`}
    />
  );
}

export default function WorkflowList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { workflows, selectedWorkflow } = useWorkflow();

  // setTimeout(() => {
  //   if (selectedWorkflow === null) {
  //     toast({
  //       title: "Error",
  //       description: "Please select a workflow",
  //       variant: "destructive",
  //     });
  //   }
  // }, 10000);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Timetables</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full w-12 h-12 p-0" variant="outline">
              <PlusCircle className="h-6 w-6" />
              <span className="sr-only">Create new Timetable</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Timetable</DialogTitle>
            </DialogHeader>
            <CreateWorkflowModal onClose={() => setIsModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow) => (
          <Link
            href={`/dashboard/admin/timetables/${workflow.id}`}
            key={workflow?.id}
          >
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedWorkflow && workflow.id === selectedWorkflow.id
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">
                    {workflow.semester_name}
                  </h2>
                  <div className="flex items-center">
                    <StatusLight
                      isPublished={workflow.publish}
                      prefActive={workflow.preference_opened}
                    />
                    <Badge variant={workflow.publish ? "default" : "secondary"}>
                      {workflow.publish ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Semester Start Date:{" "}
                  {new Date(workflow.semester_start_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Created On:{" "}
                  {new Date(workflow.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Created By: {workflow.created_by}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
