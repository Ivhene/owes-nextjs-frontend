import { Hero } from "./types";

export type HeroRoleSection = {
  role: string;
  accent: string;
  heroes: Hero[];
};

// Role names must match `role.role_name` from the API exactly
const heroRoles = [
  { role: "Tank", accent: "from-ow-blue to-ow-blue-muted" },
  { role: "Damage", accent: "from-ow-orange to-ow-orange-dark" },
  { role: "Support", accent: "from-ow-success to-ow-blue" },
];

export function groupHeroesByRole(heroes: Hero[]): HeroRoleSection[] {
  return heroRoles.map(({ role, accent }) => ({
    role,
    accent,
    heroes: heroes
      .filter((hero) => hero.role.role_name === role)
      .sort((a, b) => a.hero_name.localeCompare(b.hero_name)),
  }));
}
