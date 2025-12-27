/**
 * ARC Raiders API Service
 * Fetches live data from ardb.app API
 */

export interface APIItem {
  id: string;
  name: string;
  description?: string;
  rarity: string | null;
  type: string;
  foundIn: string[];
  value: number;
  weight?: number;
  stackSize?: number;
  icon?: string;
  breaksInto?: Array<{
    item: {
      id: string;
      name: string;
      value: number;
      rarity: string;
      icon?: string;
    };
    amount: number;
  }>;
  usedInCraft?: Array<{
    id: string;
    name: string;
    value: number;
    rarity: string;
  }>;
  obtainedFrom?: Array<{
    item: {
      id: string;
      name: string;
      value: number;
    };
    amount: number;
  }>;
}

const API_BASE = 'https://ardb.app/api';

/**
 * Fetch all items from the API
 */
export async function fetchAllItems(): Promise<APIItem[]> {
  const response = await fetch(`${API_BASE}/items`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch a specific item with full details including recycling data
 */
export async function fetchItem(id: string): Promise<APIItem> {
  const response = await fetch(`${API_BASE}/items/${id}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Calculate ROI for an item based on its recycling value
 * ROI% = (Recycle Value - Sell Value) / Sell Value * 100
 */
export function calculateROI(item: APIItem): number {
  if (!item.breaksInto || item.breaksInto.length === 0) {
    return 0; // Can't recycle
  }

  // Calculate total recycling value
  const recycleValue = item.breaksInto.reduce((total, component) => {
    return total + (component.item.value * component.amount);
  }, 0);

  const sellValue = item.value;

  if (sellValue === 0) {
    return 0;
  }

  // ROI formula from the PDF
  return ((recycleValue - sellValue) / sellValue) * 100;
}

/**
 * Get the image URL for an item
 */
export function getItemImageURL(icon?: string): string | undefined {
  if (!icon) return undefined;

  // Fix the URL path - API returns /items/... but correct path is /static/items/...
  const fixedIcon = icon.replace(/^\/items\//, '/static/items/');

  return `https://ardb.app${fixedIcon}`;
}
