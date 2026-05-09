'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { seedSuppliers, seedPurchases, seedBatches, seedRevenue, monthlyData, todayMetrics } from '@/utils/seedData';

const DataContext = createContext();

function loadFromStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(`dailyops_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}

function saveToStorage(key, data) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(`dailyops_${key}`, JSON.stringify(data)); } catch {}
}

export function DataProvider({ children }) {
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [batches, setBatches] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSuppliers(loadFromStorage('suppliers', seedSuppliers));
    setPurchases(loadFromStorage('purchases', seedPurchases));
    setBatches(loadFromStorage('batches', seedBatches));
    setRevenue(loadFromStorage('revenue', seedRevenue));
    setIsLoaded(true);
  }, []);

  useEffect(() => { if (isLoaded) saveToStorage('suppliers', suppliers); }, [suppliers, isLoaded]);
  useEffect(() => { if (isLoaded) saveToStorage('purchases', purchases); }, [purchases, isLoaded]);
  useEffect(() => { if (isLoaded) saveToStorage('batches', batches); }, [batches, isLoaded]);
  useEffect(() => { if (isLoaded) saveToStorage('revenue', revenue); }, [revenue, isLoaded]);

  const addSupplier = (s) => setSuppliers(prev => [...prev, { ...s, id: Date.now(), created: new Date().toISOString().split('T')[0], totalSpend: 0 }]);
  const addPurchase = (p) => setPurchases(prev => [...prev, { ...p, id: Date.now() }]);
  const updatePurchase = (id, updates) => setPurchases(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const addBatch = (b) => setBatches(prev => [...prev, { ...b, id: `B-${1050 + prev.length}`, produced: 0, progress: 0 }]);
  const updateBatch = (id, updates) => setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  const addRevenue = (r) => setRevenue(prev => [...prev, { ...r, id: Date.now() }]);

  return (
    <DataContext.Provider value={{
      suppliers, purchases, batches, revenue,
      monthlyData, todayMetrics, isLoaded,
      addSupplier, addPurchase, updatePurchase, addBatch, updateBatch, addRevenue,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() { return useContext(DataContext); }
