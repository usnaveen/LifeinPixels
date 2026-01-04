import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/activities';
import { Trash2, Plus } from 'lucide-react';

const ActivityManager = ({ customActivities, onAdd, onDelete }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#ffffff');
    const [categoryId, setCategoryId] = useState(1);
    const [idInput, setIdInput] = useState('');

    const handleAdd = () => {
        if (!name || !idInput) return;
        const id = parseFloat(idInput);
        if (isNaN(id)) return;

        onAdd({
            id,
            label: name,
            color,
            categoryId
        });
        setName('');
        setIdInput('');
    };

    return (
        <div className="win-border" style={{ padding: '16px', backgroundColor: 'var(--surface-color)', marginTop: '20px' }}>
            <h3 style={{ marginTop: 0, borderBottom: '2px solid var(--border-dark)', paddingBottom: '8px' }}>Manage Activities</h3>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8em' }}>ID</label>
                    <input
                        type="number" step="0.1"
                        value={idInput} onChange={e => setIdInput(e.target.value)}
                        placeholder="e.g. 1.9"
                        style={{ width: '80px', padding: '4px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8em' }}>Name</label>
                    <input
                        type="text"
                        value={name} onChange={e => setName(e.target.value)}
                        placeholder="New Activity"
                        style={{ width: '150px', padding: '4px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8em' }}>Category</label>
                    <select
                        value={categoryId}
                        onChange={e => setCategoryId(parseInt(e.target.value))}
                        style={{ padding: '4px' }}
                    >
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8em' }}>Color</label>
                    <input
                        type="color"
                        value={color} onChange={e => setColor(e.target.value)}
                        style={{ height: '28px' }}
                    />
                </div>
                <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={16} /> Add
                </button>
            </div>

            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {customActivities.map(act => (
                    <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dotted #888' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: act.color, border: '1px solid #000' }}></div>
                            <span><strong>{act.id}</strong> - {act.label}</span>
                        </div>
                        <button onClick={() => onDelete(act.id)} style={{ padding: '2px 6px', color: '#d32f2f' }}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
                {customActivities.length === 0 && <span style={{ opacity: 0.6 }}>No custom activities added.</span>}
            </div>
        </div>
    );
};

export default ActivityManager;
