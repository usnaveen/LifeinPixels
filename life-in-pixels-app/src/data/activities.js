export const ACTIVITY_MAP = {
    0: { color: '#2D3436', label: 'Sleep' },

    // 1: Work / Study (Terracotta)
    1: { color: '#E17055', label: 'Work / Study (General)' },
    1.1: { color: '#E17055', label: 'Attending Classes' },
    1.2: { color: '#E17055', label: 'Studying Subjects' },
    1.3: { color: '#E17055', label: 'Assignments' },
    1.4: { color: '#E17055', label: 'Deep Work' },
    1.5: { color: '#E17055', label: 'Leetcode' },
    1.6: { color: '#E17055', label: 'Projects' },

    // 2: Hobbies / Project (Soft Blue)
    2: { color: '#74B9FF', label: 'Hobbies / Personal Project' },

    // 3: Social / Friends (Pink)
    3: { color: '#FD79A8', label: 'Social / Friends (General)' },
    3.1: { color: '#FD79A8', label: 'Going Out with Friends' },
    3.2: { color: '#FD79A8', label: 'Friends in Room' },
    3.3: { color: '#FD79A8', label: 'Call - Friends' },
    3.4: { color: '#FD79A8', label: 'Call - Family' },

    // 4: Exercise (Mint Green)
    4: { color: '#00B894', label: 'Exercise (General)' },
    4.1: { color: '#00B894', label: 'Gym' },
    4.2: { color: '#00B894', label: 'Jogging' },
    4.3: { color: '#00B894', label: 'Yoga' },
    4.4: { color: '#00B894', label: 'Swimming' },

    // 5: Relaxation (Mustard)
    5: { color: '#FDCB6E', label: 'Relaxation (General)' },
    5.1: { color: '#FDCB6E', label: 'Reading Books' },
    5.2: { color: '#FDCB6E', label: 'Watching Videos' },
    5.3: { color: '#FDCB6E', label: 'Watching Movie' },
    5.4: { color: '#FDCB6E', label: 'Meditation' },

    // 6: Misc (Grey)
    6: { color: '#636E72', label: 'Travel / Misc' },

    // 7: Selfcare (Purple)
    7: { color: '#a29bfe', label: 'Selfcare (General)' },
    7.1: { color: '#a29bfe', label: 'Bathing' },
    7.2: { color: '#a29bfe', label: 'Toilet' },
    7.3: { color: '#a29bfe', label: 'Grooming / Hygiene' },
};

export const CATEGORIES = [
    { id: 0, label: 'Sleep', baseColor: '#2D3436' },
    { id: 1, label: 'Work / Study', baseColor: '#E17055' },
    { id: 2, label: 'Hobbies', baseColor: '#74B9FF' },
    { id: 3, label: 'Social', baseColor: '#FD79A8' },
    { id: 4, label: 'Exercise', baseColor: '#00B894' },
    { id: 5, label: 'Relaxation', baseColor: '#FDCB6E' },
    { id: 6, label: 'Misc', baseColor: '#636E72' },
    { id: 7, label: 'Selfcare', baseColor: '#a29bfe' },
];

export const getActivitiesByCategory = (catId, mapOverride = ACTIVITY_MAP) => {
    if (catId === 0 || catId === 2 || catId === 6) return [mapOverride[catId] || ACTIVITY_MAP[catId]];

    return Object.entries(mapOverride)
        .filter(([key]) => {
            const numKey = parseFloat(key);
            // Ensure strictly child of category (e.g. 1.1) or the base category itself (1)
            return Math.floor(numKey) === catId;
        })
        .map(([key, value]) => ({ id: parseFloat(key), ...value }))
        .sort((a, b) => a.id - b.id);
};
