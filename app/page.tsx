'use client';

import { useState, useMemo } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterTabs from '@/components/FilterTabs';
import ItemCard from '@/components/ItemCard';
import ComponentCard from '@/components/ComponentCard';
import StatsCard from '@/components/StatsCard';
import { useItemsData } from '@/hooks/useItemsData';
import { getCacheAgeString } from '@/lib/cache';

import componentsData from '@/data/components.json';
import workshopsData from '@/data/workshops.json';

type ViewMode = 'items' | 'components' | 'workshops';
type ItemFilter = 'all' | 'safe' | 'quests' | 'expedition';
type SortOption = 'roi' | 'value' | 'weight' | 'valuePerWeight' | 'name';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('items');
  const [itemFilter, setItemFilter] = useState<ItemFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('roi');

  // Fetch items with caching
  const { items: allItems, loading, error, isStale, refetch } = useItemsData();

  // Filter and sort items based on search, category, and sort option
  const filteredItems = useMemo(() => {
    let items = allItems;

    // Apply category filter
    if (itemFilter !== 'all') {
      items = items.filter(item => item.category === itemFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...items].sort((a, b) => {
      switch (sortBy) {
        case 'roi':
          return (b.roi ?? 0) - (a.roi ?? 0);
        case 'value':
          return b.value - a.value;
        case 'weight':
          return (a.weight ?? 999) - (b.weight ?? 999);
        case 'valuePerWeight':
          return (b.valuePerWeight ?? 0) - (a.valuePerWeight ?? 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [allItems, itemFilter, searchQuery, sortBy]);

  // Get category counts
  const categoryCounts = useMemo(() => ({
    safe: allItems.filter(i => i.category === 'safe').length,
    quests: allItems.filter(i => i.category === 'quests').length,
    expedition: allItems.filter(i => i.category === 'expedition').length,
  }), [allItems]);

  // Combine all components
  const allComponents = useMemo(() => {
    return [
      ...componentsData.essentials,
      ...componentsData.priorities,
      ...componentsData.highTier,
    ];
  }, []);

  // Filter components
  const filteredComponents = useMemo(() => {
    if (!searchQuery) return allComponents;
    const query = searchQuery.toLowerCase();
    return allComponents.filter((comp) =>
      comp.name.toLowerCase().includes(query)
    );
  }, [allComponents, searchQuery]);

  // Get view tabs
  const viewTabs = [
    { id: 'items', label: '📦 Items', count: allItems.length },
    { id: 'components', label: '🔧 Components', count: allComponents.length },
    { id: 'workshops', label: '🏗️ Workshops', count: 7 },
  ];

  const itemFilterTabs = [
    { id: 'all', label: 'All Items', count: allItems.length },
    { id: 'safe', label: 'Safe to Recycle', count: categoryCounts.safe },
    { id: 'quests', label: 'Keep for Quests', count: categoryCounts.quests },
    { id: 'expedition', label: 'Expedition', count: categoryCounts.expedition },
  ];

  // Calculate stats
  const recycleRecommended = useMemo(() => {
    return allItems.filter(item => item.roi && item.roi > 0).length;
  }, [allItems]);

  const sellRecommended = useMemo(() => {
    return allItems.filter(item => item.roi && item.roi < -20).length;
  }, [allItems]);

  // Show loading state
  if (loading && allItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl text-gray-400">Loading item data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && allItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-xl text-red-400 mb-4">Failed to load data</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cache indicator */}
      {isStale && (
        <div className="mb-4 card bg-yellow-500/10 border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">🔄</span>
              <span className="text-sm text-gray-300">
                Updating data in background... (cached data shown)
              </span>
            </div>
            <button
              onClick={refetch}
              className="px-3 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition-colors"
            >
              Refresh now
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 gradient-text">
          Quick Loot Decision Tool
        </h2>
        <p className="text-gray-400 text-lg mb-2">
          Instantly find out if you should recycle or sell items in ARC Raiders
        </p>
        <p className="text-xs text-gray-500">
          Data updated {getCacheAgeString()} • Auto-refreshes every 24 hours
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatsCard
          icon="📦"
          value={allItems.length}
          label="Total Items"
          color="text-blue-400"
        />
        <StatsCard
          icon="♻️"
          value={recycleRecommended}
          label="Recycle These"
          color="text-green-400"
        />
        <StatsCard
          icon="🏪"
          value={sellRecommended}
          label="Sell These"
          color="text-red-400"
        />
        <StatsCard
          icon="🔧"
          value={allComponents.length}
          label="Components"
          color="text-purple-400"
        />
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={setSearchQuery}
        placeholder={
          viewMode === 'items'
            ? "Search items... (e.g., 'Ion Sputter', 'Battery')"
            : viewMode === 'components'
            ? "Search components... (e.g., 'Metal Parts', 'Battery')"
            : "Search workshops..."
        }
      />

      {/* View Mode Tabs */}
      <FilterTabs
        tabs={viewTabs}
        activeTab={viewMode}
        onTabChange={(tab) => setViewMode(tab as ViewMode)}
      />

      {/* Items View */}
      {viewMode === 'items' && (
        <>
          <FilterTabs
            tabs={itemFilterTabs}
            activeTab={itemFilter}
            onTabChange={(tab) => setItemFilter(tab as ItemFilter)}
          />

          {/* Sort Controls */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <label htmlFor="sort-select" className="text-sm text-gray-400 flex items-center gap-2">
              <span>🔀</span>
              <span>Sort by:</span>
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            >
              <option value="roi">ROI (Highest First)</option>
              <option value="value">Value (Highest First)</option>
              <option value="weight">Weight (Lightest First)</option>
              <option value="valuePerWeight">Value/Weight (Best Ratio)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-xl">No items found matching &quot;{searchQuery}&quot;</p>
              <p className="mt-2">Try a different search term</p>
            </div>
          ) : (
            <>
              {/* Category-specific help text */}
              {itemFilter === 'expedition' && (
                <div className="mb-6 card bg-purple-500/10 border-purple-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                      <h4 className="font-semibold mb-1">About Expedition Project Items</h4>
                      <p className="text-sm text-gray-300">
                        These items can be turned in for the Expedition Project. You don&apos;t need to keep specific items -
                        just collect enough items to reach the coin value target in each category (Materials: 300k, Provisions: 180k,
                        Survival Items: 100k, Combat Items: 250k). Any items in that category count toward the goal!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {itemFilter === 'quests' && (
                <div className="mb-6 card bg-yellow-500/10 border-yellow-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold mb-1">Quest Items - Keep These!</h4>
                      <p className="text-sm text-gray-300">
                        These specific items are required for in-game quests. Store them in your stash and don&apos;t sell or
                        recycle them until you&apos;ve completed the related quest. The amounts shown are what you&apos;ll need.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {itemFilter === 'safe' && (
                <div className="mb-6 card bg-green-500/10 border-green-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-semibold mb-1">Safe to Recycle or Sell</h4>
                      <p className="text-sm text-gray-300">
                        These items aren&apos;t needed for quests or special purposes. Check the ROI% to decide:
                        Green (positive) = recycle for profit, Red (negative) = sell for better value.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4 text-sm text-gray-400">
                Showing {filteredItems.length} items
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item, idx) => (
                  <ItemCard key={`${item.name}-${idx}`} item={item} showCategory={itemFilter === 'all'} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Components View */}
      {viewMode === 'components' && (
        <>
          {filteredComponents.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-xl">No components found matching &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Component Finder</h3>
                <p className="text-gray-400">
                  Find the best items to recycle for specific components
                </p>
              </div>

              <div className="mb-4 text-sm text-gray-400">
                Showing {filteredComponents.length} components
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredComponents.map((component, idx) => (
                  <ComponentCard key={`${component.name}-${idx}`} component={component} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Workshops View */}
      {viewMode === 'workshops' && (
        <div className="space-y-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Workshop Upgrades</h3>
            <p className="text-gray-400">
              Track required items for each workshop bench upgrade
            </p>
          </div>

          {Object.entries(workshopsData).map(([key, workshop]) => (
            <div key={key} className="card">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{workshop.icon}</span>
                <h3 className="text-2xl font-bold">{workshop.name}</h3>
              </div>

              {workshop.levels.map((level, levelIdx) => (
                <div key={levelIdx} className="mb-6 last:mb-0">
                  <h4 className="text-lg font-semibold mb-3 text-blue-400">
                    Level {level.level}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {level.upgrades.map((upgrade, upgradeIdx) => (
                      <div
                        key={upgradeIdx}
                        className="p-3 bg-[var(--background)] rounded border border-[var(--border)]"
                      >
                        <div className="font-medium mb-1">{upgrade.item}</div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>×{upgrade.amount}</span>
                          <span>💰 {upgrade.value.toLocaleString()}</span>
                        </div>
                        {upgrade.roi !== undefined && (
                          <div className="mt-1 text-xs">
                            <span className={upgrade.roi > 0 ? 'text-green-400' : 'text-red-400'}>
                              ROI: {upgrade.roi > 0 ? '+' : ''}{upgrade.roi}%
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Category Explanations */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-green-500/10 border-green-500/30">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span>♻️</span>
            <span>Safe to Recycle</span>
          </h3>
          <p className="text-gray-300 text-sm mb-2">
            Items you can freely recycle without worrying about quests or expeditions.
          </p>
          <p className="text-green-400 text-sm font-medium">
            → Check the ROI% before recycling! Green = profit, Red = sell instead
          </p>
        </div>

        <div className="card bg-yellow-500/10 border-yellow-500/30">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span>📋</span>
            <span>Keep for Quests</span>
          </h3>
          <p className="text-gray-300 text-sm mb-2">
            Specific items required for in-game quests. Keep these in your stash!
          </p>
          <p className="text-yellow-400 text-sm font-medium">
            → Don&apos;t sell or recycle until you complete the quest
          </p>
        </div>

        <div className="card bg-purple-500/10 border-purple-500/30">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span>🚀</span>
            <span>Expedition Project</span>
          </h3>
          <p className="text-gray-300 text-sm mb-2">
            You need to turn in items worth specific coin values in different categories (Materials, Provisions, etc).
          </p>
          <p className="text-purple-400 text-sm font-medium">
            → Any items work, just hit the coin value target per category
          </p>
        </div>
      </div>

      {/* Icon Legend */}
      <div className="mt-8 card bg-gray-500/10 border-gray-500/30">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📖</span>
          <span>Icon Guide</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <div className="font-semibold">Coin Value</div>
              <div className="text-sm text-gray-400">How much you get when selling</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚖️</span>
            <div>
              <div className="font-semibold">Weight</div>
              <div className="text-sm text-gray-400">Inventory space it takes up</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <div className="font-semibold">Value/Weight</div>
              <div className="text-sm text-gray-400">Coins per kg - higher is better</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">♻️</span>
            <div>
              <div className="font-semibold text-green-400">Recycle!</div>
              <div className="text-sm text-gray-400">Positive ROI - recycle this item</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🏪</span>
            <div>
              <div className="font-semibold text-red-400">Sell!</div>
              <div className="text-sm text-gray-400">Negative ROI - selling is better</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚖️</span>
            <div>
              <div className="font-semibold text-gray-400">Either</div>
              <div className="text-sm text-gray-400">0% ROI - same value either way</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="font-semibold text-orange-400">High Loss</div>
              <div className="text-sm text-gray-400">-40%+ ROI - definitely sell this</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 card bg-blue-500/10 border-blue-500/30">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>💡</span>
          <span>Pro Tips</span>
        </h3>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>
              <strong className="text-white">Positive ROI (green):</strong> Recycling returns more value than selling - recycle these!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">✗</span>
            <span>
              <strong className="text-white">Negative ROI (red/orange):</strong> Selling is better - recycling loses value
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">ℹ</span>
            <span>
              <strong className="text-white">High-priority components:</strong> Usually carry a penalty of -40% to -60% when recycled
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-1">⚠</span>
            <span>
              <strong className="text-white">Recycling during raids:</strong> Only returns ~50% of usual components - better to wait for Speranza
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">💎</span>
            <span>
              <strong className="text-white">General rule:</strong> Sell most items, only recycle when you need specific components or ROI is positive
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">⚡</span>
            <span>
              <strong className="text-white">Don&apos;t craft for profit:</strong> Crafting usually loses value vs. selling raw materials
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">🎯</span>
            <span>
              <strong className="text-white">Workshop upgrades:</strong> Stockpile items early - some are rare and you&apos;ll need multiples
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
