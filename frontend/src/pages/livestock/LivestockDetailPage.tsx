import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { livestock as lApi, livestockProduction } from '../../services/api';
import type { Livestock, LivestockProduction } from '../../types';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function LivestockDetailPage() {
  const { tag } = useParams<{ tag: string }>();
  const [animal, setAnimal] = useState<Livestock | null>(null);
  const [prods, setProds] = useState<LivestockProduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ Production_date: '', Production_amount: '', Feed_consumed: '', Comments: '' });

  const loadAll = async () => {
    if (!tag) return;
    setLoading(true);
    const [a, p] = await Promise.all([lApi.get(tag), livestockProduction.list(tag)]);
    setAnimal(a); setProds(p); setLoading(false);
  };
  useEffect(() => { loadAll(); }, [tag]);

  const openCreate = () => { setEditingId(null); setForm({ Production_date: '', Production_amount: '', Feed_consumed: '', Comments: '' }); setModalOpen(true); };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault(); setSaving(true);
    try {
      if (editingId) await livestockProduction.update(tag!, editingId, form);
      else await livestockProduction.create(tag!, form);
      setModalOpen(false); loadAll();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setSaving(true);
    try { await livestockProduction.delete(tag!, deleteId); setDeleteId(null); loadAll(); } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!animal) return <p>Animal not found.</p>;

  return (
    <div>
      <Link to="/livestock" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-teal mb-4"><ArrowLeft size={16} /> Back to Livestock</Link>
      <div className="card mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">{animal.Animal_type} — {animal.Breed}</h1>
        <p className="text-gray-500 text-sm mt-1">Tag: {animal.Tag_number} · Age: {animal.Age} years</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-brand-dark">Production Records ({prods.length})</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Record</button>
      </div>

      {prods.length === 0 ? <EmptyState title="No production records" /> : (
        <div className="table-container"><table className="data-table"><thead><tr><th>Date</th><th>Amount</th><th>Feed (kg)</th><th>Comments</th><th className="text-right">Actions</th></tr></thead><tbody>
          {prods.map(p => (
            <tr key={p.id}><td>{p.Production_date}</td><td className="font-medium">{p.Production_amount}</td><td>{p.Feed_consumed}</td><td className="text-gray-500 max-w-[200px] truncate">{p.Comments}</td>
            <td className="text-right"><div className="flex justify-end gap-1">
              <button onClick={() => { setEditingId(p.id); setForm({ Production_date: p.Production_date, Production_amount: p.Production_amount, Feed_consumed: p.Feed_consumed, Comments: p.Comments || '' }); setModalOpen(true); }} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal"><Pencil size={14} /></button>
              <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
            </div></td></tr>
          ))}
        </tbody></table></div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Record' : 'Add Record'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="label">Date</label><input type="date" value={form.Production_date} onChange={e => setForm(f => ({ ...f, Production_date: e.target.value }))} className="input-field" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Amount</label><input value={form.Production_amount} onChange={e => setForm(f => ({ ...f, Production_amount: e.target.value }))} className="input-field" required /></div>
            <div><label className="label">Feed Consumed (kg)</label><input type="number" step="0.01" value={form.Feed_consumed} onChange={e => setForm(f => ({ ...f, Feed_consumed: e.target.value }))} className="input-field" required /></div>
          </div>
          <div><label className="label">Comments</label><textarea value={form.Comments} onChange={e => setForm(f => ({ ...f, Comments: e.target.value }))} className="input-field" rows={3} /></div>
          <div className="flex gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button><button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
