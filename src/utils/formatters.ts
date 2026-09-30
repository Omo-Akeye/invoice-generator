import type { Currency } from '../types/invoice';
import { getCurrency, DEFAULT_CURRENCY } from './currencies';

export const getCurrencySymbol = (currency: Currency): string => getCurrency(currency).symbol;

const numberFormats = new Map<number, Intl.NumberFormat>();
const numberFormat = (decimals: number) => {
    let format = numberFormats.get(decimals);
    if (!format) {
        format = new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        numberFormats.set(decimals, format);
    }
    return format;
};

/** One consistent style for every currency: symbol first, English grouping, ISO decimals ("₦1,000.00", "¥1,000", "KSh 1,000.00"). */
export const formatCurrency = (amount: number, currency: Currency = DEFAULT_CURRENCY): string => {
    const { symbol, decimals } = getCurrency(currency);
    const isNegative = amount < 0;
    const formatted = numberFormat(decimals).format(Math.abs(amount));
    const gap = /[A-Za-z]$/.test(symbol) ? ' ' : '';
    return `${isNegative ? '-' : ''}${symbol}${gap}${formatted}`;
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
