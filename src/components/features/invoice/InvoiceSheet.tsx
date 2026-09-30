import React from 'react';
import type { Invoice, InvoiceTemplate } from '../../../types/invoice';
import { getTemplate } from './templates/registry';
import { ScaledFrame } from '../../ui/ScaledFrame';
import { cn } from '../../../utils/cn';

export const InvoiceSheet: React.FC<{ invoice: Invoice; template?: InvoiceTemplate; className?: string }> = ({ invoice, template, className }) => {
    const Template = getTemplate(template ?? invoice.template).component;
    return (
        <ScaledFrame className={cn('invoice-sheet bg-white', className)} aria-hidden>
            <Template invoice={invoice} />
        </ScaledFrame>
    );
};
