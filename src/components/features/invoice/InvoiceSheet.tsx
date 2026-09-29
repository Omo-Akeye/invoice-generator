import React from 'react';
import type { Invoice, InvoiceTemplate } from '../../../types/invoice';
import { ClassicTemplate, ModernTemplate, ElegantTemplate } from './templates';
import { ScaledFrame } from '../../ui/ScaledFrame';
import { cn } from '../../../utils/cn';

const TEMPLATE_COMPONENTS: Record<InvoiceTemplate, React.FC<{ invoice: Invoice }>> = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    elegant: ElegantTemplate,
};

export const InvoiceSheet: React.FC<{ invoice: Invoice; template?: InvoiceTemplate; className?: string }> = ({ invoice, template, className }) => {
    const Template = TEMPLATE_COMPONENTS[template ?? invoice.template];
    return (
        <ScaledFrame className={cn('invoice-sheet bg-white', className)} aria-hidden>
            <Template invoice={invoice} />
        </ScaledFrame>
    );
};
