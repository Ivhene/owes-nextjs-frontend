"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  createPlayer,
  createTeam,
  deletePlayer,
  deleteRating,
  deleteTeam,
  getPlayerById,
  getTeamById,
  ratePlayer,
  updatePlayer,
  updateTeam,
} from "./API";
import {
  ApiResult,
  CreatedPlayer,
  CreatedTeam,
  CreatePlayerRequest,
  CreateTeamRequest,
  Player,
  RatePlayerRequest,
  Team,
  UpdatePlayerRating,
  UpdateTeamRequest,
} from "./types";
import { validatePlayer, validateRating, validateTeam } from "./validation";

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

function isValidId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}

function invalidId(resource: string): ApiResult<never> {
  return { ok: false, error: `The ${resource} id is not valid.` };
}

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
  if (!isValidId(teamId)) {
    return invalidId("team");
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
  if (!isValidId(teamId)) {
    return invalidId("team");
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

// Teams include their roster and hero ratings embed the rated player
function invalidatePlayer(
  playerId: number,
  teamIds: (number | null | undefined)[],
) {
  updateTag("players");
  updateTag(`player-${playerId}`);
  updateTag("heroes");

  const affectedTeams = new Set(
    teamIds.filter((id): id is number => typeof id === "number"),
  );
  if (affectedTeams.size > 0) {
    updateTag("teams");
    for (const teamId of affectedTeams) {
      updateTag(`team-${teamId}`);
    }
  }
}

export async function editPlayer(
  playerId: number,
  input: CreatePlayerRequest,
): Promise<ApiResult<Player>> {
  if (!isValidId(playerId)) {
    return invalidId("player");
  }
  const validated = validatePlayer(input);
  if (!validated.ok) {
    return validated;
  }

  const current = await getPlayerById(playerId);
  if (!current.ok) {
    return {
      ok: false,
      error: `Nothing was saved, because the player's current ratings could not be loaded. ${current.error}`,
    };
  }

  const ratings: UpdatePlayerRating[] = (current.data.ratings ?? []).flatMap(
    (rating) =>
      rating.hero
        ? [
            {
              rating_id: rating.rating_id,
              ratings: rating.ratings,
              hero: { hero_id: rating.hero.hero_id },
            },
          ]
        : [],
  );

  const result = await updatePlayer(playerId, {
    ...validated.data,
    ratings,
  });
  if (result.ok) {
    invalidatePlayer(playerId, [
      current.data.current_team?.team_id,
      validated.data.current_team,
    ]);
  }

  return result;
}

export async function savePlayerRating(
  playerId: number,
  input: RatePlayerRequest,
): Promise<ApiResult<Player>> {
  if (!isValidId(playerId)) {
    return invalidId("player");
  }
  const validated = validateRating(input);
  if (!validated.ok) {
    return validated;
  }

  const result = await ratePlayer(playerId, validated.data);
  if (result.ok) {
    // Team rosters embed their players' ratings
    invalidatePlayer(playerId, [result.data.current_team?.team_id]);
  }

  return result;
}

export async function removePlayerRating(
  playerId: number,
  ratingId: number,
): Promise<ApiResult<null>> {
  if (!isValidId(playerId)) {
    return invalidId("player");
  }
  if (!isValidId(ratingId)) {
    return invalidId("rating");
  }

  // The DELETE has no response body, so the team comes from the player
  const current = await getPlayerById(playerId);
  const result = await deleteRating(playerId, ratingId);
  if (result.ok) {
    invalidatePlayer(playerId, [
      current.ok ? current.data.current_team?.team_id : null,
    ]);
  }

  return result;
}

// Redirects to /players on success, so it only returns on failure
export async function removePlayer(playerId: number): Promise<ApiResult<null>> {
  if (!isValidId(playerId)) {
    return invalidId("player");
  }

  const current = await getPlayerById(playerId);
  const result = await deletePlayer(playerId);
  if (!result.ok) {
    return result;
  }

  invalidatePlayer(playerId, [
    current.ok ? current.data.current_team?.team_id : null,
  ]);
  redirect("/players");
}
