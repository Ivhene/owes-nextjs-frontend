import { Hero } from "@/lib/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

type HeroCardProps = {
  hero: Hero;
  onClick?: () => void;
  className?: string;
};

export function HeroCard({ hero, onClick, className }: HeroCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full max-w-33 flex-col overflow-hidden rounded-md border border-ow-border/70 bg-ow-bg-deep/95 text-left shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-ow-orange/60 hover:shadow-[0_14px_28px_rgba(249,158,26,0.18)] focus-visible:border-ow-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ow-orange/50",
        className,
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-ow-bg-muted">
        <Image
          src={hero.hero_image}
          alt={hero.hero_name}
          fill
          sizes="132px"
          className="object-cover object-[center_18%] transition duration-200 group-hover:scale-[1.04]"
        />
      </div>
      <div className="border-t border-ow-border/70 bg-ow-bg-deep px-2 py-1.5">
        <span className="block truncate text-center text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-ow-text">
          {hero.hero_name}
        </span>
      </div>
    </button>
  );
}
