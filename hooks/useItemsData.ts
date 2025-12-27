'use client';

import { useState, useEffect } from 'react';
import { Item, Rarity } from '@/lib/types';
import { getCachedData, setCachedData, isCacheFresh, getCacheMetadata } from '@/lib/cache';

interface UseItemsDataReturn {
  items: Item[];
  loading: boolean;
  error: string | null;
  isStale: boolean;
  lastUpdated: number | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching items data with caching
 * - Returns cached data immediately if available
 * - Fetches fresh data in background if cache is stale
 * - Supports manual refresh
 */
export function useItemsData(): UseItemsDataReturn {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);

      // Load data from local JSON (has ROI, categories, component values)
      const itemsModule = await import('@/data/items.json');
      const freshItems = itemsModule.default as Item[];

      // Update state and cache
      setItems(freshItems);
      setCachedData(freshItems);
      setIsStale(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to load from cache first
    const cached = getCachedData<Item[]>();
    const fresh = isCacheFresh();

    if (cached) {
      // Show cached data immediately
      setItems(cached);
      setLoading(false);

      if (!fresh) {
        // Cache is stale, fetch in background
        setIsStale(true);
        fetchData(true); // Silent refresh
      }
    } else {
      // No cache, fetch immediately with loading state
      fetchData(false);
    }
  }, []);

  const metadata = getCacheMetadata();

  return {
    items,
    loading,
    error,
    isStale,
    lastUpdated: metadata?.timestamp || null,
    refetch: () => fetchData(false),
  };
}
