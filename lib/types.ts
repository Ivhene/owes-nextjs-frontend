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
  birthday: Date | null;
  player_role: Role;
  player_image: string | null;
  native_region: string;
  current_team: Team | null;
};

export type Team = {
  team_id: number;
  team_name: string;
  team_image: string | null;
  competing_region: string;
};

export type Rating = {
  rating_id: number;
  rating: string;
  hero: Hero | null;
  player: Player | null;
  rating_user: string | null;
};
