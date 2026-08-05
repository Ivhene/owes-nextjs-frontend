import { PlayersLoading } from "@/components/players/loading";
import { PlayersList } from "@/components/players/PlayersList";
import { getPlayers } from "@/lib/API";
import { Suspense } from "react";

export default function PlayersPage() {
  const players = getPlayers();

  return (
    <Suspense fallback={<PlayersLoading />}>
      <PlayersList players={players} />
    </Suspense>
  );
}
