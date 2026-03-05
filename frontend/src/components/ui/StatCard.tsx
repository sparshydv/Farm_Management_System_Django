import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  color?: 'teal' | 'dark' | 'amber' | 'emerald';
}

const bgMap = {
  teal: 'bg-brand-teal/10 text-brand-teal',
  dark: 'bg-brand-dark/10 text-brand-dark',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
};

export default function StatCard({ label, value, icon, trend, color = 'teal' }: Props) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-xl ${bgMap[color]}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-brand-dark">{value}</p>
        {trend && <p className="text-xs text-brand-teal mt-1">{trend}</p>}
      </div>
    </div>
  );
}
