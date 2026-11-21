import {
  ApiResult,
  CreatedPlayer,
  CreatedTeam,
  CreatePlayerRequest,
  CreateTeamRequest,
  Hero,
  Player,
  Role,
  Team,
  UpdateTeamRequest,
} from "./types";

const API_URL = process.env.API_URL;

type ApiAction = "loading" | "saving" | "deleting";

const serverErrorHints: Record<ApiAction, string> = {
  loading: "The item may not exist, or the backend has a problem.",
  saving: "Check the entered values, or the backend has a problem.",
  deleting: "The item may still be in use, or the backend has a problem.",
};

const actionVerbs: Record<ApiAction, string> = {
  loading: "Loading",
  saving: "Saving",
  deleting: "Deleting",
};

function describeHttpError(
  status: number,
  resource: string,
  action: ApiAction,
): string {
  if (status === 404) {
    return `${resource} could not be found.`;
  }
  if (status >= 500) {
    return `The server failed while ${action} ${resource.toLowerCase()} (HTTP ${status}). ${serverErrorHints[action]}`;
  }
  return `${actionVerbs[action]} ${resource.toLowerCase()} failed (HTTP ${status}).`;
}

// Never throws: network and HTTP failures are returned as `{ ok: false, error }`
async function send(
  path: string,
  resource: string,
  init: RequestInit,
  action: ApiAction,
): Promise<ApiResult<Response>> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    return {
      ok: false,
      error: `Could not reach the API while ${action} ${resource.toLowerCase()}. Check that the backend is running and that API_URL is correct.`,
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      error: describeHttpError(response.status, resource, action),
    };
  }

  return { ok: true, data: response };
}

async function fetchJson<T>(
  path: string,
  resource: string,
  init: RequestInit,
  action: ApiAction = "loading",
): Promise<ApiResult<T>> {
  const sent = await send(path, resource, init, action);
  if (!sent.ok) {
    return sent;
  }
  const response = sent.data;

  try {
    return { ok: true, data: (await response.json()) as T };
  } catch {
    return {
      ok: false,
      error: `The API returned an unreadable response while ${action} ${resource.toLowerCase()}.`,
    };
  }
}

function sendJson<T>(
  method: "POST" | "PUT",
  path: string,
  resource: string,
  body: unknown,
): Promise<ApiResult<T>> {
  return fetchJson<T>(
    path,
    resource,
    {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    "saving",
  );
}

// DELETE answers 204 without a body
async function deleteResource(
  path: string,
  resource: string,
): Promise<ApiResult<null>> {
  const sent = await send(path, resource, { method: "DELETE" }, "deleting");
  return sent.ok ? { ok: true, data: null } : sent;
}

export function getHeroes(): Promise<ApiResult<Hero[]>> {
  return fetchJson<Hero[]>("/heroes", "Heroes", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 1200, tags: ["heroes"] },
  });
}

// The API has no roles endpoint; roles are collected from the heroes
export async function getRoles(): Promise<ApiResult<Role[]>> {
  const result = await getHeroes();
  if (!result.ok) {
    return result;
  }

  const roles = new Map<number, Role>();
  for (const hero of result.data) {
    roles.set(hero.role.role_id, hero.role);
  }

  return {
    ok: true,
    data: Array.from(roles.values()).sort((a, b) => a.role_id - b.role_id),
  };
}

export function getPlayers(): Promise<ApiResult<Player[]>> {
  return fetchJson<Player[]>("/players", "Players", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 1200, tags: ["players"] },
  });
}

export async function getPlayerById(
  playerId: number,
): Promise<ApiResult<Player>> {
  if (!Number.isInteger(playerId)) {
    return { ok: false, error: "The player id in the URL is not valid." };
  }

  return fetchJson<Player>(`/players/${playerId}`, "Player", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 1200, tags: [`player-${playerId}`] },
  });
}

export function getTeams(): Promise<ApiResult<Team[]>> {
  return fetchJson<Team[]>("/teams", "Teams", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 1200, tags: ["teams"] },
  });
}

export async function getTeamById(teamId: number): Promise<ApiResult<Team>> {
  if (!Number.isInteger(teamId)) {
    return { ok: false, error: "The team id in the URL is not valid." };
  }

  return fetchJson<Team>(`/teams/${teamId}`, "Team", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 1200, tags: [`team-${teamId}`] },
  });
}

// Call through the server actions in lib/actions.ts, which also invalidate the cache
export function createPlayer(
  player: CreatePlayerRequest,
): Promise<ApiResult<CreatedPlayer>> {
  return sendJson<CreatedPlayer>("POST", "/players", "Player", player);
}

export function createTeam(
  team: CreateTeamRequest,
): Promise<ApiResult<CreatedTeam>> {
  return sendJson<CreatedTeam>("POST", "/teams", "Team", team);
}

// PUT replaces every editable field; the response is the team without players
export function updateTeam(
  teamId: number,
  team: UpdateTeamRequest,
): Promise<ApiResult<Team>> {
  return sendJson<Team>("PUT", `/teams/${teamId}`, "Team", team);
}

export function deleteTeam(teamId: number): Promise<ApiResult<null>> {
  return deleteResource(`/teams/${teamId}`, "Team");
}
