import React, { useState, useEffect, useMemo } from 'react';
import PixelGrid from './components/PixelGrid';
import ActivitySelector from './components/ActivitySelector';
import EntryModal from './components/EntryModal';
import ActivityManager from './components/ActivityManager';
import ThemeToggle from './components/ThemeToggle';
import { ACTIVITY_MAP } from './data/activities';
import { loadData, saveData, exportData } from './utils/storage';
import { Download } from 'lucide-react';

const CUSTOM_ACTIVITIES_KEY = 'life_in_pixels_2026_custom_activities';

function App() {
  // 1. Data State
  const [yearData, setYearData] = useState({});
  const [customActivities, setCustomActivities] = useState([]);

  // 2. UI State
  const [currentActivityId, setCurrentActivityId] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, date: null, defaultTime: null, initialEvent: null });

  // 3. Load Data on Mount
  useEffect(() => {
    // Load events
    setYearData(loadData());

    // Load custom activities
    try {
      const stored = localStorage.getItem(CUSTOM_ACTIVITIES_KEY);
      if (stored) setCustomActivities(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load custom activities", e);
    }
  }, []);

  // 4. Save Data Effects
  useEffect(() => {
    if (Object.keys(yearData).length > 0) {
      saveData(yearData);
    }
  }, [yearData]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_ACTIVITIES_KEY, JSON.stringify(customActivities));
  }, [customActivities]);

  // 5. Derived Activity Map
  const activityMap = useMemo(() => {
    const customMap = {};
    customActivities.forEach(act => {
      customMap[act.id] = { label: act.label, color: act.color };
    });
    return { ...ACTIVITY_MAP, ...customMap };
  }, [customActivities]);

  // 6. Handlers
  const handlePixelClick = (date, hourIndex) => {
    // Find if there's an existing event starting roughly at this time?
    const hourStr = String(hourIndex).padStart(2, '0');
    // Simple lookup: check if any event starts in this hour
    const events = yearData[date] || [];
    const existingEvent = events.find(e => parseInt(e.start.split(':')[0]) === hourIndex);

    setModal({
      isOpen: true,
      date: date,
      defaultTime: `${hourStr}:00`,
      initialEvent: existingEvent || null
    });
  };

  const handleSaveEvent = (event) => {
    const date = modal.date;
    if (!date) return;

    setYearData(prev => {
      const dayEvents = prev[date] ? [...prev[date]] : [];
      // Remove existing if updating (by ID)
      const filtered = dayEvents.filter(e => e.id !== event.id);
      // Add new
      filtered.push(event);
      // Sort by start time
      filtered.sort((a, b) => a.start.localeCompare(b.start));

      return {
        ...prev,
        [date]: filtered
      };
    });
  };

  const handleDeleteEvent = (eventId) => {
    const date = modal.date;
    if (!date) return;

    setYearData(prev => {
      const dayEvents = prev[date] ? [...prev[date]] : [];
      return {
        ...prev,
        [date]: dayEvents.filter(e => e.id !== eventId)
      };
    });
  };

  const handleAddCustomActivity = (act) => {
    setCustomActivities(prev => [...prev, act]);
  };

  const handleDeleteCustomActivity = (id) => {
    setCustomActivities(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid var(--border-dark)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ fontSize: '2rem', margin: 0, textShadow: '2px 2px 0 var(--shadow-color, #888)' }}>Life in Pixels '26</h1>
          <ThemeToggle />
        </div>
        <button onClick={exportData} title="Export JSON" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={20} /> Export
        </button>
      </header>

      <main>
        <ActivitySelector
          currentActivityId={currentActivityId}
          onSelect={setCurrentActivityId}
          activityMap={activityMap}
        />

        <div className="win-border" style={{ padding: '8px', marginBottom: '20px', backgroundColor: '#808080' }}>
          <PixelGrid
            yearData={yearData}
            onPixelClick={handlePixelClick}
            activityMap={activityMap}
          />
        </div>

        <ActivityManager
          customActivities={customActivities}
          onAdd={handleAddCustomActivity}
          onDelete={handleDeleteCustomActivity}
        />
      </main>

      <EntryModal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        date={modal.date}
        defaultTime={modal.defaultTime}
        initialEvent={modal.initialEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        activityMap={activityMap}
      />
    </div>
  );
}

export default App;
