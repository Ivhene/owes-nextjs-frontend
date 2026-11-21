"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  createPlayer,
  createTeam,
  deleteTeam,
  getTeamById,
  updateTeam,
} from "./API";
import {
  ApiResult,
  CreatedPlayer,
  CreatedTeam,
  CreatePlayerRequest,
  CreateTeamRequest,
  Team,
  UpdateTeamRequest,
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

const invalidTeamId: ApiResult<never> = {
  ok: false,
  error: "The team id is not valid.",
};

// Players embed their current team, so a team change also affects its roster
async function getRosterIds(teamId: number): Promise<number[]> {
  const team = await getTeamById(teamId);
  return team.ok ? (team.data.players ?? []).map((p) => p.player_id) : [];
}

function invalidateTeam(teamId: number, rosterIds: number[]) {
  updateTag("teams");
  updateTag(`team-${teamId}`);
  updateTag("players");
  for (const playerId of rosterIds) {
    updateTag(`player-${playerId}`);
  }
}

export async function editTeam(
  teamId: number,
  input: UpdateTeamRequest,
): Promise<ApiResult<Team>> {
  if (!Number.isInteger(teamId) || teamId <= 0) {
    return invalidTeamId;
  }
  const validated = validateTeam(input);
  if (!validated.ok) {
    return validated;
  }

  const result = await updateTeam(teamId, validated.data);
  if (result.ok) {
    invalidateTeam(teamId, await getRosterIds(teamId));
  }

  return result;
}

// Redirects to /teams on success, so it only returns on failure
export async function removeTeam(teamId: number): Promise<ApiResult<null>> {
  if (!Number.isInteger(teamId) || teamId <= 0) {
    return invalidTeamId;
  }

  const rosterIds = await getRosterIds(teamId);
  const result = await deleteTeam(teamId);
  if (!result.ok) {
    return result;
  }

  invalidateTeam(teamId, rosterIds);
  // Hero ratings embed the rated player's team id
  updateTag("heroes");
  redirect("/teams");
}
