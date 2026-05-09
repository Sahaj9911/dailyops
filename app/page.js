'use client';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import Topbar from '@/components/Topbar';
import { formatCurrency, formatCompact, calcExpensesByCategory } from '@/utils/calculations';
import InvoiceUploadModal from '@/components/InvoiceUploadModal';

export default function DashboardPage() {
  const { purchases, batches, revenue, todayMetrics, monthlyData, isLoaded } = useData();
  const [showUpload, setShowUpload] = useState(false);

  if (!isLoaded) return <div style={{padding:40}}>Loading...</div>;

  const expByCat = calcExpensesByCategory(purchases);
  const topExpense = expByCat[0] || { category: 'N/A', percentage: 0 };

  const recentInvoices = [...purchases].sort((a, b) => b.id - a.id).slice(0, 3);
  const activeBatches = batches.filter(b => b.stage !== 'completed').slice(0, 4);

  return (
    <>
      <Topbar onUploadClick={() => setShowUpload(true)} />
      <div className="page-content animate-in">
        <div className="page-header">
          <h2>Overview</h2>
          <p>Monitor your manufacturing health and daily operations.</p>
        </div>

        {/* KPI Row 1 */}
        <div className="metrics-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-label">Revenue Today</span>
              <svg className="metric-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg>
            </div>
            <div className="metric-card-value">
              {formatCurrency(todayMetrics.revenueToday)}
              <span className="metric-card-change positive">↑{todayMetrics.revenueTodayChange}%</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-label">Profit This Month</span>
              <svg className="metric-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div className="metric-card-value">
              {formatCurrency(todayMetrics.profitThisMonth)}
              <span className="metric-card-change positive">↑{todayMetrics.profitChange}%</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-label">Outstanding Payments</span>
              <svg className="metric-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>
            </div>
            <div className="metric-card-value">{formatCurrency(todayMetrics.outstandingPayments)}</div>
            <div className="metric-card-sub">{todayMetrics.outstandingCount} Invoices</div>
          </div>
        </div>

        {/* KPI Row 2 */}
        <div className="metrics-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-label">Cash Flow Health</span>
              <svg className="metric-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:'var(--success)'}}></span>
              <span style={{fontSize:15,fontWeight:600}}>{todayMetrics.cashFlowHealth}</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-label">Production Status</span>
              <svg className="metric-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
            </div>
            <div className="metric-card-value">{todayMetrics.activeBatches}</div>
            <div className="metric-card-sub">Batches Active</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-label">Highest Expense</span>
              <svg className="metric-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
            </div>
            <div className="metric-card-value" style={{fontSize:24}}>
              {topExpense.category}
              <span className="metric-card-change negative" style={{fontSize:13}}>↑ {todayMetrics.highestExpenseChange}%</span>
            </div>
          </div>
        </div>

        {/* Charts + Insights */}
        <div className="grid-7-3 mb-24">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Revenue vs Expenses</h3>
              <div style={{display:'flex',gap:4}}>
                <button className="btn btn-sm btn-primary">30 Days</button>
                <button className="btn btn-sm btn-ghost">90 Days</button>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'flex-end',gap:24,height:220,paddingTop:20}}>
              {monthlyData.months.map((m, i) => (
                <div key={m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                  <div style={{display:'flex',gap:4,alignItems:'flex-end',height:180,width:'100%'}}>
                    <div style={{flex:1,background:'var(--primary)',borderRadius:'4px 4px 0 0',height:`${(monthlyData.revenue[i]/280000)*100}%`,transition:'height 0.6s ease',minHeight:4}}></div>
                    <div style={{flex:1,background:'var(--border)',borderRadius:'4px 4px 0 0',height:`${(monthlyData.expenses[i]/280000)*100}%`,transition:'height 0.6s ease',minHeight:4}}></div>
                  </div>
                  <span style={{fontSize:12,color:'var(--on-surface-variant)'}}>W{i+1}</span>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:24,justifyContent:'center',marginTop:16}}>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}>
                <span style={{width:10,height:10,borderRadius:2,background:'var(--primary)'}}></span> Revenue
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}>
                <span style={{width:10,height:10,borderRadius:2,background:'var(--border)'}}></span> Expenses
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title" style={{marginBottom:16}}>
              <span style={{color:'var(--primary)',fontWeight:700}}>✦</span> AI Insights
            </h3>
            <div className="insights-panel">
              <div className="insight-card">
                <div className="insight-card-header">
                  <span style={{color:'var(--error)'}}>📈</span>
                  <span className="insight-card-title">Material Cost Alert</span>
                </div>
                <p className="insight-card-text">Fabric costs have increased 12% this month compared to the rolling average.</p>
              </div>
              <div className="insight-card">
                <div className="insight-card-header">
                  <span style={{color:'var(--success)'}}>✅</span>
                  <span className="insight-card-title">Margin Optimization</span>
                </div>
                <p className="insight-card-text">Bag batch #B102 currently holds the highest profit margin across active lines.</p>
              </div>
              <div className="insight-card">
                <div className="insight-card-header">
                  <span style={{color:'var(--info)'}}>⏱</span>
                  <span className="insight-card-title">Production Flow</span>
                </div>
                <p className="insight-card-text">Machine #3 scheduled for routine maintenance in 3 days. Expect minor delays.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Batches + Invoices */}
        <div className="grid-7-3">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Production Batches</h3>
              <a href="/production" className="btn btn-ghost btn-sm text-primary">View All</a>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Batch ID</th><th>Product</th><th>Progress</th><th>Margin</th></tr>
                </thead>
                <tbody>
                  {activeBatches.map(batch => (
                    <tr key={batch.id}>
                      <td style={{fontWeight:600}}>#{batch.id}</td>
                      <td>{batch.name}</td>
                      <td>
                        <div className="progress-row">
                          <div className="progress-bar" style={{width:120}}>
                            <div className={`progress-bar-fill ${batch.progress===100?'done':''}`} style={{width:`${batch.progress}%`}}></div>
                          </div>
                          <span className="progress-text">{batch.progress === 100 ? 'Done' : `${batch.progress}%`}</span>
                        </div>
                      </td>
                      <td style={{fontWeight:600}}>{batch.margin}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title" style={{marginBottom:16}}>Recent Invoices</h3>
            {recentInvoices.map(inv => (
              <div key={inv.id} className="invoice-item">
                <div className="invoice-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="invoice-info">
                  <div className="invoice-id">{inv.invoiceNo}</div>
                  <div className="invoice-vendor">{inv.supplier}</div>
                </div>
                <div className="invoice-amount">
                  <div className="invoice-amount-value">{inv.amount > 0 ? '-' : '+'}{formatCurrency(inv.amount)}</div>
                  <div className={`invoice-amount-status badge ${inv.status === 'settled' || inv.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>{inv.status === 'settled' || inv.status === 'approved' ? 'Settled' : 'Unsettled'}</div>
                </div>
              </div>
            ))}
            <a href="/purchases" style={{display:'block',textAlign:'center',padding:'12px 0',fontSize:13,color:'var(--on-surface-variant)',textDecoration:'none',marginTop:8}}>View All Transactions</a>
          </div>
        </div>
      </div>
      <InvoiceUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </>
  );
}
