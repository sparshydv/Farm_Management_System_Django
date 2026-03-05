import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { eggProduction as api } from '../../services/api';
import type { EggProduction } from '../../types';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function EggProductionPage() {
  const [data, setData] = useState<EggProduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EggProduction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EggProduction | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [showChart, setShowChart] = useState(true);

  const empty = {
    Year: '', Month: '', Day: '', Poultry_number: '',
    Morning_egg_collection: '', Midday_egg_collection: '', Evening_egg_collection: '',
    Morning_feeds: '', Evening_feeds: '', Comments: '',
  };
  const [form, setForm] = useState(empty);

  const load = () => { api.list().then(setData).finally(() => setLoading(false)); };
  useEffect(load, []);

  const years = [...new Set(data.map(d => d.Year))].sort();
  const months = [...new Set(data.map(d => d.Month))].sort((a, b) => a - b);

  const filtered = data.filter(d => {
    if (filterYear && String(d.Year) !== filterYear) return false;
    if (filterMonth && String(d.Month) !== filterMonth) return false;
    return true;
  });

  const chartData = filtered.map(d => ({
    day: `Day ${d.Day}`,
    eggs: parseFloat(d.Total_egg_collection),
    feeds: parseFloat(d.Total_feeds),
  })).sort((a, b) => parseInt(a.day.replace('Day ', '')) - parseInt(b.day.replace('Day ', '')));

  const totalEggs = filtered.reduce((s, d) => s + parseFloat(d.Total_egg_collection), 0);
  const totalFeeds = filtered.reduce((s, d) => s + parseFloat(d.Total_feeds), 0);
  const totalRecords = filtered.length;
  const totalPoultry = new Set(filtered.map(d => d.Poultry_number)).size;

  const monthName = (m: number) => ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m] || m;

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (r: EggProduction) => {
    setEditing(r);
    setForm({
      Year: String(r.Year), Month: String(r.Month), Day: String(r.Day),
      Poultry_number: String(r.Poultry_number),
      Morning_egg_collection: r.Morning_egg_collection, Midday_egg_collection: r.Midday_egg_collection,
      Evening_egg_collection: r.Evening_egg_collection,
      Morning_feeds: r.Morning_feeds, Evening_feeds: r.Evening_feeds,
      Comments: r.Comments || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault(); setSaving(true);
    const payload = {
      Year: Number(form.Year), Month: Number(form.Month), Day: Number(form.Day),
      Poultry_number: Number(form.Poultry_number),
      Morning_egg_collection: form.Morning_egg_collection || '0',
      Midday_egg_collection: form.Midday_egg_collection || '0',
      Evening_egg_collection: form.Evening_egg_collection || '0',
      Morning_feeds: form.Morning_feeds || '0', Evening_feeds: form.Evening_feeds || '0',
      Comments: form.Comments || null,
    };
    try { if (editing) await api.update(editing.id, payload); else await api.create(payload); setModalOpen(false); load(); } finally { setSaving(false); }
  };

  const handleDelete = async () => { if (!deleteTarget) return; setSaving(true); try { await api.delete(deleteTarget.id); setDeleteTarget(null); load(); } finally { setSaving(false); } };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-brand-dark">Egg Production</h1><p className="text-gray-500 text-sm mt-1">{data.length} records</p></div>
        <div className="flex gap-2">
          <button onClick={() => setShowChart(!showChart)} className="btn-ghost flex items-center gap-2"><BarChart3 size={16} /> {showChart ? 'Hide' : 'Show'} Chart</button>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Record</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center"><p className="text-xs text-gray-500 mb-1">Total Eggs</p><p className="text-xl font-bold text-brand-teal">{totalEggs.toFixed(0)}</p></div>
        <div className="card text-center"><p className="text-xs text-gray-500 mb-1">Total Feeds</p><p className="text-xl font-bold text-brand-dark">{totalFeeds.toFixed(1)} kg</p></div>
        <div className="card text-center"><p className="text-xs text-gray-500 mb-1">Records</p><p className="text-xl font-bold text-brand-dark">{totalRecords}</p></div>
        <div className="card text-center"><p className="text-xs text-gray-500 mb-1">Poultry #s</p><p className="text-xl font-bold text-brand-dark">{totalPoultry}</p></div>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="input-field w-auto"><option value="">All Years</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="input-field w-auto"><option value="">All Months</option>{months.map(m => <option key={m} value={m}>{monthName(m)}</option>)}</select>
      </div>

      {showChart && chartData.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-sm font-semibold text-brand-dark mb-3">Daily Egg Collection vs Feed</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E3E3" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }} />
              <Legend />
              <Bar dataKey="eggs" fill="#69B7AF" radius={[4, 4, 0, 0]} name="Eggs Collected" />
              <Bar dataKey="feeds" fill="#242726" radius={[4, 4, 0, 0]} name="Feed (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {filtered.length === 0 ? <EmptyState title="No records" message="Add an egg production record." /> : (
        <div className="table-container"><table className="data-table"><thead><tr><th>Year</th><th>Month</th><th>Day</th><th>Poultry #</th><th>Morning</th><th>Midday</th><th>Evening</th><th>Total Eggs</th><th>Total Feed</th><th className="text-right">Actions</th></tr></thead><tbody>
          {filtered.map(r => (<tr key={r.id}><td>{r.Year}</td><td>{monthName(r.Month)}</td><td>{r.Day}</td><td>{r.Poultry_number}</td><td>{r.Morning_egg_collection}</td><td>{r.Midday_egg_collection}</td><td>{r.Evening_egg_collection}</td><td className="font-semibold text-brand-teal">{r.Total_egg_collection}</td><td>{r.Total_feeds}</td>
          <td className="text-right"><div className="flex justify-end gap-1">
            <button onClick={() => openEdit(r)} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal"><Pencil size={14} /></button>
            <button onClick={() => setDeleteTarget(r)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
          </div></td></tr>))}
        </tbody></table></div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Record' : 'Add Record'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div><label className="label">Year</label><input type="number" value={form.Year} onChange={e => setForm(f => ({ ...f, Year: e.target.value }))} className="input-field" required placeholder="2024" /></div>
            <div><label className="label">Month (1-12)</label><input type="number" min={1} max={12} value={form.Month} onChange={e => setForm(f => ({ ...f, Month: e.target.value }))} className="input-field" required /></div>
            <div><label className="label">Day</label><input type="number" min={1} max={31} value={form.Day} onChange={e => setForm(f => ({ ...f, Day: e.target.value }))} className="input-field" required /></div>
            <div><label className="label">Poultry #</label><input type="number" value={form.Poultry_number} onChange={e => setForm(f => ({ ...f, Poultry_number: e.target.value }))} className="input-field" required /></div>
          </div>
          <p className="text-xs text-gray-500 font-semibold">Egg Collection</p>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Morning</label><input type="number" step="0.01" value={form.Morning_egg_collection} onChange={e => setForm(f => ({ ...f, Morning_egg_collection: e.target.value }))} className="input-field" required /></div>
            <div><label className="label">Midday</label><input type="number" step="0.01" value={form.Midday_egg_collection} onChange={e => setForm(f => ({ ...f, Midday_egg_collection: e.target.value }))} className="input-field" /></div>
            <div><label className="label">Evening</label><input type="number" step="0.01" value={form.Evening_egg_collection} onChange={e => setForm(f => ({ ...f, Evening_egg_collection: e.target.value }))} className="input-field" /></div>
          </div>
          <p className="text-xs text-gray-500 font-semibold">Feeds (kg)</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Morning</label><input type="number" step="0.01" value={form.Morning_feeds} onChange={e => setForm(f => ({ ...f, Morning_feeds: e.target.value }))} className="input-field" required /></div>
            <div><label className="label">Evening</label><input type="number" step="0.01" value={form.Evening_feeds} onChange={e => setForm(f => ({ ...f, Evening_feeds: e.target.value }))} className="input-field" /></div>
          </div>
          <div><label className="label">Comments</label><textarea value={form.Comments} onChange={e => setForm(f => ({ ...f, Comments: e.target.value }))} className="input-field" rows={2} /></div>
          <div className="flex gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button><button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
