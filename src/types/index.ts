export type Category = 'makeup' | 'skincare' | 'clothing';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  currency: string;
  imageUrl?: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  // Specific attributes
  ingredients?: string[];
  materials?: string[];
  skinType?: string[];
  sizeOrVolume?: string;
}

export interface IngredientOrMaterialAnalysis {
  name: string;
  category: 'active' | 'soothing' | 'fragrance' | 'fabric' | 'preservative' | 'other';
  assessment: 'positive' | 'neutral' | 'caution';
  purpose: string;
  details: string;
}

export interface EvaluationResult {
  id: string;
  productName: string;
  brand: string;
  category: Category;
  price: number;
  overallScore: number; // 0 - 100
  verdict: 'Highly Recommended' | 'Recommended with Reservations' | 'Consider Alternatives' | 'Not Recommended';
  summary: string;
  pros: string[];
  cons: string[];
  ingredientsOrMaterials: IngredientOrMaterialAnalysis[];
  valueAssessment: {
    score: number; // 0 - 10
    costPerUse: string;
    verdict: string;
  };
  createdAt: string;
}

export interface ImpulseCheckInput {
  productName: string;
  brand: string;
  price: number;
  category: Category;
  urgencyReason: string;
  plannedFrequency: 'Daily' | 'Weekly' | 'Special occasions' | 'Not sure';
  hasSimilarItem: boolean;
  canWait48Hours: boolean;
}

export interface ImpulseCheckResult {
  id: string;
  productName: string;
  category: Category;
  price: number;
  impulseRiskScore: number; // 0 (thoughtful) - 100 (high impulse risk)
  recommendation: 'Proceed' | 'Wait 48 Hours' | 'Skip Purchase';
  keyReasons: string[];
  coolingOffUntil?: string;
  similarOwnedCount: number;
  alternativeSuggestion?: string;
  potentialSavings: number;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  priority: 'high' | 'medium' | 'low';
  targetPrice?: number;
  notes?: string;
  addedAt: string;
  estimatedImpulseRisk?: 'low' | 'moderate' | 'high';
}

export interface CollectionItem {
  id: string;
  product: Product;
  purchaseDate: string;
  purchasePrice: number;
  openedDate?: string;
  expiryDate?: string;
  status: 'active' | 'nearly_empty' | 'expired' | 'archived';
  usageCount: number;
  estimatedCostPerUse: number;
  rating?: number;
  notes?: string;
}

export interface ComparisonItem {
  id: string;
  title: string;
  category: Category;
  products: Product[];
  evaluationSummary?: {
    winnerId: string;
    verdict: string;
    highlights: {
      productId: string;
      advantage: string;
    }[];
  };
  createdAt: string;
}

export interface MonthlySpendingData {
  month: string;
  makeup: number;
  skincare: number;
  clothing: number;
  total: number;
  budget: number;
}
