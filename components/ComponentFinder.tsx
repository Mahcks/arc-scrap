'use client';

import { useMemo, useState } from 'react';
import { Item } from '@/lib/types';

interface DonorItem {
  itemName: string;
  amount: number;
  itemValue: number;
  image?: string;
  rarity?: string;
  efficiency: number;
}

interface ComponentSource {
  componentName: string;
  componentValue: number;
  donors: DonorItem[];
  totalSources: number;
}

interface ComponentFinderProps {
  items: Item[];
}

type SortMode = 'alphabetical' | 'efficiency' | 'sources';

export default function ComponentFinder({ items }: ComponentFinderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('alphabetical');

  // Build reverse lookup index
  const componentIndex = useMemo(() => {
    const index = new Map<string, ComponentSource>();

    items.forEach(item => {
      if (!item.breaksInto) return;

      item.breaksInto.forEach(component => {
        const existing = index.get(component.name);

        const donor: DonorItem = {
          itemName: item.name,
          amount: component.amount,
          itemValue: item.value,
          image: item.image,
          rarity: item.rarity,
          efficiency: component.amount / item.value,
        };

        if (existing) {
          existing.donors.push(donor);
        } else {
          index.set(component.name, {
            componentName: component.name,
            componentValue: component.value,
            donors: [donor],
            totalSources: 1,
          });
        }
      });
    });

    // Sort donors by efficiency
    index.forEach(source => {
      source.donors.sort((a, b) => b.efficiency - a.efficiency);
      source.totalSources = source.donors.length;
    });

    return index;
  }, [items]);

  // Get all components with sorting
  const allComponents = useMemo(() => {
    const components = Array.from(componentIndex.values());

    switch (sortMode) {
      case 'alphabetical':
        return components.sort((a, b) => a.componentName.localeCompare(b.componentName));
      case 'efficiency':
        // Sort by best donor efficiency (highest first)
        return components.sort((a, b) => {
          const aMaxEff = Math.max(...a.donors.map(d => d.efficiency));
          const bMaxEff = Math.max(...b.donors.map(d => d.efficiency));
          return bMaxEff - aMaxEff;
        });
      case 'sources':
        // Sort by number of sources (most first)
        return components.sort((a, b) => b.totalSources - a.totalSources);
      default:
        return components;
    }
  }, [componentIndex, sortMode]);

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!searchQuery) return allComponents;

    const query = searchQuery.toLowerCase();
    return allComponents.filter(comp =>
      comp.componentName.toLowerCase().includes(query)
    );
  }, [allComponents, searchQuery]);

  // Get selected component details
  const selectedComponentData = selectedComponent
    ? componentIndex.get(selectedComponent)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
      {/* Component Sidebar */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex gap-1 p-1 bg-[var(--background)] border border-[var(--border)] rounded-lg">
          <button
            onClick={() => setSortMode('alphabetical')}
            className={`flex-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
              sortMode === 'alphabetical'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            A-Z
          </button>
          <button
            onClick={() => setSortMode('efficiency')}
            className={`flex-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
              sortMode === 'efficiency'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            Best
          </button>
          <button
            onClick={() => setSortMode('sources')}
            className={`flex-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
              sortMode === 'sources'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            Most
          </button>
        </div>

        {/* Component List */}
        <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
          {filteredComponents.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-muted)] text-xs">
              No components found
            </div>
          ) : (
            filteredComponents.map((component) => (
              <button
                key={component.componentName}
                onClick={() => setSelectedComponent(component.componentName)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all text-sm ${
                  selectedComponent === component.componentName
                    ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--text-primary)]'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-xs">
                      {component.componentName}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      {component.totalSources} source{component.totalSources !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <svg className="fill-amber-400 w-2.5 h-2.5" width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 4C47.464 4 60 16.536 60 32C60 47.464 47.464 60 32 60C16.536 60 4 47.464 4 32C4 16.536 16.536 4 32 4ZM31.333 12C20.6558 12.0002 12.0002 20.6558 12 31.333C12 42.0104 20.6557 50.6668 31.333 50.667C42.0105 50.667 50.667 42.0105 50.667 31.333C50.6668 20.6557 42.0104 12 31.333 12Z"></path>
                      <rect x="24" width="6" height="64"></rect>
                      <rect x="34.6667" width="6" height="64"></rect>
                    </svg>
                    <span className="text-[10px] text-amber-400 font-semibold">
                      {component.componentValue}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Details Panel */}
      <div className="lg:min-h-[600px]">
        {!selectedComponentData ? (
          <div className="card h-full flex items-center justify-center">
            <div className="text-center space-y-2 max-w-sm">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                Select a Component
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Choose any component from the list to see which items you should recycle to obtain it
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
                    {selectedComponentData.componentName}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <svg className="fill-amber-400 w-3.5 h-3.5" width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 4C47.464 4 60 16.536 60 32C60 47.464 47.464 60 32 60C16.536 60 4 47.464 4 32C4 16.536 16.536 4 32 4ZM31.333 12C20.6558 12.0002 12.0002 20.6558 12 31.333C12 42.0104 20.6557 50.6668 31.333 50.667C42.0105 50.667 50.667 42.0105 50.667 31.333C50.6668 20.6557 42.0104 12 31.333 12Z"></path>
                      <rect x="24" width="6" height="64"></rect>
                      <rect x="34.6667" width="6" height="64"></rect>
                    </svg>
                    <span className="text-sm text-amber-400 font-semibold">
                      {selectedComponentData.componentValue} each
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--accent)]">
                    {selectedComponentData.totalSources}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">
                    sources
                  </div>
                </div>
              </div>
            </div>

            {/* Donor List */}
            <div className="card">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">
                Best Items to Recycle
              </h3>
              <div className="space-y-2">
                {selectedComponentData.donors.map((donor, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border transition-all ${
                      idx === 0
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : idx === 1
                        ? 'bg-gray-400/5 border-gray-400/20'
                        : idx === 2
                        ? 'bg-orange-600/5 border-orange-600/20'
                        : 'bg-[var(--background)] border-[var(--border)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          idx === 0
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : idx === 1
                            ? 'bg-gray-400/20 text-gray-300 border border-gray-400/40'
                            : idx === 2
                            ? 'bg-orange-600/20 text-orange-400 border border-orange-600/40'
                            : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      {/* Image */}
                      {donor.image && (
                        <div className="w-10 h-10 rounded bg-[var(--background)] flex-shrink-0 overflow-hidden border border-[var(--border)]">
                          <img
                            src={donor.image}
                            alt={donor.itemName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[var(--text-primary)] text-sm truncate">
                          {donor.itemName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                          <span className="text-[var(--text-secondary)]">
                            Yields <span className="text-emerald-400 font-semibold">{donor.amount}x</span>
                          </span>
                          <span className="text-[var(--border)]">•</span>
                          <span className="text-[var(--text-secondary)]">
                            <span className="text-amber-400 font-semibold">{donor.itemValue.toLocaleString()}</span> coins
                          </span>
                        </div>
                      </div>

                      {/* Efficiency */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-emerald-400">
                          {(donor.efficiency * 1000).toFixed(1)}
                        </div>
                        <div className="text-[9px] text-[var(--text-muted)] uppercase">
                          per 1k
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="card bg-blue-500/5 border-blue-500/20">
              <div className="flex gap-2.5">
                <div className="text-xl">💡</div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-semibold text-blue-400">Efficiency Explained</div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    Higher efficiency = more {selectedComponentData.componentName} per coin spent.
                    Top items give you the best value when recycling for this specific component.
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
