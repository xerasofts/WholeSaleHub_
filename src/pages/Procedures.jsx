import React, { useState } from 'react';
import { useProcedures } from '../hooks/useProcedures';
import '../index.css';

export default function Procedures() {
  const { procedures, addProcedure, updateProcedure, removeProcedure } = useProcedures();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', description: '', fee: '' });
  const [q, setQ] = useState('');

  const startAdd = () => {
    setEditing('new');
    setForm({ id: `p${Date.now()}`, name: '', description: '', fee: '' });
  };
  const startEdit = (p) => { setEditing(p.id); setForm({ ...p }); };
  const save = () => {
    if (!form.name) return;
    if (editing === 'new') addProcedure({ ...form, fee: parseFloat(form.fee || 0) });
    else updateProcedure(form.id, { ...form, fee: parseFloat(form.fee || 0) });
    setEditing(null);
  };

  const filtered = procedures.filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h2>Procedures</h2>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input className="search-input" placeholder="Search procedures..." value={q} onChange={e=>setQ(e.target.value)} />
          <button className="add-btn" onClick={startAdd}>+ Add Procedure</button>
        </div>
      </div>

      <div className="inventory-grid">
        {filtered.map(p => (
          <div key={p.id} className="result-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontWeight:700}}>{p.name}</div>
                <div style={{color:'var(--text-secondary)', fontSize:12}}>{p.description}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:700}}>₹{p.fee}</div>
                <div style={{color:'var(--text-secondary)', fontSize:12}}>Fee</div>
              </div>
            </div>
            <div style={{marginTop:10, display:'flex', gap:8}}>
              <button className="text-btn" onClick={() => startEdit(p)}>Edit</button>
              <button className="text-btn" onClick={() => removeProcedure(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="booking-form-modal" style={{maxWidth:520}}>
          <h3>{editing === 'new' ? 'Add Procedure' : 'Edit Procedure'}</h3>
          <div style={{display:'grid', gap:8}}>
            <label>Name</label>
            <input className="form-input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
            <label>Description</label>
            <textarea className="form-input" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
            <label>Fee</label>
            <input className="form-input" type="number" value={form.fee} onChange={(e)=>setForm({...form, fee:e.target.value})} />
            <div style={{display:'flex', gap:8, marginTop:12}}>
              <button className="consult-btn save-btn" onClick={save}>Save</button>
              <button className="consult-btn cancel" onClick={()=>setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
