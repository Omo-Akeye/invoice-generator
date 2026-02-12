export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface CompanyInfo {
    name: string;
    address: string;
    email: string;
    phone: string;
    logo?: string;
}

export interface ClientInfo {
    name: string;
    address: string;
    email: string;
}

export interface LineItem {
    id: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface InvoiceSettings {
    currency: Currency;
    taxRate: number;
    discountValue: number;
    discountType: 'percentage' | 'fixed';
    includeTax: boolean;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    company: CompanyInfo;
    client: ClientInfo;
    items: LineItem[];
    settings: InvoiceSettings;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    notes?: string;
}
