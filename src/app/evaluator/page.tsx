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
  CardFooter,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  SearchCheck,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Bookmark,
  RotateCcw,
  SlidersHorizontal,
  Package,
  Check,
  X,
  TrendingDown,
  Info,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  MOCK_EVALUATIONS,
  MOCK_IMPULSE_CHECKS,
  MOCK_PRODUCTS,
  MOCK_COLLECTION,
} from "@/lib/mock/data";
import {
  Category,
  EvaluationResult,
  ImpulseCheckResult,
  IngredientOrMaterialAnalysis,
} from "@/types";

export default function EvaluatorPage() {
  const [activeTab, setActiveTab] = React.useState<"evaluate" | "impulse" | "history">("evaluate");

  // Form inputs for Product Evaluation
  const [productName, setProductName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [category, setCategory] = React.useState<Category>("skincare");
  const [price, setPrice] = React.useState("");
  const [sizeOrVolume, setSizeOrVolume] = React.useState("");
  const [productUrl, setProductUrl] = React.useState("");
  const [ingredientsText, setIngredientsText] = React.useState("");
  const [skinOrStyleTarget, setSkinOrStyleTarget] = React.useState("Sensitive");

  // Form inputs for Impulse Check
  const [impulseProduct, setImpulseProduct] = React.useState("");
  const [impulseBrand, setImpulseBrand] = React.useState("");
  const [impulsePrice, setImpulsePrice] = React.useState("");
  const [impulseCategory, setImpulseCategory] = React.useState<Category>("makeup");
  const [urgencyReason, setUrgencyReason] = React.useState("Spotted on promotion");
  const [expectedFrequency, setExpectedFrequency] = React.useState("Weekly rotation");
  const [hasSimilarItem, setHasSimilarItem] = React.useState(false);
  const [canWait48Hours, setCanWait48Hours] = React.useState(false);

  // Status & Feedback States
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingStep, setLoadingStep] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);

  // Active Results
  const [evaluationResult, setEvaluationResult] = React.useState<EvaluationResult | null>(
    MOCK_EVALUATIONS[0]
  );
  const [impulseResult, setImpulseResult] = React.useState<ImpulseCheckResult | null>(null);

  // History list
  const [evalHistory, setEvalHistory] = React.useState<EvaluationResult[]>(MOCK_EVALUATIONS);

  // Ingredient filter
  const [ingredientFilter, setIngredientFilter] = React.useState<string>("all");
  const [ingredientSearch, setIngredientSearch] = React.useState("");

  // Dismiss action notification after 4 seconds
  React.useEffect(() => {
    if (actionNotice) {
      const timer = setTimeout(() => setActionNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionNotice]);

  // Quick preset loader to test different product types with 1 click
  const loadPreset = (presetType: "skincare" | "clothing" | "makeup" | "impulse_risk") => {
    setErrorMessage(null);
    if (presetType === "skincare") {
      setProductName("Hydrating Barrier Repair Cream");
      setBrand("SkinTheory");
      setCategory("skincare");
      setPrice("38");
      setSizeOrVolume("50ml");
      setIngredientsText(
        "Ceramide NP, Hyaluronic Acid, Centella Asiatica Extract, Niacinamide (2%), Glycerin, Water, Squalane"
      );
      setSkinOrStyleTarget("Dry / Sensitive");
    } else if (presetType === "clothing") {
      setProductName("Merino Wool Relaxed Crewneck");
      setBrand("Nordic Atelier");
      setCategory("clothing");
      setPrice("115");
      setSizeOrVolume("Medium");
      setIngredientsText("100% Extra-Fine Merino Wool (19.5 micron), Zero Synthetic Fillers");
      setSkinOrStyleTarget("Casual & Workwear");
    } else if (presetType === "makeup") {
      setProductName("Weightless Silk Liquid Foundation");
      setBrand("Atelier Veil");
      setCategory("makeup");
      setPrice("48");
      setSizeOrVolume("30ml");
      setIngredientsText("Water, Dimethicone, Titanium Dioxide, Glycerin, Niacinamide, Silica");
      setSkinOrStyleTarget("Natural Satin Finish");
    } else if (presetType === "impulse_risk") {
      setProductName("Limited Edition Multi-Chrome Palette");
      setBrand("Glitz Cosmetics");
      setCategory("makeup");
      setPrice("74");
      setSizeOrVolume("12 shades");
      setIngredientsText("Mica, Talc, Synthetic Fluorphlogopite, Dimethicone, Fragrance / Parfum");
      setSkinOrStyleTarget("Trend Glam");
    }
  };

  // Evaluate Handler
  const handleEvaluateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!productName.trim()) {
      setErrorMessage("Please enter a product name.");
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setErrorMessage("Please enter a valid non-negative price.");
      return;
    }

    setIsLoading(true);
    setLoadingStep("Extracting active ingredients and composition...");

    setTimeout(() => {
      setLoadingStep("Benchmarking formulation utility and price-per-use...");
    }, 600);

    setTimeout(() => {
      // Parse ingredients into analysis list
      const rawIngredients = ingredientsText
        ? ingredientsText.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Core formula compound"];

      const analyzedIngredients: IngredientOrMaterialAnalysis[] = rawIngredients.map((item, idx) => {
        const lower = item.toLowerCase();
        const isFragrance = lower.includes("fragrance") || lower.includes("parfum") || lower.includes("essential");
        const isCeramide = lower.includes("ceramide") || lower.includes("niacinamide") || lower.includes("hyaluronic") || lower.includes("salicylic");
        const isNaturalWool = lower.includes("wool") || lower.includes("linen") || lower.includes("cotton");
        const isSynthetic = lower.includes("polyester") || lower.includes("acrylic");

        if (isFragrance) {
          return {
            name: item,
            category: "fragrance",
            assessment: "caution",
            purpose: "Fragrance / Scent",
            details: "Potential contact allergen for sensitive skin barriers.",
          };
        } else if (isCeramide) {
          return {
            name: item,
            category: "active",
            assessment: "positive",
            purpose: "Active Function",
            details: "High efficacy ingredient with validated clinical research.",
          };
        } else if (isNaturalWool) {
          return {
            name: item,
            category: "fabric",
            assessment: "positive",
            purpose: "Primary Textile",
            details: "Durable, temperature-regulating natural fiber with excellent longevity.",
          };
        } else if (isSynthetic) {
          return {
            name: item,
            category: "fabric",
            assessment: "caution",
            purpose: "Synthetic Blend",
            details: "Synthetic blend prone to premature pilling and microfiber shedding.",
          };
        }

        return {
          name: item,
          category: category === "clothing" ? "fabric" : "other",
          assessment: "neutral",
          purpose: "Base component",
          details: "Standard formulation base with acceptable stability profile.",
        };
      });

      // Calculate score based on cautions
      const cautionCount = analyzedIngredients.filter((i) => i.assessment === "caution").length;
      const baseScore = 90 - cautionCount * 12;
      const finalScore = Math.max(50, Math.min(95, baseScore));

      const verdict =
        finalScore >= 85
          ? "Highly Recommended"
          : finalScore >= 75
          ? "Recommended with Reservations"
          : "Consider Alternatives";

      const costPerUseEstimate =
        category === "clothing"
          ? `$${(numericPrice / 50).toFixed(2)} / estimated wear`
          : `$${(numericPrice / 75).toFixed(2)} / daily application`;

      const result: EvaluationResult = {
        id: `eval-${Date.now()}`,
        productName: productName.trim(),
        brand: brand.trim() || "Independent Brand",
        category,
        price: numericPrice,
        overallScore: finalScore,
        verdict,
        summary: `Objective evaluation for ${productName}. The product exhibits ${
          cautionCount > 0 ? "some trade-offs" : "a well-balanced composition"
        } relative to its price point of $${numericPrice}.`,
        pros: [
          `Targeted formulation suitable for ${skinOrStyleTarget || "everyday use"}`,
          cautionCount === 0 ? "Free of irritating fragrances and cheap synthetic fillers" : "Functional primary formulation",
          `Projected cost utility at ${costPerUseEstimate}`,
        ],
        cons:
          cautionCount > 0
            ? [`Contains ${cautionCount} ingredient(s) requiring caution for sensitive profiles`, "Premium price point requires deliberate budgeting"]
            : ["Requires proper storage to maintain shelf stability"],
        ingredientsOrMaterials: analyzedIngredients,
        valueAssessment: {
          score: parseFloat((finalScore / 10).toFixed(1)),
          costPerUse: costPerUseEstimate,
          verdict: finalScore >= 80 ? "High utility relative to cost." : "Moderate value; consider waiting for discount.",
        },
        createdAt: new Date().toISOString(),
      };

      setEvaluationResult(result);
      setEvalHistory((prev) => [result, ...prev]);
      setIsLoading(false);
      setActionNotice(`Evaluation generated for "${result.productName}".`);
    }, 1100);
  };

  // Handle Impulse Check Submit
  const handleImpulseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const targetName = impulseProduct || productName;
    if (!targetName.trim()) {
      setErrorMessage("Please specify the item under consideration.");
      return;
    }

    const priceNum = parseFloat(impulsePrice || price) || 45;

    setIsLoading(true);
    setLoadingStep("Checking collection for redundant inventory and impulse signals...");

    setTimeout(() => {
      // Risk scoring algorithm
      let riskScore = 15;
      if (hasSimilarItem) riskScore += 35;
      if (!canWait48Hours) riskScore += 30;
      if (urgencyReason.includes("Spotted on promotion") || urgencyReason.includes("Influencer")) {
        riskScore += 20;
      }
      if (expectedFrequency.includes("Rare") || expectedFrequency.includes("Not sure")) {
        riskScore += 25;
      }

      riskScore = Math.min(95, riskScore);

      const recommendation =
        riskScore >= 70 ? "Skip Purchase" : riskScore >= 40 ? "Wait 48 Hours" : "Proceed";

      const potentialSavings = recommendation !== "Proceed" ? priceNum : 0;

      const similarOwned = MOCK_COLLECTION.filter((c) => c.product.category === impulseCategory);

      const result: ImpulseCheckResult = {
        id: `impulse-${Date.now()}`,
        productName: targetName,
        category: impulseCategory,
        price: priceNum,
        impulseRiskScore: riskScore,
        recommendation,
        keyReasons: [
          hasSimilarItem
            ? `You already own ${similarOwned.length} items in the "${impulseCategory}" category.`
            : "No identical duplicate detected in your current collection.",
          canWait48Hours
            ? "Cooling-off commitment met (48h friction buffer active)."
            : "Immediate purchase urge detected without deliberate reflection.",
          `Identified trigger reason: "${urgencyReason}".`,
        ],
        coolingOffUntil:
          recommendation === "Wait 48 Hours"
            ? new Date(Date.now() + 48 * 3600 * 1000).toISOString()
            : undefined,
        similarOwnedCount: similarOwned.length,
        alternativeSuggestion:
          similarOwned.length > 0
            ? `Utilize owned item "${similarOwned[0].product.name}" (${similarOwned[0].usageCount} uses so far) before committing new funds.`
            : undefined,
        potentialSavings,
        createdAt: new Date().toISOString(),
      };

      setImpulseResult(result);
      setIsLoading(false);
      setActionNotice(
        recommendation === "Proceed"
          ? "Impulse check passed. Purchase appears deliberate."
          : `Impulse check complete: Recommended action is ${recommendation}.`
      );
    }, 900);
  };

  // Transfer product to Impulse Check tab
  const transferToImpulse = () => {
    if (evaluationResult) {
      setImpulseProduct(evaluationResult.productName);
      setImpulseBrand(evaluationResult.brand);
      setImpulsePrice(evaluationResult.price.toString());
      setImpulseCategory(evaluationResult.category);
      setActiveTab("impulse");
      setActionNotice(`Transferred "${evaluationResult.productName}" to Impulse Check.`);
    }
  };

  // Filtered ingredients
  const filteredIngredients = React.useMemo(() => {
    if (!evaluationResult) return [];
    return evaluationResult.ingredientsOrMaterials.filter((item) => {
      const matchesCategory =
        ingredientFilter === "all" ||
        (ingredientFilter === "actives" && item.category === "active") ||
        (ingredientFilter === "cautions" && item.assessment === "caution") ||
        (ingredientFilter === "fabrics" && item.category === "fabric");

      const matchesSearch =
        !ingredientSearch.trim() ||
        item.name.toLowerCase().includes(ingredientSearch.toLowerCase()) ||
        item.details.toLowerCase().includes(ingredientSearch.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [evaluationResult, ingredientFilter, ingredientSearch]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Action Notification Banner */}
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

        {/* Error Banner */}
        {errorMessage && (
          <div className="flex items-center justify-between p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 animate-in fade-in">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              {errorMessage}
            </span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-700 hover:text-red-900"
              aria-label="Dismiss error"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Section Navigation Tabs & Mode Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-espresso/10">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("evaluate")}
              className={`pb-3 px-3 text-xs font-semibold transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
                activeTab === "evaluate"
                  ? "border-berry text-espresso"
                  : "border-transparent text-espresso-muted hover:text-espresso"
              }`}
            >
              <SearchCheck className="h-3.5 w-3.5" />
              Product Evaluation
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("impulse")}
              className={`pb-3 px-3 text-xs font-semibold transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
                activeTab === "impulse"
                  ? "border-berry text-espresso"
                  : "border-transparent text-espresso-muted hover:text-espresso"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Impulse Check
              {impulseResult && impulseResult.recommendation !== "Proceed" && (
                <span className="h-1.5 w-1.5 rounded-full bg-berry" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`pb-3 px-3 text-xs font-semibold transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "border-berry text-espresso"
                  : "border-transparent text-espresso-muted hover:text-espresso"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Evaluation History ({evalHistory.length})
            </button>
          </div>

          <div className="pb-2 sm:pb-0">
            <span className="text-[11px] text-espresso-muted">
              [Demo / Prototype Mode • Structured Mock Pipeline]
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PRODUCT EVALUATION */}
        {/* ========================================================================= */}
        {activeTab === "evaluate" && (
          <div className="space-y-6">
            {/* Quick Presets Bar */}
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-md bg-espresso/5 border border-espresso/10 text-xs">
              <span className="text-espresso-muted font-medium flex items-center gap-1">
                <SlidersHorizontal className="h-3 w-3" /> Quick Test Presets:
              </span>
              <button
                type="button"
                onClick={() => loadPreset("skincare")}
                className="px-2 py-1 rounded bg-white border border-espresso/15 text-espresso hover:border-berry text-[11px]"
              >
                Ceramide Cream (Skincare)
              </button>
              <button
                type="button"
                onClick={() => loadPreset("clothing")}
                className="px-2 py-1 rounded bg-white border border-espresso/15 text-espresso hover:border-berry text-[11px]"
              >
                Merino Knit (Clothing)
              </button>
              <button
                type="button"
                onClick={() => loadPreset("makeup")}
                className="px-2 py-1 rounded bg-white border border-espresso/15 text-espresso hover:border-berry text-[11px]"
              >
                Silk Foundation (Makeup)
              </button>
              <button
                type="button"
                onClick={() => loadPreset("impulse_risk")}
                className="px-2 py-1 rounded bg-white border border-espresso/15 text-espresso hover:border-berry text-[11px]"
              >
                Glam Palette (Allergen Check)
              </button>
            </div>

            {/* Split Grid: Form (Left) & Results (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Form Column */}
              <div className="lg:col-span-5 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluate product</CardTitle>
                    <CardDescription>
                      Input product specifications, ingredients, or fabric composition for objective scrutiny.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleEvaluateSubmit} className="space-y-3.5">
                      <Input
                        label="Product name *"
                        required
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g. Hydrating Barrier Repair Cream"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Brand"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          placeholder="e.g. SkinTheory"
                        />
                        <Input
                          label="Retail price ($) *"
                          type="number"
                          step="0.01"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="e.g. 38"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-espresso mb-1">
                            Category
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                            className="w-full h-8 px-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                          >
                            <option value="skincare">Skincare</option>
                            <option value="makeup">Makeup</option>
                            <option value="clothing">Clothing</option>
                          </select>
                        </div>

                        <Input
                          label="Size / Volume / Net Wt"
                          value={sizeOrVolume}
                          onChange={(e) => setSizeOrVolume(e.target.value)}
                          placeholder="e.g. 50ml or Size M"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-espresso mb-1">
                          Target Profile / Compatibility Focus
                        </label>
                        <input
                          type="text"
                          value={skinOrStyleTarget}
                          onChange={(e) => setSkinOrStyleTarget(e.target.value)}
                          placeholder="e.g. Sensitive skin barrier / Minimalist layering"
                          className="w-full h-8 px-2.5 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-espresso mb-1">
                          Ingredients or Fabric Breakdown
                        </label>
                        <textarea
                          rows={4}
                          value={ingredientsText}
                          onChange={(e) => setIngredientsText(e.target.value)}
                          placeholder="Paste comma-separated ingredients or textile percentages..."
                          className="w-full p-2.5 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none leading-relaxed"
                        />
                        <span className="text-[10px] text-espresso-muted block mt-1">
                          Tip: Enter comma-separated items to parse individual components.
                        </span>
                      </div>

                      <div className="pt-1">
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          isLoading={isLoading}
                          className="w-full"
                          leftIcon={<SearchCheck className="h-4 w-4" />}
                        >
                          {isLoading ? "Analyzing..." : "Evaluate product"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Results Column */}
              <div className="lg:col-span-7 space-y-4">
                {isLoading ? (
                  <Card className="py-16 text-center space-y-3">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-berry" />
                    <p className="text-xs font-semibold text-espresso">{loadingStep}</p>
                    <p className="text-[11px] text-espresso-muted">
                      Synthesizing formulation stability, irritant checks, and price benchmarks...
                    </p>
                  </Card>
                ) : evaluationResult ? (
                  <Card className="space-y-5">
                    {/* Top Result Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-espresso/10 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-espresso">
                            {evaluationResult.productName}
                          </h2>
                          <Badge variant="subtle" size="sm">
                            {evaluationResult.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-espresso-muted mt-0.5">
                          {evaluationResult.brand} • ${evaluationResult.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-2xl font-bold text-espresso">
                            {evaluationResult.overallScore}
                          </span>
                          <span className="text-xs text-espresso-muted">/100</span>
                        </div>
                        <Badge
                          variant={
                            evaluationResult.overallScore >= 85
                              ? "success"
                              : evaluationResult.overallScore >= 70
                              ? "berry"
                              : "warning"
                          }
                          size="md"
                        >
                          {evaluationResult.verdict}
                        </Badge>
                      </div>
                    </div>

                    {/* Executive Summary */}
                    <div>
                      <h3 className="text-xs font-semibold text-espresso uppercase tracking-wider mb-1">
                        Assessment Summary
                      </h3>
                      <p className="text-xs text-espresso-light leading-relaxed">
                        {evaluationResult.summary}
                      </p>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 rounded-md bg-espresso/5 border border-espresso/10 space-y-2">
                        <span className="text-xs font-semibold text-espresso flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                          Validated Advantages
                        </span>
                        <ul className="space-y-1.5 text-xs text-espresso-light pl-4 list-disc">
                          {evaluationResult.pros.map((pro, idx) => (
                            <li key={idx}>{pro}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-md bg-espresso/5 border border-espresso/10 space-y-2">
                        <span className="text-xs font-semibold text-espresso flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-700" />
                          Considerations & Trade-offs
                        </span>
                        <ul className="space-y-1.5 text-xs text-espresso-light pl-4 list-disc">
                          {evaluationResult.cons.map((con, idx) => (
                            <li key={idx}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Ingredient Scrutiny Module */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-semibold text-espresso uppercase tracking-wider">
                            Formulation & Fabric Scrutiny
                          </h3>
                          <p className="text-[11px] text-espresso-muted">
                            Component classification and risk rating
                          </p>
                        </div>

                        {/* Filter Toolbar */}
                        <div className="flex items-center gap-2">
                          <select
                            value={ingredientFilter}
                            onChange={(e) => setIngredientFilter(e.target.value)}
                            className="h-7 px-2 text-xs rounded border border-espresso/15 bg-white text-espresso focus:outline-none"
                          >
                            <option value="all">All items</option>
                            <option value="actives">Actives only</option>
                            <option value="cautions">Cautions / Allergens</option>
                            <option value="fabrics">Fabrics only</option>
                          </select>
                        </div>
                      </div>

                      {/* Component breakdown list */}
                      <div className="space-y-2">
                        {filteredIngredients.length > 0 ? (
                          filteredIngredients.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-md border border-espresso/10 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-espresso">
                                    {item.name}
                                  </span>
                                  <span className="text-[11px] text-espresso-muted">
                                    • {item.purpose}
                                  </span>
                                </div>
                                <p className="text-[11px] text-espresso-light">
                                  {item.details}
                                </p>
                              </div>

                              <Badge
                                variant={
                                  item.assessment === "positive"
                                    ? "success"
                                    : item.assessment === "caution"
                                    ? "warning"
                                    : "subtle"
                                }
                                size="sm"
                              >
                                {item.assessment}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-espresso-muted py-3 text-center border border-dashed border-espresso/15 rounded-md">
                            No ingredients match the selected filter.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Value-for-Money Metric */}
                    <div className="p-3.5 rounded-md bg-rose/15 border border-espresso/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-espresso">
                            Utility Metric: {evaluationResult.valueAssessment.score}/10
                          </span>
                          <span className="text-xs text-espresso-light">
                            ({evaluationResult.valueAssessment.costPerUse})
                          </span>
                        </div>
                        <p className="text-[11px] text-espresso-muted mt-0.5">
                          {evaluationResult.valueAssessment.verdict}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Bookmark className="h-3.5 w-3.5" />}
                          onClick={() => {
                            setActionNotice(`Added "${evaluationResult.productName}" to wishlist.`);
                          }}
                        >
                          Add to wishlist
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Clock className="h-3.5 w-3.5" />}
                          onClick={transferToImpulse}
                        >
                          Run impulse check
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="text-center py-16">
                    <SearchCheck className="h-8 w-8 mx-auto text-espresso-muted mb-2" />
                    <h3 className="text-xs font-semibold text-espresso">
                      No evaluation loaded
                    </h3>
                    <p className="text-xs text-espresso-muted mt-1 max-w-sm mx-auto">
                      Fill out the product specifications form or click a quick preset to inspect ingredients and value utility.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: IMPULSE CHECK */}
        {/* ========================================================================= */}
        {activeTab === "impulse" && (
          <div className="space-y-6">
            <div className="p-3 rounded-md bg-espresso/5 border border-espresso/10 text-xs text-espresso-light">
              <strong className="text-espresso">Pre-Purchase Friction Mechanism:</strong> The impulse check analyzes urgency factors, examines collection overlaps, and estimates 48-hour cooling-off outcomes before you commit payment.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Friction Questionnaire Form */}
              <div className="lg:col-span-5 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Impulse check</CardTitle>
                    <CardDescription>
                      Answer these 4 friction questions to determine if this purchase is intentional.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleImpulseSubmit} className="space-y-3.5">
                      <Input
                        label="Product under consideration *"
                        required
                        value={impulseProduct}
                        onChange={(e) => setImpulseProduct(e.target.value)}
                        placeholder="e.g. Velvet Eyeshadow Palette"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Retail price ($) *"
                          type="number"
                          step="0.01"
                          required
                          value={impulsePrice}
                          onChange={(e) => setImpulsePrice(e.target.value)}
                          placeholder="e.g. 65"
                        />

                        <div>
                          <label className="block text-xs font-medium text-espresso mb-1">
                            Category
                          </label>
                          <select
                            value={impulseCategory}
                            onChange={(e) => setImpulseCategory(e.target.value as Category)}
                            className="w-full h-8 px-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                          >
                            <option value="makeup">Makeup</option>
                            <option value="skincare">Skincare</option>
                            <option value="clothing">Clothing</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-espresso mb-1">
                          1. Why do you want to buy this right now?
                        </label>
                        <select
                          value={urgencyReason}
                          onChange={(e) => setUrgencyReason(e.target.value)}
                          className="w-full h-8 px-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                        >
                          <option value="Restock essential">Functional restock (current item is empty)</option>
                          <option value="Seasonal weather need">Seasonal necessity (weather/work change)</option>
                          <option value="Spotted on promotion">Spotted limited sale / fear of price increase</option>
                          <option value="Influencer / trend excitement">Saw on social media / influencer recommendation</option>
                          <option value="Boredom / emotional reward">Emotional reward / impulse craving</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-espresso mb-1">
                          2. Expected usage frequency
                        </label>
                        <select
                          value={expectedFrequency}
                          onChange={(e) => setExpectedFrequency(e.target.value)}
                          className="w-full h-8 px-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                        >
                          <option value="Daily staple">Daily staple (4–7 days / week)</option>
                          <option value="Weekly rotation">Regular weekly rotation (1–3 days / week)</option>
                          <option value="Special occasions">Special occasions only (a few times per year)</option>
                          <option value="Rare / Not sure">Uncertain / impulsive curiosity</option>
                        </select>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-espresso/10">
                        <label className="flex items-start gap-2 cursor-pointer text-xs text-espresso">
                          <input
                            type="checkbox"
                            checked={hasSimilarItem}
                            onChange={(e) => setHasSimilarItem(e.target.checked)}
                            className="mt-0.5 rounded border-espresso/20 text-berry focus:ring-berry"
                          />
                          <span>
                            <strong>Duplicate check:</strong> I already have products in my collection serving a similar function or shade.
                          </span>
                        </label>

                        <label className="flex items-start gap-2 cursor-pointer text-xs text-espresso">
                          <input
                            type="checkbox"
                            checked={canWait48Hours}
                            onChange={(e) => setCanWait48Hours(e.target.checked)}
                            className="mt-0.5 rounded border-espresso/20 text-berry focus:ring-berry"
                          />
                          <span>
                            <strong>Cooling-off agreement:</strong> I am willing to pause 48 hours before checking out.
                          </span>
                        </label>
                      </div>

                      <div className="pt-1">
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          isLoading={isLoading}
                          className="w-full"
                          leftIcon={<Clock className="h-4 w-4" />}
                        >
                          {isLoading ? "Analyzing impulse risk..." : "Run impulse check"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Impulse Results Column */}
              <div className="lg:col-span-7 space-y-4">
                {isLoading ? (
                  <Card className="py-16 text-center space-y-3">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-berry" />
                    <p className="text-xs font-semibold text-espresso">{loadingStep}</p>
                    <p className="text-[11px] text-espresso-muted">
                      Benchmarking urgency signals against owned inventory...
                    </p>
                  </Card>
                ) : impulseResult ? (
                  <Card className="space-y-5">
                    {/* Header Score & Recommendation */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-espresso/10 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-espresso">
                            {impulseResult.productName}
                          </h2>
                          <Badge variant="subtle" size="sm">
                            ${impulseResult.price}
                          </Badge>
                        </div>
                        <p className="text-xs text-espresso-muted mt-0.5">
                          Category: {impulseResult.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-espresso-muted block">Risk Score</span>
                          <span className="text-2xl font-bold text-espresso">
                            {impulseResult.impulseRiskScore}/100
                          </span>
                        </div>

                        <Badge
                          variant={
                            impulseResult.recommendation === "Proceed"
                              ? "success"
                              : impulseResult.recommendation === "Wait 48 Hours"
                              ? "warning"
                              : "espresso"
                          }
                          size="md"
                        >
                          {impulseResult.recommendation}
                        </Badge>
                      </div>
                    </div>

                    {/* Financial Utility Notice */}
                    {impulseResult.potentialSavings > 0 ? (
                      <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-emerald-700" />
                          <span className="text-emerald-900 font-medium">
                            Budget Protection: Pausing avoids an immediate withdrawal of ${impulseResult.potentialSavings}.
                          </span>
                        </div>
                        <Badge variant="success" size="sm">
                          +${impulseResult.potentialSavings} saved
                        </Badge>
                      </div>
                    ) : (
                      <div className="p-3 rounded-md bg-espresso/5 border border-espresso/10 text-xs text-espresso-light">
                        <strong className="text-espresso">Budget Neutral:</strong> This item meets genuine utility standards and carries low impulse risk.
                      </div>
                    )}

                    {/* Rationales */}
                    <div>
                      <h3 className="text-xs font-semibold text-espresso uppercase tracking-wider mb-2">
                        Decision Rationale
                      </h3>
                      <ul className="space-y-1.5 text-xs text-espresso-light pl-4 list-disc">
                        {impulseResult.keyReasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Collection Duplicate Alert */}
                    {impulseResult.alternativeSuggestion && (
                      <div className="p-3.5 rounded-md bg-rose/15 border border-espresso/10 space-y-2">
                        <span className="text-xs font-semibold text-espresso flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5 text-berry" />
                          Owned Collection Alternative
                        </span>
                        <p className="text-xs text-espresso-light leading-relaxed">
                          {impulseResult.alternativeSuggestion}
                        </p>
                      </div>
                    )}

                    {/* Cooling Off Countdown */}
                    {impulseResult.coolingOffUntil && (
                      <div className="p-3 rounded-md bg-espresso/5 border border-espresso/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-espresso">
                          <Clock className="h-4 w-4 text-berry" />
                          <span>48-Hour Deliberation Window Activated</span>
                        </div>
                        <span className="font-semibold text-espresso-muted">
                          Expires in ~47h 59m
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-espresso/10">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setActionNotice(`Added "${impulseResult.productName}" to 48-hour cooling queue.`);
                        }}
                      >
                        Save to cooling queue
                      </Button>

                      <Link href="/collection">
                        <Button variant="outline" size="sm">
                          View owned collection
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <Card className="text-center py-16">
                    <Clock className="h-8 w-8 mx-auto text-espresso-muted mb-2" />
                    <h3 className="text-xs font-semibold text-espresso">
                      No impulse check active
                    </h3>
                    <p className="text-xs text-espresso-muted mt-1 max-w-sm mx-auto">
                      Fill out the 4 friction questions on the left to evaluate duplicate risk and impulse probability.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EVALUATION HISTORY */}
        {/* ========================================================================= */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-espresso">
                  Past Evaluations ({evalHistory.length})
                </h2>
                <p className="text-xs text-espresso-muted">
                  Log of products analyzed during this session
                </p>
              </div>

              <span className="text-[11px] text-espresso-muted">
                [Session Memory • In-Memory Store]
              </span>
            </div>

            <div className="space-y-3">
              {evalHistory.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-semibold text-espresso">
                          {item.productName}
                        </h3>
                        <Badge variant="subtle" size="sm">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-espresso-muted mt-0.5">
                        {item.brand} • ${item.price} • Cost utility: {item.valueAssessment.costPerUse}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-espresso">
                          Score: {item.overallScore}/100
                        </span>
                        <Badge variant="berry" size="sm" className="ml-2">
                          {item.verdict}
                        </Badge>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEvaluationResult(item);
                          setActiveTab("evaluate");
                          setActionNotice(`Loaded "${item.productName}" scorecard.`);
                        }}
                      >
                        Inspect
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
