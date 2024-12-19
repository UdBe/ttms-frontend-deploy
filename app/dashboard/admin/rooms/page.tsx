"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { APICaller } from "@/utils/apiCaller";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useWorkflow } from "../context";

export default function RoomSelectionPage() {
  const [roomsList, setRoomsList] = useState<any[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [capacity, setCapacity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const { selectedWorkflow } = useWorkflow();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await APICaller({
          path: "/room/",
          method: "GET",
          auth: true,
        });
        setRoomsList(data);
      } catch (error) {
        setError("Failed to fetch rooms");
        toast({
          title: "Error",
          description: "Failed to fetch rooms. Please try again.",
          variant: "destructive",
        });
      }
    };
    fetchRooms();
  }, [toast]);

  useEffect(() => {
    const totalCapacity = selectedRooms.reduce((acc, roomId) => {
      const room = roomsList.find((r) => r.id.toString() === roomId);
      return acc + (room ? room.capacity : 0);
    }, 0);
    setCapacity(totalCapacity);
  }, [selectedRooms, roomsList]);

  const handleRoomSelection = (roomId: number) => {
    const roomIdString = roomId.toString();
    setSelectedRooms((prev) =>
      prev.includes(roomIdString)
        ? prev.filter((id) => id !== roomIdString)
        : [...prev, roomIdString],
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedRooms.length === 0) {
      setError("Please select at least one room.");
      return;
    }
    if (selectedWorkflow === null) {
      toast({
        title: "Error",
        description: "Please select a workflow first.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log(selectedRooms, typeof selectedRooms[0]);
      const { response } = await APICaller({
        path: `/workflow/${selectedWorkflow.id}/room`,
        method: "POST",
        auth: true,
        body: {
          rooms: selectedRooms,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast({
          title: "Success: Rooms Selected",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {selectedRooms.length}{" "}
                {selectedRooms.length <= 1 ? "Room" : "Rooms"} Selected
                Successfully
                <br />
                Workflow: {selectedWorkflow.semester_name}
              </code>
            </pre>
          ),
        });
        router.push("/dashboard/admin/courses");
      } else {
        throw new Error("Error in selecting rooms.");
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {error.message}
              <br />
              Workflow: {selectedWorkflow.semester_name}
            </code>
          </pre>
        ),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start space-y-3 p-3">
      <Card className="w-full p-5">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Choose the available rooms for the semester. <br />
              Selected Capacity: {capacity}
            </p>
            <Button variant="default" type="submit" disabled={loading}>
              {loading ? <Spinner speed="fast" size="md" /> : "Submit"}
            </Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Select</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Room Number</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Capacity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomsList.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRooms.includes(room.id.toString())}
                      onCheckedChange={() => handleRoomSelection(room.id)}
                    />
                  </TableCell>
                  <TableCell>{room.id}</TableCell>
                  <TableCell>{room.room_number}</TableCell>
                  <TableCell>{room.block}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </form>
      </Card>
    </main>
  );
}
