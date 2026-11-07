"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { ApiResult, Team } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";

type SingleTeamPageProps = {
  teamPromise: Promise<ApiResult<Team>>;
};

const roleOrder: Record<string, number> = {
  Tank: 0,
  Damage: 1,
  Support: 2,
};

export function SingleTeamPage({ teamPromise }: SingleTeamPageProps) {
  const result = use(teamPromise);
  const router = useRouter();

  if (!result.ok) {
    return <ErrorMessage title="Team unavailable" message={result.error} />;
  }

  const team = result.data;
  const teamLogo = team.team_image ?? "/transparent_logo.png";
  const sortedPlayers = [...(team.players ?? [])].sort((left, right) => {
    const leftRank = roleOrder[left.role.role_name] ?? 99;
    const rightRank = roleOrder[right.role.role_name] ?? 99;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return left.gamertag.localeCompare(right.gamertag);
  });

  const openPlayer = (playerId: number) => router.push(`/players/${playerId}`);

  return (
    <div className="grid gap-4 pb-12 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:pb-40 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-w-0 rounded-2xl border sm:rounded-3xl border-ow-border/70 bg-ow-bg-deep/55 shadow-[0_18px_44px_rgba(15,23,42,0.16)] backdrop-blur-sm">
        <div className="border-b border-ow-border/70 px-4 py-3 sm:px-6 sm:py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ow-text/60">
            Roster
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-ow-text sm:text-3xl">
            {team.team_name}
          </h1>
        </div>

        <div className="overflow-hidden rounded-b-2xl sm:rounded-b-3xl">
          {sortedPlayers.length === 0 ? (
            <div className="flex min-h-80 items-center justify-center px-6 py-12 text-sm font-semibold text-ow-text/65">
              No players on this team.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-ow-bg-deep/95 backdrop-blur-sm">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-ow-text/55">
                    <th className="border-b border-ow-border/70 px-4 py-3 sm:px-6">
                      Player
                    </th>
                    <th className="border-b border-ow-border/70 px-4 py-3 text-right sm:px-6">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayers.map((player, index) => (
                    <tr
                      key={player.player_id}
                      role="link"
                      tabIndex={0}
                      aria-label={`Open ${player.gamertag}`}
                      onClick={() => openPlayer(player.player_id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openPlayer(player.player_id);
                        }
                      }}
                      className={`cursor-pointer transition-colors hover:bg-ow-orange/10 focus-visible:bg-ow-orange/10 focus-visible:outline-none ${
                        index % 2 === 0 ? "bg-ow-bg-deep/20" : "bg-ow-bg-deep/5"
                      }`}
                    >
                      <td className="border-b border-ow-border/50 px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-2xl border border-ow-border/60 bg-ow-bg-muted">
                            <Image
                              src={player.player_image ?? "/transparent_logo.png"}
                              alt={player.gamertag}
                              fill
                              sizes="48px"
                              className={
                                player.player_image
                                  ? "object-cover object-center"
                                  : "object-contain p-1"
                              }
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ow-text sm:text-base">
                              {player.gamertag}
                            </p>
                            {player.real_name ? (
                              <p className="mt-0.5 truncate text-xs text-ow-text/55">
                                {player.real_name}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-ow-border/50 px-4 py-3 text-right sm:px-6">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-ow-border/60 bg-ow-bg-deep/40 py-1 pl-1.5 pr-3">
                          <span className="relative size-6 overflow-hidden rounded-full bg-white/5">
                            <Image
                              src={player.role.role_image}
                              alt=""
                              fill
                              sizes="24px"
                              className="object-contain p-0.75"
                            />
                          </span>
                          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ow-text">
                            {player.role.role_name}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <aside className="order-first h-fit overflow-hidden rounded-2xl border sm:grid sm:grid-cols-[200px_minmax(0,1fr)] sm:rounded-3xl lg:sticky lg:top-6 lg:order-none lg:block border-ow-border/70 bg-ow-bg-deep/60 shadow-[0_18px_44px_rgba(15,23,42,0.16)] backdrop-blur-sm">
        <div className="relative aspect-square overflow-hidden bg-ow-bg-muted sm:self-start">
          <div className="absolute inset-0 bg-linear-to-br from-ow-bg-muted via-ow-bg-deep to-ow-bg-muted" />

          <Image
            src={teamLogo}
            alt={team.team_name}
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            className="object-contain p-8 sm:p-6 lg:p-10"
          />

          <div className="absolute inset-0 bg-linear-to-t from-ow-bg-deep/92 via-ow-bg-deep/20 to-transparent" />

          <div className="absolute left-2.5 top-2.5 rounded-full border border-white/10 bg-ow-bg-deep/70 px-2.5 py-1 backdrop-blur-sm">
            <span className="text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-ow-text/90">
              {team.competing_region}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-ow-bg-deep/88 px-3 py-2 backdrop-blur-sm">
            <span className="block truncate text-center text-sm font-extrabold uppercase tracking-[0.18em] text-ow-text">
              {team.team_name}
            </span>
          </div>
        </div>

        <div className="space-y-3 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ow-text/55">
              Team details
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-ow-text">
              {team.team_name}
            </h2>
          </div>

          <dl className="grid gap-2 text-sm">
            <div className="rounded-2xl border border-ow-border/70 bg-ow-bg-deep/30 px-4 py-2.5">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ow-text/55">
                Competing region
              </dt>
              <dd className="mt-1 font-semibold text-ow-text">
                {team.competing_region}
              </dd>
            </div>

            <div className="rounded-2xl border border-ow-border/70 bg-ow-bg-deep/30 px-4 py-2.5">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ow-text/55">
                Players
              </dt>
              <dd className="mt-1 font-semibold text-ow-text">
                {sortedPlayers.length}
              </dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
