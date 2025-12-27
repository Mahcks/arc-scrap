'use client';

import { useState, useEffect } from 'react';
import { Item, Rarity } from '@/lib/types';
import { calculateRecyclingValue, calculateROI, categorizeItem } from '@/lib/recycling';

interface UseApiItemsDataReturn {
  items: Item[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching ALL items from the API
 * Used by Shopping List to get craftable items with recipes
 */
export function useApiItemsData(): UseApiItemsDataReturn {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch list of all items
        const response = await fetch('https://arcdata.mahcks.com/v1/items');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const itemIds = data.items.map((item: { id: string }) => item.id);

        // Fetch all items in parallel (with batching to avoid overwhelming the server)
        const batchSize = 50;
        const allItems: Item[] = [];

        for (let i = 0; i < itemIds.length; i += batchSize) {
          const batch = itemIds.slice(i, i + batchSize);
          const batchPromises = batch.map((id: string) =>
            fetch(`https://arcdata.mahcks.com/v1/items/${id}`)
              .then(res => res.json())
              .catch(() => null)
          );
          const batchResults = await Promise.all(batchPromises);

          // Transform API data to our Item interface with ROI calculations
          const transformedBatch = batchResults
            .filter((apiItem: any) => apiItem !== null)
            .map((apiItem: any) => {
              const itemName = apiItem.name?.en || apiItem.id;
              const sellValue = apiItem.value || 0;
              const recycleValue = calculateRecyclingValue(apiItem.recyclesInto);
              const roi = calculateROI(sellValue, recycleValue);
              const category = categorizeItem(itemName);

              const item: Item = {
                name: itemName,
                value: sellValue,
                roi: roi,
                category: category,
                weight: apiItem.weightKg,
                weightKg: apiItem.weightKg,
                image: apiItem.imageFilename,
                imageFilename: apiItem.imageFilename,
                rarity: apiItem.rarity?.toLowerCase() as Rarity,
                recipe: apiItem.recipe,
                craftBench: apiItem.craftBench,
                recyclesInto: apiItem.recyclesInto,
              };

              if (item.weight && item.weight > 0) {
                item.valuePerWeight = item.value / item.weight;
              }

              return item;
            });

          allItems.push(...transformedBatch);
        }

        setItems(allItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch API data');
        console.error('Failed to fetch API items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, []);

  return { items, loading, error };
}
