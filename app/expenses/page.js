'use client';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import Topbar from '@/components/Topbar';
import InvoiceUploadModal from '@/components/InvoiceUploadModal';
import { formatCurrency, formatCompact, calcExpensesByCategory, calcTotalExpenses, calcTotalRevenue, calcGrossMargin } from '@/utils/calculations';

const BAR_COLORS = ['var(--primary)', 'var(--primary-container)', 'var(--outline)', 'var(--outline-variant)', 'var(--border)'];

export default function ExpensesPage() {
  const { purchases, revenue, monthlyData, suppliers, isLoaded } = useData();
  const [showUpload, setShowUpload] = useState(false);
  const [period, setPeriod] = useState('6m');

  if (!isLoaded) return <div style={{padding:40}}>Loading...</div>;

  const totalRev = monthlyData.revenue.reduce((a,b) => a+b, 0);
  const totalExp = monthlyData.expenses.reduce((a,b) => a+b, 0);
  const netProfit = totalRev - totalExp;
  const grossMargin = ((totalRev - totalExp) / totalRev * 100).toFixed(1);
  const expByCat = calcExpensesByCategory(purchases);
  const topSuppliers = [...suppliers].sort((a,b) => b.totalSpend - a.totalSpend).slice(0, 5);
  const maxRev = Math.max(...monthlyData.revenue);

  return (
    <>
      <Topbar onUploadClick={() => setShowUpload(true)} />
      <div className="page-content animate-in">
        <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div><h2>Financial Intelligence</h2><p>Real-time overview of operational economics.</p></div>
          <button className="btn btn-secondary btn-sm">Last 6 Months</button>
        </div>

        <div className="metrics-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
          <div className="metric-card">
            <div className="metric-card-header"><span className="metric-card-label">Money In (Revenue)</span>
              <svg className="metric-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg>
            </div>
            <div className="metric-card-value">{formatCompact(totalRev)}<span className="metric-card-change positive">↑12.5%</span></div>
          </div>
          <div className="metric-card">
            <div className="metric-card-header"><span className="metric-card-label">Money Out (Expenses)</span>
              <svg className="metric-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/></svg>
            </div>
            <div className="metric-card-value">{formatCompact(totalExp)}<span className="metric-card-change negative">↗4.2%</span></div>
          </div>
          <div className="metric-card">
            <div className="metric-card-header"><span className="metric-card-label">Money Kept (Profit)</span>
              <svg className="metric-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div className="metric-card-value">{formatCompact(netProfit)}<span className="metric-card-change positive">↑8.1%</span></div>
          </div>
          <div className="metric-card">
            <div className="metric-card-header"><span className="metric-card-label">Gross Margin</span>
              <svg className="metric-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div className="metric-card-value">{grossMargin}%<span className="metric-card-change positive">↑1.2%</span></div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header"><span className="chart-title">EBITDA Trend</span><button className="btn-icon">⋯</button></div>
            <div style={{display:'flex',alignItems:'flex-end',gap:16,height:200}}>
              {monthlyData.months.map((m, i) => {
                const ebitda = monthlyData.revenue[i] - monthlyData.expenses[i];
                const maxE = Math.max(...monthlyData.revenue.map((r,j) => r - monthlyData.expenses[j]));
                return (
                  <div key={m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                    <div style={{width:'100%',background: i===5?'var(--primary)':'var(--primary-dim)',borderRadius:'4px 4px 0 0',height:`${(ebitda/maxE)*160}px`,transition:'height 0.6s ease',opacity:i===5?1:0.7}}></div>
                    <span style={{fontSize:12,color:'var(--on-surface-variant)',fontWeight:i===5?700:400}}>{m}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-header"><span className="chart-title">Profit After Tax (PAT)</span><button className="btn-icon">⋯</button></div>
            <div style={{display:'flex',alignItems:'flex-end',gap:16,height:200}}>
              {monthlyData.months.map((m, i) => {
                const pat = monthlyData.profit[i] * 0.75;
                const maxP = Math.max(...monthlyData.profit) * 0.75;
                return (
                  <div key={m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                    <div style={{width:'100%',background: i===5?'var(--primary)':'var(--surface-dim)',borderRadius:'4px 4px 0 0',height:`${(pat/maxP)*160}px`,transition:'height 0.6s ease'}}></div>
                    <span style={{fontSize:12,color:'var(--on-surface-variant)',fontWeight:i===5?700:400}}>{m}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expense Distribution + Top Suppliers */}
        <div className="charts-grid">
          <div className="chart-card">
            <span className="chart-title">Expense Distribution</span>
            <div style={{marginTop:20}}>
              {expByCat.map((cat, i) => (
                <div className="expense-bar-item" key={cat.category}>
                  <div className="expense-bar-header">
                    <span className="expense-bar-label">{cat.category}</span>
                    <span className="expense-bar-pct">{cat.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="expense-bar">
                    <div className="expense-bar-fill" style={{width:`${cat.percentage}%`, background: BAR_COLORS[i % BAR_COLORS.length]}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-header"><span className="chart-title">Top Spend Suppliers</span><a href="/suppliers" className="btn btn-ghost btn-sm text-primary">View All</a></div>
            <div>
              {topSuppliers.map(s => (
                <div className="supplier-row" key={s.id}>
                  <div className="supplier-avatar" style={{background:`hsl(${s.id*60},40%,45%)`}}>{s.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600}}>{s.name}</div>
                    <div style={{fontSize:13,color:'var(--on-surface-variant)'}}>{s.category}</div>
                  </div>
                  <div style={{fontWeight:600}}>{formatCurrency(s.totalSpend)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <InvoiceUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </>
  );
}
