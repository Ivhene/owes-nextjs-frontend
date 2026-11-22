"use client";

import { ratingTiers } from "@/lib/ratings";
import { RatingValue } from "@/lib/types";
import { cn } from "@/lib/utils";

type RatingPickerProps = {
  value: RatingValue | null;
  onChange: (value: RatingValue) => void;
  labelledBy?: string;
};

// All tiers in a single row, styled like the tier list labels
export function RatingPicker({ value, onChange, labelledBy }: RatingPickerProps) {
  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className="grid grid-cols-7 gap-1.5 sm:gap-2"
    >
      {ratingTiers.map((tier) => {
        const selected = tier.value === value;

        return (
          <button
            key={tier.value}
            type="button"
            onClick={() => onChange(tier.value)}
            aria-label={tier.name}
            aria-pressed={selected}
            className={cn(
              "flex h-11 items-center justify-center rounded-lg border border-transparent text-lg font-black tracking-[0.1em] transition duration-150 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ow-text/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-14 sm:text-xl",
              tier.labelClassName,
              value !== null && !selected && "opacity-40",
              selected &&
                "ring-2 ring-ow-text ring-offset-2 ring-offset-background",
            )}
          >
            {tier.label}
          </button>
        );
      })}
    </div>
  );
}
