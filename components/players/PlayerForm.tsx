"use client";

import {
  FormEvent,
  Suspense,
  use,
  useId,
  useState,
  useTransition,
} from "react";

import { ErrorMessage } from "@/components/ErrorMessage";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isRegion, regions } from "@/lib/regions";
import {
  ApiResult,
  CreatePlayerRequest,
  Player,
  Region,
  Role,
  Team,
} from "@/lib/types";
import { GAMERTAG_MAX_LENGTH, validatePlayer } from "@/lib/validation";

type PlayerFormProps = {
  teams: Promise<ApiResult<Team[]>>;
  roles: Promise<ApiResult<Role[]>>;
  initialPlayer?: Player;
  submitLabel: string;
  onSubmit: (player: CreatePlayerRequest) => Promise<ApiResult<unknown>>;
  onSaved: () => void;
};

const noTeam = "none";

export function PlayerForm(props: PlayerFormProps) {
  return (
    <Suspense
      fallback={
        <p className="py-6 text-center text-sm text-ow-text/70">
          Loading form...
        </p>
      }
    >
      <PlayerFormFields {...props} />
    </Suspense>
  );
}

function PlayerFormFields({
  teams,
  roles,
  initialPlayer,
  submitLabel,
  onSubmit,
  onSaved,
}: PlayerFormProps) {
  const teamsResult = use(teams);
  const rolesResult = use(roles);

  const id = useId();
  const [gamertag, setGamertag] = useState(initialPlayer?.gamertag ?? "");
  const [role, setRole] = useState(
    initialPlayer ? String(initialPlayer.role.role_id) : "",
  );
  const [region, setRegion] = useState<string>(
    isRegion(initialPlayer?.native_region) ? initialPlayer.native_region : "",
  );
  const [realName, setRealName] = useState(initialPlayer?.real_name ?? "");
  const [birthday, setBirthday] = useState(initialPlayer?.birthday ?? "");
  const [team, setTeam] = useState(
    initialPlayer?.current_team
      ? String(initialPlayer.current_team.team_id)
      : noTeam,
  );
  const [image, setImage] = useState(initialPlayer?.player_image ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!rolesResult.ok) {
    return (
      <ErrorMessage title="Roles unavailable" message={rolesResult.error} />
    );
  }
  if (!teamsResult.ok) {
    return (
      <ErrorMessage title="Teams unavailable" message={teamsResult.error} />
    );
  }

  const sortedTeams = [...teamsResult.data].sort((a, b) =>
    a.team_name.localeCompare(b.team_name),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validated = validatePlayer({
      gamertag,
      real_name: realName,
      birthday,
      player_role: Number(role),
      native_region: region as Region,
      player_image: image,
      current_team: team === noTeam ? null : Number(team),
    });
    if (!validated.ok) {
      setError(validated.error);
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await onSubmit(validated.data);
      if (result.ok) {
        onSaved();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Gamertag" htmlFor={`${id}-gamertag`} required>
          <Input
            id={`${id}-gamertag`}
            value={gamertag}
            onChange={(event) => setGamertag(event.target.value)}
            maxLength={GAMERTAG_MAX_LENGTH}
            autoComplete="off"
            required
          />
        </FormField>

        <FormField label="Role" htmlFor={`${id}-role`} required>
          <Select value={role} onValueChange={setRole} required>
            <SelectTrigger id={`${id}-role`} className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {rolesResult.data.map((item) => (
                <SelectItem key={item.role_id} value={String(item.role_id)}>
                  {item.role_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Region" htmlFor={`${id}-region`} required>
          <Select value={region} onValueChange={setRegion} required>
            <SelectTrigger id={`${id}-region`} className="w-full">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Current team" htmlFor={`${id}-team`}>
          <Select value={team} onValueChange={setTeam}>
            <SelectTrigger id={`${id}-team`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={noTeam}>No team</SelectItem>
              {sortedTeams.map((item) => (
                <SelectItem key={item.team_id} value={String(item.team_id)}>
                  {item.team_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Real name" htmlFor={`${id}-real-name`}>
          <Input
            id={`${id}-real-name`}
            value={realName}
            onChange={(event) => setRealName(event.target.value)}
            autoComplete="off"
          />
        </FormField>

        <FormField label="Birthday" htmlFor={`${id}-birthday`}>
          <Input
            id={`${id}-birthday`}
            type="date"
            value={birthday}
            onChange={(event) => setBirthday(event.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Image URL" htmlFor={`${id}-image`}>
        <Input
          id={`${id}-image`}
          type="url"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://cdn.discordapp.com/..."
          autoComplete="off"
        />
      </FormField>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-ow-danger/40 bg-ow-danger/10 px-3 py-2 text-sm font-semibold text-ow-text"
        >
          {error}
        </p>
      )}

      <DialogFooter>
        <Button type="submit" disabled={isPending} className="font-semibold">
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
