'use client';

interface FilterTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    count?: number;
    icon?: React.ComponentType<{ className?: string }>;
    description?: string;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'cards';
}

export default function FilterTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
}: FilterTabsProps) {
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-[var(--accent)]/10 border-[var(--accent)] shadow-lg'
                  : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)]'
              }`}
            >
              <div className="flex items-start gap-3">
                {Icon && (
                  <Icon
                    className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                      activeTab === tab.id ? 'text-[var(--accent)]' : 'text-gray-400'
                    }`}
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-semibold ${
                        activeTab === tab.id ? 'text-[var(--text-primary)]' : 'text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </span>
                    {tab.count !== undefined && (
                      <span
                        className={`text-sm font-medium px-2 py-0.5 rounded ${
                          activeTab === tab.id
                            ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                            : 'bg-[var(--background)] text-gray-400'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </div>
                  {tab.description && (
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {tab.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-blue-500 text-white'
              : 'bg-[var(--card)] text-gray-400 hover:text-white hover:bg-[var(--card-hover)]'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 text-xs opacity-75">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
