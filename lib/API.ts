import { Hero, Player } from "./types";

const API_URL = process.env.API_URL;

export async function getHeroes(): Promise<Hero[]> {
  const response = await fetch(`${API_URL}/heroes`, {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 1200, tags: ["heroes"] },
  });
  const data = await response.json();
  return data;
}

export async function getPlayers(): Promise<Player[]> {
  const response = await fetch(`${API_URL}/players`, {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 1200, tags: ["players"] },
  });
  const data = await response.json();
  return data;
}

export async function getPlayerById(playerId: number): Promise<Player> {
  const response = await fetch(`${API_URL}/players/${playerId}`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json();
  return data;
}
