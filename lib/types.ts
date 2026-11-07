export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type Hero = {
  hero_id: number;
  hero_name: string;
  hero_image: string;
  role: Role;
  ratings: Rating[] | null;
};

export type Role = {
  role_id: number;
  role_name: string;
  role_image: string;
};

export type Player = {
  player_id: number;
  gamertag: string;
  real_name: string | null;
  birthday: string | null;
  role: Role;
  player_image: string | null;
  native_region: string;
  current_team: Team | null;
  ratings: Rating[] | null;
};

export type Team = {
  team_id: number;
  team_name: string;
  team_image: string | null;
  competing_region: string;
  // Only present on /teams responses; nested players have no current_team
  players?: Player[] | null;
};

export type Rating = {
  rating_id: number;
  ratings: string;
  hero: Hero | null;
  player: Player | null;
  rating_user: string | null;
};
