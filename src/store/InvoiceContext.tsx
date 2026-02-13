import React, { createContext, useContext, useMemo, useCallback } from 'react';
import type { Invoice, LineItem, CompanyInfo, ClientInfo, InvoiceSettings, InvoiceTemplate } from '../types/invoice';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
    calculateLineItemTotal,
    calculateSubtotal,
    calculateTaxAmount,
    calculateDiscountAmount,
    calculateGrandTotal
} from '../utils/calculations';
import { v4 as uuidv4 } from 'uuid';

interface InvoiceContextType {
    invoice: Invoice;
    isLoading: boolean;
    updateCompany: (company: Partial<CompanyInfo>) => void;
    updateClient: (client: Partial<ClientInfo>) => void;
    updateSettings: (settings: Partial<InvoiceSettings>) => void;
    updateTemplate: (template: InvoiceTemplate) => void;
    addItem: () => void;
    updateItem: (id: string, updates: Partial<LineItem>) => void;
    removeItem: (id: string) => void;
    updateInvoiceDetails: (updates: Partial<Pick<Invoice, 'invoiceNumber' | 'issueDate' | 'dueDate' | 'notes' | 'company'>>) => void;
    clearInvoice: () => void;
    isValid: boolean;
}

const DEFAULT_INVOICE: Invoice = {
    id: uuidv4(),
    invoiceNumber: `INV-${new Date().getFullYear()}-001`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    template: 'classic',
    company: {
        name: '',
        address: '',
        email: '',
        phone: '',
    },
    client: {
        name: '',
        address: '',
        email: '',
    },
    items: [
        {
            id: uuidv4(),
            name: '',
            description: '',
            quantity: 1,
            unitPrice: 0,
            total: 0,
        },
    ],
    settings: {
        currency: 'NGN',
        taxRate: 7.5,
        discountValue: 0,
        discountType: 'percentage',
        includeTax: true,
    },
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 0,
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rawInvoice, setInvoice, isLoading] = useLocalStorage<Invoice>('invoice-data', DEFAULT_INVOICE);


    const invoice = useMemo(() => {
        const subtotal = calculateSubtotal(rawInvoice.items);
        const taxAmount = rawInvoice.settings.includeTax
            ? calculateTaxAmount(subtotal, rawInvoice.settings.taxRate)
            : 0;
        const discountAmount = calculateDiscountAmount(
            subtotal,
            rawInvoice.settings.discountValue,
            rawInvoice.settings.discountType
        );
        const total = calculateGrandTotal(subtotal, taxAmount, discountAmount);

        return {
            ...rawInvoice,
            subtotal,
            taxAmount,
            discountAmount,
            total,
        };
    }, [rawInvoice]);

    const isValid = useMemo(() => {
        const hasClientName = invoice.client.name.trim().length > 0;
        const hasLineItems = invoice.items.some(item =>
            item.name.trim().length > 0 &&
            item.quantity > 0 &&
            item.unitPrice > 0
        );
        return hasClientName && hasLineItems;
    }, [invoice.client.name, invoice.items]);

    const updateCompany = useCallback((company: Partial<CompanyInfo>) => {
        setInvoice(prev => ({ ...prev, company: { ...prev.company, ...company } }));
    }, [setInvoice]);

    const updateClient = useCallback((client: Partial<ClientInfo>) => {
        setInvoice(prev => ({ ...prev, client: { ...prev.client, ...client } }));
    }, [setInvoice]);

    const updateSettings = useCallback((settings: Partial<InvoiceSettings>) => {
        setInvoice(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
    }, [setInvoice]);

    const updateTemplate = useCallback((template: InvoiceTemplate) => {
        setInvoice(prev => ({ ...prev, template }));
    }, [setInvoice]);

    const updateInvoiceDetails = useCallback((updates: Partial<Pick<Invoice, 'invoiceNumber' | 'issueDate' | 'dueDate' | 'notes' | 'company'>>) => {
        setInvoice(prev => ({ ...prev, ...updates }));
    }, [setInvoice]);

    const addItem = useCallback(() => {
        const newItem: LineItem = {
            id: uuidv4(),
            name: '',
            description: '',
            quantity: 1,
            unitPrice: 0,
            total: 0,
        };
        setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }, [setInvoice]);

    const updateItem = useCallback((id: string, updates: Partial<LineItem>) => {
        setInvoice(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, ...updates };

                    if ('quantity' in updates || 'unitPrice' in updates) {
                        updatedItem.total = calculateLineItemTotal(updatedItem.quantity, updatedItem.unitPrice);
                    }
                    return updatedItem;
                }
                return item;
            }),
        }));
    }, [setInvoice]);

    const removeItem = useCallback((id: string) => {
        setInvoice(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id),
        }));
    }, [setInvoice]);

    const clearInvoice = useCallback(() => {
        if (window.confirm('Are you sure you want to clear the entire invoice?')) {
            setInvoice({ ...DEFAULT_INVOICE, id: uuidv4() });
        }
    }, [setInvoice]);

    const value = useMemo(() => ({
        invoice,
        isLoading,
        updateCompany,
        updateClient,
        updateSettings,
        updateTemplate,
        addItem,
        updateItem,
        removeItem,
        updateInvoiceDetails,
        clearInvoice,
        isValid,
    }), [
        invoice,
        isLoading,
        updateCompany,
        updateClient,
        updateSettings,
        updateTemplate,
        addItem,
        updateItem,
        removeItem,
        updateInvoiceDetails,
        clearInvoice,
        isValid
    ]);

    return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
};

export const useInvoice = () => {
    const context = useContext(InvoiceContext);
    if (context === undefined) {
        throw new Error('useInvoice must be used within an InvoiceProvider');
    }
    return context;
};
