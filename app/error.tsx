"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorMessage
      message="An unexpected error occurred while rendering this page. Try again, and if the problem continues, check that the backend API is running."
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
