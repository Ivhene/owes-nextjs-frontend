import { TeamsLoading } from "@/components/teams/loading";
import { TeamsList } from "@/components/teams/TeamsList";
import { getTeams } from "@/lib/API";
import { Suspense } from "react";

export default function TeamsPage() {
  const teams = getTeams();

  return (
    <Suspense fallback={<TeamsLoading />}>
      <TeamsList teams={teams} />
    </Suspense>
  );
}
