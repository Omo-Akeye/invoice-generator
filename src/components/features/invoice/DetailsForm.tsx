import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { Input } from '../../ui/Input';
import { Card } from '../../ui/Card';

export const ClientForm: React.FC = () => {
    const { invoice, updateClient } = useInvoice();

    return (
        <Card title="BILL TO">
            <div className="space-y-4">
                <Input
                    label="Client Name"
                    placeholder="e.g. Fola Adeola"
                    value={invoice.client.name}
                    onChange={(e) => updateClient({ name: e.target.value })}
                />
                <Input
                    label="Client Email"
                    placeholder="fola@gtbank.com"
                    type="email"
                    value={invoice.client.email}
                    onChange={(e) => updateClient({ email: e.target.value })}
                />
                <Input
                    label="Client Address"
                    placeholder="8 Abuja Street, Wuse 2, Abuja"
                    value={invoice.client.address}
                    onChange={(e) => updateClient({ address: e.target.value })}
                />
            </div>
        </Card>
    );
};

export const InvoiceDetailsForm: React.FC = () => {
    const { invoice, updateInvoiceDetails } = useInvoice();

    return (
        <Card title="INVOICE DETAILS">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Invoice Number"
                    value={invoice.invoiceNumber}
                    onChange={(e) => updateInvoiceDetails({ invoiceNumber: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                    <Input
                        label="Issue Date"
                        type="date"
                        value={invoice.issueDate}
                        onChange={(e) => updateInvoiceDetails({ issueDate: e.target.value })}
                    />
                    <Input
                        label="Due Date"
                        type="date"
                        value={invoice.dueDate}
                        onChange={(e) => updateInvoiceDetails({ dueDate: e.target.value })}
                    />
                </div>
            </div>
        </Card>
    );
};
