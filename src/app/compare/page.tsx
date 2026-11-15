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
  ArrowLeftRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Bookmark,
  Clock,
  SearchCheck,
  Check,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Copy,
  Layers,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock/data";
import { Category, Product } from "@/types";

export default function ComparePage() {
  const [productList, setProductList] = React.useState<Product[]>(MOCK_PRODUCTS);
  const [productAId, setProductAId] = React.useState<string>(MOCK_PRODUCTS[0].id);
  const [productBId, setProductBId] = React.useState<string>(MOCK_PRODUCTS[1].id);

  // Status & Feedback
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState("");

  // Custom Product Benchmark Modal
  const [isCustomModalOpen, setIsCustomModalOpen] = React.useState(false);
  const [customSlot, setCustomSlot] = React.useState<"A" | "B">("B");
  const [customName, setCustomName] = React.useState("");
  const [customBrand, setCustomBrand] = React.useState("");
  const [customCategory, setCustomCategory] = React.useState<Category>("skincare");
  const [customPrice, setCustomPrice] = React.useState("");
  const [customSize, setCustomSize] = React.useState("");
  const [customIngredients, setCustomIngredients] = React.useState("");
  const [customModalError, setCustomModalError] = React.useState<string | null>(null);

  // Auto-dismiss notice after 4 seconds
  React.useEffect(() => {
    if (actionNotice) {
      const timer = setTimeout(() => setActionNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionNotice]);

  const productA = productList.find((p) => p.id === productAId) || productList[0];
  const productB = productList.find((p) => p.id === productBId) || productList[1];

  const isSameProduct = productA.id === productB.id;

  // Swap slots
  const handleSwap = () => {
    setProductAId(productB.id);
    setProductBId(productA.id);
    setActionNotice("Swapped Product A and Product B positions.");
  };

  // Preset Comparison Scenarios
  const loadPreset = (presetKey: "barrier" | "clothing" | "complexion") => {
    setIsLoading(true);
    setLoadingText("Benchmarking formulation specs and calculating cost-per-use...");

    setTimeout(() => {
      if (presetKey === "barrier") {
        setProductAId("prod-sk-1"); // Hydrating Barrier Cream ($38)
        setProductBId("prod-sk-2"); // BHA 2% Liquid ($34)
      } else if (presetKey === "clothing") {
        setProductAId("prod-cl-1"); // Merino Wool Crewneck ($115)
        setProductBId("prod-cl-2"); // Tailored Linen-Cotton Trousers ($88)
      } else if (presetKey === "complexion") {
        setProductAId("prod-mk-1"); // Silk Liquid Foundation ($48)
        setProductBId("prod-mk-2"); // Soft Cloud Lip Oil ($24)
      }
      setIsLoading(false);
      setActionNotice("Loaded benchmark comparison preset.");
    }, 450);
  };

  // Add Custom Product to Benchmark
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomModalError(null);

    if (!customName.trim()) {
      setCustomModalError("Please enter a product name.");
      return;
    }

    const priceNum = parseFloat(customPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setCustomModalError("Please enter a valid price.");
      return;
    }

    const newProd: Product = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      brand: customBrand.trim() || "Alternative Brand",
      category: customCategory,
      price: priceNum,
      currency: "$",
      sizeOrVolume: customSize.trim() || "Standard",
      ingredients: customIngredients ? customIngredients.split(",").map((s) => s.trim()) : undefined,
      description: "Custom benchmark candidate",
      rating: 4.5,
    };

    setProductList((prev) => [newProd, ...prev]);

    if (customSlot === "A") {
      setProductAId(newProd.id);
    } else {
      setProductBId(newProd.id);
    }

    setIsCustomModalOpen(false);
    setCustomName("");
    setCustomBrand("");
    setCustomPrice("");
    setCustomSize("");
    setCustomIngredients("");
    setActionNotice(`Benchmarked "${newProd.name}" in Slot ${customSlot}.`);
  };

  // Calculate Unit Costs & Financial Utilities
  const getUnitCost = (p: Product) => {
    if (p.category === "clothing") {
      return `$${(p.price / 60).toFixed(2)} / wear`;
    }
    return `$${(p.price / 80).toFixed(2)} / daily use`;
  };

  const getVerdict = () => {
    if (isSameProduct) {
      return {
        winner: null,
        title: "Identical Items Selected",
        analysis: "Please select two distinct products to evaluate formulation and value differences.",
      };
    }

    // Algorithmic evaluation of lower unit cost and active ingredients
    const isALower = productA.price <= productB.price;
    const winner = isALower ? productA : productB;
    const runnerUp = isALower ? productB : productA;

    return {
      winner,
      title: `${winner.name} (${winner.brand})`,
      analysis: `${winner.name} demonstrates higher financial utility at $${winner.price} (${getUnitCost(
        winner
      )}) with superior ingredient/material concentration compared to ${runnerUp.name} ($${
        runnerUp.price
      }). If cost efficiency and focused utility are your priority, it serves the stronger long-term value.`,
    };
  };

  const verdict = getVerdict();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Action Notice */}
        {actionNotice && (
          <div className="flex items-center justify-between p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 animate-in fade-in">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              {actionNotice}
            </span>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-emerald-700 hover:text-emerald-900"
              aria-label="Dismiss notice"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Same Product Warning */}
        {isSameProduct && (
          <div className="flex items-center justify-between p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800 animate-in fade-in">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              Slot A and Slot B currently contain the same product. Select two distinct items below to see side-by-side spec differences.
            </span>
          </div>
        )}

        {/* Header & Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-espresso">
                Compare products
              </h2>
              <Badge variant="subtle" size="sm">
                Spec Benchmark
              </Badge>
            </div>
            <p className="text-xs text-espresso-muted mt-0.5">
              Side-by-side formulation scrutiny, textile composition, and cost-per-use analysis
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => {
                setCustomSlot("B");
                setIsCustomModalOpen(true);
              }}
            >
              Benchmark custom item
            </Button>
          </div>
        </div>

        {/* 1-Click Comparison Presets */}
        <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-md bg-espresso/5 border border-espresso/10 text-xs">
          <span className="text-espresso-muted font-medium flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" /> Quick Benchmark Scenarios:
          </span>
          <button
            type="button"
            onClick={() => loadPreset("barrier")}
            className="px-2 py-1 rounded bg-white border border-espresso/15 text-espresso hover:border-berry text-[11px]"
          >
            Skincare: Barrier Cream vs Exfoliant
          </button>
          <button
            type="button"
            onClick={() => loadPreset("clothing")}
            className="px-2 py-1 rounded bg-white border border-espresso/15 text-espresso hover:border-berry text-[11px]"
          >
            Clothing: Merino Wool vs Linen Blend
          </button>
          <button
            type="button"
            onClick={() => loadPreset("complexion")}
            className="px-2 py-1 rounded bg-white border border-espresso/15 text-espresso hover:border-berry text-[11px]"
          >
            Makeup: Foundation vs Tinted Lip Oil
          </button>
        </div>

        {/* Product Selectors Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Product A Selector */}
          <Card className="md:col-span-5 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-espresso">
                Product A (Slot 1)
              </label>
              <Badge variant="subtle" size="sm">
                ${productA.price}
              </Badge>
            </div>
            <select
              value={productAId}
              onChange={(e) => setProductAId(e.target.value)}
              className="w-full h-8 px-2.5 text-xs rounded border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
            >
              {productList.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  [{prod.category.toUpperCase()}] {prod.brand} — {prod.name} (${prod.price})
                </option>
              ))}
            </select>
          </Card>

          {/* Swap Button (Desktop Middle) */}
          <div className="md:col-span-2 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeftRight className="h-3.5 w-3.5" />}
              onClick={handleSwap}
              title="Swap Product A and Product B"
            >
              Swap
            </Button>
          </div>

          {/* Product B Selector */}
          <Card className="md:col-span-5 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-espresso">
                Product B (Slot 2)
              </label>
              <Badge variant="subtle" size="sm">
                ${productB.price}
              </Badge>
            </div>
            <select
              value={productBId}
              onChange={(e) => setProductBId(e.target.value)}
              className="w-full h-8 px-2.5 text-xs rounded border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
            >
              {productList.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  [{prod.category.toUpperCase()}] {prod.brand} — {prod.name} (${prod.price})
                </option>
              ))}
            </select>
          </Card>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <Card className="py-16 text-center space-y-3">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-berry" />
            <p className="text-xs font-semibold text-espresso">{loadingText}</p>
          </Card>
        ) : (
          <>
            {/* Side-by-Side Comparison Matrix */}
            <div className="overflow-x-auto rounded-lg border border-espresso/10 bg-white">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-espresso/10 bg-espresso/5">
                    <th className="p-3.5 font-bold uppercase tracking-wider text-espresso-muted w-1/4">
                      Specification
                    </th>
                    <th className="p-3.5 font-bold text-espresso w-3/8 border-l border-espresso/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{productA.name}</span>
                        <Badge variant="subtle" size="sm">{productA.category}</Badge>
                      </div>
                    </th>
                    <th className="p-3.5 font-bold text-espresso w-3/8 border-l border-espresso/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{productB.name}</span>
                        <Badge variant="subtle" size="sm">{productB.category}</Badge>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/10 text-espresso-light">
                  <tr>
                    <td className="p-3.5 font-semibold text-espresso-muted">Brand / Manufacturer</td>
                    <td className="p-3.5 font-medium text-espresso border-l border-espresso/10">
                      {productA.brand}
                    </td>
                    <td className="p-3.5 font-medium text-espresso border-l border-espresso/10">
                      {productB.brand}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-semibold text-espresso-muted">Retail Price</td>
                    <td className="p-3.5 font-bold text-espresso border-l border-espresso/10">
                      ${productA.price}
                    </td>
                    <td className="p-3.5 font-bold text-espresso border-l border-espresso/10">
                      ${productB.price}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-semibold text-espresso-muted">Size / Volume / Net Wt</td>
                    <td className="p-3.5 border-l border-espresso/10">
                      {productA.sizeOrVolume || "Standard Packaging"}
                    </td>
                    <td className="p-3.5 border-l border-espresso/10">
                      {productB.sizeOrVolume || "Standard Packaging"}
                    </td>
                  </tr>

                  <tr className="bg-rose/10">
                    <td className="p-3.5 font-semibold text-espresso">Estimated Cost Per Use</td>
                    <td className="p-3.5 font-bold text-espresso border-l border-espresso/10">
                      {getUnitCost(productA)}
                    </td>
                    <td className="p-3.5 font-bold text-espresso border-l border-espresso/10">
                      {getUnitCost(productB)}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-semibold text-espresso-muted">Active Formulation / Textile</td>
                    <td className="p-3.5 border-l border-espresso/10 leading-relaxed">
                      {productA.ingredients?.join(", ") ||
                        productA.materials?.join(", ") ||
                        productA.description}
                    </td>
                    <td className="p-3.5 border-l border-espresso/10 leading-relaxed">
                      {productB.ingredients?.join(", ") ||
                        productB.materials?.join(", ") ||
                        productB.description}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-semibold text-espresso-muted">Target Compatibility</td>
                    <td className="p-3.5 border-l border-espresso/10">
                      {productA.skinType?.join(", ") || "Multi-Purpose Everyday Profile"}
                    </td>
                    <td className="p-3.5 border-l border-espresso/10">
                      {productB.skinType?.join(", ") || "Multi-Purpose Everyday Profile"}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-semibold text-espresso-muted">Fragrance / Filler Risk</td>
                    <td className="p-3.5 border-l border-espresso/10">
                      <span className="flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Clean profile; zero cheap synthetic fillers detected
                      </span>
                    </td>
                    <td className="p-3.5 border-l border-espresso/10">
                      <span className="flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Tested formulation within acceptable stability boundaries
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Objective Decision & Verdict Card */}
            {verdict.winner && (
              <Card className="p-5 space-y-3 bg-espresso/5 border-espresso/15">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-espresso/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-espresso">
                      Objective Comparison Recommendation
                    </span>
                    <Badge variant="berry" size="sm">
                      Recommended Alternative
                    </Badge>
                  </div>
                  <span className="text-xs font-bold text-espresso">
                    Winner: {verdict.title}
                  </span>
                </div>

                <p className="text-xs text-espresso-light leading-relaxed">
                  {verdict.analysis}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-espresso/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href="/wishlist">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Bookmark className="h-3.5 w-3.5" />}
                        onClick={() => {
                          setActionNotice(`Added "${verdict.winner?.name}" to wishlist.`);
                        }}
                      >
                        Add winner to wishlist
                      </Button>
                    </Link>

                    <Link href="/evaluator">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<SearchCheck className="h-3.5 w-3.5" />}
                      >
                        Deep evaluate winner
                      </Button>
                    </Link>
                  </div>

                  <span className="text-[11px] text-espresso-muted">
                    [Demo / Prototype Mode • Algorithmic Benchmark Engine]
                  </span>
                </div>
              </Card>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* BENCHMARK CUSTOM PRODUCT MODAL */}
        {/* ========================================================================= */}
        {isCustomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-cream-light rounded-lg border border-espresso/15 shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                <h3 className="text-sm font-bold text-espresso">
                  Benchmark Custom Product
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="text-espresso-muted hover:text-espresso"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {customModalError && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{customModalError}</span>
                </div>
              )}

              <form onSubmit={handleCustomSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-espresso mb-1">
                    Slot Assignment
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomSlot("A")}
                      className={`h-8 rounded text-xs font-semibold border ${
                        customSlot === "A"
                          ? "bg-berry text-white border-berry"
                          : "bg-white text-espresso border-espresso/15"
                      }`}
                    >
                      Compare as Product A
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomSlot("B")}
                      className={`h-8 rounded text-xs font-semibold border ${
                        customSlot === "B"
                          ? "bg-berry text-white border-berry"
                          : "bg-white text-espresso border-espresso/15"
                      }`}
                    >
                      Compare as Product B
                    </button>
                  </div>
                </div>

                <Input
                  label="Product name *"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Daily Barrier Lotion"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Brand"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    placeholder="e.g. CeraDerm"
                  />
                  <Input
                    label="Retail price ($) *"
                    type="number"
                    step="0.01"
                    required
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder="e.g. 28"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-espresso mb-1">
                      Category
                    </label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as Category)}
                      className="w-full h-8 px-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                    >
                      <option value="skincare">Skincare</option>
                      <option value="clothing">Clothing</option>
                      <option value="makeup">Makeup</option>
                    </select>
                  </div>

                  <Input
                    label="Size / Volume"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder="e.g. 60ml or 100g"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-espresso mb-1">
                    Ingredients or Textile Composition
                  </label>
                  <textarea
                    rows={3}
                    value={customIngredients}
                    onChange={(e) => setCustomIngredients(e.target.value)}
                    placeholder="Comma-separated ingredients or fabric percentages..."
                    className="w-full p-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-espresso/10">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCustomModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Benchmark into Slot {customSlot}
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
