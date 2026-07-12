"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Building2, House, UserRound, UsersRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const router = useRouter();
  const path = usePathname();

  const items = [
    {
      label: "Home",
      icon: <House />,
      route: "/",
      active: path === "/",
    },
    {
      label: "Players",
      icon: <UsersRound />,
      route: "/players",
      active: path === "/players",
    },
    {
      label: "Heroes",
      icon: <UserRound />,
      route: "/heroes",
      active: path === "/heroes",
    },
    {
      label: "Teams",
      icon: <Building2 />,
      route: "/teams",
      active: path === "/teams",
    },
  ];

  return (
    <Sidebar className="bg-ow-bg-deep">
      <SidebarHeader>
        <div
          className="flex flex-row items-center justify-between pr-12 p-5 text-3xl font-bold hover:cursor-pointer hover:border-ow-border hover:border hover:shadow-ow-border hover:shadow-xl hover:bg-ow-bg-muted"
          onClick={() => router.push("/")}
        >
          <Image
            src="/transparent_logo.png"
            alt="Logo"
            width={75}
            height={75}
          />
          OWES
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-16">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  className={cn(
                    `flex flex-row items-center justify-between pr-12 p-3 text-3xl font-bold hover:cursor-pointer hover:border-ow-border hover:border hover:shadow-ow-border hover:shadow-xl hover:bg-ow-bg-muted`,
                    item.active
                      ? "bg-ow-bg-muted border border-ow-border shadow-ow-border shadow-md"
                      : "",
                  )}
                  onClick={() => router.push("/")}
                  key={item.label}
                >
                  <SidebarMenuButton
                    onClick={() => router.push(item.route)}
                    className="hover:bg-transparent"
                  >
                    {item.icon} {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
