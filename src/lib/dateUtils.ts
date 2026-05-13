/**
 * Date Utility for Thai Buddhist Era (BE)
 */

export const formatThaiDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
    if (!date) return '-';
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return '-';
        
        // If options are provided, use the Intl API (best effort)
        if (options) {
            return d.toLocaleDateString('th-TH-u-ca-buddhist', options);
        }

        // Manual formatting for the default long format to ENSURE BE year
        // This avoids issues with browsers that don't support u-ca-buddhist correctly
        const day = d.getDate();
        const month = THAI_MONTHS[d.getMonth()];
        const yearBE = d.getFullYear() + 543;

        return `${day} ${month} ${yearBE}`;
    } catch (e) {
        return '-';
    }
};

const THAI_MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

/**
 * Returns date in DD/MM/YYYY BE format
 */
export const formatThaiDateShort = (date: string | Date) => {
    if (!date) return '-';
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return '-';
        
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear() + 543;
        
        return `${day}/${month}/${year}`;
    } catch (e) {
        return '-';
    }
};

export const formatThaiDateTime = (date: string | Date) => {
    if (!date) return '-';
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return '-';
        
        return d.toLocaleString('th-TH-u-ca-buddhist', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        return '-';
    }
};

/**
 * Returns the Buddhist Era year (BE)
 */
export const getBEYear = (date: string | Date = new Date()) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return new Date().getFullYear() + 543;
    return d.getFullYear() + 543;
};

/**
 * Converts BE year to CE year
 */
export const getCEYear = (beYear: number) => {
    return beYear - 543;
};

/**
 * Returns a label for the year in BE format
 */
export const getYearLabel = (date: string | Date = new Date()) => {
    return `พ.ศ. ${getBEYear(date)}`;
};
