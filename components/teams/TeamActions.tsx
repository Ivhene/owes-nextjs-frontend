"use client";

import {
  DeleteDialogButton,
  EditDialogButton,
} from "@/components/DetailActions";
import { editTeam, removeTeam } from "@/lib/actions";
import { Team } from "@/lib/types";

import { TeamForm } from "./TeamForm";

type TeamActionsProps = {
  team: Team;
};

export function TeamActions({ team }: TeamActionsProps) {
  const playerCount = team.players?.length ?? 0;
  const rosterNote =
    playerCount === 0
      ? ""
      : ` Its ${playerCount === 1 ? "player" : `${playerCount} players`} will no longer be on a team.`;

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <EditDialogButton label="Edit team">
        {(close) => (
          <TeamForm
            initialTeam={team}
            submitLabel="Save changes"
            onSubmit={(input) => editTeam(team.team_id, input)}
            onSaved={close}
          />
        )}
      </EditDialogButton>
      <DeleteDialogButton
        label="Delete team"
        title={`Delete ${team.team_name}?`}
        description={`This permanently deletes the team.${rosterNote}`}
        onDelete={() => removeTeam(team.team_id)}
      />
    </div>
  );
}
