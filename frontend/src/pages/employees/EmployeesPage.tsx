import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { employees as api } from '../../services/api';
import type { Employee } from '../../types';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function EmployeesPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [form, setForm] = useState({ Eid: 0, Name: '', Country_code: '', Phone_number: '', Position: '', Salary: 0, Performance: '' });

  const load = () => { api.list().then(setData).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ Eid: 0, Name: '', Country_code: '', Phone_number: '', Position: '', Salary: 0, Performance: '' });
    setSaveError('');
    setModalOpen(true);
  };
  const openEdit = (e: Employee) => {
    setEditing(e);
    setForm({ Eid: e.Eid, Name: e.Name, Country_code: e.Country_code, Phone_number: e.Phone_number, Position: e.Position, Salary: e.Salary, Performance: e.Performance });
    setSaveError('');
    setModalOpen(true);
  };

  const formatError = (err: any) => {
    if (!err) return 'Failed to save employee.';
    if (typeof err.detail === 'string') return err.detail;
    const fieldErrors = Object.entries(err)
      .filter(([k, v]) => k !== 'status' && Array.isArray(v))
      .map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`);
    if (fieldErrors.length) return fieldErrors.join(' | ');
    return 'Failed to save employee.';
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      if (editing) { await api.update(editing.Eid, form); }
      else { await api.create(form); }
      setModalOpen(false);
      load();
    } catch (err: any) {
      setSaveError(formatError(err));
    }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try { await api.delete(deleteTarget.Eid); setDeleteTarget(null); load(); }
    finally { setSaving(false); }
  };

  const filtered = data.filter(e =>
    e.Name.toLowerCase().includes(search.toLowerCase()) ||
    e.Position.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Employees</h1>
          <p className="text-gray-500 text-sm mt-1">{data.length} total employees</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No employees" message="Add your first employee to get started." action={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Employee</button>} />
      ) : (
        <>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name or position..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead><tr>
                <th>ID</th><th>Name</th><th>Phone</th><th>Position</th><th>Salary</th><th>Performance</th><th className="text-right">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.Eid}>
                    <td className="font-mono text-xs">{e.Eid}</td>
                    <td className="font-medium">{e.Name}</td>
                    <td>{e.Country_code} {e.Phone_number}</td>
                    <td><span className="badge-info">{e.Position}</span></td>
                    <td className="font-medium">${e.Salary.toLocaleString()}</td>
                    <td><span className={e.Performance?.toLowerCase() === 'good' ? 'badge-success' : 'badge-warning'}>{e.Performance}</span></td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(e)} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteTarget(e)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={handleSave} className="space-y-4">
          {saveError && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">{saveError}</div>}
          {!editing && <div><label className="label">Employee ID</label><input type="number" value={form.Eid || ''} onChange={e => setForm(f => ({ ...f, Eid: +e.target.value }))} className="input-field" required /></div>}
          <div><label className="label">Name</label><input value={form.Name} onChange={e => setForm(f => ({ ...f, Name: e.target.value }))} className="input-field" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Country Code</label><input value={form.Country_code} onChange={e => setForm(f => ({ ...f, Country_code: e.target.value }))} className="input-field" placeholder="+1" required /></div>
            <div><label className="label">Phone</label><input value={form.Phone_number} onChange={e => setForm(f => ({ ...f, Phone_number: e.target.value }))} className="input-field" inputMode="numeric" pattern="[0-9]{10}" minLength={10} maxLength={10} title="Enter exactly 10 digits" required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Position</label><input value={form.Position} onChange={e => setForm(f => ({ ...f, Position: e.target.value }))} className="input-field" required /></div>
            <div><label className="label">Salary</label><input type="number" value={form.Salary || ''} onChange={e => setForm(f => ({ ...f, Salary: +e.target.value }))} className="input-field" required /></div>
          </div>
          <div><label className="label">Performance</label><select value={form.Performance} onChange={e => setForm(f => ({ ...f, Performance: e.target.value }))} className="input-field"><option value="">Select</option><option>Excellent</option><option>Good</option><option>Average</option><option>Poor</option></select></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Add Employee'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} message={`Delete employee "${deleteTarget?.Name}"?`} />
    </div>
  );
}
