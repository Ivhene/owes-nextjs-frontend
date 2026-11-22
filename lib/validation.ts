import { allowedImageHosts, isAllowedImageUrl } from "./image-hosts";
import { isRatingValue } from "./ratings";
import { isRegion } from "./regions";
import {
  ApiResult,
  CreatePlayerRequest,
  CreateTeamRequest,
  RatePlayerRequest,
} from "./types";

// Column sizes in the database; longer values make the backend return a 500
export const GAMERTAG_MAX_LENGTH = 12;
export const TEAM_NAME_MAX_LENGTH = 30;

const imageUrlError = `The image URL must be an https link from one of these hosts: ${allowedImageHosts.join(", ")}.`;

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isId(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) > 0;
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

// Trims the input, turns empty optional fields into null and checks the rules
export function validatePlayer(
  input: CreatePlayerRequest,
): ApiResult<CreatePlayerRequest> {
  const gamertag = optionalText(input.gamertag);
  if (!gamertag) {
    return { ok: false, error: "Gamertag is required." };
  }
  if (gamertag.length > GAMERTAG_MAX_LENGTH) {
    return {
      ok: false,
      error: `Gamertag can be at most ${GAMERTAG_MAX_LENGTH} characters.`,
    };
  }
  if (!isId(input.player_role)) {
    return { ok: false, error: "Choose a role." };
  }
  if (!isRegion(input.native_region)) {
    return { ok: false, error: "Choose a region." };
  }

  const birthday = optionalText(input.birthday);
  if (birthday && !isIsoDate(birthday)) {
    return { ok: false, error: "Birthday must be a valid date." };
  }

  const playerImage = optionalText(input.player_image);
  if (playerImage && !isAllowedImageUrl(playerImage)) {
    return { ok: false, error: imageUrlError };
  }

  const currentTeam = input.current_team ?? null;
  if (currentTeam !== null && !isId(currentTeam)) {
    return { ok: false, error: "Choose a valid team." };
  }

  return {
    ok: true,
    data: {
      gamertag,
      real_name: optionalText(input.real_name),
      birthday,
      player_role: input.player_role,
      native_region: input.native_region,
      player_image: playerImage,
      current_team: currentTeam,
    },
  };
}

export function validateTeam(
  input: CreateTeamRequest,
): ApiResult<CreateTeamRequest> {
  const teamName = optionalText(input.team_name);
  if (!teamName) {
    return { ok: false, error: "Team name is required." };
  }
  if (teamName.length > TEAM_NAME_MAX_LENGTH) {
    return {
      ok: false,
      error: `Team name can be at most ${TEAM_NAME_MAX_LENGTH} characters.`,
    };
  }
  if (!isRegion(input.competing_region)) {
    return { ok: false, error: "Choose a region." };
  }

  const teamImage = optionalText(input.team_image);
  if (teamImage && !isAllowedImageUrl(teamImage)) {
    return { ok: false, error: imageUrlError };
  }

  return {
    ok: true,
    data: {
      team_name: teamName,
      team_image: teamImage,
      competing_region: input.competing_region,
    },
  };
}

export function validateRating(
  input: RatePlayerRequest,
): ApiResult<RatePlayerRequest> {
  if (!isId(input.hero)) {
    return { ok: false, error: "Choose a hero." };
  }
  if (!isRatingValue(input.rating)) {
    return { ok: false, error: "Choose a rating." };
  }

  return { ok: true, data: { hero: input.hero, rating: input.rating } };
}
