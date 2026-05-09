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
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [form, setForm] = useState({ name: '', contact: '', gst: '', category: '' });

  if (!isLoaded) return <div style={{padding:40}}>Loading...</div>;

  const handleAdd = () => {
    if (!form.name) return;
    addSupplier(form);
    setForm({ name: '', contact: '', gst: '', category: '' });
    setShowAdd(false);
  };

  const openWhatsApp = (supplier) => {
    setSelectedSupplier(supplier);
    setShowWhatsApp(true);
  };

  const sendWhatsApp = (template) => {
    if (!selectedSupplier || !selectedSupplier.contact) return;
    
    let text = '';
    if (template === 'quote') {
      text = `Hi ${selectedSupplier.name},\n\nWe are looking to place a new order. Can you please share your latest rates and availability?`;
    } else if (template === 'followup') {
      text = `Hi ${selectedSupplier.name},\n\nFollowing up on our pending delivery. Can you provide an ETA?`;
    } else if (template === 'payment') {
      text = `Hi ${selectedSupplier.name},\n\nThis is to confirm that the payment for the recent invoice has been processed.`;
    }
    
    const cleanNumber = selectedSupplier.contact.replace(/\D/g, '');
    const url = `https://wa.me/91${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShowWhatsApp(false);
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
              <thead><tr><th>Supplier</th><th>Category</th><th>Contact</th><th>GST</th><th>Total Spend</th><th>Since</th><th>Actions</th></tr></thead>
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
                    <td>
                      <button className="btn btn-sm btn-ghost" onClick={() => openWhatsApp(s)} style={{color:'var(--success)', display:'flex', alignItems:'center', gap:4, padding:'4px 8px'}}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                        WhatsApp
                      </button>
                    </td>
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
      <Modal isOpen={showWhatsApp} onClose={() => setShowWhatsApp(false)} title={`Message ${selectedSupplier?.name}`}>
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <p style={{fontSize:14, color:'var(--on-surface-variant)', marginBottom:8}}>Select a message template to generate a quick WhatsApp draft.</p>
          <button className="btn btn-secondary" style={{justifyContent:'flex-start', textAlign:'left', height:'auto', padding:'12px 16px'}} onClick={() => sendWhatsApp('quote')}>
            <span style={{display:'block', fontWeight:600}}>📦 Request Materials Quote</span>
            <span style={{display:'block', fontSize:12, color:'var(--on-surface-variant)', marginTop:4}}>Ask for latest rates and availability</span>
          </button>
          <button className="btn btn-secondary" style={{justifyContent:'flex-start', textAlign:'left', height:'auto', padding:'12px 16px'}} onClick={() => sendWhatsApp('followup')}>
            <span style={{display:'block', fontWeight:600}}>⏱ Follow-up on Delivery</span>
            <span style={{display:'block', fontSize:12, color:'var(--on-surface-variant)', marginTop:4}}>Ask for ETA on pending orders</span>
          </button>
          <button className="btn btn-secondary" style={{justifyContent:'flex-start', textAlign:'left', height:'auto', padding:'12px 16px'}} onClick={() => sendWhatsApp('payment')}>
            <span style={{display:'block', fontWeight:600}}>💸 Payment Confirmation</span>
            <span style={{display:'block', fontSize:12, color:'var(--on-surface-variant)', marginTop:4}}>Notify that an invoice was settled</span>
          </button>
        </div>
      </Modal>
      <InvoiceUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </>
  );
}
