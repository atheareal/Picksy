import {
  LayoutDashboard,
  SearchCheck,
  Bookmark,
  Package,
  ArrowLeftRight,
  BarChart3,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Spending overview, inventory status, and recent evaluations",
  },
  {
    title: "Product Evaluator",
    href: "/evaluator",
    icon: SearchCheck,
    description: "Evaluate products, ingredient safety, and impulse risk",
  },
  {
    title: "Wishlist",
    href: "/wishlist",
    icon: Bookmark,
    description: "Prioritized purchase queue with budget impact tracking",
  },
  {
    title: "My Collection",
    href: "/collection",
    icon: Package,
    description: "Track owned items, usage frequency, and expiration dates",
  },
  {
    title: "Compare Products",
    href: "/compare",
    icon: ArrowLeftRight,
    description: "Side-by-side product specifications and value comparison",
  },
  {
    title: "Shopping Insights",
    href: "/insights",
    icon: BarChart3,
    description: "Monthly spending patterns, category distribution, and analytics",
  },
];
