import { PlayersLoading } from "@/components/players/loading";
import { PlayersList } from "@/components/players/PlayersList";
import { getPlayers, getRoles, getTeams } from "@/lib/API";
import { Suspense } from "react";

export default function PlayersPage() {
  const players = getPlayers();
  const teams = getTeams();
  const roles = getRoles();

  return (
    <Suspense fallback={<PlayersLoading />}>
      <PlayersList players={players} teams={teams} roles={roles} />
    </Suspense>
  );
}
