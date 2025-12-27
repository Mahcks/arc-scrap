import { Item, getROIColor, formatROI, getRecycleRecommendation, getRarityColor, getRarityLabel } from '@/lib/types';

interface ItemCardProps {
  item: Item;
  showCategory?: boolean;
}

export default function ItemCard({ item, showCategory = false }: ItemCardProps) {
  const recommendation = getRecycleRecommendation(item.roi);
  const roiColor = getROIColor(item.roi);

  const getCategoryInfo = (category?: string) => {
    switch (category) {
      case 'safe':
        return { label: 'Safe to Recycle', color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: '♻️' };
      case 'quests':
        return { label: 'Quest Item', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: '📋' };
      case 'expedition':
        return { label: 'Expedition', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: '🚀' };
      default:
        return { label: category || '', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: '' };
    }
  };

  const categoryInfo = getCategoryInfo(item.category);

  const rarityColor = getRarityColor(item.rarity);
  const rarityLabel = getRarityLabel(item.rarity);

  // Get rarity background gradient
  const getRarityGradient = (rarity?: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-600 to-gray-700';
      case 'uncommon':
        return 'from-green-600 to-green-700';
      case 'rare':
        return 'from-blue-600 to-blue-700';
      case 'epic':
        return 'from-purple-600 to-purple-700';
      case 'legendary':
        return 'from-orange-600 to-orange-700';
      default:
        return '';
    }
  };

  // Get rarity glow color for shadow
  const getRarityGlowColor = (rarity?: string) => {
    switch (rarity) {
      case 'common':
        return 'rgba(156, 163, 175, 0.5)';
      case 'uncommon':
        return 'rgba(34, 197, 94, 0.6)';
      case 'rare':
        return 'rgba(59, 130, 246, 0.6)';
      case 'epic':
        return 'rgba(168, 85, 247, 0.6)';
      case 'legendary':
        return 'rgba(249, 115, 22, 0.7)';
      default:
        return 'rgba(0, 0, 0, 0)';
    }
  };

  return (
    <div className="card hover:scale-[1.02] transition-all cursor-pointer group overflow-hidden relative">
      {/* Background gradient based on recommendation */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none ${
        recommendation.action === 'Sell' ? 'bg-gradient-to-br from-red-500 to-orange-500' :
        recommendation.action === 'Recycle' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
        'bg-gradient-to-br from-gray-500 to-gray-600'
      }`} />

      <div className="relative">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-3">
          {/* Item Image */}
          {item.image && (
            <div className="w-20 h-20 rounded-lg bg-[var(--background)] flex-shrink-0 relative overflow-visible">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Rarity border with glow */}
              {item.rarity && (
                <div
                  className={`absolute -inset-[3px] rounded-lg border-[3px] ${rarityColor} pointer-events-none`}
                  style={{
                    boxShadow: `0 0 16px ${getRarityGlowColor(item.rarity)}, 0 0 32px ${getRarityGlowColor(item.rarity).replace('0.6', '0.3')}`
                  }}
                />
              )}
              {/* Rarity badge */}
              {item.rarity && (
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold ${rarityColor} bg-[var(--card)] border-2 whitespace-nowrap`}>
                  {rarityLabel}
                </div>
              )}
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Title and category */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-bold text-lg text-white">{item.name}</h3>
              {showCategory && item.category && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${categoryInfo.color} flex items-center gap-1`}>
                  <span>{categoryInfo.icon}</span>
                  <span className="uppercase tracking-wide">{categoryInfo.label}</span>
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-1.5">
                <svg className="fill-yellow-400 size-3.5" width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 4C47.464 4 60 16.536 60 32C60 47.464 47.464 60 32 60C16.536 60 4 47.464 4 32C4 16.536 16.536 4 32 4ZM31.333 12C20.6558 12.0002 12.0002 20.6558 12 31.333C12 42.0104 20.6557 50.6668 31.333 50.667C42.0105 50.667 50.667 42.0105 50.667 31.333C50.6668 20.6557 42.0104 12 31.333 12Z"></path><rect x="24" width="6" height="64"></rect><rect x="34.6667" width="6" height="64"></rect></svg>
                <span className="font-semibold text-white">{item.value.toLocaleString()}</span>
                <span className="text-gray-500 text-xs">coins</span>
              </div>
              {item.weight && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">⚖️</span>
                  <span className="font-semibold text-white">{item.weight}</span>
                  <span className="text-gray-500 text-xs">kg</span>
                </div>
              )}
              {item.valuePerWeight && (
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-400">📊</span>
                  <span className="font-semibold text-white">{item.valuePerWeight.toLocaleString()}</span>
                  <span className="text-gray-500 text-xs">coins/kg</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROI Section - More prominent */}
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            {/* Left: Recommendation */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">{recommendation.emoji}</span>
              <div>
                <div className={`text-sm font-semibold ${recommendation.color}`}>
                  {recommendation.action}
                </div>
                <div className="text-xs text-gray-500">
                  {(item.roi ?? 0) > 0 && 'Recycling gives more value'}
                  {(item.roi ?? 0) === 0 && 'No recycling data'}
                  {(item.roi ?? 0) < 0 && (item.roi ?? 0) >= -20 && 'Slight loss if recycled'}
                  {(item.roi ?? 0) < -20 && 'Better to sell directly'}
                </div>
              </div>
            </div>

            {/* Right: ROI Value */}
            <div className="text-right">
              <div className={`text-3xl font-bold ${roiColor} leading-none`}>
                {formatROI(item.roi)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                ROI
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown section if there's recycling data */}
        {item.breaksInto && item.breaksInto.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
              ♻️ Breaks Into:
            </div>
            <div className="flex flex-wrap gap-2">
              {item.breaksInto.map((component, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1 bg-[var(--background)] rounded border border-[var(--border)] text-xs flex items-center gap-1.5"
                >
                  <span className="font-semibold text-white">{component.amount}x</span>
                  <span className="text-gray-400">{component.name}</span>
                  <span className="text-gray-600">•</span>
                  <svg className="fill-yellow-400 size-3" width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 4C47.464 4 60 16.536 60 32C60 47.464 47.464 60 32 60C16.536 60 4 47.464 4 32C4 16.536 16.536 4 32 4ZM31.333 12C20.6558 12.0002 12.0002 20.6558 12 31.333C12 42.0104 20.6557 50.6668 31.333 50.667C42.0105 50.667 50.667 42.0105 50.667 31.333C50.6668 20.6557 42.0104 12 31.333 12Z"></path><rect x="24" width="6" height="64"></rect><rect x="34.6667" width="6" height="64"></rect></svg>
                  <span className="text-yellow-400 font-semibold">{component.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
