import { TeamLoading } from "@/components/teams/loading";
import { SingleTeamPage } from "@/components/teams/SingleTeamPage";
import { getTeamById } from "@/lib/API";
import { Suspense } from "react";

export default async function TeamPage(props: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await props.params;
  const team = getTeamById(Number(teamId));

  return (
    <Suspense fallback={<TeamLoading />}>
      <SingleTeamPage teamPromise={team} />
    </Suspense>
  );
}
