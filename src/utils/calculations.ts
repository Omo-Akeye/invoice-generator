import type { LineItem } from '../types/invoice';

/**
 * Rounds a number to the specified number of decimal places accurately.
 * Prevents floating point errors like 0.1 + 0.2 = 0.30000000000000004
 */
export const roundTo = (value: number, decimals: number = 2): number => {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};

export const calculateLineItemTotal = (quantity: number, unitPrice: number): number => {
    return roundTo(quantity * unitPrice);
};

export const calculateSubtotal = (items: LineItem[]): number => {
    return items.reduce((acc, item) => acc + item.total, 0);
};

export const calculateTaxAmount = (subtotal: number, taxRate: number): number => {
    return roundTo((subtotal * taxRate) / 100);
};

export const calculateDiscountAmount = (
    subtotal: number,
    discountValue: number,
    discountType: 'percentage' | 'fixed'
): number => {
    if (discountType === 'percentage') {
        return roundTo((subtotal * discountValue) / 100);
    }
    return roundTo(discountValue);
};

export const calculateGrandTotal = (
    subtotal: number,
    taxAmount: number,
    discountAmount: number
): number => {
    return roundTo(subtotal + taxAmount - discountAmount);
};
