import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

// The sidebar is a slide-out sheet below md, so mobile needs its own trigger
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ow-border/70 bg-ow-bg-deep/90 px-4 py-2 backdrop-blur-sm md:hidden">
      <SidebarTrigger className="size-9" />
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/transparent_logo.png"
          alt="OWES logo"
          width={32}
          height={32}
        />
        <span className="text-lg font-black tracking-tight text-ow-text">
          OWES
        </span>
      </Link>
    </header>
  );
}
