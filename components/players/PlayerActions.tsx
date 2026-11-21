"use client";

import {
  DeleteDialogButton,
  EditDialogButton,
} from "@/components/DetailActions";
import { editPlayer, removePlayer } from "@/lib/actions";
import { ApiResult, Player, Role, Team } from "@/lib/types";

import { PlayerForm } from "./PlayerForm";

type PlayerActionsProps = {
  player: Player;
  teams: Promise<ApiResult<Team[]>>;
  roles: Promise<ApiResult<Role[]>>;
};

export function PlayerActions({ player, teams, roles }: PlayerActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <EditDialogButton label="Edit player">
        {(close) => (
          <PlayerForm
            teams={teams}
            roles={roles}
            initialPlayer={player}
            submitLabel="Save changes"
            onSubmit={(input) => editPlayer(player.player_id, input)}
            onSaved={close}
          />
        )}
      </EditDialogButton>
      <DeleteDialogButton
        label="Delete player"
        title={`Delete ${player.gamertag}?`}
        description="This permanently deletes the player."
        onDelete={() => removePlayer(player.player_id)}
      />
    </div>
  );
}
