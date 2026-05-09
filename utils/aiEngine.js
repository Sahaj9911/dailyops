import { formatCurrency, formatCompact, calcExpensesByCategory, calcTotalExpenses, calcTotalRevenue } from './calculations';

export function getAIResponse(query, data) {
  const q = query.toLowerCase();
  const { purchases, revenue, batches, suppliers } = data;
  const totalExp = calcTotalExpenses(purchases);
  const totalRev = calcTotalRevenue(revenue);
  const profit = totalRev - totalExp;
  const expByCat = calcExpensesByCategory(purchases);

  if (q.includes('profit') && (q.includes('month') || q.includes('total'))) {
    return `This month's profit is **${formatCurrency(profit)}**. Total revenue: ${formatCurrency(totalRev)}, Total expenses: ${formatCurrency(totalExp)}. Your net margin is **${((profit/totalRev)*100).toFixed(1)}%**.`;
  }
  if (q.includes('revenue')) {
    return `Total revenue recorded: **${formatCurrency(totalRev)}**. You have ${revenue.length} revenue entries. The largest single entry was ${formatCurrency(Math.max(...revenue.map(r => r.amount)))}.`;
  }
  if (q.includes('expense') || q.includes('spending') || q.includes('cost')) {
    const top = expByCat[0];
    return `Total expenses: **${formatCurrency(totalExp)}**. Highest category: **${top.category}** at ${formatCurrency(top.amount)} (${top.percentage.toFixed(0)}% of total). You have ${purchases.length} purchase records.`;
  }
  if (q.includes('supplier') && q.includes('cost') || q.includes('supplier') && q.includes('increase')) {
    const sorted = [...suppliers].sort((a, b) => b.totalSpend - a.totalSpend);
    return `Top supplier by spend: **${sorted[0].name}** (${formatCurrency(sorted[0].totalSpend)}), followed by **${sorted[1].name}** (${formatCurrency(sorted[1].totalSpend)}). Consider negotiating bulk rates with your top suppliers.`;
  }
  if (q.includes('margin') || q.includes('highest margin')) {
    const best = [...batches].sort((a, b) => b.margin - a.margin)[0];
    return `Highest margin product: **${best.name}** at **${best.margin}%** margin. Target price: ${formatCurrency(best.targetPrice)}/unit. Consider scaling this product line.`;
  }
  if (q.includes('production') || q.includes('batch')) {
    const active = batches.filter(b => b.stage === 'in-production').length;
    const planned = batches.filter(b => b.stage === 'planned').length;
    const done = batches.filter(b => b.stage === 'completed').length;
    return `Production overview: **${active}** batches in production, **${planned}** planned, **${done}** completed. Total active units: ${batches.filter(b => b.stage !== 'completed').reduce((s, b) => s + b.qty, 0).toLocaleString()}.`;
  }
  if (q.includes('gst') || q.includes('tax')) {
    const totalGST = purchases.reduce((s, p) => s + (p.gst || 0), 0);
    return `Total GST paid on purchases: **${formatCurrency(totalGST)}**. Average GST rate across invoices: ~${((totalGST / totalExp) * 100).toFixed(1)}%.`;
  }
  if (q.includes('summary') || q.includes('overview') || q.includes('health')) {
    return `**Business Summary:**\n• Revenue: ${formatCurrency(totalRev)}\n• Expenses: ${formatCurrency(totalExp)}\n• Net Profit: ${formatCurrency(profit)} (${((profit/totalRev)*100).toFixed(1)}%)\n• Active batches: ${batches.filter(b => b.stage === 'in-production').length}\n• Top expense: ${expByCat[0].category}\n• Suppliers: ${suppliers.length}`;
  }
  return `I can help with questions about your **profit, revenue, expenses, suppliers, production batches, margins,** and **GST**. Try asking something like "What's my profit this month?" or "Which product has the highest margin?"`;
}

export const suggestedQuestions = [
  "How much profit did we make this month?",
  "What are our top expenses?",
  "Which product has highest margins?",
  "Which supplier costs increased?",
  "Give me a business summary",
  "How is production going?",
];
