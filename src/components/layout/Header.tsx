"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell } from "lucide-react";
import { NAV_ITEMS } from "@/constants/navigation";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();

  // Determine current active section
  const currentNav = NAV_ITEMS.find((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname?.startsWith(`${item.href}/`)
  ) || {
    title: "Dashboard",
    description: "Overview and personal shopping activity",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-espresso/10 bg-cream/90 backdrop-blur-sm px-4 sm:px-6">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-espresso/15 bg-white text-espresso hover:bg-espresso/5 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-espresso">
            {currentNav.title}
          </h1>
          <p className="text-[11px] text-espresso-muted hidden sm:block">
            {currentNav.description}
          </p>
        </div>
      </div>

      {/* Right: Search & Actions */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-espresso-muted" />
          <input
            type="search"
            placeholder="Search products or ingredients..."
            aria-label="Search products or ingredients"
            className="h-8 w-full rounded-md border border-espresso/15 bg-white pl-8 pr-3 text-xs text-espresso placeholder:text-espresso-muted/70 focus:border-berry focus:outline-none focus:ring-1 focus:ring-berry transition-colors"
          />
        </div>

        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-md border border-espresso/15 bg-white text-espresso-light hover:text-espresso transition-colors"
          aria-label="View notifications"
          title="Notifications"
        >
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-berry" />
        </button>
      </div>
    </header>
  );
}
