import type { Invoice, LineItem } from '../../types/invoice';
import {
    calculateLineItemTotal,
    calculateSubtotal,
    calculateTaxAmount,
    calculateDiscountAmount,
    calculateGrandTotal,
} from '../../utils/calculations';

// Fictional data used only to render real templates on the landing page.
const items: LineItem[] = [
    { id: 's1', name: 'Brand identity', description: 'Logo, colour system and type', quantity: 1, unitPrice: 450000, total: 0 },
    { id: 's2', name: 'Website design', description: 'Five responsive pages', quantity: 5, unitPrice: 120000, total: 0 },
    { id: 's3', name: 'Copywriting', description: 'Homepage and about page', quantity: 2, unitPrice: 65000, total: 0 },
].map((item) => ({ ...item, total: calculateLineItemTotal(item.quantity, item.unitPrice) }));

const settings: Invoice['settings'] = {
    currency: 'NGN',
    taxRate: 7.5,
    discountValue: 5,
    discountType: 'percentage',
    includeTax: true,
};

const subtotal = calculateSubtotal(items);
const taxAmount = calculateTaxAmount(subtotal, settings.taxRate);
const discountAmount = calculateDiscountAmount(subtotal, settings.discountValue, settings.discountType);

export const SAMPLE_INVOICE: Invoice = {
    id: 'sample',
    invoiceNumber: 'INV-2026-014',
    issueDate: '2026-09-30',
    dueDate: '2026-10-14',
    template: 'classic',
    company: {
        name: 'Function Studio',
        address: '12 Admiralty Way, Lekki, Lagos',
        email: 'hello@functionstudio.com',
        phone: '+234 809 555 0142',
    },
    client: {
        name: 'Acme Foods Ltd.',
        address: '4 Aminu Kano Crescent, Wuse 2, Abuja',
        email: 'accounts@acmefoods.com',
    },
    items,
    settings,
    subtotal,
    taxAmount,
    discountAmount,
    total: calculateGrandTotal(subtotal, taxAmount, discountAmount),
    notes: 'Payment due within 14 days. Thank you for the work together.',
    paymentInfo: {
        method: 'bank_transfer',
        bankName: 'Sample Bank',
        accountName: 'Function Studio Ltd',
        accountNumber: '0123456789',
    },
};
