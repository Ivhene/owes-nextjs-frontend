"use client";

import { use, useMemo, useState } from "react";

import { ErrorMessage } from "@/components/ErrorMessage";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiResult, Team } from "@/lib/types";
import { TeamCard } from "./TeamCard";

type TeamsListProps = {
  teams: Promise<ApiResult<Team[]>>;
};

const noTeams: Team[] = [];

export function TeamsList({ teams }: TeamsListProps) {
  const result = use(teams);
  const teamsData = result.ok ? result.data : noTeams;

  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");

  const regions = useMemo(
    () =>
      Array.from(new Set(teamsData.map((team) => team.competing_region))).sort(),
    [teamsData],
  );

  const filteredTeams = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return teamsData
      .filter((team) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          team.team_name.toLowerCase().includes(normalizedSearch);
        const matchesRegion =
          regionFilter === "all" || team.competing_region === regionFilter;

        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => a.team_name.localeCompare(b.team_name));
  }, [teamsData, regionFilter, search]);

  if (!result.ok) {
    return <ErrorMessage title="Teams unavailable" message={result.error} />;
  }

  const controlClassName =
    "h-8 w-full rounded-xl border-ow-border/70 bg-ow-bg-deep/70 px-2.5 py-1 text-ow-text placeholder:text-ow-text/45";

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-6">
      <div className="rounded-2xl border border-ow-border/70 bg-ow-bg-deep/55 p-3 sm:p-4 shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search teams"
            className={controlClassName}
          />

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className={controlClassName}>
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <div className="flex min-h-56 items-center justify-center rounded-2xl border border-ow-border/70 bg-ow-bg-deep/45 text-sm font-semibold text-ow-text/70 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          No teams found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
          {filteredTeams.map((team) => (
            <TeamCard key={team.team_id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
