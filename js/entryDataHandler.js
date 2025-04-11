export async function fetchEntries() {
    const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1hL_f05Hzl_vdeEyiOuxKZ2LV3oRPaUUlZYkDd9n4ngg/values/Glossary?key=AIzaSyBvMMzxGc8F_GTs7ytfJDNo_ZEWp_wze5k';

    try {
        const response = await fetch(GOOGLE_SHEETS_API_URL);
        const data = await response.json();
        const rows = data.values;

        return rows.slice(1).map((row) => ({
            word: row[0],
            pos: row[1],
            description: row[2],
            relatedWords: row[3].split(',').map(word => word.trim()),
        }));
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

export async function fetchTextContent() {
    const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1hL_f05Hzl_vdeEyiOuxKZ2LV3oRPaUUlZYkDd9n4ngg/values/Content?key=AIzaSyBvMMzxGc8F_GTs7ytfJDNo_ZEWp_wze5k';

    try {
        const response = await fetch(GOOGLE_SHEETS_API_URL);
        const data = await response.json();
        const rows = data.values;

        return {
            about: rows.slice(1).map(row => row[0]),
            suggest: rows.slice(1).map(row => row[1])
        };
        
    } catch (error) {
        console.error('Error fetching sheet 3 data:', error);
        return [];
    }
}
