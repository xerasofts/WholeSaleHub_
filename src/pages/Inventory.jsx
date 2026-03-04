import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import '../index.css';

export default function Inventory() {
  const { inventory, addItem, updateItem, removeItem } = useInventory();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', unit: '', price: '', quantityAvailable: '', notes: '' });
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  const startAdd = () => {
    setEditing('new');
    setForm({ id: `m${Date.now()}`, name: '', unit: 'tab', price: '', quantityAvailable: '', notes: '' });
  };

  const startEdit = (item) => {
    setEditing(item.id);
    setForm({ ...item });
  };

  const save = () => {
    if (!form.name) return;
    if (editing === 'new') {
      addItem({ ...form, price: parseFloat(form.price || 0), quantityAvailable: parseFloat(form.quantityAvailable || 0) });
    } else {
      updateItem(form.id, { ...form, price: parseFloat(form.price || 0), quantityAvailable: parseFloat(form.quantityAvailable || 0) });
    }
    setEditing(null);
  };

  const adjustQty = (id, delta) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, (item.quantityAvailable || 0) + delta);
    updateItem(id, { quantityAvailable: newQty });
  };

  const filtered = inventory.filter(i => {
    if (q && !i.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === 'low') return (i.quantityAvailable || 0) <= 5;
    if (filter === 'in-stock') return (i.quantityAvailable || 0) > 0;
    return true;
  });

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h2>Inventory Management</h2>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input className="search-input" placeholder="Search medicines..." value={q} onChange={e=>setQ(e.target.value)} />
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="filter-select">
            <option value="all">All</option>
            <option value="in-stock">In Stock</option>
            <option value="low">Low Stock (&le;5)</option>
          </select>
          <button className="add-btn" onClick={startAdd}>+ Add Item</button>
        </div>
      </div>

      <div className="inventory-grid">
        {filtered.map(item => (
          <div key={item.id} className="result-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontWeight:700}}>{item.name}</div>
                <div style={{color:'var(--text-secondary)', fontSize:12}}>{item.unit} • ₹{item.price}</div>
                {item.notes && <div style={{color:'var(--text-muted)', fontSize:12, marginTop:6}}>{item.notes}</div>}
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:700, fontSize:20}}>{item.quantityAvailable}</div>
                <div style={{color:'var(--text-secondary)', fontSize:12}}>Available</div>
              </div>
            </div>
            <div style={{marginTop:10, display:'flex', gap:8, alignItems:'center'}}>
              <button className="text-btn" onClick={() => startEdit(item)}>Edit</button>
              <button className="text-btn" onClick={() => removeItem(item.id)}>Delete</button>
              <div style={{marginLeft:'auto', display:'flex', gap:6}}>
                <button className="text-btn" onClick={()=>adjustQty(item.id, -1)}>-</button>
                <button className="text-btn" onClick={()=>adjustQty(item.id, 1)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="booking-form-modal" style={{maxWidth:520}}>
          <h3>{editing === 'new' ? 'Add Item' : 'Edit Item'}</h3>
          <div style={{display:'grid', gap:8}}>
            <label>Name</label>
            <input className="form-input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
            <label>Unit</label>
            <input className="form-input" value={form.unit} onChange={(e)=>setForm({...form, unit:e.target.value})} />
            <label>Price</label>
            <input className="form-input" type="number" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} />
            <label>Quantity</label>
            <input className="form-input" type="number" value={form.quantityAvailable} onChange={(e)=>setForm({...form, quantityAvailable:e.target.value})} />
            <label>Notes</label>
            <textarea className="form-input" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
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
