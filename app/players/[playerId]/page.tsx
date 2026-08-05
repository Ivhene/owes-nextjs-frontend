import { SinglePlayerPage } from "@/components/players/SinglePlayerPage";
import { getPlayerById } from "@/lib/API";

export default async function PlayerPage(props: {
  params: Promise<{ playerId: string }>;
}) {
  const propsData = await props.params;
  const playerId = propsData.playerId;
  const player = getPlayerById(parseInt(playerId, 10));

  return <SinglePlayerPage playerPromise={player} />;
}
