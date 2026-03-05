import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { machinery as mApi, machineryActivities, machineryMaintenance } from '../../services/api';
import type { Machinery, MachineryActivity, MachineryMaintenance } from '../../types';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

type Tab = 'activities' | 'maintenance';

export default function MachineryDetailPage() {
  const { plate } = useParams<{ plate: string }>();
  const np = decodeURIComponent(plate || '');
  const [machine, setMachine] = useState<Machinery | null>(null);
  const [tab, setTab] = useState<Tab>('activities');
  const [activities, setActivities] = useState<MachineryActivity[]>([]);
  const [maintenance, setMaintenance] = useState<MachineryMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<Tab>('activities');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: Tab; id: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const [actForm, setActForm] = useState({ Activity_date: '', Activity_type: '', Activity_cost: 0, Description: '' });
  const [maintForm, setMaintForm] = useState({ Date: '', Machinery_part: '', Technician_details: '', Cost: 0, Description: '' });

  const loadAll = async () => {
    setLoading(true);
    const [m, a, mt] = await Promise.all([mApi.get(np), machineryActivities.list(np), machineryMaintenance.list(np)]);
    setMachine(m); setActivities(a); setMaintenance(mt); setLoading(false);
  };
  useEffect(() => { loadAll(); }, [np]);

  const openCreate = (type: Tab) => {
    setModalType(type); setEditingId(null);
    if (type === 'activities') setActForm({ Activity_date: '', Activity_type: '', Activity_cost: 0, Description: '' });
    else setMaintForm({ Date: '', Machinery_part: '', Technician_details: '', Cost: 0, Description: '' });
    setModalOpen(true);
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault(); setSaving(true);
    try {
      if (modalType === 'activities') {
        if (editingId) await machineryActivities.update(np, editingId, actForm);
        else await machineryActivities.create(np, actForm);
      } else {
        if (editingId) await machineryMaintenance.update(np, editingId, maintForm);
        else await machineryMaintenance.create(np, maintForm);
      }
      setModalOpen(false); loadAll();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setSaving(true);
    try {
      if (deleteTarget.type === 'activities') await machineryActivities.delete(np, deleteTarget.id);
      else await machineryMaintenance.delete(np, deleteTarget.id);
      setDeleteTarget(null); loadAll();
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!machine) return <p>Machine not found.</p>;

  const tabs = [
    { key: 'activities' as Tab, label: 'Activities', count: activities.length },
    { key: 'maintenance' as Tab, label: 'Maintenance', count: maintenance.length },
  ];

  return (
    <div>
      <Link to="/machinery" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-teal mb-4"><ArrowLeft size={16} /> Back to Machinery</Link>
      <div className="card mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">{machine.Equipment_name}</h1>
        <p className="text-gray-500 text-sm mt-1">Plate: {machine.Number_plate} · Purchased: {machine.Purchase_date} · ${Number(machine.Purchase_price).toLocaleString()}</p>
      </div>

      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-brand-teal text-white shadow' : 'text-gray-500 hover:text-brand-dark'}`}>{t.label} ({t.count})</button>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={() => openCreate(tab)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add {tab === 'activities' ? 'Activity' : 'Maintenance'}</button>
      </div>

      {tab === 'activities' && (activities.length === 0 ? <EmptyState title="No activities" /> : (
        <div className="table-container"><table className="data-table"><thead><tr><th>Date</th><th>Type</th><th>Cost</th><th>Description</th><th className="text-right">Actions</th></tr></thead><tbody>
          {activities.map(a => (<tr key={a.id}><td>{a.Activity_date}</td><td className="font-medium">{a.Activity_type}</td><td>${a.Activity_cost.toLocaleString()}</td><td className="text-gray-500 max-w-[200px] truncate">{a.Description}</td>
          <td className="text-right"><div className="flex justify-end gap-1">
            <button onClick={() => { setModalType('activities'); setEditingId(a.id); setActForm({ Activity_date: a.Activity_date, Activity_type: a.Activity_type, Activity_cost: a.Activity_cost, Description: a.Description }); setModalOpen(true); }} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal"><Pencil size={14} /></button>
            <button onClick={() => setDeleteTarget({ type: 'activities', id: a.id })} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
          </div></td></tr>))}
        </tbody></table></div>
      ))}

      {tab === 'maintenance' && (maintenance.length === 0 ? <EmptyState title="No maintenance records" /> : (
        <div className="table-container"><table className="data-table"><thead><tr><th>Date</th><th>Part</th><th>Technician</th><th>Cost</th><th className="text-right">Actions</th></tr></thead><tbody>
          {maintenance.map(m => (<tr key={m.id}><td>{m.Date}</td><td className="font-medium">{m.Machinery_part}</td><td>{m.Technician_details}</td><td>${m.Cost.toLocaleString()}</td>
          <td className="text-right"><div className="flex justify-end gap-1">
            <button onClick={() => { setModalType('maintenance'); setEditingId(m.id); setMaintForm({ Date: m.Date, Machinery_part: m.Machinery_part, Technician_details: m.Technician_details, Cost: m.Cost, Description: m.Description }); setModalOpen(true); }} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal"><Pencil size={14} /></button>
            <button onClick={() => setDeleteTarget({ type: 'maintenance', id: m.id })} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
          </div></td></tr>))}
        </tbody></table></div>
      ))}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit' : 'Add'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {modalType === 'activities' && <>
            <div className="grid grid-cols-2 gap-3"><div><label className="label">Date</label><input type="date" value={actForm.Activity_date} onChange={e => setActForm(f => ({ ...f, Activity_date: e.target.value }))} className="input-field" required /></div><div><label className="label">Type</label><input value={actForm.Activity_type} onChange={e => setActForm(f => ({ ...f, Activity_type: e.target.value }))} className="input-field" required /></div></div>
            <div><label className="label">Cost</label><input type="number" value={actForm.Activity_cost || ''} onChange={e => setActForm(f => ({ ...f, Activity_cost: +e.target.value }))} className="input-field" required /></div>
            <div><label className="label">Description</label><textarea value={actForm.Description} onChange={e => setActForm(f => ({ ...f, Description: e.target.value }))} className="input-field" rows={3} /></div>
          </>}
          {modalType === 'maintenance' && <>
            <div className="grid grid-cols-2 gap-3"><div><label className="label">Date</label><input type="date" value={maintForm.Date} onChange={e => setMaintForm(f => ({ ...f, Date: e.target.value }))} className="input-field" required /></div><div><label className="label">Part</label><input value={maintForm.Machinery_part} onChange={e => setMaintForm(f => ({ ...f, Machinery_part: e.target.value }))} className="input-field" required /></div></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="label">Technician</label><input value={maintForm.Technician_details} onChange={e => setMaintForm(f => ({ ...f, Technician_details: e.target.value }))} className="input-field" /></div><div><label className="label">Cost</label><input type="number" value={maintForm.Cost || ''} onChange={e => setMaintForm(f => ({ ...f, Cost: +e.target.value }))} className="input-field" required /></div></div>
            <div><label className="label">Description</label><textarea value={maintForm.Description} onChange={e => setMaintForm(f => ({ ...f, Description: e.target.value }))} className="input-field" rows={3} required /></div>
          </>}
          <div className="flex gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button><button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
