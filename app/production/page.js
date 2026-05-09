'use client';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import Topbar from '@/components/Topbar';
import Modal from '@/components/Modal';
import InvoiceUploadModal from '@/components/InvoiceUploadModal';
import { formatCurrency, calcUnitEconomics } from '@/utils/calculations';

export default function ProductionPage() {
  const { batches, addBatch, updateBatch, isLoaded } = useData();
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showNewBatch, setShowNewBatch] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [newBatch, setNewBatch] = useState({ name:'', product:'', qty:0, stage:'planned', materials:{fabric:0,hardware:0,labor:0}, targetPrice:0 });

  if (!isLoaded) return <div style={{padding:40}}>Loading...</div>;

  const planned = batches.filter(b => b.stage === 'planned');
  const inProduction = batches.filter(b => b.stage === 'in-production');
  const completed = batches.filter(b => b.stage === 'completed');
  const selected = selectedBatch ? batches.find(b => b.id === selectedBatch) : null;
  const economics = selected ? calcUnitEconomics(selected) : null;

  const handleAddBatch = () => {
    addBatch({ ...newBatch, margin: newBatch.targetPrice > 0 ? (((newBatch.targetPrice - newBatch.materials.fabric - newBatch.materials.hardware - newBatch.materials.labor) / newBatch.targetPrice) * 100).toFixed(1) : 0 });
    setNewBatch({ name:'', product:'', qty:0, stage:'planned', materials:{fabric:0,hardware:0,labor:0}, targetPrice:0 });
    setShowNewBatch(false);
  };

  const columns = [
    { title: 'Planned', items: planned, dot: 'planned' },
    { title: 'In Production', items: inProduction, dot: 'in-production' },
    { title: 'Completed', items: completed, dot: 'completed' },
  ];

  return (
    <>
      <Topbar onUploadClick={() => setShowUpload(true)} />
      <div className="page-content animate-in">
        <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div><h2>Production Pipeline</h2><p>Manage active batches and monitor unit economics.</p></div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-secondary btn-sm">⚙ Filter</button>
            <button className="btn btn-primary" onClick={() => setShowNewBatch(true)}>+ New Batch</button>
          </div>
        </div>

        <div className="production-layout">
          <div className="kanban-board">
            {columns.map(col => (
              <div className="kanban-column" key={col.title}>
                <div className="kanban-column-header">
                  <span className={`kanban-dot ${col.dot}`}></span>
                  {col.title}
                  <span className="kanban-count">{col.items.length}</span>
                </div>
                {col.items.map(batch => (
                  <div className="kanban-card" key={batch.id} onClick={() => setSelectedBatch(batch.id)} style={selectedBatch===batch.id?{borderColor:'var(--primary)',boxShadow:'var(--shadow)'}:{}}>
                    <span className="kanban-card-id">{batch.id}</span>
                    <div className="kanban-card-title">{batch.name}</div>
                    <div className="kanban-card-meta">◇ {batch.qty.toLocaleString()} units</div>
                    {batch.progress > 0 && batch.progress < 100 && (
                      <div className="progress-bar" style={{marginTop:8}}>
                        <div className="progress-bar-fill" style={{width:`${batch.progress}%`}}></div>
                      </div>
                    )}
                    {batch.progress === 100 && (
                      <div className="progress-bar" style={{marginTop:8}}>
                        <div className="progress-bar-fill done" style={{width:'100%'}}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {selected && economics && (
            <div className="detail-panel animate-in">
              <div className="detail-panel-header">
                <div>
                  <div className="detail-label">Active Batch</div>
                  <div className="detail-title">{selected.name}</div>
                  <div className="detail-tags">
                    <span className="detail-tag">{selected.id}</span>
                    <span className="detail-tag"># {selected.qty.toLocaleString()} units</span>
                  </div>
                </div>
                <button className="btn-icon" onClick={() => setSelectedBatch(null)}>✕</button>
              </div>

              <div style={{marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <span style={{fontSize:13,color:'var(--on-surface-variant)'}}>Production Stage</span>
                  <span style={{fontSize:13,fontWeight:600}}>{selected.stage === 'in-production' ? `In Progress (${selected.progress}%)` : selected.stage.charAt(0).toUpperCase()+selected.stage.slice(1)}</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-bar-fill ${selected.progress===100?'done':''}`} style={{width:`${selected.progress}%`}}></div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Unit Economics</div>
                <div className="detail-row"><span className="detail-row-label">✂ Fabric Cost</span><span className="detail-row-value">{formatCurrency(selected.materials.fabric)}</span></div>
                <div className="detail-row"><span className="detail-row-label">⚙ Hardware/Trims</span><span className="detail-row-value">{formatCurrency(selected.materials.hardware)}</span></div>
                <div className="detail-row"><span className="detail-row-label">👥 Labor Cost (Est.)</span><span className="detail-row-value">{formatCurrency(selected.materials.labor)}</span></div>
                <div style={{borderTop:'1px solid var(--border)',marginTop:8,paddingTop:8}}>
                  <div className="detail-row"><span className="detail-row-label" style={{fontWeight:600}}>Total Cost / Unit</span><span className="detail-row-value">{formatCurrency(economics.totalCostPerUnit)}</span></div>
                  <div className="detail-row"><span className="detail-row-label">Target Wholesale</span><span className="detail-row-value">{formatCurrency(selected.targetPrice)}</span></div>
                </div>
              </div>

              <div className="detail-highlight">
                <span className="detail-highlight-label">Projected Margin</span>
                <div>
                  <span className="detail-highlight-value">{formatCurrency(economics.profitPerUnit)}</span>
                  <span className="detail-highlight-pct">{economics.marginPct.toFixed(1)}%</span>
                </div>
              </div>

              <div style={{display:'flex',gap:12,marginTop:20}}>
                <button className="btn btn-secondary" style={{flex:1}}>Log Issue</button>
                <button className="btn btn-primary" style={{flex:1}} onClick={() => {
                  if (selected.stage === 'planned') updateBatch(selected.id, {stage:'in-production', progress:10});
                  else if (selected.stage === 'in-production' && selected.progress < 100) updateBatch(selected.id, {progress: Math.min(100, selected.progress+25)});
                  else if (selected.progress >= 100) updateBatch(selected.id, {stage:'completed',progress:100,produced:selected.qty});
                }}>Update Status</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Batch Modal */}
      <Modal isOpen={showNewBatch} onClose={() => setShowNewBatch(false)} title="New Production Batch">
        <div className="form-group"><label className="form-label">Batch Name</label><input className="form-input" value={newBatch.name} onChange={e => setNewBatch(p=>({...p,name:e.target.value}))} placeholder="e.g. Canvas Tote Bag" /></div>
        <div className="form-group"><label className="form-label">Product Type</label><input className="form-input" value={newBatch.product} onChange={e => setNewBatch(p=>({...p,product:e.target.value}))} placeholder="e.g. Tote Bag" /></div>
        <div className="form-group"><label className="form-label">Planned Quantity</label><input className="form-input" type="number" value={newBatch.qty||''} onChange={e => setNewBatch(p=>({...p,qty:Number(e.target.value)}))} /></div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">Fabric Cost/Unit (₹)</label><input className="form-input" type="number" value={newBatch.materials.fabric||''} onChange={e => setNewBatch(p=>({...p,materials:{...p.materials,fabric:Number(e.target.value)}}))} /></div>
          <div className="form-group"><label className="form-label">Hardware Cost/Unit (₹)</label><input className="form-input" type="number" value={newBatch.materials.hardware||''} onChange={e => setNewBatch(p=>({...p,materials:{...p.materials,hardware:Number(e.target.value)}}))} /></div>
        </div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">Labor Cost/Unit (₹)</label><input className="form-input" type="number" value={newBatch.materials.labor||''} onChange={e => setNewBatch(p=>({...p,materials:{...p.materials,labor:Number(e.target.value)}}))} /></div>
          <div className="form-group"><label className="form-label">Target Price/Unit (₹)</label><input className="form-input" type="number" value={newBatch.targetPrice||''} onChange={e => setNewBatch(p=>({...p,targetPrice:Number(e.target.value)}))} /></div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowNewBatch(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAddBatch} disabled={!newBatch.name}>Create Batch</button>
        </div>
      </Modal>
      <InvoiceUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </>
  );
}
