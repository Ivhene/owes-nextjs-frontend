"use client";

import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ratingTiers as tiers, RatingTier as TierConfig } from "@/lib/ratings";
import { Hero, Rating } from "@/lib/types";
import { cn } from "@/lib/utils";

type HeroTierListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHero: Hero | null;
};

type TierPlayer = {
  playerId: number | null;
  gamertag: string;
};

const chipClassName =
  "inline-flex items-center rounded-full border border-ow-border/60 bg-ow-surface px-2 py-0.5 text-xs font-semibold text-ow-text sm:px-2.5 sm:py-1 sm:text-sm";

function TierRow({
  tier,
  players,
  isFirst,
  isLast,
  onPlayerClick,
}: {
  tier: TierConfig;
  players: TierPlayer[];
  isFirst: boolean;
  isLast: boolean;
  onPlayerClick: () => void;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[56px_minmax(0,1fr)] overflow-hidden border shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:grid-cols-[88px_minmax(0,1fr)]",
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
        <span className="text-base font-black leading-none tracking-[0.2em] sm:text-lg sm:tracking-[0.28em]">
          {tier.label}
        </span>
        <span className="sr-only">{tier.name}</span>
      </div>
      <div className="flex items-start px-2 py-2">
        <div className="flex min-h-12 w-full flex-wrap content-start gap-1 rounded-none border border-dashed border-ow-border/70 bg-background/40 p-2">
          {players.map((player) =>
            player.playerId === null ? (
              <span
                key={`${tier.label}-${player.gamertag}`}
                className={chipClassName}
              >
                {player.gamertag}
              </span>
            ) : (
              <Link
                key={player.playerId}
                href={`/players/${player.playerId}`}
                onClick={onPlayerClick}
                className={cn(
                  chipClassName,
                  "transition-colors hover:border-ow-orange/60 hover:text-ow-orange focus-visible:border-ow-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ow-orange/50",
                )}
              >
                {player.gamertag}
              </Link>
            ),
          )}
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

  const getRatingTier = (rating: Rating) => rating.ratings.trim().toUpperCase();

  const playersByTier = tiers.map((tier) => {
    const players = new Map<string, TierPlayer>();
    for (const rating of ratings) {
      if (getRatingTier(rating) !== tier.label) {
        continue;
      }
      const playerId = rating.player?.player_id ?? null;
      const gamertag = rating.player?.gamertag ?? "Unknown Player";
      players.set(playerId === null ? `name-${gamertag}` : `id-${playerId}`, {
        playerId,
        gamertag,
      });
    }

    return {
      tier,
      players: Array.from(players.values()).sort((a, b) =>
        a.gamertag.localeCompare(b.gamertag),
      ),
    };
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[calc(100%-4rem)] lg:max-w-[80vw]">
        <div className="flex max-h-[calc(100svh-2rem)] flex-col overflow-y-auto bg-linear-to-b from-ow-surface to-ow-bg-deep/90">
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
                    onPlayerClick={() => onOpenChange(false)}
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
