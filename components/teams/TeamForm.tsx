"use client";

import { FormEvent, useId, useState, useTransition } from "react";

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
import { ApiResult, CreateTeamRequest, Region, Team } from "@/lib/types";
import { TEAM_NAME_MAX_LENGTH, validateTeam } from "@/lib/validation";

type TeamFormProps = {
  initialTeam?: Team;
  submitLabel: string;
  onSubmit: (team: CreateTeamRequest) => Promise<ApiResult<unknown>>;
  onSaved: () => void;
};

export function TeamForm({
  initialTeam,
  submitLabel,
  onSubmit,
  onSaved,
}: TeamFormProps) {
  const id = useId();
  const [teamName, setTeamName] = useState(initialTeam?.team_name ?? "");
  const [region, setRegion] = useState<string>(
    isRegion(initialTeam?.competing_region) ? initialTeam.competing_region : "",
  );
  const [image, setImage] = useState(initialTeam?.team_image ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validated = validateTeam({
      team_name: teamName,
      competing_region: region as Region,
      team_image: image,
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
        <FormField label="Team name" htmlFor={`${id}-name`} required>
          <Input
            id={`${id}-name`}
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            maxLength={TEAM_NAME_MAX_LENGTH}
            autoComplete="off"
            required
          />
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
