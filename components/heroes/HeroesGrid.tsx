"use client";

import { Hero } from "@/lib/types";
import { use, useState } from "react";
import { HeroTierListDialog } from "./HeroTierListDialog";
import { HeroCard } from "./HeroCard";

type HeroesGridProps = {
  heroes: Promise<Hero[]>;
};

export function HeroesGrid({ heroes }: HeroesGridProps) {
  const heroesData = use(heroes);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [tierListOpen, setTierListOpen] = useState(false);

  const tanks = heroesData
    .filter((hero) => hero.role.role_name === "Tank")
    .sort((a, b) => a.hero_name.localeCompare(b.hero_name));
  const dps = heroesData
    .filter((hero) => hero.role.role_name === "Damage")
    .sort((a, b) => a.hero_name.localeCompare(b.hero_name));
  const supports = heroesData
    .filter((hero) => hero.role.role_name === "Support")
    .sort((a, b) => a.hero_name.localeCompare(b.hero_name));

  const sections = [
    {
      title: "Tank",
      accent: "from-ow-blue to-ow-blue-muted",
      heroes: tanks,
      columnsClass: "grid-cols-3",
    },
    {
      title: "Damage",
      accent: "from-ow-orange to-ow-orange-dark",
      heroes: dps,
      columnsClass: "grid-cols-6",
    },
    {
      title: "Support",
      accent: "from-ow-success to-ow-blue",
      heroes: supports,
      columnsClass: "grid-cols-3",
    },
  ];

  return (
    <div className="flex h-full w-full flex-row items-center justify-center overflow-x-auto pb-2">
      <div className="grid min-w-270 grid-cols-1 gap-6 xl:grid-cols-4">
        {sections.map((section) => (
          <section
            key={section.title}
            className={`rounded-2xl border border-ow-border/70 bg-ow-bg-deep/55 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur-sm ${
              section.title === "Damage" ? "xl:col-span-2" : "xl:col-span-1"
            }`}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full bg-linear-to-r ${section.accent}`}
              />
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-ow-text">
                {section.title}
              </h2>
              <div className="h-px flex-1 bg-linear-to-r from-ow-border/80 to-transparent" />
            </div>

            <div className={`grid gap-3 ${section.columnsClass}`}>
              {section.heroes.map((hero) => (
                <HeroCard
                  key={hero.hero_id}
                  hero={hero}
                  onClick={() => {
                    setSelectedHero(hero);
                    setTierListOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <HeroTierListDialog
        open={tierListOpen}
        onOpenChange={setTierListOpen}
        selectedHero={selectedHero}
      />
    </div>
  );
}
