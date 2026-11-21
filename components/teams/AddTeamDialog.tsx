"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addTeam } from "@/lib/actions";

import { TeamForm } from "./TeamForm";

export function AddTeamDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 w-full rounded-xl px-3 font-semibold lg:w-auto">
          <PlusIcon />
          Add team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            Add team
          </DialogTitle>
          <DialogDescription>
            Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <TeamForm
          submitLabel="Add team"
          onSubmit={addTeam}
          onSaved={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
