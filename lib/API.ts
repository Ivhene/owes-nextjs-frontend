import { Hero, Player } from "./types";

const API_URL = process.env.API_URL;

async function fetchJson<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${init.method ?? "GET"} ${path} (${response.status} ${response.statusText})`,
    );
  }

  return response.json();
}

export function getHeroes(): Promise<Hero[]> {
  return fetchJson<Hero[]>("/heroes", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 1200, tags: ["heroes"] },
  });
}

export function getPlayers(): Promise<Player[]> {
  return fetchJson<Player[]>("/players", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 1200, tags: ["players"] },
  });
}

export function getPlayerById(playerId: number): Promise<Player> {
  return fetchJson<Player>(`/players/${playerId}`, {
    method: "GET",
    cache: "no-store",
  });
}
