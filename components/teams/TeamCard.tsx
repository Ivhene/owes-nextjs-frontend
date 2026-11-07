import { Team } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

type TeamCardProps = {
  team: Team;
};

export function TeamCard({ team }: TeamCardProps) {
  const router = useRouter();
  const playerCount = team.players?.length ?? 0;

  return (
    <article
      onClick={() => router.push(`/teams/${team.team_id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-ow-border/70 bg-ow-bg-deep/95 text-left shadow-[0_10px_22px_rgba(15,23,42,0.16)] transition duration-200 hover:-translate-y-0.5 hover:border-ow-orange/60 hover:shadow-[0_14px_28px_rgba(249,158,26,0.14)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ow-bg-muted">
        <div className="absolute inset-0 bg-linear-to-br from-ow-bg-muted via-ow-bg-deep to-ow-bg-muted" />

        <Image
          src={team.team_image ?? "/transparent_logo.png"}
          alt={team.team_name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
          className="object-contain p-6 transition duration-200 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-linear-to-t from-ow-bg-deep/92 via-ow-bg-deep/18 to-transparent" />

        <div className="absolute left-2.5 top-2.5 rounded-full border border-white/10 bg-ow-bg-deep/70 px-2.5 py-1 backdrop-blur-sm">
          <span className="text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-ow-text/90">
            {team.competing_region}
          </span>
        </div>

        <div className="absolute right-2.5 top-2.5 rounded-full border border-white/10 bg-ow-bg-deep/70 px-2.5 py-1 backdrop-blur-sm">
          <span className="text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-ow-text/90">
            {playerCount} {playerCount === 1 ? "player" : "players"}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-ow-bg-deep/88 px-2.5 py-1.5 backdrop-blur-sm">
          <span className="block truncate text-center text-xs font-extrabold uppercase tracking-[0.16em] text-ow-text">
            {team.team_name}
          </span>
        </div>
      </div>
    </article>
  );
}
