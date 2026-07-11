"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return React.createElement(
    ThemeProvider,
    {
      attribute: "class",
      defaultTheme: "system",
      enableSystem: true,
      disableTransitionOnChange: true,
    },
    children,
  );
}
