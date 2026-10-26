import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
import { usePreferenceStore } from '@/store/preferenceStore';

export function formatPrice(price, explicitCurrency) {
    if (explicitCurrency) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: explicitCurrency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    }
    const store = usePreferenceStore.getState();
    if (store && typeof store.formatPriceWithPreference === 'function') {
        return store.formatPriceWithPreference(price);
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
}
export function formatDate(dateStringOrDate) {
    const date = typeof dateStringOrDate === 'string' ? new Date(dateStringOrDate) : dateStringOrDate;
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}
export function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength) + '...';
}
