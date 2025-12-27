export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Item {
  name: string;
  value: number;
  roi?: number;
  category?: string;
  weight?: number;
  weightKg?: number; // API uses weightKg
  valuePerWeight?: number;
  amount?: number;
  phase?: number;
  image?: string;
  imageFilename?: string; // API uses imageFilename
  rarity?: Rarity;
  breaksInto?: Array<{
    name: string;
    amount: number;
    value: number;
  }>;
  recyclesInto?: Record<string, number>; // API format: { "plastic_parts": 4 }
  recipe?: Record<string, number>; // Crafting requirements: { "arc_alloy": 2, "plastic_parts": 4 }
  craftBench?: string | string[]; // Where it can be crafted: ["workbench", "equipment_bench"] or "workbench"
}

export interface Component {
  name: string;
  value: number;
  priority: 'essential' | 'priority' | 'high-tier' | 'other';
  roi?: number;
  bestDonors?: DonorItem[];
}

export interface DonorItem {
  item: string;
  value: number;
  yield: number;
}

export interface WorkshopUpgrade {
  item: string;
  value: number;
  amount: number;
  roi?: number;
  weight?: number;
}

export interface WorkshopLevel {
  level: number;
  upgrades: WorkshopUpgrade[];
}

export interface Workshop {
  name: string;
  icon: string;
  levels: WorkshopLevel[];
}

export type ROICategory = 'positive' | 'neutral' | 'negative' | 'heavy-loss';

export function getROICategory(roi: number | undefined): ROICategory {
  if (roi === undefined) return 'neutral';
  if (roi > 0) return 'positive';
  if (roi === 0) return 'neutral';
  if (roi > -30) return 'negative';
  return 'heavy-loss';
}

export function getROIColor(roi: number | undefined): string {
  const category = getROICategory(roi);
  switch (category) {
    case 'positive':
      return 'text-green-400';
    case 'neutral':
      return 'text-gray-400';
    case 'negative':
      return 'text-orange-400';
    case 'heavy-loss':
      return 'text-red-400';
  }
}

export function formatROI(roi: number | undefined): string {
  if (roi === undefined) return 'N/A';
  const sign = roi > 0 ? '+' : '';
  return `${sign}${roi}%`;
}

export function getRecycleRecommendation(roi: number | undefined): {
  action: string;
  color: string;
  emoji: string;
} {
  if (roi === undefined) {
    return { action: 'Unknown', color: 'text-gray-400', emoji: '❓' };
  }

  if (roi > 0) {
    return { action: 'Recycle!', color: 'text-green-400', emoji: '♻️' };
  }

  if (roi === 0) {
    return { action: 'Either', color: 'text-gray-400', emoji: '⚖️' };
  }

  if (roi > -20) {
    return { action: 'Sell (small loss)', color: 'text-orange-400', emoji: '💰' };
  }

  return { action: 'Sell!', color: 'text-red-400', emoji: '🏪' };
}

export function getRarityColor(rarity: Rarity | undefined): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-400 border-gray-500/30';
    case 'uncommon':
      return 'text-green-400 border-green-500/30';
    case 'rare':
      return 'text-blue-400 border-blue-500/30';
    case 'epic':
      return 'text-purple-400 border-purple-500/30';
    case 'legendary':
      return 'text-orange-400 border-orange-500/30';
    default:
      return 'text-gray-400 border-gray-500/30';
  }
}

export function getRarityLabel(rarity: Rarity | undefined): string {
  if (!rarity) return '';
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}
