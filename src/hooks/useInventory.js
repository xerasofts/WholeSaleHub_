import { useState, useEffect, useCallback } from 'react';

const INVENTORY_STORAGE_KEY = 'clinic_inventory';

const defaultInventory = [
  { id: 'm1', name: 'Paracetamol 500mg', unit: 'tab', price: 5, quantityAvailable: 100, notes: '' },
  { id: 'm2', name: 'Azithromycin 500mg', unit: 'tab', price: 20, quantityAvailable: 50, notes: '' },
  { id: 'm3', name: 'Cough Syrup 100ml', unit: 'ml', price: 60, quantityAvailable: 30, notes: '' },
  { id: 'm4', name: 'Iron Syrup 200ml', unit: 'ml', price: 120, quantityAvailable: 20, notes: '' }
];

const getInitialInventory = () => {
  try {
    const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Error reading inventory from localStorage', e);
  }
  return defaultInventory;
};

export function useInventory() {
  const [inventory, setInventory] = useState(getInitialInventory);

  useEffect(() => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

  const addItem = useCallback((item) => {
    setInventory(prev => [...prev, item]);
  }, []);

  const updateItem = useCallback((id, updates) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  const removeItem = useCallback((id) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  }, []);

  const decrementStock = useCallback((id, qty) => {
    setInventory(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newQty = Math.max(0, (i.quantityAvailable || 0) - (qty || 0));
      return { ...i, quantityAvailable: newQty };
    }));
  }, []);

  return { inventory, setInventory, addItem, updateItem, removeItem, decrementStock };
}

export default useInventory;
