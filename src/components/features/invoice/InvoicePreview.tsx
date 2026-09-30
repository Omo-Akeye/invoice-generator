import { forwardRef } from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { getTemplate } from './templates/registry';

export const InvoicePreview = forwardRef<HTMLDivElement>((_, ref) => {
    const { invoice } = useInvoice();
    const Template = getTemplate(invoice.template).component;

    return (
        <div ref={ref} id="invoice-preview">
            <Template invoice={invoice} />
        </div>
    );
});

InvoicePreview.displayName = 'InvoicePreview';
