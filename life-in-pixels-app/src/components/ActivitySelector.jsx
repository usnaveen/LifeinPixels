import React, { useState } from 'react';
import { CATEGORIES, getActivitiesByCategory } from '../data/activities';

const ActivitySelector = ({ currentActivityId, onSelect, activityMap }) => {
    // Activity Selector logic
    const [selectedCategory, setSelectedCategory] = useState(1); // Default to Work

    const subActivities = getActivitiesByCategory(selectedCategory, activityMap);

    return (
        <div className="win-border" style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--bg-color)',
            zIndex: 10,
            marginBottom: '20px',
            padding: '10px'
        }}>
            {/* Level 1: Categories */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '8px' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`win-border ${selectedCategory === cat.id ? 'pressed' : ''}`}
                        style={{
                            backgroundColor: selectedCategory === cat.id ? '#ddd' : 'var(--surface-color)',
                            color: selectedCategory === cat.id ? '#000' : 'var(--text-color)',
                            flexShrink: 0,
                            fontWeight: 'bold'
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Level 2: Specific Activities */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {subActivities.map(act => (
                    <button
                        key={act.id}
                        onClick={() => onSelect(act.id)}
                        className={`win-border ${currentActivityId === act.id ? 'pressed' : ''}`}
                        style={{
                            backgroundColor: act.color,
                            color: '#fff', // Always white text on colored buttons? Or dynamic?
                            textShadow: '1px 1px 0 #000',
                            fontSize: '0.9em',
                            padding: '0.4em 0.8em',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        <span style={{ fontSize: '0.8em', opacity: 0.8 }}>{act.id}</span>
                        {act.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ActivitySelector;
