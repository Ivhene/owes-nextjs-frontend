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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Building2,
  House,
  UserRound,
  UsersRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";

const SIDEBAR_STATE_KEY = "owes-sidebar-state";

export function AppSidebar() {
  const router = useRouter();
  const path = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const didRestoreState = React.useRef(false);

  React.useLayoutEffect(() => {
    if (didRestoreState.current) {
      return;
    }

    didRestoreState.current = true;

    const savedState = window.localStorage.getItem(SIDEBAR_STATE_KEY);

    if (savedState === "collapsed" && state !== "collapsed") {
      toggleSidebar();
    }
  }, [state, toggleSidebar]);

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

  const toggleCollapse = () => {
    const nextState = state === "collapsed" ? "expanded" : "collapsed";
    window.localStorage.setItem(SIDEBAR_STATE_KEY, nextState);
    toggleSidebar();
  };

  return (
    <Sidebar collapsible="icon" className="bg-ow-bg-deep">
      <SidebarHeader>
        <div
          className={cn(
            "flex flex-row items-center justify-between text-3xl font-bold hover:cursor-pointer hover:border-ow-border hover:border hover:shadow-ow-border hover:shadow-xl hover:bg-ow-bg-muted",
            state === "expanded" ? "p-5" : "p-2",
          )}
          onClick={() => router.push("/")}
        >
          {state === "expanded" ? (
            <React.Fragment>
              <Image
                src="/transparent_logo.png"
                alt="Logo"
                width={75}
                height={75}
              />
              OWES
            </React.Fragment>
          ) : (
            <Image
              src="/transparent_logo.png"
              alt="Logo"
              width={45}
              height={45}
            />
          )}
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
                  onClick={() => router.push(item.route)}
                  key={item.label}
                >
                  <SidebarMenuButton className="hover:bg-transparent">
                    {item.icon} {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem
                className={cn(
                  `flex flex-row items-center justify-between pr-12 p-3 text-3xl font-bold hover:cursor-pointer hover:border-ow-border hover:border hover:shadow-ow-border hover:shadow-xl hover:bg-ow-bg-muted`,
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleCollapse();
                }}
              >
                <SidebarMenuButton className="hover:bg-transparent">
                  {state === "collapsed" ? (
                    <React.Fragment>
                      <ArrowRightToLine />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <ArrowLeftToLine />
                      Collapse
                    </React.Fragment>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
