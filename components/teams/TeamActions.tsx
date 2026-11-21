"use client";

import { useState, useTransition } from "react";
import { PencilIcon, Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { editTeam, removeTeam } from "@/lib/actions";
import { Team } from "@/lib/types";
import { cn } from "@/lib/utils";

import { TeamForm } from "./TeamForm";

type TeamActionsProps = {
  team: Team;
  className?: string;
};

type TeamDialogProps = {
  team: Team;
};

const iconButtonClass =
  "size-8 rounded-full border border-white/10 bg-ow-bg-deep/70 text-ow-text/90 backdrop-blur-sm hover:bg-ow-bg-deep/90 hover:text-ow-text";

export function TeamActions({ team, className }: TeamActionsProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <EditTeamDialog team={team} />
      <DeleteTeamDialog team={team} />
    </div>
  );
}

function EditTeamDialog({ team }: TeamDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit team"
              className={iconButtonClass}
            >
              <PencilIcon />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Edit team</TooltipContent>
      </Tooltip>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            Edit team
          </DialogTitle>
          <DialogDescription>
            Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <TeamForm
          initialTeam={team}
          submitLabel="Save changes"
          onSubmit={(input) => editTeam(team.team_id, input)}
          onSaved={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function DeleteTeamDialog({ team }: TeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const playerCount = team.players?.length ?? 0;

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) {
      return;
    }
    setOpen(nextOpen);
    setError(null);
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      // Navigates to /teams on success
      const result = await removeTeam(team.team_id);
      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete team"
              className={cn(iconButtonClass, "hover:text-ow-danger")}
            >
              <Trash2Icon />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Delete team</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold tracking-tight">
            Delete {team.team_name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the team.
            {playerCount > 0 &&
              ` Its ${playerCount === 1 ? "player" : `${playerCount} players`} will no longer be on a team.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-ow-danger/40 bg-ow-danger/10 px-3 py-2 text-sm font-semibold text-ow-text"
          >
            {error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            className="font-semibold"
            onClick={(event) => {
              // Keep the dialog open until the delete has finished
              event.preventDefault();
              handleDelete();
            }}
          >
            {isPending ? "Deleting..." : "Delete team"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
