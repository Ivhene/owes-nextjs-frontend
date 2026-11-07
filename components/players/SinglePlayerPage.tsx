"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { getRatingRank, getRatingTier } from "@/lib/ratings";
import { ApiResult, Player } from "@/lib/types";
import Image from "next/image";
import { use } from "react";

type SinglePlayerPageProps = {
  playerPromise: Promise<ApiResult<Player>>;
};

function formatBirthday(birthday: string | null) {
  if (!birthday) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(birthday));
}

export function SinglePlayerPage({ playerPromise }: SinglePlayerPageProps) {
  const result = use(playerPromise);

  if (!result.ok) {
    return <ErrorMessage title="Player unavailable" message={result.error} />;
  }

  const player = result.data;

  const teamLogo = player.current_team?.team_image ?? "/transparent_logo.png";
  const sortedRatings = (player.ratings ?? [])
    .filter((rating) => rating.hero !== null)
    .sort((left, right) => {
      const leftRank = getRatingRank(left.ratings);
      const rightRank = getRatingRank(right.ratings);

      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      return (left.hero?.hero_name ?? "").localeCompare(
        right.hero?.hero_name ?? "",
      );
    });

  return (
    <div className="grid gap-6 pb-40 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-3xl border border-ow-border/70 bg-ow-bg-deep/55 shadow-[0_18px_44px_rgba(15,23,42,0.16)] backdrop-blur-sm">
        <div className="border-b border-ow-border/70 px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ow-text/60">
            Hero ratings
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-ow-text sm:text-3xl">
            {player.gamertag}
          </h1>
        </div>

        <div className="overflow-hidden rounded-b-3xl">
          {sortedRatings.length === 0 ? (
            <div className="flex min-h-80 items-center justify-center px-6 py-12 text-sm font-semibold text-ow-text/65">
              No hero ratings available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-ow-bg-deep/95 backdrop-blur-sm">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-ow-text/55">
                    <th className="border-b border-ow-border/70 px-5 py-3 sm:px-6">
                      Hero
                    </th>
                    <th className="border-b border-ow-border/70 px-5 py-3 text-right sm:px-6">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRatings.map((rating, index) => {
                    const hero = rating.hero;
                    const ratingLabel = rating.ratings.trim().toUpperCase();
                    const badgeClassName =
                      getRatingTier(rating.ratings)?.labelClassName ??
                      "bg-ow-border/10 text-ow-text";

                    return (
                      <tr
                        key={rating.rating_id}
                        className={
                          index % 2 === 0
                            ? "bg-ow-bg-deep/20"
                            : "bg-ow-bg-deep/5"
                        }
                      >
                        <td className="border-b border-ow-border/50 px-5 py-3 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-2xl border border-ow-border/60 bg-ow-bg-muted">
                              <Image
                                src={
                                  hero?.hero_image ?? "/transparent_logo.png"
                                }
                                alt={hero?.hero_name ?? "Hero"}
                                fill
                                sizes="48px"
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-ow-text sm:text-base">
                                {hero?.hero_name ?? "Unknown hero"}
                              </p>
                              {rating.rating_user ? (
                                <p className="mt-0.5 truncate text-xs text-ow-text/55">
                                  {rating.rating_user}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-ow-border/50 px-5 py-3 text-right sm:px-6">
                          <span
                            className={`inline-flex min-w-12 justify-center rounded-full border border-transparent px-3 py-1 text-sm font-extrabold tracking-[0.18em] ${badgeClassName}`}
                          >
                            {ratingLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <aside className="lg:sticky lg:top-6 h-fit rounded-3xl border border-ow-border/70 bg-ow-bg-deep/60 shadow-[0_18px_44px_rgba(15,23,42,0.16)] backdrop-blur-sm">
        <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-ow-bg-muted">
          <div className="absolute inset-0 bg-linear-to-br from-ow-bg-muted via-ow-bg-deep to-ow-bg-muted" />

          <Image
            src={player.player_image ?? "/transparent_logo.png"}
            alt={player.gamertag}
            fill
            sizes="(max-width: 1024px) 100vw, 360px"
            className={
              player.player_image
                ? "object-cover object-center"
                : "object-contain p-10"
            }
          />

          <div className="absolute inset-0 bg-linear-to-t from-ow-bg-deep/92 via-ow-bg-deep/20 to-transparent" />

          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full border border-white/10 bg-ow-bg-deep/70 px-1.5 py-1 backdrop-blur-sm">
            <div className="relative size-6 overflow-hidden rounded-full bg-white/5">
              <Image
                src={player.role.role_image}
                alt={player.role.role_name}
                fill
                sizes="24px"
                className="object-contain p-0.75"
              />
            </div>
            <span className="text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-ow-text/90">
              {player.role.role_name}
            </span>
          </div>

          {player.current_team && (
            <div className="absolute right-2.5 top-2.5 size-7 overflow-hidden rounded-full border border-white/10 bg-ow-bg-deep/70 backdrop-blur-sm">
              <Image
                src={teamLogo}
                alt={player.current_team.team_name}
                fill
                sizes="28px"
                className="object-contain p-1"
              />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-ow-bg-deep/88 px-3 py-2 backdrop-blur-sm">
            <span className="block truncate text-center text-sm font-extrabold uppercase tracking-[0.18em] text-ow-text">
              {player.gamertag}
            </span>
          </div>
        </div>

        <div className="space-y-3 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ow-text/55">
              Player details
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-ow-text">
              {player.real_name ?? player.gamertag}
            </h2>
          </div>

          <dl className="grid gap-2 text-sm">
            <div className="rounded-2xl border border-ow-border/70 bg-ow-bg-deep/30 px-4 py-2.5">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ow-text/55">
                Role
              </dt>
              <dd className="mt-1 font-semibold text-ow-text">
                {player.role.role_name}
              </dd>
            </div>

            <div className="rounded-2xl border border-ow-border/70 bg-ow-bg-deep/30 px-4 py-2.5">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ow-text/55">
                Team
              </dt>
              <dd className="mt-1 font-semibold text-ow-text">
                {player.current_team?.team_name ?? "Free agent"}
              </dd>
            </div>

            <div className="rounded-2xl border border-ow-border/70 bg-ow-bg-deep/30 px-4 py-2.5">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ow-text/55">
                Region
              </dt>
              <dd className="mt-1 font-semibold text-ow-text">
                {player.native_region}
              </dd>
            </div>

            <div className="rounded-2xl border border-ow-border/70 bg-ow-bg-deep/30 px-4 py-2.5">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ow-text/55">
                Birthday
              </dt>
              <dd className="mt-1 font-semibold text-ow-text">
                {formatBirthday(player.birthday)}
              </dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
