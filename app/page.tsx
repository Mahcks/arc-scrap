"use client";

import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import FilterTabs from "@/components/FilterTabs";
import ItemCard from "@/components/ItemCard";
import ComponentFinder from "@/components/ComponentFinder";
import ShoppingList from "@/components/ShoppingList";
import { useApiItemsData } from "@/hooks/useApiItemsData";
import { getCacheAgeString } from "@/lib/cache";
import {
  CoinIcon,
  WeightIcon,
  ChartIcon,
  RecycleIcon,
  StoreIcon,
  FireIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
  AlertIcon,
  DiamondIcon,
  FlashIcon,
  TargetIcon,
  BookIcon,
  LightbulbIcon,
  ClipboardIcon,
  RocketIcon,
  PackageIcon,
  SearchIcon,
  HammerIcon,
} from "@/components/icons";

import workshopsData from "@/data/workshops.json";

type ViewMode = "items" | "components" | "shopping" | "workshops";
type ItemFilter = "all" | "safe" | "quests" | "expedition";
type SortOption = "roi" | "value" | "weight" | "valuePerWeight" | "name";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("items");
  const [itemFilter, setItemFilter] = useState<ItemFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("roi");

  // Fetch items from API with ROI calculations and categories
  const { items: allItems, loading, error } = useApiItemsData();

  // Filter and sort items based on search, category, and sort option
  const filteredItems = useMemo(() => {
    let items = allItems;

    // Apply category filter
    if (itemFilter !== "all") {
      items = items.filter((item) => item.category === itemFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(query));
    }

    // Apply sorting
    const sorted = [...items].sort((a, b) => {
      switch (sortBy) {
        case "roi":
          return (b.roi ?? 0) - (a.roi ?? 0);
        case "value":
          return b.value - a.value;
        case "weight":
          return (a.weight ?? 999) - (b.weight ?? 999);
        case "valuePerWeight":
          return (b.valuePerWeight ?? 0) - (a.valuePerWeight ?? 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [allItems, itemFilter, searchQuery, sortBy]);

  // Get category counts
  const categoryCounts = useMemo(
    () => ({
      safe: allItems.filter((i) => i.category === "safe").length,
      quests: allItems.filter((i) => i.category === "quests").length,
      expedition: allItems.filter((i) => i.category === "expedition").length,
    }),
    [allItems]
  );

  // Count unique components
  const componentCount = useMemo(() => {
    const uniqueComponents = new Set<string>();
    allItems.forEach((item) => {
      if (item.breaksInto) {
        item.breaksInto.forEach((component) => {
          uniqueComponents.add(component.name);
        });
      }
    });
    return uniqueComponents.size;
  }, [allItems]);

  // Count craftable items (items that break into components)
  const craftableCount = useMemo(() => {
    return allItems.filter(item => item.breaksInto && item.breaksInto.length > 0).length;
  }, [allItems]);

  // Get view tabs
  const viewTabs = [
    {
      id: "items",
      label: "Items",
      description: "Browse all items with ROI calculations",
      icon: PackageIcon,
      count: allItems.length
    },
    {
      id: "components",
      label: "Components",
      description: "Find which items to recycle for specific components",
      icon: SearchIcon,
      count: componentCount
    },
    {
      id: "shopping",
      label: "Shopping List",
      description: "Plan what to recycle for items you want to craft",
      icon: ClipboardIcon,
      count: craftableCount
    },
    {
      id: "workshops",
      label: "Workshops",
      description: "Required items for workshop upgrades",
      icon: HammerIcon,
      count: 7
    },
  ];

  const itemFilterTabs = [
    { id: "all", label: "All Items", count: allItems.length },
    { id: "safe", label: "Safe to Recycle", count: categoryCounts.safe },
    { id: "quests", label: "Keep for Quests", count: categoryCounts.quests },
    { id: "expedition", label: "Expedition", count: categoryCounts.expedition },
  ];

  // Calculate stats
  const recycleRecommended = useMemo(() => {
    return allItems.filter((item) => item.roi && item.roi > 0).length;
  }, [allItems]);

  const sellRecommended = useMemo(() => {
    return allItems.filter((item) => item.roi && item.roi < -20).length;
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
            onClick={() => window.location.reload()}
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
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
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
      </div> */}

      {/* View Mode Tabs */}
      <FilterTabs
        tabs={viewTabs}
        activeTab={viewMode}
        onTabChange={(tab) => setViewMode(tab as ViewMode)}
        variant="cards"
      />

      {/* Search Bar - only show for items view */}
      {viewMode === "items" && (
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search items... (e.g., 'Ion Sputter', 'Battery')"
        />
      )}

      {/* Items View */}
      {viewMode === "items" && (
        <>
          <FilterTabs
            tabs={itemFilterTabs}
            activeTab={itemFilter}
            onTabChange={(tab) => setItemFilter(tab as ItemFilter)}
          />

          {/* Sort Controls */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <label
              htmlFor="sort-select"
              className="text-sm text-gray-400 flex items-center gap-2"
            >
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
              <p className="text-xl">
                No items found matching &quot;{searchQuery}&quot;
              </p>
              <p className="mt-2">Try a different search term</p>
            </div>
          ) : (
            <>
              {/* Category-specific help text */}
              {itemFilter === "expedition" && (
                <div className="mb-6 card bg-purple-500/10 border-purple-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                      <h4 className="font-semibold mb-1">
                        About Expedition Project Items
                      </h4>
                      <p className="text-sm text-gray-300">
                        These items can be turned in for the Expedition Project.
                        You don&apos;t need to keep specific items - just
                        collect enough items to reach the coin value target in
                        each category (Materials: 300k, Provisions: 180k,
                        Survival Items: 100k, Combat Items: 250k). Any items in
                        that category count toward the goal!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {itemFilter === "quests" && (
                <div className="mb-6 card bg-yellow-500/10 border-yellow-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Quest Items - Keep These!
                      </h4>
                      <p className="text-sm text-gray-300">
                        These specific items are required for in-game quests.
                        Store them in your stash and don&apos;t sell or recycle
                        them until you&apos;ve completed the related quest. The
                        amounts shown are what you&apos;ll need.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {itemFilter === "safe" && (
                <div className="mb-6 card bg-green-500/10 border-green-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Safe to Recycle or Sell
                      </h4>
                      <p className="text-sm text-gray-300">
                        These items aren&apos;t needed for quests or special
                        purposes. Check the ROI% to decide: Green (positive) =
                        recycle for profit, Red (negative) = sell for better
                        value.
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
                  <ItemCard
                    key={`${item.name}-${idx}`}
                    item={item}
                    showCategory={itemFilter === "all"}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Components View */}
      {viewMode === "components" && <ComponentFinder items={allItems} />}

      {/* Shopping List View */}
      {viewMode === "shopping" && <ShoppingList items={allItems} />}

      {/* Workshops View */}
      {viewMode === "workshops" && (
        <div className="space-y-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Workshop Upgrades</h3>
            <p className="text-gray-400">
              Track required items for each workshop bench upgrade
            </p>
          </div>

          {/* Workshop Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {Object.entries(workshopsData).map(([key, workshop]) => {
              const getWorkshopIcon = (name: string) => {
                switch(name) {
                  case "Gear Bench": return <HammerIcon className="w-8 h-8" />;
                  case "Gunsmith": return <TargetIcon className="w-8 h-8" />;
                  case "Medical Lab": return <AlertIcon className="w-8 h-8" />;
                  case "Refiner": return <FireIcon className="w-8 h-8" />;
                  case "Utility Station": return <FlashIcon className="w-8 h-8" />;
                  case "Explosives Station": return <RocketIcon className="w-8 h-8" />;
                  case "Scrappy": return <RecycleIcon className="w-8 h-8" />;
                  default: return <PackageIcon className="w-8 h-8" />;
                }
              };

              return (
                <button
                  key={key}
                  onClick={() => {
                    const element = document.getElementById(`workshop-${key}`);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="card card-hover p-4 flex flex-col items-center gap-2 text-center group"
                >
                  <div className="text-[var(--accent)] group-hover:scale-110 transition-transform">
                    {getWorkshopIcon(workshop.name)}
                  </div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {workshop.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {workshop.levels.length} level{workshop.levels.length !== 1 ? 's' : ''}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Workshop Details */}
          <div className="space-y-6 mt-8">
            {Object.entries(workshopsData).map(([key, workshop]) => (
              <div key={key} id={`workshop-${key}`} className="card scroll-mt-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-[var(--accent)]">
                    {(() => {
                      switch(workshop.name) {
                        case "Gear Bench": return <HammerIcon className="w-8 h-8" />;
                        case "Gunsmith": return <TargetIcon className="w-8 h-8" />;
                        case "Medical Lab": return <AlertIcon className="w-8 h-8" />;
                        case "Refiner": return <FireIcon className="w-8 h-8" />;
                        case "Utility Station": return <FlashIcon className="w-8 h-8" />;
                        case "Explosives Station": return <RocketIcon className="w-8 h-8" />;
                        case "Scrappy": return <RecycleIcon className="w-8 h-8" />;
                        default: return <PackageIcon className="w-8 h-8" />;
                      }
                    })()}
                  </div>
                  <h3 className="text-2xl font-bold">{workshop.name}</h3>
                </div>

                {workshop.levels.map((level, levelIdx) => (
                  <div key={levelIdx} className="mb-6 last:mb-0">
                    <h4 className="text-lg font-semibold mb-3 text-[var(--accent)]">
                      Level {level.level}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {level.upgrades.map((upgrade, upgradeIdx) => (
                        <div
                          key={upgradeIdx}
                          className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors"
                        >
                          <div className="font-medium mb-1 text-sm text-[var(--text-primary)]">{upgrade.item}</div>
                          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                            <span className="flex items-center gap-1">
                              <CloseIcon className="w-3 h-3 text-[var(--text-muted)]" />
                              {upgrade.amount}
                            </span>
                            <span className="text-[var(--border)]">•</span>
                            <span className="flex items-center gap-1">
                              <CoinIcon className="w-3 h-3 text-amber-400" />
                              {upgrade.value.toLocaleString()}
                            </span>
                          </div>
                          {upgrade.roi !== undefined && (
                            <div className="mt-1.5 text-xs">
                              <span
                                className={`font-medium ${
                                  upgrade.roi > 0
                                    ? "text-green-400"
                                    : upgrade.roi === 0
                                    ? "text-gray-400"
                                    : "text-red-400"
                                }`}
                              >
                                ROI: {upgrade.roi > 0 ? "+" : ""}
                                {upgrade.roi}%
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
        </div>
      )}

      {/* Category Explanations */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-green-500/10 border-green-500/30">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <RecycleIcon className="w-5 h-5" />
            <span>Safe to Recycle</span>
          </h3>
          <p className="text-gray-300 text-sm mb-2">
            Items you can freely recycle without worrying about quests or
            expeditions.
          </p>
          <p className="text-green-400 text-sm font-medium">
            → Check the ROI% before recycling! Green = profit, Red = sell
            instead
          </p>
        </div>

        <div className="card bg-yellow-500/10 border-yellow-500/30">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <ClipboardIcon className="w-5 h-5" />
            <span>Keep for Quests</span>
          </h3>
          <p className="text-gray-300 text-sm mb-2">
            Specific items required for in-game quests. Keep these in your
            stash!
          </p>
          <p className="text-yellow-400 text-sm font-medium">
            → Don&apos;t sell or recycle until you complete the quest
          </p>
        </div>

        <div className="card bg-purple-500/10 border-purple-500/30">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <RocketIcon className="w-5 h-5" />
            <span>Expedition Project</span>
          </h3>
          <p className="text-gray-300 text-sm mb-2">
            You need to turn in items worth specific coin values in different
            categories (Materials, Provisions, etc).
          </p>
          <p className="text-purple-400 text-sm font-medium">
            → Any items work, just hit the coin value target per category
          </p>
        </div>
      </div>

      {/* Icon Legend */}
      <div className="mt-8 card bg-gray-500/10 border-gray-500/30">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookIcon className="w-5 h-5" />
          <span>Icon Guide</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <CoinIcon className="text-amber-400 w-6 h-6 flex-shrink-0" />
            <div>
              <div className="font-semibold">Coin Value</div>
              <div className="text-sm text-gray-400">
                How much you get when selling
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <WeightIcon className="text-gray-400 w-6 h-6 flex-shrink-0" />
            <div>
              <div className="font-semibold">Weight</div>
              <div className="text-sm text-gray-400">
                Inventory space it takes up
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ChartIcon className="text-blue-400 w-6 h-6 flex-shrink-0" />
            <div>
              <div className="font-semibold">Value/Weight</div>
              <div className="text-sm text-gray-400">
                Coins per kg - higher is better
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RecycleIcon className="text-green-400 w-6 h-6 flex-shrink-0" />
            <div>
              <div className="font-semibold text-green-400">Recycle!</div>
              <div className="text-sm text-gray-400">
                Positive ROI - recycle this item
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <StoreIcon className="text-red-400 w-6 h-6 flex-shrink-0" />
            <div>
              <div className="font-semibold text-red-400">Sell!</div>
              <div className="text-sm text-gray-400">
                Negative ROI - selling is better
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <WeightIcon className="text-gray-400 w-6 h-6 flex-shrink-0" />
            <div>
              <div className="font-semibold text-gray-400">Either</div>
              <div className="text-sm text-gray-400">
                0% ROI - same value either way
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FireIcon className="text-orange-400 w-6 h-6 flex-shrink-0" />
            <div>
              <div className="font-semibold text-orange-400">High Loss</div>
              <div className="text-sm text-gray-400">
                -40%+ ROI - definitely sell this
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 card bg-blue-500/10 border-blue-500/30">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <LightbulbIcon className="w-5 h-5" />
          <span>Pro Tips</span>
        </h3>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <CheckIcon className="text-green-400 w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-white">Positive ROI (green):</strong>{" "}
              Recycling returns more value than selling - recycle these!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CloseIcon className="text-red-400 w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-white">Negative ROI (red/orange):</strong>{" "}
              Selling is better - recycling loses value
            </span>
          </li>
          <li className="flex items-start gap-2">
            <InfoIcon className="text-blue-400 w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-white">High-priority components:</strong>{" "}
              Usually carry a penalty of -40% to -60% when recycled
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertIcon className="text-yellow-400 w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-white">Recycling during raids:</strong>{" "}
              Only returns ~50% of usual components - better to wait for
              Speranza
            </span>
          </li>
          <li className="flex items-start gap-2">
            <DiamondIcon className="text-purple-400 w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-white">General rule:</strong> Sell most
              items, only recycle when you need specific components or ROI is
              positive
            </span>
          </li>
          <li className="flex items-start gap-2">
            <FlashIcon className="text-orange-400 w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-white">
                Don&apos;t craft for profit:
              </strong>{" "}
              Crafting usually loses value vs. selling raw materials
            </span>
          </li>
          <li className="flex items-start gap-2">
            <TargetIcon className="text-cyan-400 w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-white">Workshop upgrades:</strong>{" "}
              Stockpile items early - some are rare and you&apos;ll need
              multiples
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
