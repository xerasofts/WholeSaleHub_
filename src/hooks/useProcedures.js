import { useState, useEffect, useCallback } from 'react';

const PROCEDURES_KEY = 'clinic_procedures';

const defaultProcedures = [
  { id: 'p1', name: 'ECG', description: 'Electrocardiogram', fee: 300 },
  { id: 'p2', name: 'Minor Surgery', description: 'Minor outpatient procedure', fee: 1500 },
  { id: 'p3', name: 'X-Ray', description: 'X-Ray imaging', fee: 400 }
];

const getInitial = () => {
  try {
    const stored = localStorage.getItem(PROCEDURES_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error('read procedures', e); }
  return defaultProcedures;
};

export function useProcedures() {
  const [procedures, setProcedures] = useState(getInitial);

  useEffect(() => {
    localStorage.setItem(PROCEDURES_KEY, JSON.stringify(procedures));
  }, [procedures]);

  const addProcedure = useCallback((proc) => setProcedures(prev => [...prev, proc]), []);
  const updateProcedure = useCallback((id, updates) => setProcedures(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p)), []);
  const removeProcedure = useCallback((id) => setProcedures(prev => prev.filter(p => p.id !== id)), []);

  return { procedures, setProcedures, addProcedure, updateProcedure, removeProcedure };
}

export default useProcedures;
