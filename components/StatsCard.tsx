interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

export default function StatsCard({ label, value, icon, color = 'text-blue-400' }: StatsCardProps) {
  return (
    <div className="card text-center">
      <div className={`text-3xl mb-2 ${color}`}>{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
