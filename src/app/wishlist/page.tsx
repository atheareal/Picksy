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
  Bookmark,
  Plus,
  Trash2,
  PackageCheck,
  Search,
  Filter,
  ArrowUpDown,
  Check,
  X,
  AlertCircle,
  Clock,
  Sparkles,
  SearchCheck,
  Edit2,
  Layers,
  ArrowRight,
  TrendingDown,
  RotateCcw,
} from "lucide-react";
import { MOCK_WISHLIST, MOCK_PRODUCTS } from "@/lib/mock/data";
import { Category, WishlistItem } from "@/types";

export default function WishlistPage() {
  const [items, setItems] = React.useState<WishlistItem[]>(MOCK_WISHLIST);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedPriority, setSelectedPriority] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"priority" | "price-asc" | "price-desc" | "newest">("priority");

  // Add Item Modal / Drawer state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);

  // Form Inputs
  const [formName, setFormName] = React.useState("");
  const [formBrand, setFormBrand] = React.useState("");
  const [formCategory, setFormCategory] = React.useState<Category>("skincare");
  const [formPrice, setFormPrice] = React.useState("");
  const [formPriority, setFormPriority] = React.useState<"high" | "medium" | "low">("medium");
  const [formTargetPrice, setFormTargetPrice] = React.useState("");
  const [formNotes, setFormNotes] = React.useState("");
  const [formImpulseRisk, setFormImpulseRisk] = React.useState<"low" | "moderate" | "high">("low");

  // Status & Feedback
  const [actionNotice, setActionNotice] = React.useState<{ message: string; undoItem?: WishlistItem } | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Monthly budget benchmark
  const monthlyBudget = 250;

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
    setFormPriority("medium");
    setFormTargetPrice("");
    setFormNotes("");
    setFormImpulseRisk("low");
    setFormError(null);
    setEditingItemId(null);
  };

  // Open Edit Modal
  const openEditModal = (item: WishlistItem) => {
    setEditingItemId(item.id);
    setFormName(item.product.name);
    setFormBrand(item.product.brand);
    setFormCategory(item.product.category);
    setFormPrice(item.product.price.toString());
    setFormPriority(item.priority);
    setFormTargetPrice(item.targetPrice ? item.targetPrice.toString() : "");
    setFormNotes(item.notes || "");
    setFormImpulseRisk(item.estimatedImpulseRisk || "low");
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Preset quick fill
  const loadPreset = (type: "skincare" | "clothing" | "makeup") => {
    if (type === "skincare") {
      setFormName("Ceramide Barrier Restoring Gel");
      setFormBrand("SkinTheory");
      setFormCategory("skincare");
      setFormPrice("29");
      setFormPriority("high");
      setFormTargetPrice("24");
      setFormNotes("Restock required once current moisturiser empties in ~3 weeks.");
      setFormImpulseRisk("low");
    } else if (type === "clothing") {
      setFormName("100% Merino Thermal Base Layer");
      setFormBrand("Nordic Atelier");
      setFormCategory("clothing");
      setFormPrice("85");
      setFormPriority("medium");
      setFormTargetPrice("75");
      setFormNotes("Check seasonal black friday sale before purchasing.");
      setFormImpulseRisk("low");
    } else if (type === "makeup") {
      setFormName("Hydrating Botanical Lip Oil");
      setFormBrand("Maison Mute");
      setFormCategory("makeup");
      setFormPrice("26");
      setFormPriority("low");
      setFormTargetPrice("20");
      setFormNotes("Optional shade trial. Wait 48 hours to confirm desire.");
      setFormImpulseRisk("moderate");
    }
  };

  // Handle Add or Edit Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Please enter a product name.");
      return;
    }

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setFormError("Please enter a valid price.");
      return;
    }

    const targetPriceNum = formTargetPrice ? parseFloat(formTargetPrice) : undefined;
    if (targetPriceNum !== undefined && (isNaN(targetPriceNum) || targetPriceNum < 0)) {
      setFormError("Target price must be a valid positive number.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (editingItemId) {
        // Update existing item
        setItems((prev) =>
          prev.map((item) => {
            if (item.id === editingItemId) {
              return {
                ...item,
                priority: formPriority,
                targetPrice: targetPriceNum,
                notes: formNotes.trim() || undefined,
                estimatedImpulseRisk: formImpulseRisk,
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
        setActionNotice({ message: `Updated "${formName.trim()}" in wishlist.` });
      } else {
        // Create new item
        const newItem: WishlistItem = {
          id: `wish-${Date.now()}`,
          priority: formPriority,
          targetPrice: targetPriceNum,
          notes: formNotes.trim() || undefined,
          addedAt: new Date().toISOString(),
          estimatedImpulseRisk: formImpulseRisk,
          product: {
            id: `prod-${Date.now()}`,
            name: formName.trim(),
            brand: formBrand.trim() || "Unspecified Brand",
            category: formCategory,
            price: priceNum,
            currency: "$",
            description: formNotes || "Wishlist item candidate",
          },
        };

        setItems((prev) => [newItem, ...prev]);
        setActionNotice({ message: `Added "${newItem.product.name}" to wishlist queue.` });
      }

      setIsSubmitting(false);
      setIsAddModalOpen(false);
      resetForm();
    }, 400);
  };

  // Handle Remove Item
  const handleRemove = (item: WishlistItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setActionNotice({
      message: `Removed "${item.product.name}" from wishlist.`,
      undoItem: item,
    });
  };

  // Handle Undo
  const handleUndo = () => {
    if (actionNotice?.undoItem) {
      setItems((prev) => [actionNotice.undoItem!, ...prev]);
      setActionNotice({ message: `Restored "${actionNotice.undoItem.product.name}".` });
    }
  };

  // Handle Log to Collection
  const handleLogToCollection = (item: WishlistItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setActionNotice({
      message: `Logged "${item.product.name}" to My Collection inventory [Demo Mode].`,
    });
  };

  // Filtered & Sorted items
  const filteredAndSortedItems = React.useMemo(() => {
    let result = items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.product.category === selectedCategory;
      const matchesPriority =
        selectedPriority === "all" || item.priority === selectedPriority;
      const matchesSearch =
        !searchQuery.trim() ||
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesPriority && matchesSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === "price-asc") {
        return a.product.price - b.product.price;
      }
      if (sortBy === "price-desc") {
        return b.product.price - a.product.price;
      }
      if (sortBy === "newest") {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
      return 0;
    });
  }, [items, selectedCategory, selectedPriority, searchQuery, sortBy]);

  // Aggregate metrics
  const totalValue = items.reduce((acc, i) => acc + i.product.price, 0);
  const highPriorityValue = items
    .filter((i) => i.priority === "high")
    .reduce((acc, i) => acc + i.product.price, 0);
  const lowPriorityValue = items
    .filter((i) => i.priority === "low")
    .reduce((acc, i) => acc + i.product.price, 0);

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
                Wishlist
              </h2>
              <Badge variant="subtle" size="sm">
                {items.length} items
              </Badge>
            </div>
            <p className="text-xs text-espresso-muted mt-0.5">
              Prioritized purchase queue tracked against deliberate budget limits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
            >
              Add to wishlist
            </Button>
          </div>
        </div>

        {/* Budget Impact Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <span className="text-xs font-medium text-espresso-muted">
              Total Wishlist Cost
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                ${totalValue}
              </span>
              <span className="text-xs text-espresso-muted">
                across {items.length} items
              </span>
            </div>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-medium text-espresso-muted">
              High Priority (Essential)
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                ${highPriorityValue}
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                {((highPriorityValue / (totalValue || 1)) * 100).toFixed(0)}% of queue
              </span>
            </div>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-medium text-espresso-muted">
              Monthly Budget Benchmark
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                ${monthlyBudget}
              </span>
              <span className="text-xs text-espresso-muted">
                cap / month
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-espresso/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-berry rounded-full"
                style={{
                  width: `${Math.min(100, (totalValue / monthlyBudget) * 100)}%`,
                }}
              />
            </div>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-medium text-espresso-muted">
              Deferral Savings
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-800">
                +${lowPriorityValue}
              </span>
              <span className="text-xs text-espresso-muted">
                if low priority paused
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
                placeholder="Search name, brand, notes..."
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

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="h-7 px-2 rounded border border-espresso/15 bg-white text-espresso focus:outline-none"
            >
              <option value="all">All priorities</option>
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-7 px-2 rounded border border-espresso/15 bg-white text-espresso focus:outline-none"
            >
              <option value="priority">Sort by: Priority</option>
              <option value="price-asc">Sort by: Price (Low to High)</option>
              <option value="price-desc">Sort by: Price (High to Low)</option>
              <option value="newest">Sort by: Date Added</option>
            </select>
          </div>

          <span className="text-[11px] text-espresso-muted">
            Showing {filteredAndSortedItems.length} of {items.length} items
          </span>
        </div>

        {/* Wishlist Items List */}
        {filteredAndSortedItems.length > 0 ? (
          <div className="space-y-3">
            {filteredAndSortedItems.map((item) => {
              const hasTargetAlert =
                item.targetPrice && item.product.price <= item.targetPrice;

              return (
                <Card key={item.id} className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Item Details */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-espresso">
                          {item.product.name}
                        </span>

                        <Badge
                          variant={
                            item.priority === "high"
                              ? "berry"
                              : item.priority === "medium"
                              ? "rose"
                              : "subtle"
                          }
                          size="sm"
                        >
                          {item.priority} priority
                        </Badge>

                        <Badge variant="subtle" size="sm">
                          {item.product.category}
                        </Badge>

                        {item.estimatedImpulseRisk === "high" && (
                          <Badge variant="warning" size="sm">
                            Impulse Risk
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-espresso-muted">
                        <span>Brand: <strong className="text-espresso font-medium">{item.product.brand}</strong></span>
                        <span>•</span>
                        <span>Retail: <strong className="text-espresso font-medium">${item.product.price}</strong></span>
                        {item.targetPrice && (
                          <>
                            <span>•</span>
                            <span className={hasTargetAlert ? "text-emerald-700 font-semibold" : ""}>
                              Target trigger: ${item.targetPrice}
                            </span>
                          </>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-xs text-espresso-light pt-1 italic">
                          "{item.notes}"
                        </p>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Link href="/evaluator">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<SearchCheck className="h-3 w-3" />}
                        >
                          Evaluate
                        </Button>
                      </Link>

                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<PackageCheck className="h-3.5 w-3.5" />}
                        onClick={() => handleLogToCollection(item)}
                      >
                        Log to collection
                      </Button>

                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-espresso-muted hover:text-espresso rounded hover:bg-espresso/5 transition-colors"
                        aria-label="Edit item"
                        title="Edit wishlist item"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="p-1.5 text-espresso-muted hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                        aria-label="Remove item"
                        title="Remove from wishlist"
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
            <Bookmark className="h-8 w-8 mx-auto text-espresso-muted" />
            <h3 className="text-xs font-semibold text-espresso">
              No wishlist items found
            </h3>
            <p className="text-xs text-espresso-muted max-w-sm mx-auto">
              {searchQuery || selectedCategory !== "all" || selectedPriority !== "all"
                ? "No items match your active search and filter criteria."
                : "Your prioritized wishlist queue is currently empty."}
            </p>

            <div className="pt-2 flex justify-center gap-2">
              {searchQuery || selectedCategory !== "all" || selectedPriority !== "all" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedPriority("all");
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
                    setIsAddModalOpen(true);
                  }}
                >
                  Add first wishlist item
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* ADD / EDIT WISHLIST ITEM MODAL */}
        {/* ========================================================================= */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-cream-light rounded-lg border border-espresso/15 shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                <h3 className="text-sm font-bold text-espresso">
                  {editingItemId ? "Edit Wishlist Item" : "Add to Wishlist"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
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
                    Skincare Restock
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("clothing")}
                    className="px-2 py-0.5 rounded bg-white border border-espresso/15 text-[11px] text-espresso hover:border-berry"
                  >
                    Merino Layer
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("makeup")}
                    className="px-2 py-0.5 rounded bg-white border border-espresso/15 text-[11px] text-espresso hover:border-berry"
                  >
                    Lip Oil Trial
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
                  placeholder="e.g. 100% Merino Thermal Base Layer"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Brand"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. Nordic Atelier"
                  />

                  <Input
                    label="Retail price ($) *"
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 85"
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
                      Priority Rank
                    </label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as any)}
                      className="w-full h-8 px-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                    >
                      <option value="high">High (Core need / Restock)</option>
                      <option value="medium">Medium (Deliberated want)</option>
                      <option value="low">Low (Discretionary trial)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Target Trigger Price ($)"
                    type="number"
                    step="0.01"
                    value={formTargetPrice}
                    onChange={(e) => setFormTargetPrice(e.target.value)}
                    placeholder="e.g. 75 (Wait for discount)"
                  />

                  <div>
                    <label className="block text-xs font-medium text-espresso mb-1">
                      Impulse Risk Level
                    </label>
                    <select
                      value={formImpulseRisk}
                      onChange={(e) => setFormImpulseRisk(e.target.value as any)}
                      className="w-full h-8 px-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                    >
                      <option value="low">Low Risk (Considered)</option>
                      <option value="moderate">Moderate Risk</option>
                      <option value="high">High Impulse Risk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-espresso mb-1">
                    Deliberation Notes & Buying Criteria
                  </label>
                  <textarea
                    rows={3}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="State reason for purchase, collection overlap check, or seasonal timing..."
                    className="w-full p-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-espresso/10">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddModalOpen(false);
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
                    {editingItemId ? "Save Changes" : "Add to Wishlist"}
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
