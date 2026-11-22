"use client";

import { FormEvent, Suspense, use, useId, useState, useTransition } from "react";
import { StarIcon } from "lucide-react";

import { ErrorMessage } from "@/components/ErrorMessage";
import { HeroPicker } from "@/components/heroes/HeroPicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { savePlayerRating } from "@/lib/actions";
import { ApiResult, Hero, Player, RatingValue } from "@/lib/types";
import { validateRating } from "@/lib/validation";

import { RatingPicker } from "./RatingPicker";

type RatePlayerDialogProps = {
  player: Player;
  heroes: Promise<ApiResult<Hero[]>>;
};

export function RatePlayerDialog({ player, heroes }: RatePlayerDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 shrink-0 rounded-xl px-3 font-semibold">
          <StarIcon />
          Rate player
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl"
        onOpenAutoFocus={(event) => {
          // Focusing the first hero would open its tooltip over the picker
          event.preventDefault();
          (event.currentTarget as HTMLElement).focus();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            Rate {player.gamertag}
          </DialogTitle>
          <DialogDescription>
            Choose a hero and a rating. Rating a hero again replaces the
            previous rating.
          </DialogDescription>
        </DialogHeader>
        <Suspense
          fallback={
            <p className="py-6 text-center text-sm text-ow-text/70">
              Loading heroes...
            </p>
          }
        >
          <RatePlayerForm
            player={player}
            heroes={heroes}
            onSaved={() => setOpen(false)}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}

type RatePlayerFormProps = RatePlayerDialogProps & {
  onSaved: () => void;
};

function RatePlayerForm({ player, heroes, onSaved }: RatePlayerFormProps) {
  const heroesResult = use(heroes);

  const id = useId();
  const [hero, setHero] = useState<Hero | null>(null);
  const [rating, setRating] = useState<RatingValue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!heroesResult.ok) {
    return (
      <ErrorMessage title="Heroes unavailable" message={heroesResult.error} />
    );
  }

  const currentRatings = new Map<number, string>();
  for (const item of player.ratings ?? []) {
    if (item.hero) {
      currentRatings.set(item.hero.hero_id, item.ratings);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validated = validateRating({
      hero: hero?.hero_id ?? 0,
      rating: rating as RatingValue,
    });
    if (!validated.ok) {
      setError(validated.error);
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await savePlayerRating(player.player_id, validated.data);
      if (result.ok) {
        onSaved();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <FieldLabel id={`${id}-hero`}>Hero</FieldLabel>
          <span className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-ow-text/70">
            {hero?.hero_name ?? "None selected"}
          </span>
        </div>
        <HeroPicker
          heroes={heroesResult.data}
          selectedHeroId={hero?.hero_id ?? null}
          onSelect={(selected) => {
            setHero(selected);
            setError(null);
          }}
          currentRatings={currentRatings}
          labelledBy={`${id}-hero`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel id={`${id}-rating`}>Rating</FieldLabel>
        <RatingPicker
          value={rating}
          onChange={(selected) => {
            setRating(selected);
            setError(null);
          }}
          labelledBy={`${id}-rating`}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-ow-danger/40 bg-ow-danger/10 px-3 py-2 text-sm font-semibold text-ow-text"
        >
          {error}
        </p>
      )}

      <DialogFooter>
        <Button type="submit" disabled={isPending} className="font-semibold">
          {isPending ? "Saving..." : "Save rating"}
        </Button>
      </DialogFooter>
    </form>
  );
}

type FieldLabelProps = {
  id: string;
  children: string;
};

// Matches the FormField label, for the button groups that have no single input
function FieldLabel({ id, children }: FieldLabelProps) {
  return (
    <p
      id={id}
      className="flex items-center gap-2 text-sm leading-none font-medium text-ow-text"
    >
      {children}
      <span aria-hidden className="text-ow-orange">
        *
      </span>
    </p>
  );
}
