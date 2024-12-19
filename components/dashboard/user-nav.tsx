"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUser } from "@/lib/dal";
import { deleteSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function getInitials(name: string): string {
  const prefixes = ["Dr.", "Prof."];
  const cleanName = name
    .split(" ")
    .filter((word) => !prefixes.includes(word))
    .join(" ");
  const initials = cleanName
    .split(" ")
    .map((n: string) => n[0])
    .join("");
  return initials.slice(0, 3).toUpperCase();
}

export function UserNav() {
  const [initials, setInitials] = useState<string>();
  const [designation, setDesignation] = useState<string>();
  const [email, setEmail] = useState<string>();
  useEffect(() => {
    (async () => {
      const { user } = await getUser();
      setDesignation(user.designation);
      setEmail(user.email);
      setInitials(getInitials(user.name));
    })();
  });

  const router = useRouter();

  function handleLogout() {
    deleteSession();
    router.push("/login");
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{designation}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Help</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            variant="ghost"
            className="w-full text-center"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
