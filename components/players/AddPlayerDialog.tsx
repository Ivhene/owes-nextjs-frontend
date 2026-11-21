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
import { addPlayer } from "@/lib/actions";
import { ApiResult, Role, Team } from "@/lib/types";

import { PlayerForm } from "./PlayerForm";

type AddPlayerDialogProps = {
  teams: Promise<ApiResult<Team[]>>;
  roles: Promise<ApiResult<Role[]>>;
};

export function AddPlayerDialog({ teams, roles }: AddPlayerDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 w-full rounded-xl px-3 font-semibold lg:w-auto">
          <PlusIcon />
          Add player
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            Add player
          </DialogTitle>
          <DialogDescription>
            Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <PlayerForm
          teams={teams}
          roles={roles}
          submitLabel="Add player"
          onSubmit={addPlayer}
          onSaved={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
