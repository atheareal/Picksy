"use client";

import * as React from "react";
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
import { Input } from "@/components/ui/Input";
import {
  Package,
  Plus,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
  ArrowUpDown,
  Trash2,
  Edit2,
  Check,
  X,
  RotateCcw,
  Clock,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  TrendingDown,
  Archive,
} from "lucide-react";
import { MOCK_COLLECTION } from "@/lib/mock/data";
import { Category, CollectionItem } from "@/types";

export default function CollectionPage() {
  const [items, setItems] = React.useState<CollectionItem[]>(MOCK_COLLECTION);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"expiry" | "most-used" | "least-used" | "cost-desc" | "newest">("expiry");

  // Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);

  // Form Inputs
  const [formName, setFormName] = React.useState("");
  const [formBrand, setFormBrand] = React.useState("");
  const [formCategory, setFormCategory] = React.useState<Category>("skincare");
  const [formPrice, setFormPrice] = React.useState("");
  const [formPurchaseDate, setFormPurchaseDate] = React.useState("");
  const [formOpenedDate, setFormOpenedDate] = React.useState("");
  const [formExpiryDate, setFormExpiryDate] = React.useState("");
  const [formStatus, setFormStatus] = React.useState<"active" | "nearly_empty" | "expired" | "archived">("active");
  const [formUsageCount, setFormUsageCount] = React.useState("1");
  const [formNotes, setFormNotes] = React.useState("");

  // Status & Feedback
  const [actionNotice, setActionNotice] = React.useState<{ message: string; undoItem?: CollectionItem } | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Auto-dismiss notification after 5 seconds
  React.useEffect(() => {
    if (actionNotice) {
      const timer = setTimeout(() => setActionNotice(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionNotice]);

  // Reset form
  const resetForm = () => {
    setFormName("");
    setFormBrand("");
    setFormCategory("skincare");
    setFormPrice("");
    setFormPurchaseDate(new Date().toISOString().split("T")[0]);
    setFormOpenedDate(new Date().toISOString().split("T")[0]);
    setFormExpiryDate("");
    setFormStatus("active");
    setFormUsageCount("1");
    setFormNotes("");
    setFormError(null);
    setEditingItemId(null);
  };

  // Open Edit Modal
  const openEditModal = (item: CollectionItem) => {
    setEditingItemId(item.id);
    setFormName(item.product.name);
    setFormBrand(item.product.brand);
    setFormCategory(item.product.category);
    setFormPrice(item.purchasePrice.toString());
    setFormPurchaseDate(item.purchaseDate);
    setFormOpenedDate(item.openedDate || "");
    setFormExpiryDate(item.expiryDate || "");
    setFormStatus(item.status);
    setFormUsageCount(item.usageCount.toString());
    setFormNotes(item.notes || "");
    setFormError(null);
    setIsModalOpen(true);
  };

  // Preset quick fill
  const loadPreset = (type: "skincare" | "clothing" | "expiring_test") => {
    if (type === "skincare") {
      setFormName("Gentle Daily Gel Cleanser");
      setFormBrand("SkinTheory");
      setFormCategory("skincare");
      setFormPrice("24");
      setFormPurchaseDate("2026-09-01");
      setFormOpenedDate("2026-09-05");
      setFormExpiryDate("2027-09-05");
      setFormStatus("active");
      setFormUsageCount("38");
      setFormNotes("Morning and evening wash. Excellent pH balance.");
    } else if (type === "clothing") {
      setFormName("Pleated Wide-Leg Linen Trousers");
      setFormBrand("Studio Minimal");
      setFormCategory("clothing");
      setFormPrice("95");
      setFormPurchaseDate("2026-05-15");
      setFormOpenedDate("");
      setFormExpiryDate("");
      setFormStatus("active");
      setFormUsageCount("24");
      setFormNotes("Dry clean or delicate cycle. Versatile work staple.");
    } else if (type === "expiring_test") {
      setFormName("Volumizing Lash Mascara");
      setFormBrand("Lash Lab");
      setFormCategory("makeup");
      setFormPrice("22");
      setFormPurchaseDate("2026-05-10");
      setFormOpenedDate("2026-05-15");
      setFormExpiryDate("2026-11-15"); // Expired / Expiring test
      setFormStatus("expired");
      setFormUsageCount("65");
      setFormNotes("Past 6-month PAO safety limit. Discard recommended.");
    }
  };

  // Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Please enter a product name.");
      return;
    }

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setFormError("Please enter a valid purchase price.");
      return;
    }

    const usageNum = parseInt(formUsageCount, 10);
    const validUsage = isNaN(usageNum) || usageNum < 1 ? 1 : usageNum;
    const costPerUse = parseFloat((priceNum / validUsage).toFixed(2));

    setIsSubmitting(true);

    setTimeout(() => {
      if (editingItemId) {
        // Edit existing item
        setItems((prev) =>
          prev.map((item) => {
            if (item.id === editingItemId) {
              return {
                ...item,
                purchaseDate: formPurchaseDate || item.purchaseDate,
                purchasePrice: priceNum,
                openedDate: formOpenedDate.trim() || undefined,
                expiryDate: formExpiryDate.trim() || undefined,
                status: formStatus,
                usageCount: validUsage,
                estimatedCostPerUse: costPerUse,
                notes: formNotes.trim() || undefined,
                product: {
                  ...item.product,
                  name: formName.trim(),
                  brand: formBrand.trim() || "Unspecified Brand",
                  category: formCategory,
                  price: priceNum,
                },
              };
            }
            return item;
          })
        );
        setActionNotice({ message: `Updated "${formName.trim()}" in collection.` });
      } else {
        // Create new item
        const newItem: CollectionItem = {
          id: `col-${Date.now()}`,
          purchaseDate: formPurchaseDate || new Date().toISOString().split("T")[0],
          purchasePrice: priceNum,
          openedDate: formOpenedDate.trim() || undefined,
          expiryDate: formExpiryDate.trim() || undefined,
          status: formStatus,
          usageCount: validUsage,
          estimatedCostPerUse: costPerUse,
          notes: formNotes.trim() || undefined,
          product: {
            id: `prod-${Date.now()}`,
            name: formName.trim(),
            brand: formBrand.trim() || "Unspecified Brand",
            category: formCategory,
            price: priceNum,
            currency: "$",
            description: formNotes || "Owned item in inventory",
          },
        };

        setItems((prev) => [newItem, ...prev]);
        setActionNotice({ message: `Logged "${newItem.product.name}" to collection.` });
      }

      setIsSubmitting(false);
      setIsModalOpen(false);
      resetForm();
    }, 400);
  };

  // Increment usage count (+1 use)
  const handleIncrementUsage = (item: CollectionItem) => {
    const newUsage = item.usageCount + 1;
    const newCostPerUse = parseFloat((item.purchasePrice / newUsage).toFixed(2));

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              usageCount: newUsage,
              estimatedCostPerUse: newCostPerUse,
            }
          : i
      )
    );

    setActionNotice({
      message: `Logged use for "${item.product.name}". Cost per use lowered to $${newCostPerUse.toFixed(2)}.`,
    });
  };

  // Toggle or update status
  const handleStatusCycle = (item: CollectionItem) => {
    const cycleMap: Record<CollectionItem["status"], CollectionItem["status"]> = {
      active: "nearly_empty",
      nearly_empty: "archived",
      expired: "archived",
      archived: "active",
    };

    const nextStatus = cycleMap[item.status];

    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
    );

    setActionNotice({
      message: `Updated status of "${item.product.name}" to ${nextStatus.replace("_", " ")}.`,
    });
  };

  // Remove item with undo
  const handleRemove = (item: CollectionItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setActionNotice({
      message: `Removed "${item.product.name}" from inventory.`,
      undoItem: item,
    });
  };

  // Undo remove
  const handleUndo = () => {
    if (actionNotice?.undoItem) {
      setItems((prev) => [actionNotice.undoItem!, ...prev]);
      setActionNotice({ message: `Restored "${actionNotice.undoItem.product.name}".` });
    }
  };

  // Filtered & Sorted items
  const filteredAndSortedItems = React.useMemo(() => {
    let result = items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.product.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;
      const matchesSearch =
        !searchQuery.trim() ||
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesStatus && matchesSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === "expiry") {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      if (sortBy === "most-used") {
        return b.usageCount - a.usageCount;
      }
      if (sortBy === "least-used") {
        return a.usageCount - b.usageCount;
      }
      if (sortBy === "cost-desc") {
        return b.estimatedCostPerUse - a.estimatedCostPerUse;
      }
      if (sortBy === "newest") {
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      }
      return 0;
    });
  }, [items, selectedCategory, selectedStatus, searchQuery, sortBy]);

  // Aggregate metrics
  const totalValue = items.reduce((acc, i) => acc + i.purchasePrice, 0);
  const activeCount = items.filter((i) => i.status === "active").length;
  const alertCount = items.filter(
    (i) => i.status === "expired" || (i.expiryDate && i.expiryDate.includes("2026-12"))
  ).length;
  const avgCostPerUse =
    items.length > 0
      ? (
          items.reduce((acc, i) => acc + i.estimatedCostPerUse, 0) / items.length
        ).toFixed(2)
      : "0.00";

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Action Notice / Undo Banner */}
        {actionNotice && (
          <div className="flex items-center justify-between p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 animate-in fade-in">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              {actionNotice.message}
            </span>
            <div className="flex items-center gap-3">
              {actionNotice.undoItem && (
                <button
                  type="button"
                  onClick={handleUndo}
                  className="font-semibold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Undo
                </button>
              )}
              <button
                type="button"
                onClick={() => setActionNotice(null)}
                className="text-emerald-700 hover:text-emerald-900"
                aria-label="Dismiss notice"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Top Header & Metrics Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-espresso">
                My Collection
              </h2>
              <Badge variant="subtle" size="sm">
                {items.length} owned items
              </Badge>
            </div>
            <p className="text-xs text-espresso-muted mt-0.5">
              Inventory tracking for owned cosmetics and wardrobe items with PAO expiry alerts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              Log to collection
            </Button>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <span className="text-xs font-medium text-espresso-muted">
              Total Collection Value
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                ${totalValue}
              </span>
              <span className="text-xs text-espresso-muted">
                across {items.length} logged items
              </span>
            </div>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-medium text-espresso-muted">
              Active Inventory
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                {activeCount}
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                currently in rotation
              </span>
            </div>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-medium text-espresso-muted">
              Expiration Alerts (PAO)
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-800">
                {alertCount}
              </span>
              <span className="text-xs text-espresso-muted">
                require review or discard
              </span>
            </div>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-medium text-espresso-muted">
              Average Cost Per Use
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                ${avgCostPerUse}
              </span>
              <span className="text-xs text-espresso-muted">
                per logged application
              </span>
            </div>
          </Card>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-md border border-espresso/10 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-48 sm:w-56">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-espresso-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory, brand..."
                className="h-7 w-full pl-8 pr-2.5 rounded border border-espresso/15 bg-white text-xs text-espresso placeholder:text-espresso-muted/70 focus:outline-none focus:border-berry"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-7 px-2 rounded border border-espresso/15 bg-white text-espresso focus:outline-none"
            >
              <option value="all">All categories</option>
              <option value="skincare">Skincare</option>
              <option value="makeup">Makeup</option>
              <option value="clothing">Clothing</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-7 px-2 rounded border border-espresso/15 bg-white text-espresso focus:outline-none"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="nearly_empty">Nearly empty</option>
              <option value="expired">Expired</option>
              <option value="archived">Archived</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-7 px-2 rounded border border-espresso/15 bg-white text-espresso focus:outline-none"
            >
              <option value="expiry">Sort by: Expiry (Soonest)</option>
              <option value="most-used">Sort by: Most Used</option>
              <option value="least-used">Sort by: Least Used</option>
              <option value="cost-desc">Sort by: Cost / Use (High to Low)</option>
              <option value="newest">Sort by: Newest Purchase</option>
            </select>
          </div>

          <span className="text-[11px] text-espresso-muted">
            Showing {filteredAndSortedItems.length} of {items.length} items
          </span>
        </div>

        {/* Collection Cards Grid */}
        {filteredAndSortedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedItems.map((item) => {
              const isExpired = item.status === "expired";
              const isExpiringSoon = item.expiryDate && item.expiryDate.includes("2026-12");

              return (
                <Card
                  key={item.id}
                  className={`flex flex-col justify-between p-4 space-y-3 ${
                    isExpired ? "border-amber-300 bg-amber-50/20" : ""
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-semibold text-espresso">
                            {item.product.name}
                          </h3>
                        </div>
                        <p className="text-xs text-espresso-muted">
                          {item.product.brand} • ${item.purchasePrice}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={
                            item.status === "active"
                              ? "success"
                              : item.status === "expired"
                              ? "warning"
                              : item.status === "nearly_empty"
                              ? "berry"
                              : "subtle"
                          }
                          size="sm"
                        >
                          {item.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>

                    {/* Timeline & Metadata */}
                    <div className="space-y-1.5 text-xs text-espresso-light border-y border-espresso/10 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-espresso-muted">Category:</span>
                        <span className="capitalize">{item.product.category}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-espresso-muted">Purchased:</span>
                        <span>{item.purchaseDate}</span>
                      </div>

                      {item.openedDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-espresso-muted">Opened (PAO):</span>
                          <span>{item.openedDate}</span>
                        </div>
                      )}

                      {item.expiryDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-espresso-muted">Expiry / PAO:</span>
                          <span
                            className={
                              isExpired
                                ? "text-amber-800 font-bold flex items-center gap-1"
                                : isExpiringSoon
                                ? "text-berry font-semibold flex items-center gap-1"
                                : ""
                            }
                          >
                            {(isExpired || isExpiringSoon) && (
                              <AlertTriangle className="h-3 w-3 shrink-0" />
                            )}
                            {item.expiryDate}
                          </span>
                        </div>
                      )}

                      {/* Cost per use benchmark */}
                      <div className="flex items-center justify-between pt-1 border-t border-dashed border-espresso/10">
                        <span className="text-espresso-muted">Cost per use:</span>
                        <span className="font-bold text-espresso">
                          ${item.estimatedCostPerUse.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-espresso-light italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* Card Action Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-espresso/10">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleIncrementUsage(item)}
                        title="Log an additional use"
                      >
                        +1 Use ({item.usageCount})
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusCycle(item)}
                        title="Cycle status"
                      >
                        Cycle status
                      </Button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-espresso-muted hover:text-espresso rounded hover:bg-espresso/5 transition-colors"
                        aria-label="Edit item"
                        title="Edit collection item"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="p-1.5 text-espresso-muted hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                        aria-label="Remove item"
                        title="Remove from collection"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-16 space-y-3">
            <Package className="h-8 w-8 mx-auto text-espresso-muted" />
            <h3 className="text-xs font-semibold text-espresso">
              No inventory items found
            </h3>
            <p className="text-xs text-espresso-muted max-w-sm mx-auto">
              {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                ? "No items match your active search and filter criteria."
                : "Your collection inventory is currently empty."}
            </p>

            <div className="pt-2 flex justify-center gap-2">
              {searchQuery || selectedCategory !== "all" || selectedStatus !== "all" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                  }}
                >
                  Reset filters
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                  }}
                >
                  Log first product
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* ADD / EDIT COLLECTION ITEM MODAL */}
        {/* ========================================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-cream-light rounded-lg border border-espresso/15 shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                <h3 className="text-sm font-bold text-espresso">
                  {editingItemId ? "Edit Owned Product" : "Log to Collection"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-espresso-muted hover:text-espresso"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Fill Presets */}
              {!editingItemId && (
                <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-espresso/5 border border-espresso/10 text-xs">
                  <span className="text-espresso-muted font-medium">Presets:</span>
                  <button
                    type="button"
                    onClick={() => loadPreset("skincare")}
                    className="px-2 py-0.5 rounded bg-white border border-espresso/15 text-[11px] text-espresso hover:border-berry"
                  >
                    Daily Cleanser (Skincare)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("clothing")}
                    className="px-2 py-0.5 rounded bg-white border border-espresso/15 text-[11px] text-espresso hover:border-berry"
                  >
                    Linen Trousers (Clothing)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("expiring_test")}
                    className="px-2 py-0.5 rounded bg-white border border-espresso/15 text-[11px] text-espresso hover:border-berry"
                  >
                    Mascara (PAO Test)
                  </button>
                </div>
              )}

              {/* Form Error Banner */}
              {formError && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <Input
                  label="Product name *"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Gentle Daily Gel Cleanser"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Brand"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. SkinTheory"
                  />

                  <Input
                    label="Purchase price ($) *"
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-espresso mb-1">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as Category)}
                      className="w-full h-8 px-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                    >
                      <option value="skincare">Skincare</option>
                      <option value="makeup">Makeup</option>
                      <option value="clothing">Clothing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-espresso mb-1">
                      Inventory Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full h-8 px-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                    >
                      <option value="active">Active in rotation</option>
                      <option value="nearly_empty">Nearly empty / low</option>
                      <option value="expired">Expired / Past PAO</option>
                      <option value="archived">Archived / Stored</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Purchase Date"
                    type="date"
                    value={formPurchaseDate}
                    onChange={(e) => setFormPurchaseDate(e.target.value)}
                  />

                  <Input
                    label="Opened Date (PAO)"
                    type="date"
                    value={formOpenedDate}
                    onChange={(e) => setFormOpenedDate(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Estimated Expiry Date"
                    type="date"
                    value={formExpiryDate}
                    onChange={(e) => setFormExpiryDate(e.target.value)}
                  />

                  <Input
                    label="Logged Usage Count"
                    type="number"
                    min="1"
                    value={formUsageCount}
                    onChange={(e) => setFormUsageCount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-espresso mb-1">
                    Inventory Notes & Experience
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Storage location, shade match, or usage frequency notes..."
                    className="w-full p-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-espresso/10">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                  >
                    {editingItemId ? "Save Changes" : "Log Product"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
