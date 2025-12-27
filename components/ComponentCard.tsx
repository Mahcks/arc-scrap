import { Component } from '@/lib/types';

interface ComponentCardProps {
  component: Component;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const priorityColors = {
    essential: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    priority: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'high-tier': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    other: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{component.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">💰 {component.value}</span>
            <span
              className={`px-2 py-0.5 rounded text-xs border ${
                priorityColors[component.priority]
              }`}
            >
              {component.priority}
            </span>
          </div>
        </div>
      </div>

      {component.bestDonors && component.bestDonors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Best Donors:</h4>
          {component.bestDonors.map((donor, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-[var(--background)] rounded border border-[var(--border)]"
            >
              <span className="text-sm">{donor.item}</span>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400">💰 {donor.value}</span>
                <span className="text-green-400 font-medium">
                  +{donor.yield} {component.name.includes('Parts') ? 'parts' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
