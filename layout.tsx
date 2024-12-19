"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/admin/rooms-multiselect";
import { APICaller } from "@/utils/apiCaller";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useWorkflow } from "@/app/dashboard/admin/context";

const FormSchema = z.object({
  rooms: z
    .array(z.string().min(1))
    .min(1)
    .nonempty("Please select at least one room."),
});

export default function RoomSelection() {
  const [roomsList, setRoomsList] = useState([]);
  const [capacity, setCapacity] = useState(0);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { selectedWorkflow } = useWorkflow();

  useEffect(() => {
    (async () => {
      const { data } = await APICaller({
        path: "/room/",
        method: "GET",
        auth: true,
      });
      const roomslist = data.map((room: any) => {
        const name = room.block + " " + room.room_number;

        return {
          value: `${room.id}`,
          label: name,
          capacity: room.capacity,
        };
      });
      setRoomsList(roomslist);
    })();
  }, []);

  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rooms: roomsList.map((room: any) => room?.id),
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (selectedWorkflow === null) {
      toast({
        title: "Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">Please select a workflow first.</code>
          </pre>
        ),
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { response } = await APICaller({
      path: `/workflow/${selectedWorkflow.id}/room`,
      method: "POST",
      auth: true,
      body: {
        rooms: data.rooms,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    setLoading(false);
    if (response.status === 200) {
      toast({
        title: "Success: Rooms Selected",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {data.rooms.length} {data.rooms.length <= 1 ? "Room" : "Rooms"}{" "}
              Selected Successfully
              <br />
              Workflow: {selectedWorkflow.semester_name}
            </code>
          </pre>
        ),
      });
      router.push("/dashboard/admin/courses");
    } else {
      toast({
        title: "Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              Error in selecting rooms.
              <br />
              Workflow: {selectedWorkflow.semester_name}
            </code>
          </pre>
        ),
        variant: "destructive",
      });
    }
  }

  return (
    <main className="flex min-h-screen:calc(100vh - 3rem) flex-col items-center justify-start space-y-3 p-3">
      <Card className="w-full p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="rooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rooms</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={roomsList}
                      capacity={capacity}
                      setCapacity={setCapacity}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select options"
                      variant="inverted"
                      animation={2}
                      maxCount={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose the available rooms for the semester. <br />
                    Selected Capacity : {capacity}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="default" type="submit" className="w-full">
              {loading ? <Spinner speed="fast" size="md" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </Card>
    </main>
  );
}

export { RoomSelection };
