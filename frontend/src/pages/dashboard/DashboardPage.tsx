import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Wheat, PawPrint, Tractor, Milk, Egg, ArrowRight } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { employees, crops, livestock, machinery, milkProduction, eggProduction } from '../../services/api';

interface Counts {
  employees: number;
  crops: number;
  livestock: number;
  machinery: number;
  milkRecords: number;
  eggRecords: number;
}

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      employees.list().then(d => d.length).catch(() => 0),
      crops.list().then(d => d.length).catch(() => 0),
      livestock.list().then(d => d.length).catch(() => 0),
      machinery.list().then(d => d.length).catch(() => 0),
      milkProduction.list().then(d => d.length).catch(() => 0),
      eggProduction.list().then(d => d.length).catch(() => 0),
    ]).then(([emp, crp, liv, mac, mlk, egg]) => {
      setCounts({ employees: emp, crops: crp, livestock: liv, machinery: mac, milkRecords: mlk, eggRecords: egg });
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: 'Employees', value: counts!.employees, icon: <Users size={22} />, color: 'teal' as const, to: '/employees' },
    { label: 'Crops', value: counts!.crops, icon: <Wheat size={22} />, color: 'emerald' as const, to: '/crops' },
    { label: 'Livestock', value: counts!.livestock, icon: <PawPrint size={22} />, color: 'amber' as const, to: '/livestock' },
    { label: 'Machinery', value: counts!.machinery, icon: <Tractor size={22} />, color: 'dark' as const, to: '/machinery' },
    { label: 'Milk Records', value: counts!.milkRecords, icon: <Milk size={22} />, color: 'teal' as const, to: '/milk-production' },
    { label: 'Egg Records', value: counts!.eggRecords, icon: <Egg size={22} />, color: 'emerald' as const, to: '/egg-production' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your farm operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {cards.map(c => (
          <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} color={c.color} />
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-brand-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map(c => (
            <Link
              key={c.to}
              to={c.to}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-brand-teal/30 hover:bg-brand-teal/5 transition-all group"
            >
              <span className="text-sm font-medium text-brand-dark">Manage {c.label}</span>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-brand-teal transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
