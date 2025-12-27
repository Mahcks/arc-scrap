import { Item, formatROI } from '@/lib/types';
import { CoinIcon, WeightIcon, ChartIcon, RecycleIcon, StoreIcon, AlertIcon, HammerIcon } from './icons';
import { formatComponentName } from '@/lib/recycling';

interface ItemCardProps {
  item: Item;
  showCategory?: boolean;
}

export default function ItemCard({ item, showCategory = false }: ItemCardProps) {
  const roi = item.roi ?? 0;
  const hasPositiveROI = roi > 0;
  const hasNegativeROI = roi < -20;

  // Get rarity glow effect
  const getRarityGlow = (rarity?: string) => {
    switch (rarity) {
      case 'common':
        return 'shadow-[0_0_12px_rgba(156,163,175,0.4)]';
      case 'uncommon':
        return 'shadow-[0_0_12px_rgba(34,197,94,0.5)]';
      case 'rare':
        return 'shadow-[0_0_12px_rgba(59,130,246,0.5)]';
      case 'epic':
        return 'shadow-[0_0_12px_rgba(168,85,247,0.5)]';
      case 'legendary':
        return 'shadow-[0_0_12px_rgba(249,115,22,0.6)]';
      default:
        return '';
    }
  };

  const getRarityBorder = (rarity?: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-500/40';
      case 'uncommon':
        return 'border-green-500/40';
      case 'rare':
        return 'border-blue-500/40';
      case 'epic':
        return 'border-purple-500/40';
      case 'legendary':
        return 'border-orange-500/40';
      default:
        return 'border-[var(--border)]';
    }
  };

  return (
    <div className="card card-hover group">
      <div className="flex gap-4">
        {/* Item Image with Rarity Glow */}
        {(item.image || item.imageFilename) && (
          <div className={`w-16 h-16 rounded-lg bg-[var(--background)] flex-shrink-0 overflow-hidden border ${getRarityBorder(item.rarity)} ${getRarityGlow(item.rarity)} transition-shadow`}>
            <img
              src={item.image || item.imageFilename}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)] truncate text-sm">
                {item.name}
              </h3>
              {showCategory && item.category && (
                <div className="flex items-center gap-1.5 mt-1">
                  {item.category === 'safe' && <span className="badge badge-success text-[10px]">Safe</span>}
                  {item.category === 'quests' && <span className="badge badge-warning text-[10px]">Quest</span>}
                  {item.category === 'expedition' && <span className="badge badge-info text-[10px]">Expedition</span>}
                </div>
              )}
            </div>

            {/* ROI Badge */}
            {roi !== 0 && (
              <div className={`badge text-[10px] font-bold ${
                hasPositiveROI ? 'badge-success' : hasNegativeROI ? 'badge-danger' : 'badge-neutral'
              }`}>
                {formatROI(roi)}
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {/* Value */}
            <div className="flex items-center gap-1.5">
              <CoinIcon className="text-amber-400 w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-[var(--text-secondary)]">{item.value.toLocaleString()}</span>
            </div>

            {/* Weight */}
            {(item.weight || item.weightKg) && (
              <div className="flex items-center gap-1.5">
                <WeightIcon className="text-[var(--text-muted)] w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-[var(--text-secondary)]">{item.weight || item.weightKg} kg</span>
              </div>
            )}

            {/* Value per Weight */}
            {item.valuePerWeight && (
              <div className="flex items-center gap-1.5">
                <ChartIcon className="text-[var(--text-muted)] w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-[var(--text-secondary)]">{item.valuePerWeight.toLocaleString()}/kg</span>
              </div>
            )}
          </div>

          {/* Action Label */}
          {roi !== 0 && (
            <div className="mt-2 text-[10px] text-[var(--text-muted)] flex items-center gap-1">
              {hasPositiveROI && <><RecycleIcon className="text-green-400 w-3 h-3 flex-shrink-0" /> Recycle for profit</>}
              {roi === 0 && 'No recycling data'}
              {roi < 0 && roi >= -20 && <><AlertIcon className="text-yellow-400 w-3 h-3 flex-shrink-0" /> Minor loss if recycled</>}
              {hasNegativeROI && <><StoreIcon className="text-red-400 w-3 h-3 flex-shrink-0" /> Sell instead</>}
            </div>
          )}

          {/* Recycling Info */}
          {item.recyclesInto && Object.keys(item.recyclesInto).length > 0 && (
            <div className="mt-2 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <RecycleIcon className="text-green-400 w-3 h-3 flex-shrink-0" />
                <span className="text-[10px] font-semibold text-green-400">Recycles Into</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(item.recyclesInto).map(([component, amount]) => (
                  <span key={component} className="text-[9px] px-1.5 py-0.5 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text-secondary)]">
                    {amount}x {formatComponentName(component)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Crafting Info */}
          {item.recipe && Object.keys(item.recipe).length > 0 && (
            <div className="mt-2 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <HammerIcon className="text-blue-400 w-3 h-3 flex-shrink-0" />
                <span className="text-[10px] font-semibold text-blue-400">Craftable</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(item.recipe).map(([component, amount]) => (
                  <span key={component} className="text-[9px] px-1.5 py-0.5 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text-secondary)]">
                    {amount}x {formatComponentName(component)}
                  </span>
                ))}
              </div>
              {item.craftBench && (
                <div className="text-[9px] text-[var(--text-muted)] mt-1">
                  at {(Array.isArray(item.craftBench) ? item.craftBench : [item.craftBench]).map(bench => bench.replace(/_/g, ' ')).join(', ')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
