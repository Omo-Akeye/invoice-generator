import React from 'react';
import type { Invoice, PaymentInfo } from '../../../../types/invoice';
import { formatCurrency } from '../../../../utils/formatters';
import { CurrencyText } from '../../../ui/CurrencyText';
import { cn } from '../../../../utils/cn';

/** An amount in the invoice's currency, with the symbol font fallback applied. */
export const Money: React.FC<{ invoice: Invoice; value: number; negative?: boolean }> = ({ invoice, value, negative }) => (
    <CurrencyText currency={invoice.settings.currency}>
        {negative ? '-' : ''}
        {formatCurrency(value, invoice.settings.currency)}
    </CurrencyText>
);

interface PaymentFieldsProps {
    info: PaymentInfo;
    labelClassName: string;
    valueClassName: string;
    className?: string;
    /** Bank details render as a grid; this sets its columns. */
    columns?: 1 | 2;
}

/** Bank, crypto or custom payment instructions, styled by the calling template. */
export const PaymentFields: React.FC<PaymentFieldsProps> = ({ info, labelClassName, valueClassName, className, columns = 2 }) => {
    const field = (label: string, value: string | undefined, extra?: string, full?: boolean) =>
        value ? (
            <div className={cn(full && columns === 2 && 'col-span-2')}>
                <p className={labelClassName}>{label}</p>
                <p className={cn(valueClassName, extra)}>{value}</p>
            </div>
        ) : null;

    if (info.method === 'bank_transfer') {
        return (
            <div className={cn('grid gap-x-4 gap-y-1.5', columns === 2 ? 'grid-cols-2' : 'grid-cols-1', className)}>
                {field('Bank', info.bankName)}
                {field('Account name', info.accountName)}
                {field('Account no.', info.accountNumber)}
                {field('Routing / sort', info.routingNumber)}
                {field('SWIFT / BIC', info.swift)}
                {field('IBAN', info.iban, 'font-mono', true)}
            </div>
        );
    }
    if (info.method === 'crypto') {
        return (
            <div className={cn('space-y-1.5', className)}>
                {field('Currency', info.cryptoCurrency)}
                {field('Wallet address', info.walletAddress, 'font-mono break-all')}
            </div>
        );
    }
    return info.customInstructions ? <p className={cn(valueClassName, 'leading-relaxed', className)}>{info.customInstructions}</p> : null;
};
