import React from 'react';

/**
 * Wraps text containing the Naira sign (₦) with a font that reliably renders it.
 * This is a rendering concern — the formatCurrency utility stays a pure string function.
 * 
 * For non-NGN currencies, children are rendered as-is with no wrapper span.
 */
export const CurrencyText: React.FC<{ currency: string; children: React.ReactNode }> = ({ currency, children }) => {
    if (currency === 'NGN') {
        return <span className="font-naira">{children}</span>;
    }
    return <>{children}</>;
};
