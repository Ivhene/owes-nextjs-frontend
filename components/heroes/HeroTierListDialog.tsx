"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Hero, Rating } from "@/lib/types";
import { cn } from "@/lib/utils";

type HeroTierListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHero: Hero | null;
};

type TierConfig = {
  label: string;
  name: string;
  labelClassName: string;
  rowClassName: string;
};

const tiers: TierConfig[] = [
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
    label: "F",
    name: "F Tier",
    labelClassName: "bg-ow-danger text-ow-white",
    rowClassName: "border-ow-danger/35 bg-ow-danger/8",
  },
];

function TierRow({
  tier,
  players,
  isFirst,
  isLast,
}: {
  tier: TierConfig;
  players: string[];
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[88px_minmax(0,1fr)] overflow-hidden border shadow-[0_10px_24px_rgba(15,23,42,0.08)]",
        isFirst && "rounded-t-2xl",
        isLast && "rounded-b-2xl",
        tier.rowClassName,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center px-2 py-2",
          tier.labelClassName,
        )}
      >
        <span className="text-lg font-black leading-none tracking-[0.28em]">
          {tier.label}
        </span>
        <span className="sr-only">{tier.name}</span>
      </div>
      <div className="flex items-start px-2 py-2">
        <div className="flex min-h-12 w-full flex-wrap content-start gap-1 rounded-none border border-dashed border-ow-border/70 bg-background/40 p-2">
          {players.map((player) => (
            <span
              key={`${tier.label}-${player}`}
              className="inline-flex items-center rounded-full border border-ow-border/60 bg-ow-surface px-2.5 py-1 text-sm font-semibold text-ow-text"
            >
              {player}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroTierListDialog({
  open,
  onOpenChange,
  selectedHero,
}: HeroTierListDialogProps) {
  const ratings = selectedHero?.ratings ?? [];

  const getRatingTier = (rating: Rating) => {
    const source = rating as Rating & { ratings?: string };

    return (source.rating ?? source.ratings ?? "").trim().toUpperCase();
  };

  const playersByTier = tiers.map((tier) => {
    const players = Array.from(
      new Set(
        ratings
          .filter((rating) => getRatingTier(rating) === tier.label)
          .map((rating) => rating.player?.gamertag ?? "Unknown Player"),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return {
      tier,
      players,
    };
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden p-0"
        style={{ width: "80vw", maxWidth: "80vw" }}
      >
        <div className="flex flex-col bg-linear-to-b from-ow-surface to-ow-bg-deep/90">
          <DialogHeader className="border-b border-ow-border/60 px-4 py-3">
            <DialogTitle className="text-lg tracking-tight sm:text-xl">
              Player tier list
            </DialogTitle>
          </DialogHeader>

          <div className="px-2 py-2 sm:px-4 sm:py-3">
            <div className="overflow-hidden rounded-2xl border border-ow-border/60">
              <div className="divide-y divide-ow-border/60">
                {playersByTier.map(({ tier, players }, index) => (
                  <TierRow
                    key={tier.label}
                    tier={tier}
                    players={players}
                    isFirst={index === 0}
                    isLast={index === playersByTier.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
