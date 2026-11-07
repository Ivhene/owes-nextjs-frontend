import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "OWES - Overwatch Esport Scouting",
  description:
    "Rate Overwatch esport players on the heroes they play while you watch. Ratings are subjective and based purely on what you feel.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className}`} suppressHydrationWarning>
      <body className="ow-page-bg ow-page-overlay flex min-h-0 overflow-hidden text-ow-text w-full">
        <TooltipProvider>
          <Providers>
            <SidebarProvider className="h-svh">
              <AppSidebar />
              <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
                <MobileHeader />
                <div className="p-4 sm:p-6 lg:p-8">{children}</div>
              </main>
            </SidebarProvider>
          </Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
