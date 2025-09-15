import {DateTime} from 'luxon';

// Formats a date string (ISO) into a Locale string
export function formatDate(date: string) {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED);
}
