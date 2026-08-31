import type { Currency } from '../types/invoice';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
    NGN: '₦',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    USD: '$',
};

export const getCurrencySymbol = (currency: Currency): string => {
    return CURRENCY_SYMBOLS[currency] ?? '$';
};

export const formatCurrency = (amount: number, currency: Currency = 'USD'): string => {
    const isNegative = amount < 0;
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    const symbol = getCurrencySymbol(currency);
    return `${isNegative ? '-' : ''}${symbol}${formatted}`;
};

export const formatDate = (date: string | Date): string => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(d);
};
