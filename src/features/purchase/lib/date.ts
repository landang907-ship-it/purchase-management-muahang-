/**
 * Date helpers - parse Excel serial dates and string formats.
 */

export function excelDateToString(val: unknown): string {
    if (val === null || val === undefined || val === '') return '';
    if (typeof val === 'string') return val.trim();
    if (typeof val === 'number') {
        // Excel serial date → use 1900 epoch base
        try {
            const epoch = new Date(Date.UTC(1899, 11, 30));
            const ms = val * 86_400_000;
            const date = new Date(epoch.getTime() + ms);
            if (!isNaN(date.getTime())) {
                const d = String(date.getUTCDate()).padStart(2, '0');
                const m = String(date.getUTCMonth() + 1).padStart(2, '0');
                const y = date.getUTCFullYear();
                return `${d}/${m}/${y}`;
            }
        } catch {
            /* ignore */
        }
        return String(val);
    }
    return String(val);
}

export function parseDate(val: unknown): Date | null {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number') {
        try {
            const epoch = new Date(Date.UTC(1899, 11, 30));
            const ms = val * 86_400_000;
            const d = new Date(epoch.getTime() + ms);
            if (!isNaN(d.getTime())) return d;
        } catch {
            /* ignore */
        }
    }
    if (typeof val === 'string') {
        const str = val.trim();
        
        // Handle DD/MM/YYYY or DD.MM.YYYY or DD-MM-YYYY
        const match = str.match(/^(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{4})$/);
        if (match) {
            const d = Number(match[1]);
            const m = Number(match[2]);
            const y = Number(match[3]);
            if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                return new Date(y, m - 1, d);
            }
        }
        
        const d = new Date(str);
        if (!isNaN(d.getTime())) return d;
    }
    return null;
}

/** Safe date parsing for filter comparison - returns Date or null */
export function parseDateSafe(val: unknown): Date | null {
    return parseDate(val);
}

export function startOfDay(d: Date = new Date()): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

/** Current year (local) for footer copyright. */
export function getCurrentYear(): number {
    return new Date().getFullYear();
}

/** Render date in Vietnamese long format: "Ngày DD tháng MM năm YYYY". */
export function renderVietnameseDate(d: Date = new Date()): string {
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `Ngày ${day} tháng ${month} năm ${year}`;
}
