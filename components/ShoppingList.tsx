'use client';

import { useMemo, useState } from 'react';
import { Item } from '@/lib/types';
import { CloseIcon, CheckIcon } from './icons';
import { useApiItemsData } from '@/hooks/useApiItemsData';
import { formatComponentName } from '@/lib/recycling';

interface ComponentRequirement {
  componentName: string;
  componentValue: number;
  totalNeeded: number;
  bestDonors: Array<{
    itemName: string;
    itemValue: number;
    amountPerRecycle: number;
    image?: string;
    rarity?: string;
    efficiency: number;
    recyclesNeeded: number;
  }>;
}

interface ShoppingListProps {
  items: Item[]; // Items from cheat sheet for component donor lookup
}

export default function ShoppingList({ items: cheatSheetItems }: ShoppingListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Fetch ALL items from API for craftable items
  const { items: apiItems, loading: apiLoading, error: apiError } = useApiItemsData();

  // Use API items for everything (has both recyclable and craftable)
  const allItems = apiItems.length > 0 ? apiItems : cheatSheetItems;

  // Filter items that have recipes (craftable items)
  const craftableItems = useMemo(() => {
    return allItems.filter(item => item.recipe && Object.keys(item.recipe).length > 0);
  }, [allItems]);

  // Filter craftable items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery) return craftableItems;

    const query = searchQuery.toLowerCase();
    return craftableItems.filter(item =>
      item.name.toLowerCase().includes(query)
    );
  }, [craftableItems, searchQuery]);

  // Build component index (component name -> items that produce it when recycled)
  const componentIndex = useMemo(() => {
    const index = new Map<string, Array<{
      itemName: string;
      itemValue: number;
      amountPerRecycle: number;
      image?: string;
      rarity?: string;
      efficiency: number;
    }>>();

    allItems.forEach(item => {
      if (!item.recyclesInto) return;

      // Convert recyclesInto object to array format
      Object.entries(item.recyclesInto).forEach(([componentName, amount]) => {
        const existing = index.get(componentName) || [];

        existing.push({
          itemName: item.name,
          itemValue: item.value,
          amountPerRecycle: amount,
          image: item.image || item.imageFilename,
          rarity: item.rarity,
          efficiency: amount / item.value,
        });

        index.set(componentName, existing);
      });
    });

    // Sort each component's donors by efficiency
    index.forEach(donors => {
      donors.sort((a, b) => b.efficiency - a.efficiency);
    });

    return index;
  }, [allItems]);

  // Calculate aggregated component requirements from recipes
  const componentRequirements = useMemo(() => {
    if (selectedItems.size === 0) return [];

    const requirements = new Map<string, ComponentRequirement>();

    // Aggregate all components needed from recipes
    selectedItems.forEach(itemName => {
      const item = allItems.find(i => i.name === itemName);
      if (!item?.recipe) return;

      // Convert recipe object to array format
      Object.entries(item.recipe).forEach(([componentName, amount]) => {
        const existing = requirements.get(componentName);

        if (existing) {
          existing.totalNeeded += amount;
        } else {
          const donors = componentIndex.get(componentName) || [];

          requirements.set(componentName, {
            componentName: componentName,
            componentValue: 0, // Will need to fetch component values later
            totalNeeded: amount,
            bestDonors: donors.slice(0, 3).map(donor => ({
              ...donor,
              recyclesNeeded: 0, // Will calculate below
            })),
          });
        }
      });
    });

    // Calculate recyclesNeeded for each donor
    requirements.forEach(req => {
      req.bestDonors.forEach(donor => {
        donor.recyclesNeeded = Math.ceil(req.totalNeeded / donor.amountPerRecycle);
      });
    });

    return Array.from(requirements.values()).sort((a, b) =>
      a.componentName.localeCompare(b.componentName)
    );
  }, [selectedItems, allItems, componentIndex]);

  const toggleItem = (itemName: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemName)) {
        next.delete(itemName);
      } else {
        next.add(itemName);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const getRarityBorder = (rarity?: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/40';
      case 'uncommon': return 'border-green-500/40';
      case 'rare': return 'border-blue-500/40';
      case 'epic': return 'border-purple-500/40';
      case 'legendary': return 'border-orange-500/40';
      default: return 'border-[var(--border)]';
    }
  };

  // Show loading state while fetching API data
  if (apiLoading) {
    return (
      <div className="card h-[400px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-4xl mb-2">⏳</div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Loading Craftable Items...
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Fetching data from API
          </p>
        </div>
      </div>
    );
  }

  // Show error if API failed
  if (apiError) {
    return (
      <div className="card h-[400px] flex items-center justify-center">
        <div className="text-center space-y-2 max-w-sm">
          <div className="text-4xl mb-2">⚠️</div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Failed to Load Crafting Data
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            {apiError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
      {/* Item Selection Sidebar */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search items to craft..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Selection Counter */}
        {selectedItems.size > 0 && (
          <div className="flex items-center justify-between p-2 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg">
            <span className="text-xs text-[var(--text-secondary)]">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={clearSelection}
              className="text-xs text-[var(--accent)] hover:text-[var(--accent)]/80 font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Item List */}
        <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-muted)] text-xs">
              No craftable items found
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selectedItems.has(item.name);

              return (
                <button
                  key={item.name}
                  onClick={() => toggleItem(item.name)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50'
                      : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Checkbox */}
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? 'bg-[var(--accent)] border-[var(--accent)]'
                          : 'border-[var(--border)]'
                      }`}
                    >
                      {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                    </div>

                    {/* Image */}
                    {(item.image || item.imageFilename) && (
                      <div className={`w-10 h-10 rounded bg-[var(--background)] flex-shrink-0 overflow-hidden border ${getRarityBorder(item.rarity)}`}>
                        <img
                          src={item.image || item.imageFilename}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--text-primary)] text-sm truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {item.recipe ? Object.keys(item.recipe).length : 0} component{(item.recipe && Object.keys(item.recipe).length !== 1) ? 's' : ''} required
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Shopping List Panel */}
      <div className="lg:min-h-[600px]">
        {selectedItems.size === 0 ? (
          <div className="card h-full flex items-center justify-center">
            <div className="text-center space-y-2 max-w-sm">
              <div className="text-4xl mb-2">📋</div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                Select Items to Craft
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Choose items from the list to see all components needed and which items to recycle for optimal efficiency
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    Component Shopping List
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Crafting {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--accent)]">
                    {componentRequirements.length}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">
                    components
                  </div>
                </div>
              </div>
            </div>

            {/* Component Requirements */}
            {componentRequirements.map((req) => (
              <div key={req.componentName} className="card">
                <div className="mb-3 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {formatComponentName(req.componentName)}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-bold text-emerald-400">
                        {req.totalNeeded}x
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">needed</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <svg className="fill-amber-400 w-3 h-3" width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 4C47.464 4 60 16.536 60 32C60 47.464 47.464 60 32 60C16.536 60 4 47.464 4 32C4 16.536 16.536 4 32 4ZM31.333 12C20.6558 12.0002 12.0002 20.6558 12 31.333C12 42.0104 20.6557 50.6668 31.333 50.667C42.0105 50.667 50.667 42.0105 50.667 31.333C50.6668 20.6557 42.0104 12 31.333 12Z"></path>
                      <rect x="24" width="6" height="64"></rect>
                      <rect x="34.6667" width="6" height="64"></rect>
                    </svg>
                    <span className="text-xs text-amber-400 font-medium">
                      {req.componentValue} each
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                    Best items to recycle
                  </h4>

                  {req.bestDonors.length === 0 ? (
                    <div className="text-xs text-[var(--text-muted)] italic">
                      No recycling sources found
                    </div>
                  ) : (
                    req.bestDonors.map((donor, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border transition-all ${
                          idx === 0
                            ? 'bg-amber-500/5 border-amber-500/20'
                            : 'bg-[var(--background)] border-[var(--border)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Rank */}
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              idx === 0
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]'
                            }`}
                          >
                            {idx + 1}
                          </div>

                          {/* Image */}
                          {donor.image && (
                            <div className={`w-8 h-8 rounded bg-[var(--background)] flex-shrink-0 overflow-hidden border ${getRarityBorder(donor.rarity)}`}>
                              <img
                                src={donor.image}
                                alt={donor.itemName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[var(--text-primary)] text-xs truncate">
                              {donor.itemName}
                            </div>
                            <div className="text-[10px] text-[var(--text-secondary)]">
                              <span className="text-emerald-400 font-semibold">{donor.amountPerRecycle}x</span> per recycle
                              <span className="text-[var(--border)] mx-1">•</span>
                              Recycle <span className="text-[var(--accent)] font-semibold">{donor.recyclesNeeded}x</span>
                            </div>
                          </div>

                          {/* Efficiency */}
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs font-bold text-emerald-400">
                              {(donor.efficiency * 1000).toFixed(1)}
                            </div>
                            <div className="text-[9px] text-[var(--text-muted)] uppercase">
                              per 1k
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}

            {/* Info Card */}
            <div className="card bg-blue-500/5 border-blue-500/20">
              <div className="flex gap-2.5">
                <div className="text-xl">💡</div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-semibold text-blue-400">Smart Recycling</div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    This list shows the most efficient items to recycle for each component you need.
                    Higher efficiency means more components per coin spent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
