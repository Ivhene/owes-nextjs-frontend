import { ApiResult, Hero, Player } from "./types";

const API_URL = process.env.API_URL;

function describeHttpError(status: number, resource: string): string {
  if (status === 404) {
    return `${resource} could not be found.`;
  }
  if (status >= 500) {
    return `The server failed while loading ${resource.toLowerCase()} (HTTP ${status}). The item may not exist, or the backend has a problem.`;
  }
  return `Loading ${resource.toLowerCase()} failed (HTTP ${status}).`;
}

// Never throws: network and HTTP failures are returned as `{ ok: false, error }`
async function fetchJson<T>(
  path: string,
  resource: string,
  init: RequestInit,
): Promise<ApiResult<T>> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    return {
      ok: false,
      error: `Could not reach the API while loading ${resource.toLowerCase()}. Check that the backend is running and that API_URL is correct.`,
    };
  }

  if (!response.ok) {
    return { ok: false, error: describeHttpError(response.status, resource) };
  }

  try {
    return { ok: true, data: (await response.json()) as T };
  } catch {
    return {
      ok: false,
      error: `The API returned an unreadable response while loading ${resource.toLowerCase()}.`,
    };
  }
}

export function getHeroes(): Promise<ApiResult<Hero[]>> {
  return fetchJson<Hero[]>("/heroes", "Heroes", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 1200, tags: ["heroes"] },
  });
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
