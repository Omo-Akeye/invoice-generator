import type { Invoice } from '../../../../types/invoice';

export interface TotalRow {
    key: 'subtotal' | 'tax' | 'discount';
    label: string;
    value: number;
}

/** Subtotal, tax and discount rows in display order; each template styles them its own way. */
export const getTotalRows = (invoice: Invoice): TotalRow[] => {
    const { settings } = invoice;
    const rows: TotalRow[] = [{ key: 'subtotal', label: 'Subtotal', value: invoice.subtotal }];
    if (settings.includeTax) {
        rows.push({ key: 'tax', label: `Tax (${settings.taxRate}%)`, value: invoice.taxAmount });
    }
    if (settings.discountValue > 0) {
        const suffix = settings.discountType === 'percentage' ? ` (${settings.discountValue}%)` : '';
        rows.push({ key: 'discount', label: `Discount${suffix}`, value: invoice.discountAmount });
    }
    return rows;
};

export const companyName = (invoice: Invoice) => invoice.company.name || 'YOUR COMPANY';
export const clientName = (invoice: Invoice) => invoice.client.name || 'CLIENT NAME';
