export function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function formatCurrencyDecimal(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCompact(amount) {
  if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(2) + 'Cr';
  if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
  if (amount >= 1000) return '₹' + (amount / 1000).toFixed(1) + 'K';
  return '₹' + amount;
}

export function calcGrossProfit(revenue, cogs) {
  return revenue - cogs;
}

export function calcGrossMargin(revenue, cogs) {
  if (revenue === 0) return 0;
  return ((revenue - cogs) / revenue) * 100;
}

export function calcNetProfit(revenue, totalExpenses) {
  return revenue - totalExpenses;
}

export function calcNetMargin(revenue, totalExpenses) {
  if (revenue === 0) return 0;
  return ((revenue - totalExpenses) / revenue) * 100;
}

export function calcEBITDA(revenue, operatingExpenses) {
  return revenue - operatingExpenses;
}

export function calcUnitEconomics(batch) {
  const totalCostPerUnit = batch.materials.fabric + batch.materials.hardware + batch.materials.labor;
  const revenuePerUnit = batch.targetPrice;
  const profitPerUnit = revenuePerUnit - totalCostPerUnit;
  const marginPct = (profitPerUnit / revenuePerUnit) * 100;
  return { totalCostPerUnit, revenuePerUnit, profitPerUnit, marginPct };
}

export function calcExpensesByCategory(purchases) {
  const cats = {};
  purchases.filter(p => p.status === 'settled' || p.status === 'approved').forEach(p => {
    cats[p.category] = (cats[p.category] || 0) + p.amount;
  });
  const total = Object.values(cats).reduce((a, b) => a + b, 0);
  return Object.entries(cats)
    .map(([category, amount]) => ({ category, amount, percentage: total ? (amount / total * 100) : 0 }))
    .sort((a, b) => b.amount - a.amount);
}

export function calcTotalExpenses(purchases) {
  return purchases.filter(p => p.status === 'settled' || p.status === 'approved').reduce((sum, p) => sum + p.amount, 0);
}

export function calcTotalRevenue(revenueRecords) {
  return revenueRecords.reduce((sum, r) => sum + r.amount, 0);
}

export function calcTotalGST(purchases) {
  return purchases.filter(p => p.status === 'settled' || p.status === 'approved').reduce((sum, p) => sum + (p.gst || 0), 0);
}
