import React from 'react';
import { getCurrency } from '../../utils/currencies';

/**
 * Wraps amounts in a font that reliably draws the currency's symbol (₦, GH₵, ₹, ₱, ₩).
 * This is a rendering concern — formatCurrency stays a pure string function.
 *
 * Other currencies render as-is with no wrapper span.
 */
export const CurrencyText: React.FC<{ currency: string; children: React.ReactNode }> = ({ currency, children }) => {
    if (getCurrency(currency).fallbackFont) {
        return <span className="font-currency">{children}</span>;
    }
    return <>{children}</>;
};
