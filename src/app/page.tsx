import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  SearchCheck,
  Bookmark,
  Package,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Plus,
} from "lucide-react";
import {
  MOCK_SPENDING_SUMMARY,
  MOCK_EVALUATIONS,
  MOCK_COLLECTION,
} from "@/lib/mock/data";

export default function DashboardPage() {
  const expiringItems = MOCK_COLLECTION.filter(
    (item) => item.status === "expired" || item.expiryDate?.includes("2026-12")
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Metric Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-espresso-muted">
                Monthly spending
              </span>
              <span className="text-[11px] font-medium text-espresso-muted">
                Budget: ${MOCK_SPENDING_SUMMARY.monthlyBudget}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                ${MOCK_SPENDING_SUMMARY.currentMonthTotal}
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                ${MOCK_SPENDING_SUMMARY.monthlyBudget - MOCK_SPENDING_SUMMARY.currentMonthTotal} remaining
              </span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-espresso-muted">
                Impulse savings
              </span>
              <TrendingDown className="h-4 w-4 text-berry" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                ${MOCK_SPENDING_SUMMARY.savedByImpulseCheck}
              </span>
              <span className="text-xs text-espresso-muted">
                cumulative avoided buys
              </span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-espresso-muted">
                My Collection
              </span>
              <Package className="h-4 w-4 text-espresso-muted" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                {MOCK_SPENDING_SUMMARY.totalItemsInCollection}
              </span>
              <span className="text-xs text-espresso-muted">
                items (${MOCK_SPENDING_SUMMARY.totalCollectionValue} value)
              </span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-espresso-muted">
                Active Wishlist
              </span>
              <Bookmark className="h-4 w-4 text-espresso-muted" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                {MOCK_SPENDING_SUMMARY.activeWishlistItems}
              </span>
              <span className="text-xs text-espresso-muted">
                items (${MOCK_SPENDING_SUMMARY.wishlistTotalValue} total)
              </span>
            </div>
          </Card>
        </section>

        {/* Action Bar */}
        <section className="flex flex-wrap items-center justify-between gap-3 border-y border-espresso/10 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/evaluator">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<SearchCheck className="h-3.5 w-3.5" />}
              >
                Evaluate product
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                Add to wishlist
              </Button>
            </Link>
            <Link href="/collection">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Package className="h-3.5 w-3.5" />}
              >
                Log to collection
              </Button>
            </Link>
          </div>

          <span className="text-[11px] text-espresso-muted">
            [Demo / Mock Data]
          </span>
        </section>

        {/* Main Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Recent Product Evaluations (2 cols) */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-espresso">
                  Recent Evaluations
                </h2>
                <p className="text-xs text-espresso-muted">
                  Latest ingredient and value assessments
                </p>
              </div>
              <Link href="/evaluator" className="text-xs text-berry hover:underline flex items-center gap-1 font-medium">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_EVALUATIONS.map((evalItem) => (
                <Card key={evalItem.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-espresso/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-espresso">
                          {evalItem.productName}
                        </span>
                        <Badge variant="subtle" size="sm">
                          {evalItem.category}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-espresso-muted">
                        {evalItem.brand} • ${evalItem.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-espresso">
                        Score: {evalItem.overallScore}/100
                      </span>
                      <Badge variant="berry" size="sm">
                        {evalItem.verdict}
                      </Badge>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-espresso-light leading-relaxed">
                    {evalItem.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-espresso-muted">
                    <span className="font-medium text-espresso">Cost per use:</span>
                    <span>{evalItem.valueAssessment.costPerUse}</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Right Column: Inventory & Expiry Alerts */}
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-espresso">
                Inventory Alerts
              </h2>
              <p className="text-xs text-espresso-muted">
                Items requiring attention or nearing expiry
              </p>
            </div>

            <Card className="space-y-3">
              {expiringItems.length > 0 ? (
                expiringItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2.5 p-2 rounded-md bg-espresso/5 border border-espresso/10"
                  >
                    <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-espresso truncate">
                          {item.product.name}
                        </span>
                        <Badge
                          variant={item.status === "expired" ? "warning" : "subtle"}
                          size="sm"
                        >
                          {item.status === "expired" ? "Expired" : "Expires soon"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-espresso-muted mt-0.5">
                        {item.product.brand} • Expiry: {item.expiryDate}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-espresso-muted py-2">
                  No inventory alerts at this time.
                </p>
              )}

              <div className="pt-2 border-t border-espresso/10">
                <Link href="/collection">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage collection
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Impulse Check Summary Card */}
            <Card className="bg-rose/15 border-espresso/15">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-espresso">
                  Impulse Check
                </CardTitle>
                <CardDescription className="text-xs text-espresso-light">
                  Avoid regretful buys before adding items to cart.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-1">
                <p className="text-xs text-espresso-light leading-relaxed">
                  Evaluate whether you already own similar items and calculate actual cost-per-use utility.
                </p>
                <div className="mt-3">
                  <Link href="/evaluator">
                    <Button variant="primary" size="sm" className="w-full">
                      Run impulse check
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
