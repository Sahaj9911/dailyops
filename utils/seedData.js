export const seedSuppliers = [
  { id: 1, name: 'LoomTech Fabrics', contact: '9876543210', gst: '29AABCT1332Q1ZS', category: 'Raw Cotton & Blends', totalSpend: 342500, created: '2024-06-12' },
  { id: 2, name: 'DyeWorks International', contact: '9123456780', gst: '27AADCD2345R1ZT', category: 'Chemicals & Dyes', totalSpend: 128900, created: '2024-07-03' },
  { id: 3, name: 'ZipperCo Hardware', contact: '9988776655', gst: '07AAECZ3456S1ZU', category: 'Trims & Fasteners', totalSpend: 85200, created: '2024-08-15' },
  { id: 4, name: 'Global Textiles', contact: '9871234560', gst: '24AAFCG4567T1ZV', category: 'Raw Materials', totalSpend: 215000, created: '2024-05-20' },
  { id: 5, name: 'Apex Machinery Parts', contact: '9765432100', gst: '33AAHCA5678U1ZW', category: 'Equipment', totalSpend: 95800, created: '2024-09-01' },
  { id: 6, name: 'City Logistics', contact: '9654321098', gst: '', category: 'Logistics', totalSpend: 67500, created: '2024-10-10' },
];

export const seedPurchases = [
  { id: 1, supplierId: 4, supplier: 'Global Textiles', invoiceNo: 'INV-9921-GT', date: '2024-10-24', amount: 4200, gst: 420, category: 'Fabric', status: 'settled', file: 'INV-2024-10-A.pdf' },
  { id: 2, supplierId: 4, supplier: 'Global Textiles', invoiceNo: 'INV-9920', date: '2024-10-23', amount: 1850, gst: 185, category: 'Fabric', status: 'unsettled', file: 'INV-2024-10-B.pdf' },
  { id: 3, supplierId: 5, supplier: 'Apex Machinery Parts', invoiceNo: 'INV-104A', date: '2024-10-21', amount: 12400, gst: 1240, category: 'Hardware', status: 'settled', file: 'INV-2024-10-C.pdf' },
  { id: 4, supplierId: 6, supplier: 'City Logistics', invoiceNo: 'INV-2023-082', date: '2024-10-20', amount: 850.5, gst: 85, category: 'Logistics', status: 'unsettled', file: null },
  { id: 5, supplierId: 3, supplier: 'ZipperCo Hardware', invoiceNo: 'UTIL-09', date: '2024-10-18', amount: 3200, gst: 320, category: 'Hardware', status: 'settled', file: 'INV-2024-10-D.pdf' },
  { id: 6, supplierId: 1, supplier: 'LoomTech Fabrics', invoiceNo: 'INV-8870', date: '2024-10-15', amount: 28500, gst: 2850, category: 'Fabric', status: 'settled', file: 'INV-2024-10-E.pdf' },
  { id: 7, supplierId: 2, supplier: 'DyeWorks International', invoiceNo: 'DW-2210', date: '2024-10-12', amount: 6750, gst: 675, category: 'Miscellaneous', status: 'settled', file: null },
  { id: 8, supplierId: 1, supplier: 'LoomTech Fabrics', invoiceNo: 'INV-8845', date: '2024-10-08', amount: 15200, gst: 1520, category: 'Fabric', status: 'settled', file: 'INV-2024-10-F.pdf' },
  { id: 9, supplierId: 6, supplier: 'City Logistics', invoiceNo: 'CL-3391', date: '2024-10-05', amount: 4100, gst: 410, category: 'Logistics', status: 'settled', file: null },
  { id: 10, supplierId: 3, supplier: 'ZipperCo Hardware', invoiceNo: 'ZC-0445', date: '2024-10-01', amount: 7800, gst: 780, category: 'Hardware', status: 'settled', file: 'INV-2024-10-G.pdf' },
];

export const seedBatches = [
  { id: 'B-1042', name: 'Heavyweight Canvas Tote', product: 'Canvas Tote Bag', qty: 500, produced: 425, stage: 'in-production', progress: 85, materials: { fabric: 4.20, hardware: 1.15, labor: 3.50 }, targetPrice: 18.00, margin: 50.8 },
  { id: 'B-1048', name: 'Linen Blend Summer Trousers', product: 'Linen Trousers', qty: 250, produced: 0, stage: 'planned', progress: 0, materials: { fabric: 6.80, hardware: 0.50, labor: 4.20 }, targetPrice: 24.00, margin: 52.1 },
  { id: 'B-1049', name: 'Organic Cotton Basic Tee', product: 'Cotton T-Shirt', qty: 1000, produced: 0, stage: 'planned', progress: 0, materials: { fabric: 2.10, hardware: 0.30, labor: 1.80 }, targetPrice: 8.50, margin: 50.6 },
  { id: 'B-1045', name: 'Denim Work Jacket', product: 'Denim Jacket', qty: 150, produced: 60, stage: 'in-production', progress: 40, materials: { fabric: 8.50, hardware: 2.30, labor: 5.00 }, targetPrice: 32.00, margin: 50.6 },
  { id: 'B-1038', name: 'Workwear Apron', product: 'Workwear Apron', qty: 300, produced: 300, stage: 'completed', progress: 100, materials: { fabric: 3.00, hardware: 0.80, labor: 2.50 }, targetPrice: 14.00, margin: 55.0 },
  { id: 'B-1030', name: 'Premium Laptop Sleeve', product: 'Laptop Sleeve', qty: 400, produced: 400, stage: 'completed', progress: 100, materials: { fabric: 3.50, hardware: 1.00, labor: 2.00 }, targetPrice: 15.00, margin: 56.7 },
];

export const seedRevenue = [
  { id: 1, batchId: 'B-1038', date: '2024-10-24', amount: 4200, description: 'Apron batch partial delivery' },
  { id: 2, batchId: 'B-1030', date: '2024-10-22', amount: 6000, description: 'Laptop Sleeve full order' },
  { id: 3, batchId: 'B-1042', date: '2024-10-20', amount: 2250, description: 'Canvas Tote sample order' },
  { id: 4, batchId: 'B-1038', date: '2024-10-18', amount: 12450, description: 'Retail Partner Alpha order' },
  { id: 5, batchId: 'B-1030', date: '2024-10-15', amount: 8500, description: 'Bulk order - corporate' },
  { id: 6, batchId: 'B-1042', date: '2024-10-10', amount: 15000, description: 'Canvas Tote wholesale' },
];

export const monthlyData = {
  revenue: [185000, 210000, 198000, 225000, 240000, 265000],
  expenses: [120000, 135000, 142000, 148000, 155000, 162000],
  profit: [65000, 75000, 56000, 77000, 85000, 103000],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
};

export const todayMetrics = {
  revenueToday: 12450,
  revenueTodayChange: 4.2,
  profitThisMonth: 48200,
  profitChange: 12.5,
  outstandingPayments: 8900,
  outstandingCount: 3,
  cashFlowHealth: 'Good Standing',
  activeBatches: 12,
  highestExpenseCategory: 'Fabric',
  highestExpenseChange: 12,
};
