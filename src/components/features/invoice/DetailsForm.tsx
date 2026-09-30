import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { Input } from '../../ui/Input';
import { sanitizeText, sanitizeEmail } from '../../../utils/sanitize';

export const ClientForm: React.FC<{ hideHeader?: boolean }> = () => {
    const { invoice, updateClient } = useInvoice();

    return (
        <fieldset className="space-y-3">
            <legend className="mb-3 text-[13px] font-medium text-ink">Bill to</legend>
            <Input
                label="Client name"
                placeholder="Fola Adeola"
                autoComplete="off"
                value={invoice.client.name}
                onChange={(e) => updateClient({ name: sanitizeText(e.target.value, 100) })}
            />
            <Input
                label="Email"
                placeholder="fola@company.com"
                autoComplete="off"
                type="email"
                value={invoice.client.email}
                onChange={(e) => updateClient({ email: sanitizeEmail(e.target.value) })}
            />
            <Input
                label="Address"
                placeholder="8 Abuja Street, Wuse 2, Abuja"
                autoComplete="off"
                value={invoice.client.address}
                onChange={(e) => updateClient({ address: sanitizeText(e.target.value, 200) })}
            />
        </fieldset>
    );
};

export const InvoiceDetailsForm: React.FC<{ hideHeader?: boolean }> = () => {
    const { invoice, updateInvoiceDetails } = useInvoice();

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
                label="Invoice number"
                className="font-mono sm:text-[13px] tabular-nums"
                value={invoice.invoiceNumber}
                onChange={(e) => updateInvoiceDetails({ invoiceNumber: sanitizeText(e.target.value, 50) })}
            />
            <Input
                label="Issue date"
                type="date"
                className="tabular-nums"
                value={invoice.issueDate}
                onChange={(e) => updateInvoiceDetails({ issueDate: e.target.value })}
            />
            <Input
                label="Due date"
                type="date"
                className="tabular-nums"
                value={invoice.dueDate}
                onChange={(e) => updateInvoiceDetails({ dueDate: e.target.value })}
            />
        </div>
    );
};
