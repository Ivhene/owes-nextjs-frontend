import { RatingValue } from "./types";

export type RatingTier = {
  value: RatingValue;
  label: string;
  name: string;
  labelClassName: string;
  rowClassName: string;
};

// Shared tier colors so the hero tier list and player ratings stay consistent
export const ratingTiers: RatingTier[] = [
  {
    value: "s",
    label: "S",
    name: "S Tier",
    labelClassName:
      "bg-linear-to-br from-ow-orange to-ow-orange-hot text-ow-black",
    rowClassName: "border-ow-orange/40 bg-ow-orange/8",
  },
  {
    value: "a",
    label: "A",
    name: "A Tier",
    labelClassName: "bg-ow-orange/80 text-ow-black",
    rowClassName: "border-ow-orange/25 bg-ow-orange/5",
  },
  {
    value: "b",
    label: "B",
    name: "B Tier",
    labelClassName: "bg-ow-blue/80 text-ow-white",
    rowClassName: "border-ow-blue/25 bg-ow-blue/5",
  },
  {
    value: "c",
    label: "C",
    name: "C Tier",
    labelClassName: "bg-ow-surface-muted text-ow-text",
    rowClassName: "border-ow-border/60 bg-ow-bg-deep/20",
  },
  {
    value: "d",
    label: "D",
    name: "D Tier",
    labelClassName: "bg-ow-gray-dark text-ow-white",
    rowClassName: "border-ow-gray-dark/40 bg-ow-gray-dark/10",
  },
  {
    value: "e",
    label: "E",
    name: "E Tier",
    labelClassName: "bg-ow-gray-dark/80 text-ow-white",
    rowClassName: "border-ow-gray-dark/30 bg-ow-gray-dark/5",
  },
  {
    value: "f",
    label: "F",
    name: "F Tier",
    labelClassName: "bg-ow-danger text-ow-white",
    rowClassName: "border-ow-danger/35 bg-ow-danger/8",
  },
];

export function getRatingTier(rating: string): RatingTier | undefined {
  const label = rating.trim().toUpperCase();
  return ratingTiers.find((tier) => tier.label === label);
}

export function getRatingRank(rating: string): number {
  const tier = getRatingTier(rating);
  return tier ? ratingTiers.indexOf(tier) : ratingTiers.length;
}

export function isRatingValue(value: unknown): value is RatingValue {
  return ratingTiers.some((tier) => tier.value === value);
}
