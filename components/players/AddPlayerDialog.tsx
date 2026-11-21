"use client";

import { FormEvent, Suspense, use, useState, useTransition } from "react";
import { PlusIcon } from "lucide-react";

import { ErrorMessage } from "@/components/ErrorMessage";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPlayer } from "@/lib/actions";
import { regions } from "@/lib/regions";
import { ApiResult, Region, Role, Team } from "@/lib/types";
import { GAMERTAG_MAX_LENGTH, validatePlayer } from "@/lib/validation";

type AddPlayerDialogProps = {
  teams: Promise<ApiResult<Team[]>>;
  roles: Promise<ApiResult<Role[]>>;
};

const noTeam = "none";

export function AddPlayerDialog({ teams, roles }: AddPlayerDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 w-full rounded-xl px-3 font-semibold lg:w-auto">
          <PlusIcon />
          Add player
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            Add player
          </DialogTitle>
          <DialogDescription>
            Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <Suspense
          fallback={
            <p className="py-6 text-center text-sm text-ow-text/70">
              Loading form...
            </p>
          }
        >
          <AddPlayerForm
            teams={teams}
            roles={roles}
            onSaved={() => setOpen(false)}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}

type AddPlayerFormProps = AddPlayerDialogProps & {
  onSaved: () => void;
};

function AddPlayerForm({ teams, roles, onSaved }: AddPlayerFormProps) {
  const teamsResult = use(teams);
  const rolesResult = use(roles);

  const [gamertag, setGamertag] = useState("");
  const [role, setRole] = useState("");
  const [region, setRegion] = useState("");
  const [realName, setRealName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [team, setTeam] = useState(noTeam);
  const [image, setImage] = useState("");
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
      const result = await addPlayer(validated.data);
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
        <FormField label="Gamertag" htmlFor="player-gamertag" required>
          <Input
            id="player-gamertag"
            value={gamertag}
            onChange={(event) => setGamertag(event.target.value)}
            maxLength={GAMERTAG_MAX_LENGTH}
            autoComplete="off"
            required
          />
        </FormField>

        <FormField label="Role" htmlFor="player-role" required>
          <Select value={role} onValueChange={setRole} required>
            <SelectTrigger id="player-role" className="w-full">
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

        <FormField label="Region" htmlFor="player-region" required>
          <Select value={region} onValueChange={setRegion} required>
            <SelectTrigger id="player-region" className="w-full">
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

        <FormField label="Current team" htmlFor="player-team">
          <Select value={team} onValueChange={setTeam}>
            <SelectTrigger id="player-team" className="w-full">
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

        <FormField label="Real name" htmlFor="player-real-name">
          <Input
            id="player-real-name"
            value={realName}
            onChange={(event) => setRealName(event.target.value)}
            autoComplete="off"
          />
        </FormField>

        <FormField label="Birthday" htmlFor="player-birthday">
          <Input
            id="player-birthday"
            type="date"
            value={birthday}
            onChange={(event) => setBirthday(event.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Image URL" htmlFor="player-image">
        <Input
          id="player-image"
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
          {isPending ? "Saving..." : "Add player"}
        </Button>
      </DialogFooter>
    </form>
  );
}
