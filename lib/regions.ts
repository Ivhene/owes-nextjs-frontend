import { Region } from "./types";

// Mirrors the backend `Regions` enum (see Swagger)
export const regions: { value: Region; label: string }[] = [
  { value: "na", label: "NA" },
  { value: "emea", label: "EMEA" },
  { value: "japan", label: "Japan" },
  { value: "korea", label: "Korea" },
  { value: "pacific", label: "Pacific" },
];

export function isRegion(value: unknown): value is Region {
  return regions.some((region) => region.value === value);
}
