"use client";

import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { groupHeroesByRole } from "@/lib/heroes";
import { getRatingTier } from "@/lib/ratings";
import { Hero } from "@/lib/types";
import { cn } from "@/lib/utils";

type HeroPickerProps = {
  heroes: Hero[];
  selectedHeroId: number | null;
  onSelect: (hero: Hero) => void;
  // Existing ratings by hero id, shown as a badge on the hero
  currentRatings?: Map<number, string>;
  labelledBy?: string;
};

// Compact, label-less version of the heroes page grid for picking one hero
export function HeroPicker({
  heroes,
  selectedHeroId,
  onSelect,
  currentRatings,
  labelledBy,
}: HeroPickerProps) {
  const sections = groupHeroesByRole(heroes);

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className="grid grid-cols-1 gap-2 lg:grid-cols-4"
    >
      {sections.map((section) => (
        <section
          key={section.role}
          className={cn(
            "rounded-xl border border-ow-border/70 bg-ow-bg-deep/40 p-2",
            section.role === "Damage" && "lg:col-span-2",
          )}
        >
          <div className="mb-2 flex items-center gap-2">
            <div
              className={`size-2 rounded-full bg-linear-to-r ${section.accent}`}
            />
            <h3 className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-ow-text/80">
              {section.role}
            </h3>
            <div className="h-px flex-1 bg-linear-to-r from-ow-border/80 to-transparent" />
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1.5">
            {section.heroes.map((hero) => (
              <HeroPickerTile
                key={hero.hero_id}
                hero={hero}
                selected={hero.hero_id === selectedHeroId}
                currentRating={currentRatings?.get(hero.hero_id)}
                onSelect={() => onSelect(hero)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

type HeroPickerTileProps = {
  hero: Hero;
  selected: boolean;
  currentRating?: string;
  onSelect: () => void;
};

function HeroPickerTile({
  hero,
  selected,
  currentRating,
  onSelect,
}: HeroPickerTileProps) {
  const tier = currentRating ? getRatingTier(currentRating) : undefined;
  const label = tier ? `${hero.hero_name} (rated ${tier.label})` : hero.hero_name;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onSelect}
          aria-label={label}
          aria-pressed={selected}
          className={cn(
            "group relative aspect-4/3 w-full overflow-hidden rounded-md border border-ow-border/70 bg-ow-bg-muted transition duration-150 hover:border-ow-orange/60 focus-visible:border-ow-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ow-orange/50",
            selected &&
              "border-ow-orange ring-2 ring-ow-orange/70 hover:border-ow-orange",
          )}
        >
          <Image
            src={hero.hero_image}
            alt=""
            fill
            sizes="64px"
            className="object-cover object-[center_18%] transition duration-150 group-hover:scale-[1.06]"
          />
          {tier && (
            <span
              aria-hidden
              className={cn(
                "absolute bottom-0.5 right-0.5 rounded-sm px-1 text-[0.6rem] font-black leading-tight",
                tier.labelClassName,
              )}
            >
              {tier.label}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
