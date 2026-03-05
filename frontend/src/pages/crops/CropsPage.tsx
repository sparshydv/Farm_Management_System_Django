import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Eye, CheckCircle, Clock } from 'lucide-react';
import { crops as api } from '../../services/api';
import type { Crop } from '../../types';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CropsPage() {
  const [data, setData] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Crop | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Crop | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const empty = { Cid: 0, Field_name: '', Field_description: '', Crop_name: '', Variety: '', Planting_date: '', Harvesting_date: '' };
  const [form, setForm] = useState(empty);

  const load = () => { api.list().then(setData).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(empty); setSaveError(''); setModalOpen(true); };
  const openEdit = (c: Crop) => {
    setEditing(c);
    setForm({ Cid: c.Cid, Field_name: c.Field_name, Field_description: c.Field_description, Crop_name: c.Crop_name, Variety: c.Variety, Planting_date: c.Planting_date, Harvesting_date: c.Harvesting_date || '' });
    setSaveError('');
    setModalOpen(true);
  };

  const formatError = (err: any) => {
    if (!err) return 'Failed to save crop.';
    if (typeof err.detail === 'string') return err.detail;
    const fieldErrors = Object.entries(err)
      .filter(([k, v]) => k !== 'status' && Array.isArray(v))
      .map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`);
    if (fieldErrors.length) return fieldErrors.join(' | ');
    return 'Failed to save crop.';
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      const body = { ...form, Harvesting_date: form.Harvesting_date || null };
      if (editing) await api.update(editing.Cid, body);
      else await api.create(body);
      setModalOpen(false); load();
    } catch (err: any) {
      setSaveError(formatError(err));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setSaving(true);
    try { await api.delete(deleteTarget.Cid); setDeleteTarget(null); load(); } finally { setSaving(false); }
  };

  const filtered = data.filter(c => c.Crop_name.toLowerCase().includes(search.toLowerCase()) || c.Field_name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-brand-dark">Crops</h1><p className="text-gray-500 text-sm mt-1">{data.length} total crops</p></div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Crop</button>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No crops" message="Start tracking your crops." action={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Crop</button>} />
      ) : (
        <>
          <div className="relative mb-4"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search crops..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(c => (
              <div key={c.Cid} className="card hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-brand-dark">{c.Crop_name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{c.Variety}</p>
                  </div>
                  {c.Is_harvested ? <span className="badge-success"><CheckCircle size={12} className="mr-1" />Harvested</span> : <span className="badge-warning"><Clock size={12} className="mr-1" />Growing</span>}
                </div>
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <p><span className="font-medium text-brand-dark">Field:</span> {c.Field_name}</p>
                  <p><span className="font-medium text-brand-dark">Planted:</span> {c.Planting_date}</p>
                  {c.Harvesting_date && <p><span className="font-medium text-brand-dark">Harvested:</span> {c.Harvesting_date}</p>}
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-50">
                  <Link to={`/crops/${c.Cid}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-brand-teal hover:bg-brand-teal/10 transition-colors"><Eye size={14} />View Details</Link>
                  <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-400 hover:text-brand-teal transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteTarget(c)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Crop' : 'Add Crop'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {saveError && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">{saveError}</div>}
          {!editing && <div><label className="label">Crop ID</label><input type="number" value={form.Cid || ''} onChange={e => setForm(f => ({ ...f, Cid: +e.target.value }))} className="input-field" required /></div>}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Crop Name</label><input value={form.Crop_name} onChange={e => setForm(f => ({ ...f, Crop_name: e.target.value }))} className="input-field" required /></div>
            <div><label className="label">Variety</label><input value={form.Variety} onChange={e => setForm(f => ({ ...f, Variety: e.target.value }))} className="input-field" required /></div>
          </div>
          <div><label className="label">Field Name</label><input value={form.Field_name} onChange={e => setForm(f => ({ ...f, Field_name: e.target.value }))} className="input-field" required /></div>
          <div><label className="label">Field Description</label><textarea value={form.Field_description} onChange={e => setForm(f => ({ ...f, Field_description: e.target.value }))} className="input-field" rows={2} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Planting Date</label><input type="date" value={form.Planting_date} onChange={e => setForm(f => ({ ...f, Planting_date: e.target.value }))} className="input-field" required /></div>
            <div><label className="label">Harvesting Date</label><input type="date" value={form.Harvesting_date} onChange={e => setForm(f => ({ ...f, Harvesting_date: e.target.value }))} className="input-field" /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Add Crop'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} message={`Delete crop "${deleteTarget?.Crop_name}"?`} />
    </div>
  );
}
