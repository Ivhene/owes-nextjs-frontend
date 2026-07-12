import { HeroesGrid } from "@/components/heroes/HeroesGrid";
import { HeroesLoading } from "@/components/heroes/loading";
import { getHeroes } from "@/lib/API";
import { Suspense } from "react";

export default function HeroesPage() {
  const heroes = getHeroes();

  return (
    <Suspense fallback={<HeroesLoading />}>
      <HeroesGrid heroes={heroes} />
    </Suspense>
  );
}
