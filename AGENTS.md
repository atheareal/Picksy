<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PICKSY — PERMANENT AGENT & DEVELOPMENT INSTRUCTIONS

## 1. Product Purpose & Core Value
Picksy is an AI-powered personal shopping assistant focused on makeup, skincare, and clothing. Its objective is to help consumers make deliberate, well-informed purchasing decisions through:
- **Product Evaluation:** Objective assessment of ingredients, fabric quality, skin/style compatibility, and value-for-money.
- **Impulse Check:** Pre-purchase friction tool that analyzes urgency, existing duplicates, and financial utility to prevent regretful buys.
- **Wishlist Management:** Prioritized, categorized queue of desired purchases tracked against budgets.
- **My Collection:** Inventory tracker for owned cosmetics and wardrobe items, monitoring open dates, usage frequency, and expiration timelines.
- **Product Comparison:** Side-by-side spec, formulation, and cost-per-use benchmark analysis.
- **Shopping Insights:** Habit analytics, monthly spending breakdowns, and cumulative savings calculated from avoided impulse purchases.

---

## 2. Visual Identity & Design System
Picksy is a polished, modern, minimal SaaS web application. It must never look or feel like a social media page, beauty blog, influencer portfolio, or decorative marketing landing page.

- **Color Palette:**
  - Background: Neutral cream / off-white (`--color-cream: #FFF9F3`, `--color-cream-light: #FFFCF9`).
  - Accent: Restrained, muted rose and berry (`--color-rose: #E8B8C8`, `--color-berry: #C77D98`) used sparingly for focused interactive elements and status indicators.
  - Text & Borders: Dark charcoal / espresso (`--color-espresso: #46363C`, `--color-espresso-light: #6E5B63`, subtle borders with low-opacity rose/espresso).
- **Layout Architecture:**
  - Clean dashboard layout with a persistent left sidebar on desktop and a responsive drawer on mobile.
  - Predictable top utility header with search and status notifications.
  - Simple, structured, card-based information hierarchy with consistent spacing (4px, 8px, 16px, 24px, 32px).
- **Typography:**
  - High legibility, crisp sans-serif primary typography (`Poppins` / system-ui) for all data, tables, controls, and body copy.
  - Restrained, elegant serif (`Playfair Display`) strictly reserved for top-level section headings only.

---

## 3. Writing Style, Content & Tone
All interface copy, labels, placeholders, tooltips, and AI-generated outputs must adhere to the following standard:
- **Concise & Direct:** Use clear, straightforward language. State the action or fact in as few words as possible.
- **Clear Action Labels:** Use utilitarian labels such as `Evaluate product`, `Add to wishlist`, `Compare products`, `Log to collection`, `Monthly spending`, `Impulse check`.
- **Absolute Prohibitions on Tone & Decor:**
  - **NO childish, cute, or exaggerated phrases** (e.g., *never* use "Hello, Beautiful", "Cute Pro Tip", "dream products", "treat yourself", "magical stash", "girly must-haves").
  - **NO excessive emojis or decorative icons** (e.g., sparkles ✨, hearts 💖, kisses 💋, stars ⭐, or celebratory icons).
  - **NO unnecessary marketing copy or decorative slogans** (e.g., "Love every beauty pick", "Curate your fabulous life").
  - **NO fluff or filler text.** Every sentence must provide functional context or actionable information.

---

## 4. Technology Stack
- **Framework:** Next.js (App Router, Turbopack, React 19, TypeScript).
- **Styling:** Tailwind CSS with standardized CSS variables.
- **Database, Auth & Storage:** Supabase (PostgreSQL with strict Row Level Security).
- **AI Engine:** OpenAI API (executed strictly in server-side Route Handlers or Server Actions).
- **Analytics & Data Visualization:** Recharts for responsive graphs and charts.
- **Iconography:** Lucide React (clean, stroke-based iconography used functionally).

---

## 5. Code Quality & Architecture Expectations
- **Strict TypeScript:** All components, hooks, utilities, and API payloads must have explicit TypeScript types. Never use `any`.
- **Component Modularity:**
  - UI primitives live in `src/components/ui/` (Button, Card, Input, Badge, Modal, Table).
  - Section-specific feature modules live in `src/components/modules/<feature>/` (dashboard, evaluator, wishlist, collection, compare, insights).
  - Domain models and shared contracts live in `src/types/`.
- **State & Usability:**
  - Every interactive element (buttons, forms, filters) must have meaningful, implemented behavior.
  - Every view must provide explicit Loading states, Error states, and Empty states with actionable next steps.
  - Validate all user inputs client-side and server-side before processing.

---

## 6. Security & Data Integrity Requirements
- **Server-Side API Secrets:** All third-party secrets (`OPENAI_API_KEY`, Supabase Service Role keys) must remain strictly on the server. Never expose secrets via `NEXT_PUBLIC_` prefixes or pass them to client bundles.
- **Supabase Row Level Security (RLS):**
  - **NEVER disable Row Level Security on Supabase tables.**
  - Every table (`evaluations`, `wishlist`, `collection`, `comparisons`, `spending_logs`) must enforce policies scoped to `auth.uid() = user_id`.
- **Honesty in Persistence & Mock Data:**
  - **NEVER pretend that mock data is real persistent data.**
  - When backend persistence is not yet wired or when offline, clearly label temporary mock data (e.g., `[Demo / Mock Data]`).
  - Never replace real backend functionality with fake, non-functional stubs once the database is integrated.

---

## 7. Responsive Design & Accessibility
- **Mobile, Tablet & Desktop Support:** All layouts must be responsive. The left sidebar collapses into an accessible mobile drawer with an overlay backdrop on screens smaller than 1024px.
- **Touch Targets:** Interactive elements must have a minimum touch target size of 44x44px on mobile viewports.
- **Accessibility:** Use semantic HTML (`<main>`, `<header>`, `<nav>`, `<aside>`, `<section>`, `<button>`). Ensure form inputs have associated labels or `aria-label` attributes.

---

## 8. Testing & Validation Expectations
- **Structured AI Outputs:** Always use structured JSON outputs (OpenAI Structured Outputs / JSON Schema / Zod) to guarantee reproducible parsing without fragile regexes.
- **Build & Lint Integrity:** Ensure every change builds cleanly (`npm run build`) without TypeScript compilation errors or ESLint violations.
- **No Unapproved Removals:** Never delete or remove existing functionality without explicit user confirmation.
