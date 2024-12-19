"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/dal";

const groups = [
  {
    label: "DoAA",
    teams: [
      {
        label: "Maninder Singh",
        value: "DOAA",
      },
    ],
  },
  {
    label: "Roles",
    teams: [
      {
        label: "Faculty",
        value: "CSED Dept.",
      },
      {
        label: "HoD",
        value: "CSED Dept.",
      },
    ],
  },
];

type Team = (typeof groups)[number]["teams"][number];

type Group = {
  label: string;
  teams: [
    {
      label: string;
      value: string;
    },
  ];
};

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [groups, setGroups] = React.useState<Group[]>();
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team>();

  useEffect(() => {
    (async () => {
      const { user } = await getUser();
      const g: Group[] = [
        {
          label: user.designation,
          teams: [
            {
              label: user.name,
              value: user.designation,
            },
          ],
        },
      ];
      setGroups(g);
      setSelectedTeam(g[0].teams[0]);
    })();
  }, []);

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedTeam && selectedTeam.value}.png`}
                alt={selectedTeam && selectedTeam.label}
                className="grayscale"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedTeam && selectedTeam.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search team..." />
            <CommandList className="w-fit">
              <CommandEmpty>No team found.</CommandEmpty>
              {groups &&
                groups.map((group) => (
                  <CommandGroup
                    key={group.label}
                    heading={group.label}
                    className="w-fit"
                  >
                    {group.teams.map((team) => (
                      <CommandItem
                        key={team.value}
                        onSelect={() => {
                          setSelectedTeam(team);
                          setOpen(false);
                        }}
                        className="text-sm w-fit"
                      >
                        <Avatar className="mr-2 h-5 w-5">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${team.value}.png`}
                            alt={team.label}
                            className="grayscale"
                          />
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        {team.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedTeam!.value === team.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Add Users
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Member</DialogTitle>
          <DialogDescription>
            Add a user with specific permissions.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Member name</Label>
              <Input id="name" placeholder="Member Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">HoD</span> -{" "}
                    <span className="text-muted-foreground">
                      Head of Department
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Faculty</span> -{" "}
                    <span className="text-muted-foreground">
                      Teaching Faculty
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
