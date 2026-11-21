"use server";

import { updateTag } from "next/cache";

import { createPlayer, createTeam } from "./API";
import {
  ApiResult,
  CreatedPlayer,
  CreatedTeam,
  CreatePlayerRequest,
  CreateTeamRequest,
} from "./types";
import { validatePlayer, validateTeam } from "./validation";

export async function addPlayer(
  input: CreatePlayerRequest,
): Promise<ApiResult<CreatedPlayer>> {
  const validated = validatePlayer(input);
  if (!validated.ok) {
    return validated;
  }

  const result = await createPlayer(validated.data);
  if (result.ok) {
    updateTag("players");
    updateTag(`player-${result.data.player_id}`);

    // Teams include their roster
    const teamId = validated.data.current_team;
    if (teamId !== null) {
      updateTag("teams");
      updateTag(`team-${teamId}`);
    }
  }

  return result;
}

export async function addTeam(
  input: CreateTeamRequest,
): Promise<ApiResult<CreatedTeam>> {
  const validated = validateTeam(input);
  if (!validated.ok) {
    return validated;
  }

  const result = await createTeam(validated.data);
  if (result.ok) {
    updateTag("teams");
    updateTag(`team-${result.data.team_id}`);
  }

  return result;
}
