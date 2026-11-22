"use client";

import { Suspense, use } from "react";

import { ErrorMessage } from "@/components/ErrorMessage";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApiResult, Hero } from "@/lib/types";

import { HeroTierListDialog } from "./HeroTierListDialog";

type HeroTierListByIdDialogProps = {
  heroes: Promise<ApiResult<Hero[]>>;
  heroId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Tier list for a hero known only by id (e.g. a hero nested in a player's
// ratings, which has no ratings of its own); the full hero comes from `heroes`
export function HeroTierListByIdDialog(props: HeroTierListByIdDialogProps) {
  return (
    <Suspense fallback={null}>
      <TierListForHero {...props} />
    </Suspense>
  );
}

function TierListForHero({
  heroes,
  heroId,
  open,
  onOpenChange,
}: HeroTierListByIdDialogProps) {
  const result = use(heroes);

  if (!result.ok) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle className="sr-only">Player tier list</DialogTitle>
          <ErrorMessage title="Tier list unavailable" message={result.error} />
        </DialogContent>
      </Dialog>
    );
  }

  const hero = result.data.find((item) => item.hero_id === heroId) ?? null;

  return (
    <HeroTierListDialog
      open={open}
      onOpenChange={onOpenChange}
      selectedHero={hero}
    />
  );
}
