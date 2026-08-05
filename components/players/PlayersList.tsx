"use client";

import { use, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Player } from "@/lib/types";
import { PlayerCard } from "./PlayerCard";

type PlayersListProps = {
  players: Promise<Player[]>;
};

export function PlayersList({ players }: PlayersListProps) {
  const playersData = use(players);

  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");

  const regions = useMemo(
    () =>
      Array.from(
        new Set(playersData.map((player) => player.native_region)),
      ).sort(),
    [playersData],
  );
  const roles = useMemo(
    () =>
      Array.from(
        new Set(playersData.map((player) => player.role.role_name)),
      ).sort(),
    [playersData],
  );
  const teams = useMemo(
    () =>
      Array.from(
        new Set(
          playersData
            .map((player) => player.current_team?.team_name)
            .filter((team): team is string => Boolean(team)),
        ),
      ).sort(),
    [playersData],
  );

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return playersData.filter((player) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        player.gamertag.toLowerCase().includes(normalizedSearch);

      const matchesRegion =
        regionFilter === "all" || player.native_region === regionFilter;
      const matchesRole =
        roleFilter === "all" || player.role.role_name === roleFilter;
      const matchesTeam =
        teamFilter === "all" || player.current_team?.team_name === teamFilter;

      return matchesSearch && matchesRegion && matchesRole && matchesTeam;
    });
  }, [playersData, regionFilter, roleFilter, search, teamFilter]);

  const controlClassName =
    "h-8 w-full rounded-xl border-ow-border/70 bg-ow-bg-deep/70 px-2.5 py-1 text-ow-text placeholder:text-ow-text/45";

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-hidden">
      <div className="rounded-2xl border border-ow-border/70 bg-ow-bg-deep/55 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur-sm">
        <div className="grid gap-3 lg:grid-cols-4">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search players"
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

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className={controlClassName}>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className={controlClassName}>
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="flex min-h-56 items-center justify-center rounded-2xl border border-ow-border/70 bg-ow-bg-deep/45 text-sm font-semibold text-ow-text/70 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          No players found.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.player_id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}
