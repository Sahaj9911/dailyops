'use client';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import Topbar from '@/components/Topbar';
import InvoiceUploadModal from '@/components/InvoiceUploadModal';
import { formatCurrency } from '@/utils/calculations';

export default function PurchasesPage() {
  const { purchases, updatePurchase, isLoaded } = useData();
  const [showUpload, setShowUpload] = useState(false);
  const [filter, setFilter] = useState('all');

  if (!isLoaded) return <div style={{padding:40}}>Loading...</div>;

  // Map legacy statuses to new ones and sort by ID descending (newest uploaded first)
  const normalizedPurchases = purchases.map(p => ({
    ...p,
    status: p.status === 'approved' ? 'settled' : p.status === 'pending' ? 'unsettled' : p.status
  }));
  const sorted = [...normalizedPurchases].sort((a, b) => b.id - a.id);
  const filtered = filter === 'all' ? sorted : sorted.filter(p => p.status === filter);

  return (
    <>
      <Topbar onUploadClick={() => setShowUpload(true)} />
      <div className="page-content animate-in">
        <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <h2>Purchase Management</h2>
            <p>Manage invoices, suppliers, and expense categorization.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Invoice
          </button>
        </div>

        {/* Summary cards */}
        <div className="metrics-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
          <div className="metric-card accent">
            <span className="metric-card-label">Total Purchases</span>
            <div className="metric-card-value">{purchases.length}</div>
          </div>
          <div className="metric-card">
            <span className="metric-card-label">Total Amount (Settled)</span>
            <div className="metric-card-value">{formatCurrency(normalizedPurchases.filter(p => p.status === 'settled').reduce((s,p) => s+p.amount, 0))}</div>
          </div>
          <div className="metric-card">
            <span className="metric-card-label">GST Paid (Settled)</span>
            <div className="metric-card-value">{formatCurrency(normalizedPurchases.filter(p => p.status === 'settled').reduce((s,p) => s+(p.gst||0), 0))}</div>
          </div>
          <div className="metric-card">
            <span className="metric-card-label">Unsettled Invoices</span>
            <div className="metric-card-value">{normalizedPurchases.filter(p => p.status==='unsettled').length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">All Invoices</h3>
            <div style={{display:'flex',gap:4}}>
              {['all','settled','unsettled'].map(f => (
                <button key={f} className={`btn btn-sm ${filter===f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th><th>Supplier</th><th>Date</th>
                  <th>Amount</th><th>GST</th><th>Category</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{fontWeight:600}}>{p.invoiceNo}</td>
                    <td>{p.supplier}</td>
                    <td>{new Date(p.date).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</td>
                    <td style={{fontWeight:600}}>{formatCurrency(p.amount)}</td>
                    <td>{formatCurrency(p.gst)}</td>
                    <td><span className="badge badge-neutral">{p.category}</span></td>
                    <td>
                      <span 
                        className={`badge ${p.status==='settled'?'badge-success':'badge-warning'}`} 
                        style={{cursor:'pointer'}} 
                        onClick={() => updatePurchase(p.id, { status: p.status === 'settled' ? 'unsettled' : 'settled' })}
                        title="Click to toggle status"
                      >
                        {p.status==='settled'?'Settled':'Unsettled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <InvoiceUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </>
  );
}
