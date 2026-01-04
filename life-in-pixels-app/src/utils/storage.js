const STORAGE_KEY = 'life_in_pixels_2026_data';
const STORAGE_KEY_V2 = 'life_in_pixels_2026_v2_events';

// Migration: Convert V1 (Hourly Integers) to V2 (Event Objects)
const migrateData = (oldData) => {
    const newEvents = {};

    if (!oldData) return newEvents;

    Object.entries(oldData).forEach(([date, hours]) => {
        newEvents[date] = [];
        hours.forEach((activityId, hourIndex) => {
            if (activityId === 0) return; // Skip sleep/empty

            // Create an event for this hour block
            const startTime = `${String(hourIndex).padStart(2, '0')}:00`;
            const endTime = `${String(hourIndex + 1).padStart(2, '0')}:00`;

            newEvents[date].push({
                id: crypto.randomUUID(),
                activityId: activityId,
                start: startTime,
                end: endTime,
                note: ''
            });
        });
    });

    return newEvents;
};

export const loadData = () => {
    try {
        // Try loading V2 data first
        const v2Data = localStorage.getItem(STORAGE_KEY_V2);
        if (v2Data) {
            return JSON.parse(v2Data);
        }

        // Fallback: Check for V1 data and migrate
        const v1Data = localStorage.getItem(STORAGE_KEY);
        if (v1Data) {
            console.log("Migrating V1 data to V2...");
            const parsedV1 = JSON.parse(v1Data);
            const migrated = migrateData(parsedV1);
            saveData(migrated); // Save to V2 immediately
            return migrated;
        }

        return {};
    } catch (error) {
        console.error('Failed to load data:', error);
        return {};
    }
};

export const saveData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save data:', error);
    }
};

export const exportData = () => {
    const data = loadData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "life_in_pixels_2026_v2_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
