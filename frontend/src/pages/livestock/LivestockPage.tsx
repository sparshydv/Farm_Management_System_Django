import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { livestock as api } from '../../services/api';
import type { Livestock } from '../../types';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function LivestockPage() {
  const [data, setData] = useState<Livestock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Livestock | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Livestock | null>(null);
  const [saving, setSaving] = useState(false);
  const empty = { Tag_number: '', Animal_type: '', Age: 0, Breed: '' };
  const [form, setForm] = useState(empty);

  const load = () => { api.list().then(setData).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (l: Livestock) => { setEditing(l); setForm({ Tag_number: l.Tag_number, Animal_type: l.Animal_type, Age: l.Age, Breed: l.Breed }); setModalOpen(true); };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault(); setSaving(true);
    try { if (editing) await api.update(editing.Tag_number, form); else await api.create(form); setModalOpen(false); load(); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setSaving(true);
    try { await api.delete(deleteTarget.Tag_number); setDeleteTarget(null); load(); } finally { setSaving(false); }
  };

  const filtered = data.filter(l => l.Animal_type.toLowerCase().includes(search.toLowerCase()) || l.Breed.toLowerCase().includes(search.toLowerCase()) || l.Tag_number.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-brand-dark">Livestock</h1><p className="text-gray-500 text-sm mt-1">{data.length} animals</p></div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Animal</button>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No livestock" message="Add your first animal." action={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Animal</button>} />
      ) : (<>
        <div className="relative mb-4"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" /></div>
        <div className="table-container"><table className="data-table"><thead><tr><th>Tag #</th><th>Type</th><th>Breed</th><th>Age</th><th className="text-right">Actions</th></tr></thead><tbody>
          {filtered.map(l => (
            <tr key={l.Tag_number}><td className="font-mono text-xs">{l.Tag_number}</td><td className="font-medium">{l.Animal_type}</td><td>{l.Breed}</td><td>{l.Age} yrs</td>
            <td className="text-right"><div className="flex justify-end gap-1">
              <Link to={`/livestock/${l.Tag_number}`} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal"><Eye size={15} /></Link>
              <button onClick={() => openEdit(l)} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal"><Pencil size={15} /></button>
              <button onClick={() => setDeleteTarget(l)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500"><Trash2 size={15} /></button>
            </div></td></tr>
          ))}
        </tbody></table></div>
      </>)}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Animal' : 'Add Animal'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="label">Tag Number</label><input value={form.Tag_number} onChange={e => setForm(f => ({ ...f, Tag_number: e.target.value }))} className="input-field" required disabled={!!editing} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Animal Type</label><input value={form.Animal_type} onChange={e => setForm(f => ({ ...f, Animal_type: e.target.value }))} className="input-field" required /></div>
            <div><label className="label">Breed</label><input value={form.Breed} onChange={e => setForm(f => ({ ...f, Breed: e.target.value }))} className="input-field" required /></div>
          </div>
          <div><label className="label">Age (years)</label><input type="number" value={form.Age || ''} onChange={e => setForm(f => ({ ...f, Age: +e.target.value }))} className="input-field" required /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} message={`Delete "${deleteTarget?.Tag_number}"?`} />
    </div>
  );
}
