'use client';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import Topbar from '@/components/Topbar';
import Modal from '@/components/Modal';
import InvoiceUploadModal from '@/components/InvoiceUploadModal';
import { formatCurrency } from '@/utils/calculations';

export default function SuppliersPage() {
  const { suppliers, addSupplier, isLoaded } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', gst: '', category: '' });

  if (!isLoaded) return <div style={{padding:40}}>Loading...</div>;

  const handleAdd = () => {
    if (!form.name) return;
    addSupplier(form);
    setForm({ name: '', contact: '', gst: '', category: '' });
    setShowAdd(false);
  };

  return (
    <>
      <Topbar onUploadClick={() => setShowUpload(true)} />
      <div className="page-content animate-in">
        <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div><h2>Suppliers</h2><p>Manage your vendor directory and track spending.</p></div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Supplier</button>
        </div>

        <div className="metrics-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          <div className="metric-card accent"><span className="metric-card-label">Total Suppliers</span><div className="metric-card-value">{suppliers.length}</div></div>
          <div className="metric-card"><span className="metric-card-label">Total Spend</span><div className="metric-card-value">{formatCurrency(suppliers.reduce((s,sup)=>s+sup.totalSpend,0))}</div></div>
          <div className="metric-card"><span className="metric-card-label">Avg Spend/Supplier</span><div className="metric-card-value">{formatCurrency(suppliers.reduce((s,sup)=>s+sup.totalSpend,0)/suppliers.length)}</div></div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">All Suppliers</h3></div>
          <div className="table-container">
            <table>
              <thead><tr><th>Supplier</th><th>Category</th><th>Contact</th><th>GST</th><th>Total Spend</th><th>Since</th></tr></thead>
              <tbody>
                {suppliers.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div className="supplier-avatar" style={{background:`hsl(${s.id*60},40%,45%)`,width:36,height:36,fontSize:13}}>{s.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
                        <span style={{fontWeight:600}}>{s.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-neutral">{s.category}</span></td>
                    <td>{s.contact}</td>
                    <td style={{fontSize:13,color:'var(--on-surface-variant)'}}>{s.gst || '—'}</td>
                    <td style={{fontWeight:600}}>{formatCurrency(s.totalSpend)}</td>
                    <td style={{fontSize:13,color:'var(--on-surface-variant)'}}>{new Date(s.created).toLocaleDateString('en-IN',{month:'short',year:'numeric'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Supplier">
        <div className="form-group"><label className="form-label">Supplier Name *</label><input className="form-input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. LoomTech Fabrics" /></div>
        <div className="form-group"><label className="form-label">Contact Number</label><input className="form-input" value={form.contact} onChange={e => setForm(p=>({...p,contact:e.target.value}))} placeholder="e.g. 9876543210" /></div>
        <div className="form-group"><label className="form-label">GST Number (optional)</label><input className="form-input" value={form.gst} onChange={e => setForm(p=>({...p,gst:e.target.value}))} placeholder="e.g. 29AABCT1332Q1ZS" /></div>
        <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))} placeholder="e.g. Raw Materials" /></div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd} disabled={!form.name}>Add Supplier</button>
        </div>
      </Modal>
      <InvoiceUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </>
  );
}
