import React, { useState, useEffect } from 'react';
import { CATEGORIES, getActivitiesByCategory } from '../data/activities';
import { X, Trash2, Save } from 'lucide-react';

const EntryModal = ({ isOpen, onClose, date, defaultTime, initialEvent, onSave, onDelete, activityMap }) => {
    if (!isOpen) return null;

    const [startTime, setStartTime] = useState(defaultTime || '09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [selectedActivityId, setSelectedActivityId] = useState(1);
    const [note, setNote] = useState('');
    const [category, setCategory] = useState(1);

    // Initialize form
    useEffect(() => {
        if (initialEvent) {
            setStartTime(initialEvent.start);
            setEndTime(initialEvent.end);
            setSelectedActivityId(initialEvent.activityId);
            setNote(initialEvent.note || '');
            const cat = Math.floor(initialEvent.activityId);
            setCategory(cat);
        } else {
            // Defaults for new entry
            if (defaultTime) {
                setStartTime(defaultTime);
                // Default 1 hour duration, cap at 23:00
                const startH = parseInt(defaultTime.split(':')[0]);
                const nextH = Math.min(23, startH + 1);
                setEndTime(`${String(nextH).padStart(2, '0')}:00`);
            }
            setNote('');
            setSelectedActivityId(1);
        }
    }, [initialEvent, defaultTime, isOpen]);

    const handleSave = () => {
        onSave({
            id: initialEvent?.id || crypto.randomUUID(),
            activityId: selectedActivityId,
            start: startTime,
            end: endTime,
            note
        });
        onClose();
    };

    const subActivities = getActivitiesByCategory(category, activityMap);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="win-border" style={{
                backgroundColor: 'var(--bg-color)',
                width: '90%', maxWidth: '500px',
                padding: '2px'
            }}>
                {/* Title Bar */}
                <div style={{
                    background: 'linear-gradient(to right, #000080, #1084d0)',
                    color: '#fff', padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontWeight: 'bold', fontFamily: 'sans-serif'
                }}>
                    <span>{initialEvent ? 'Edit Entry' : 'New Entry'} - {date}</span>
                    <button onClick={onClose} style={{ padding: '0 4px', minWidth: '20px', background: '#c0c0c0', color: '#000', border: '1px outset #fff' }}>
                        <X size={14} />
                    </button>
                </div>

                <div className="win-border-inset" style={{ padding: '16px', backgroundColor: 'var(--surface-color)', color: 'var(--text-color)' }}>

                    {/* Time Inputs */}
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '4px' }}>Start</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                                style={{ width: '100%', padding: '4px' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '4px' }}>End</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={e => setEndTime(e.target.value)}
                                style={{ width: '100%', padding: '4px' }}
                            />
                        </div>
                    </div>

                    {/* Category Select */}
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '4px' }}>Category</label>
                        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className={category === cat.id ? 'pressed' : ''}
                                    style={{
                                        fontSize: '0.8em',
                                        whiteSpace: 'nowrap',
                                        backgroundColor: category === cat.id ? '#ddd' : 'var(--surface-color)'
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Activity Select */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '4px' }}>Activity</label>
                        <select
                            value={selectedActivityId}
                            onChange={e => setSelectedActivityId(parseFloat(e.target.value))}
                            style={{ width: '100%', padding: '4px' }}
                        >
                            {subActivities.map(act => (
                                <option key={act.id} value={act.id}>
                                    {act.id} - {act.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Note */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '4px' }}>Note (Optional)</label>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            rows={3}
                            style={{ width: '100%', resize: 'vertical' }}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
                        {initialEvent && (
                            <button onClick={() => { onDelete(initialEvent.id); onClose(); }} style={{ color: '#d32f2f' }}>
                                <Trash2 size={16} style={{ marginRight: '4px' }} /> Delete
                            </button>
                        )}
                        <button onClick={handleSave} style={{ fontWeight: 'bold' }}>
                            <Save size={16} style={{ marginRight: '4px' }} /> Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntryModal;
