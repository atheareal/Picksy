"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-cream text-espresso">
      {/* Desktop & Mobile Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile bottom navigation */}
        <MobileNav />
      </div>
    </div>
  );
}
