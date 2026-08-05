import { Player } from "@/lib/types";
import Image from "next/image";

type PlayerCardProps = {
  player: Player;
};

export function PlayerCard({ player }: PlayerCardProps) {
  const teamLogo = player.current_team?.team_image ?? "/transparent_logo.png";

  return (
    <article className="group relative overflow-hidden rounded-xl border border-ow-border/70 bg-ow-bg-deep/95 text-left shadow-[0_10px_22px_rgba(15,23,42,0.16)] transition duration-200 hover:-translate-y-0.5 hover:border-ow-orange/60 hover:shadow-[0_14px_28px_rgba(249,158,26,0.14)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ow-bg-muted">
        {player.player_image ? (
          <Image
            src={player.player_image}
            alt={player.gamertag}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover object-center transition duration-200 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-ow-bg-muted via-ow-bg-deep to-ow-bg-muted" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-ow-bg-deep/92 via-ow-bg-deep/18 to-transparent" />

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
            {player.native_region}
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

        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-ow-bg-deep/88 px-2.5 py-1.5 backdrop-blur-sm">
          <span className="block truncate text-center text-xs font-extrabold uppercase tracking-[0.16em] text-ow-text">
            {player.gamertag}
          </span>
        </div>
      </div>
    </article>
  );
}
