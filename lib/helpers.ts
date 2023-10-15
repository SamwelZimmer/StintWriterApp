import CryptoJS from 'crypto-js';

import { Timestamp, Stint, CategorisedStints } from './types';

const SHARED_SECRET = 'SHARED_SECRET_BETWEEN_APP_A_AND_APP_B';

export const decryptData = (encryptedData: string) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SHARED_SECRET);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        return decryptedData;
    } catch (error) {
        console.error("Decryption error:", error);
        return "not working";
    }
};

export const addToLocalStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined' && !localStorage.getItem(key)) {
        localStorage.setItem(key, data);
    };
};

export const updateLocalStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined' && localStorage.getItem(key)) {
        localStorage.setItem(key, data);
    };
};

export const getFromLocalStorage = (key: string) => {
    if (typeof window !== 'undefined' && localStorage.getItem(key)) {
        const item = localStorage.getItem(key);
        return item
    }; 
    return;
};

export const removeFromLocalStorage = (key: string) => {
    try {
        localStorage.removeItem(key);
        console.log(`Item with key '${key}' removed from localStorage`);
    } catch (error) {
        console.error(`Error removing item with key '${key}' from localStorage:`, error);
    }
}

// Usage:
// removeFromLocalStorage('yourKey');


export const stringToSlug = (str: string) => {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
};

export function daysBetween(start: Date, end: Date): number {

    // convert dates to milliseconds
    const startMs = start.getTime();
    const endMs = end.getTime();

    // calculate the difference in milliseconds
    const differenceMs = Math.abs(endMs - startMs);

    // convert the difference to days
    const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

    // add 1 to make it inclusive
    return days + 1;
};

export function shortenString(input: string, n: number): string {
    return input.length > n ? input.substr(0, n) : input;
}

export function formatDateFromTimestamp(timestamp: Timestamp): string {
    // Convert the Firestore timestamp to a JavaScript Date object
    const date = new Date(timestamp.seconds * 1000);

    // Extract the day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    // Function to get the ordinal suffix for numbers (e.g., "st", "nd", "rd", "th")
    function getOrdinalSuffix(n: number): string {
        if (n >= 11 && n <= 13) {
        return 'th';
        }
        switch (n % 10) {
        case 1:  return 'st';
        case 2:  return 'nd';
        case 3:  return 'rd';
        default: return 'th';
        }
    }

    // Combine the day, month, and year with the appropriate ordinal suffix
    return `${day}${getOrdinalSuffix(day)} ${shortenString(month, 3)}, ${year}`;
};

export const categorizeStints = (stints: Stint[]): CategorisedStints => {
    const now = Date.now() / 1000; // current time in seconds

    const categorized: CategorisedStints = {
        upcoming: [],
        active: [],
        past: [],
    };

    stints.forEach((stint) => {
        if (stint.startDate.seconds > now) {
            categorized.upcoming.push(stint);
        } else if (stint.startDate.seconds <= now && stint.endDate.seconds >= now) {
            categorized.active.push(stint);
        } else if (stint.endDate.seconds < now) {
            categorized.past.push(stint);
        }
    });

    return categorized;
};
  