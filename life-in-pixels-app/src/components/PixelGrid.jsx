import React, { useMemo } from 'react';
// import { ACTIVITY_MAP } from '../data/activities';

// Generate 12h headers (12 AM, 1 AM ... 12 PM, 1 PM ...)
const HOURS = Array.from({ length: 24 }, (_, i) => {
    const h = i % 12 || 12;
    const ampm = i < 12 ? 'A' : 'P'; // Shortened for space
    return `${h}${ampm}`;
});

const PixelGrid = ({ yearData, onPixelClick, activityMap }) => {
    // Generate all dates for 2026
    const dates = useMemo(() => {
        const list = [];
        const start = new Date(2026, 0, 1);
        const end = new Date(2026, 11, 31);

        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            const iso = d.toISOString().split('T')[0];
            const label = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
            list.push({ iso, label });
        }
        return list;
    }, []);

    const getSlotColor = (dateIso, hourIndex) => {
        const events = yearData[dateIso] || [];
        // Simple logic: Find event that "starts" in this hour or covers it.
        // Refined: Check if any event *intersects* this hour significantly.
        // For MVP: Check if an event's start hour matches current hour.
        // Users might equate "10:00" slot to the event happening at 10.

        const hourStart = hourIndex;
        // const hourEnd = hourIndex + 1;

        // Find event starting in this hour
        const event = events.find(e => {
            const startH = parseInt(e.start.split(':')[0]);
            return startH === hourStart;
        });

        if (event) {
            const act = activityMap[event.activityId];
            return act ? act.color : '#2D3436';
        }
        return null; // Default (transparent/bg)
    };

    return (
        <div className="win-border-inset" style={{ overflowX: 'auto', padding: '10px', backgroundColor: '#808080' }}>
            <table style={{ borderCollapse: 'separate', borderSpacing: '1px' }}>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: '#c0c0c0', border: '1px solid #fff', minWidth: '60px', fontSize: '0.8em' }}>Date</th>
                        {HOURS.map(h => (
                            <th key={h} style={{ width: '26px', fontSize: '0.6em', backgroundColor: '#c0c0c0', border: '1px solid white' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dates.map(({ iso, label }) => (
                        <tr key={iso}>
                            <td style={{
                                fontSize: '0.8em',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                backgroundColor: '#c0c0c0',
                                padding: '0 4px',
                                borderRight: '1px solid #404040'
                            }}>
                                {label}
                            </td>
                            {HOURS.map((_, hIdx) => {
                                const color = getSlotColor(iso, hIdx);
                                const hasActivity = !!color;

                                return (
                                    <td
                                        key={`${iso}-${hIdx}`}
                                        onClick={() => onPixelClick(iso, hIdx)}
                                        className={`cell-3d ${hasActivity ? '' : 'empty'}`}
                                        style={{
                                            width: '26px',
                                            height: '26px',
                                            backgroundColor: color || 'var(--bg-color)', // Fallback to theme bg if empty
                                            cursor: 'pointer',
                                        }}
                                        title={`${label} @ ${hIdx}:00`}
                                    />
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default PixelGrid;
