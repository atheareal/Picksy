"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { X, Settings } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-espresso/40 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-espresso/10 bg-cream-light transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col">
          {/* Top Brand / Wordmark */}
          <div className="flex h-16 items-center justify-between border-b border-espresso/10 px-5">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={onClose}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-berry text-xs font-semibold text-white tracking-wider">
                P
              </span>
              <span className="font-sans text-lg font-bold tracking-tight text-espresso">
                Picksy
              </span>
            </Link>

            {/* Close button on mobile */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-espresso-muted hover:bg-blush hover:text-espresso lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Section */}
          <nav className="flex flex-col gap-1 p-3" aria-label="Main Navigation">
            <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-espresso-muted">
              Application
            </p>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-rose/25 text-espresso font-semibold"
                      : "text-espresso-light hover:bg-espresso/5 hover:text-espresso"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-berry" : "text-espresso-muted"
                    )}
                  />
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Area */}
        <div className="border-t border-espresso/10 p-3">
          <div className="flex items-center justify-between rounded-md p-2 hover:bg-espresso/5 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose/40 text-xs font-semibold text-espresso">
                JD
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-semibold text-espresso">
                  Jane Doe
                </span>
                <span className="truncate text-[11px] text-espresso-muted">
                  Personal Account
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-md text-espresso-muted hover:text-espresso"
              aria-label="User settings"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
