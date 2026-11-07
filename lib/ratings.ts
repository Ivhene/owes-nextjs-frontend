export type RatingTier = {
  label: string;
  name: string;
  labelClassName: string;
  rowClassName: string;
};

// Shared tier colors so the hero tier list and player ratings stay consistent
export const ratingTiers: RatingTier[] = [
  {
    label: "S",
    name: "S Tier",
    labelClassName:
      "bg-linear-to-br from-ow-orange to-ow-orange-hot text-ow-black",
    rowClassName: "border-ow-orange/40 bg-ow-orange/8",
  },
  {
    label: "A",
    name: "A Tier",
    labelClassName: "bg-ow-orange/80 text-ow-black",
    rowClassName: "border-ow-orange/25 bg-ow-orange/5",
  },
  {
    label: "B",
    name: "B Tier",
    labelClassName: "bg-ow-blue/80 text-ow-white",
    rowClassName: "border-ow-blue/25 bg-ow-blue/5",
  },
  {
    label: "C",
    name: "C Tier",
    labelClassName: "bg-ow-surface-muted text-ow-text",
    rowClassName: "border-ow-border/60 bg-ow-bg-deep/20",
  },
  {
    label: "D",
    name: "D Tier",
    labelClassName: "bg-ow-gray-dark text-ow-white",
    rowClassName: "border-ow-gray-dark/40 bg-ow-gray-dark/10",
  },
  {
    label: "E",
    name: "E Tier",
    labelClassName: "bg-ow-gray-dark/80 text-ow-white",
    rowClassName: "border-ow-gray-dark/30 bg-ow-gray-dark/5",
  },
  {
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
