import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { crops as cropsApi, cropExpenses, cropSales, cropOperations } from '../../services/api';
import type { Crop, CropExpense, CropSale, CropOperation } from '../../types';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

type Tab = 'expenses' | 'sales' | 'operations';

export default function CropDetailPage() {
  const { id } = useParams<{ id: string }>();
  const cid = Number(id);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [tab, setTab] = useState<Tab>('expenses');
  const [expenses, setExpenses] = useState<CropExpense[]>([]);
  const [sales, setSales] = useState<CropSale[]>([]);
  const [operations, setOperations] = useState<CropOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<Tab>('expenses');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: Tab; id: number } | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [expenseForm, setExpenseForm] = useState({ Expense_date: '', Expense_type: '', Expense_description: '', Budget: '', Expense_amount: '', Supplier: '', Payment_method: '', Receipt_number: '' });
  const [saleForm, setSaleForm] = useState({ Sale_date: '', Quantity_sold: '', Unit_price: '', Buyer_information: '', Payment_method: '', Payment_status: 'pending', Invoice_number: '', Additional_notes: '' });
  const [opForm, setOpForm] = useState({ Operation_date: '', Operation_name: '', Additional_notes: '' });

  const loadAll = async () => {
    setLoading(true);
    const [c, e, s, o] = await Promise.all([
      cropsApi.get(cid), cropExpenses.list(cid), cropSales.list(cid), cropOperations.list(cid),
    ]);
    setCrop(c); setExpenses(e); setSales(s); setOperations(o);
    setLoading(false);
  };
  useEffect(() => { loadAll(); }, [cid]);

  const openCreate = (type: Tab) => {
    setModalType(type); setEditingId(null);
    if (type === 'expenses') setExpenseForm({ Expense_date: '', Expense_type: '', Expense_description: '', Budget: '', Expense_amount: '', Supplier: '', Payment_method: '', Receipt_number: '' });
    if (type === 'sales') setSaleForm({ Sale_date: '', Quantity_sold: '', Unit_price: '', Buyer_information: '', Payment_method: '', Payment_status: 'pending', Invoice_number: '', Additional_notes: '' });
    if (type === 'operations') setOpForm({ Operation_date: '', Operation_name: '', Additional_notes: '' });
    setModalOpen(true);
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault(); setSaving(true);
    try {
      if (modalType === 'expenses') {
        if (editingId) await cropExpenses.update(cid, editingId, expenseForm);
        else await cropExpenses.create(cid, expenseForm);
      } else if (modalType === 'sales') {
        if (editingId) await cropSales.update(cid, editingId, saleForm);
        else await cropSales.create(cid, saleForm);
      } else {
        if (editingId) await cropOperations.update(cid, editingId, opForm);
        else await cropOperations.create(cid, opForm);
      }
      setModalOpen(false); loadAll();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setSaving(true);
    try {
      if (deleteTarget.type === 'expenses') await cropExpenses.delete(cid, deleteTarget.id);
      else if (deleteTarget.type === 'sales') await cropSales.delete(cid, deleteTarget.id);
      else await cropOperations.delete(cid, deleteTarget.id);
      setDeleteTarget(null); loadAll();
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!crop) return <p>Crop not found.</p>;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'expenses', label: 'Expenses', count: expenses.length },
    { key: 'sales', label: 'Sales', count: sales.length },
    { key: 'operations', label: 'Operations', count: operations.length },
  ];

  return (
    <div>
      <Link to="/crops" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-teal mb-4"><ArrowLeft size={16} /> Back to Crops</Link>
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">{crop.Crop_name} — {crop.Variety}</h1>
            <p className="text-gray-500 text-sm mt-1">Field: {crop.Field_name} · Planted: {crop.Planting_date}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-brand-teal text-white shadow' : 'text-gray-500 hover:text-brand-dark'}`}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={() => openCreate(tab)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add {tab === 'expenses' ? 'Expense' : tab === 'sales' ? 'Sale' : 'Operation'}</button>
      </div>

      {/* Tab content */}
      {tab === 'expenses' && (expenses.length === 0 ? <EmptyState title="No expenses" /> : (
        <div className="table-container"><table className="data-table"><thead><tr><th>Date</th><th>Type</th><th>Budget</th><th>Amount</th><th>Supplier</th><th>Payment</th><th className="text-right">Actions</th></tr></thead><tbody>
          {expenses.map(e => (<tr key={e.id}><td>{e.Expense_date}</td><td>{e.Expense_type}</td><td>${e.Budget}</td><td className="font-medium">${e.Expense_amount}</td><td>{e.Supplier}</td><td>{e.Payment_method}</td><td className="text-right"><div className="flex justify-end gap-1"><button onClick={() => { setModalType('expenses'); setEditingId(e.id); setExpenseForm({ Expense_date: e.Expense_date, Expense_type: e.Expense_type, Expense_description: e.Expense_description, Budget: e.Budget, Expense_amount: e.Expense_amount, Supplier: e.Supplier, Payment_method: e.Payment_method, Receipt_number: e.Receipt_number }); setModalOpen(true); }} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal"><Pencil size={14} /></button><button onClick={() => setDeleteTarget({ type: 'expenses', id: e.id })} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500"><Trash2 size={14} /></button></div></td></tr>))}
        </tbody></table></div>
      ))}

      {tab === 'sales' && (sales.length === 0 ? <EmptyState title="No sales" /> : (
        <div className="table-container"><table className="data-table"><thead><tr><th>Date</th><th>Qty</th><th>Unit Price</th><th>Total</th><th>Buyer</th><th>Status</th><th className="text-right">Actions</th></tr></thead><tbody>
          {sales.map(s => (<tr key={s.id}><td>{s.Sale_date}</td><td>{s.Quantity_sold}</td><td>${s.Unit_price}</td><td className="font-medium">${s.Total_price}</td><td>{s.Buyer_information}</td><td><span className={s.Payment_status === 'received' ? 'badge-success' : 'badge-warning'}>{s.Payment_status}</span></td><td className="text-right"><div className="flex justify-end gap-1"><button onClick={() => { setModalType('sales'); setEditingId(s.id); setSaleForm({ Sale_date: s.Sale_date, Quantity_sold: s.Quantity_sold, Unit_price: s.Unit_price, Buyer_information: s.Buyer_information, Payment_method: s.Payment_method, Payment_status: s.Payment_status, Invoice_number: s.Invoice_number, Additional_notes: s.Additional_notes }); setModalOpen(true); }} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal"><Pencil size={14} /></button><button onClick={() => setDeleteTarget({ type: 'sales', id: s.id })} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500"><Trash2 size={14} /></button></div></td></tr>))}
        </tbody></table></div>
      ))}

      {tab === 'operations' && (operations.length === 0 ? <EmptyState title="No operations" /> : (
        <div className="table-container"><table className="data-table"><thead><tr><th>Date</th><th>Operation</th><th>Notes</th><th className="text-right">Actions</th></tr></thead><tbody>
          {operations.map(o => (<tr key={o.id}><td>{o.Operation_date}</td><td className="font-medium">{o.Operation_name}</td><td className="text-gray-500">{o.Additional_notes}</td><td className="text-right"><div className="flex justify-end gap-1"><button onClick={() => { setModalType('operations'); setEditingId(o.id); setOpForm({ Operation_date: o.Operation_date, Operation_name: o.Operation_name, Additional_notes: o.Additional_notes }); setModalOpen(true); }} className="p-2 rounded-lg hover:bg-brand-teal/10 text-gray-500 hover:text-brand-teal"><Pencil size={14} /></button><button onClick={() => setDeleteTarget({ type: 'operations', id: o.id })} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500"><Trash2 size={14} /></button></div></td></tr>))}
        </tbody></table></div>
      ))}

      {/* Dynamic Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? `Edit ${modalType.slice(0, -1)}` : `Add ${modalType.slice(0, -1)}`} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {modalType === 'expenses' && <>
            <div className="grid grid-cols-2 gap-3"><div><label className="label">Date</label><input type="date" value={expenseForm.Expense_date} onChange={e => setExpenseForm(f => ({ ...f, Expense_date: e.target.value }))} className="input-field" required /></div><div><label className="label">Type</label><input value={expenseForm.Expense_type} onChange={e => setExpenseForm(f => ({ ...f, Expense_type: e.target.value }))} className="input-field" required /></div></div>
            <div><label className="label">Description</label><textarea value={expenseForm.Expense_description} onChange={e => setExpenseForm(f => ({ ...f, Expense_description: e.target.value }))} className="input-field" rows={2} /></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="label">Budget</label><input type="number" step="0.01" value={expenseForm.Budget} onChange={e => setExpenseForm(f => ({ ...f, Budget: e.target.value }))} className="input-field" /></div><div><label className="label">Amount</label><input type="number" step="0.01" value={expenseForm.Expense_amount} onChange={e => setExpenseForm(f => ({ ...f, Expense_amount: e.target.value }))} className="input-field" required /></div></div>
            <div className="grid grid-cols-3 gap-3"><div><label className="label">Supplier</label><input value={expenseForm.Supplier} onChange={e => setExpenseForm(f => ({ ...f, Supplier: e.target.value }))} className="input-field" /></div><div><label className="label">Payment</label><input value={expenseForm.Payment_method} onChange={e => setExpenseForm(f => ({ ...f, Payment_method: e.target.value }))} className="input-field" /></div><div><label className="label">Receipt #</label><input value={expenseForm.Receipt_number} onChange={e => setExpenseForm(f => ({ ...f, Receipt_number: e.target.value }))} className="input-field" /></div></div>
          </>}
          {modalType === 'sales' && <>
            <div className="grid grid-cols-2 gap-3"><div><label className="label">Date</label><input type="date" value={saleForm.Sale_date} onChange={e => setSaleForm(f => ({ ...f, Sale_date: e.target.value }))} className="input-field" required /></div><div><label className="label">Invoice #</label><input value={saleForm.Invoice_number} onChange={e => setSaleForm(f => ({ ...f, Invoice_number: e.target.value }))} className="input-field" /></div></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="label">Quantity</label><input value={saleForm.Quantity_sold} onChange={e => setSaleForm(f => ({ ...f, Quantity_sold: e.target.value }))} className="input-field" required /></div><div><label className="label">Unit Price</label><input type="number" step="0.01" value={saleForm.Unit_price} onChange={e => setSaleForm(f => ({ ...f, Unit_price: e.target.value }))} className="input-field" required /></div></div>
            <div><label className="label">Buyer Info</label><textarea value={saleForm.Buyer_information} onChange={e => setSaleForm(f => ({ ...f, Buyer_information: e.target.value }))} className="input-field" rows={2} /></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="label">Payment Method</label><input value={saleForm.Payment_method} onChange={e => setSaleForm(f => ({ ...f, Payment_method: e.target.value }))} className="input-field" /></div><div><label className="label">Status</label><select value={saleForm.Payment_status} onChange={e => setSaleForm(f => ({ ...f, Payment_status: e.target.value }))} className="input-field"><option value="pending">Pending</option><option value="received">Received</option></select></div></div>
            <div><label className="label">Notes</label><textarea value={saleForm.Additional_notes} onChange={e => setSaleForm(f => ({ ...f, Additional_notes: e.target.value }))} className="input-field" rows={2} /></div>
          </>}
          {modalType === 'operations' && <>
            <div className="grid grid-cols-2 gap-3"><div><label className="label">Date</label><input type="date" value={opForm.Operation_date} onChange={e => setOpForm(f => ({ ...f, Operation_date: e.target.value }))} className="input-field" required /></div><div><label className="label">Operation Name</label><input value={opForm.Operation_name} onChange={e => setOpForm(f => ({ ...f, Operation_name: e.target.value }))} className="input-field" required /></div></div>
            <div><label className="label">Notes</label><textarea value={opForm.Additional_notes} onChange={e => setOpForm(f => ({ ...f, Additional_notes: e.target.value }))} className="input-field" rows={3} /></div>
          </>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
