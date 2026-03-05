import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { machinery as api } from '../../services/api';
import type { Machinery } from '../../types';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function MachineryPage() {
  const [data, setData] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Machinery | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Machinery | null>(null);
  const [saving, setSaving] = useState(false);
  const empty = { Number_plate: '', Equipment_name: '', Purchase_price: '', Purchase_date: '', Operation: '' };
  const [form, setForm] = useState(empty);

  const load = () => { api.list().then(setData).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (m: Machinery) => { setEditing(m); setForm({ Number_plate: m.Number_plate, Equipment_name: m.Equipment_name, Purchase_price: m.Purchase_price, Purchase_date: m.Purchase_date, Operation: m.Operation }); setModalOpen(true); };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault(); setSaving(true);
    try { if (editing) await api.update(editing.Number_plate, form); else await api.create(form); setModalOpen(false); load(); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setSaving(true);
    try { await api.delete(deleteTarget.Number_plate); setDeleteTarget(null); load(); } finally { setSaving(false); }
  };

  const filtered = data.filter(m => m.Equipment_name.toLowerCase().includes(search.toLowerCase()) || m.Number_plate.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-brand-dark">Machinery</h1><p className="text-gray-500 text-sm mt-1">{data.length} equipment</p></div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Equipment</button>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No machinery" message="Add your first equipment." action={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Equipment</button>} />
      ) : (<>
        <div className="relative mb-4"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" /></div>
        <div className="table-container"><table className="data-table"><thead><tr><th>Plate #</th><th>Name</th><th>Price</th><th>Purchased</th><th>Operation</th><th className="text-right">Actions</th></tr></thead><tbody>
          {filtered.map(m => (
            <tr key={m.Number_plate}><td className="font-mono text-xs">{m.Number_plate}</td><td className="font-medium">{m.Equipment_name}</td><td>${Number(m.Purchase_price).toLocaleString()}</td><td>{m.Purchase_date}</td><td className="text-gray-500 max-w-[150px] truncate">{m.Operation}</td>
            <td className="text-right"><div className="flex justify-end gap-1">
              <Link to={`/machinery/${encodeURIComponent(m.Number_plate)}`} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal"><Eye size={15} /></Link>
              <button onClick={() => openEdit(m)} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal"><Pencil size={15} /></button>
              <button onClick={() => setDeleteTarget(m)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500"><Trash2 size={15} /></button>
            </div></td></tr>
          ))}
        </tbody></table></div>
      </>)}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Equipment' : 'Add Equipment'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="label">Number Plate</label><input value={form.Number_plate} onChange={e => setForm(f => ({ ...f, Number_plate: e.target.value }))} className="input-field" required disabled={!!editing} /></div>
          <div><label className="label">Equipment Name</label><input value={form.Equipment_name} onChange={e => setForm(f => ({ ...f, Equipment_name: e.target.value }))} className="input-field" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Purchase Price</label><input type="number" step="0.01" value={form.Purchase_price} onChange={e => setForm(f => ({ ...f, Purchase_price: e.target.value }))} className="input-field" required /></div>
            <div><label className="label">Purchase Date</label><input type="date" value={form.Purchase_date} onChange={e => setForm(f => ({ ...f, Purchase_date: e.target.value }))} className="input-field" required /></div>
          </div>
          <div><label className="label">Operation</label><textarea value={form.Operation} onChange={e => setForm(f => ({ ...f, Operation: e.target.value }))} className="input-field" rows={2} /></div>
          <div className="flex gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button><button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} message={`Delete "${deleteTarget?.Equipment_name}"?`} />
    </div>
  );
}
