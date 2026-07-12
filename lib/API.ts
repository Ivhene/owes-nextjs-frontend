import { Hero } from "./types";

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
