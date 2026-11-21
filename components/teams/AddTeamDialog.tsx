"use client";

import { FormEvent, useState, useTransition } from "react";
import { PlusIcon } from "lucide-react";

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
import { addTeam } from "@/lib/actions";
import { regions } from "@/lib/regions";
import { Region } from "@/lib/types";
import { TEAM_NAME_MAX_LENGTH, validateTeam } from "@/lib/validation";

export function AddTeamDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 w-full rounded-xl px-3 font-semibold lg:w-auto">
          <PlusIcon />
          Add team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            Add team
          </DialogTitle>
          <DialogDescription>
            Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <AddTeamForm onSaved={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

type AddTeamFormProps = {
  onSaved: () => void;
};

function AddTeamForm({ onSaved }: AddTeamFormProps) {
  const [teamName, setTeamName] = useState("");
  const [region, setRegion] = useState("");
  const [image, setImage] = useState("");
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
      const result = await addTeam(validated.data);
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
        <FormField label="Team name" htmlFor="team-name" required>
          <Input
            id="team-name"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            maxLength={TEAM_NAME_MAX_LENGTH}
            autoComplete="off"
            required
          />
        </FormField>

        <FormField label="Region" htmlFor="team-region" required>
          <Select value={region} onValueChange={setRegion} required>
            <SelectTrigger id="team-region" className="w-full">
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

      <FormField label="Image URL" htmlFor="team-image">
        <Input
          id="team-image"
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
          {isPending ? "Saving..." : "Add team"}
        </Button>
      </DialogFooter>
    </form>
  );
}
