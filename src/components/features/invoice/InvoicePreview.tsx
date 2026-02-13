import { forwardRef } from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { ClassicTemplate, ModernTemplate, ElegantTemplate } from './templates';

export const InvoicePreview = forwardRef<HTMLDivElement>((_, ref) => {
    const { invoice } = useInvoice();

    const renderTemplate = () => {
        switch (invoice.template) {
            case 'modern':
                return <ModernTemplate invoice={invoice} />;
            case 'elegant':
                return <ElegantTemplate invoice={invoice} />;
            case 'classic':
            default:
                return <ClassicTemplate invoice={invoice} />;
        }
    };

    return (
        <div ref={ref} id="invoice-preview">
            {renderTemplate()}
        </div>
    );
});

InvoicePreview.displayName = 'InvoicePreview';

