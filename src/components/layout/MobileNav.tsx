"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-espresso/10 bg-cream-light/95 backdrop-blur-md px-1 lg:hidden"
      aria-label="Mobile Bottom Navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);

        // Short title for compact mobile nav labels
        const shortTitle = item.title
          .replace("Product ", "")
          .replace("Products", "")
          .replace("Shopping ", "");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-center transition-colors",
              isActive
                ? "text-berry font-semibold"
                : "text-espresso-muted hover:text-espresso"
            )}
          >
            <Icon
              className={cn("h-4 w-4", isActive ? "text-berry" : "text-espresso-muted")}
            />
            <span className="text-[10px] leading-tight truncate max-w-[56px]">
              {shortTitle}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
