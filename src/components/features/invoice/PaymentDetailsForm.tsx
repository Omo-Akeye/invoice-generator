import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { Input, Select, TextArea } from '../../ui/Input';
import { Switch } from '../../ui/Switch';
import { SegmentedControl } from '../../ui/SegmentedControl';
import type { PaymentMethod } from '../../../types/invoice';
import { AlertTriangle, Bitcoin, Building2, PenLine } from 'lucide-react';

const METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { value: 'bank_transfer', label: 'Bank', icon: <Building2 size={14} strokeWidth={1.75} /> },
    { value: 'crypto', label: 'Crypto', icon: <Bitcoin size={14} strokeWidth={1.75} /> },
    { value: 'other', label: 'Custom', icon: <PenLine size={14} strokeWidth={1.75} /> },
];

const CRYPTO = [
    ['BTC', 'Bitcoin (BTC)'],
    ['ETH', 'Ethereum (ETH)'],
    ['USDT', 'Tether (USDT)'],
    ['USDC', 'USD Coin (USDC)'],
    ['SOL', 'Solana (SOL)'],
    ['BNB', 'BNB'],
    ['XRP', 'XRP'],
    ['LTC', 'Litecoin (LTC)'],
];

export const PaymentDetailsForm: React.FC<{ hideHeader?: boolean }> = () => {
    const { invoice, updatePaymentInfo } = useInvoice();
    const paymentInfo = invoice.paymentInfo;
    const isEnabled = !!paymentInfo;
    const activeMethod = paymentInfo?.method ?? 'bank_transfer';

    const set = (fields: Parameters<typeof updatePaymentInfo>[0]) => {
        if (fields !== undefined) updatePaymentInfo(fields);
    };

    return (
        <div className="space-y-5">
            <Switch
                label="Show payment instructions"
                description="Printed on the invoice so your client knows how to pay."
                checked={isEnabled}
                onChange={(checked) => updatePaymentInfo(checked ? { method: 'bank_transfer' } : undefined)}
            />

            {isEnabled && (
                <div className="space-y-4">
                    <SegmentedControl
                        ariaLabel="Payment method"
                        value={activeMethod}
                        onChange={(method) => set({ method })}
                        options={METHODS}
                    />

                    {activeMethod === 'bank_transfer' && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Input
                                label="Bank name"
                                placeholder="Your bank's name"
                                value={paymentInfo?.bankName ?? ''}
                                onChange={(e) => set({ bankName: e.target.value })}
                            />
                            <Input
                                label="Account name"
                                placeholder="Function Studio Ltd"
                                value={paymentInfo?.accountName ?? ''}
                                onChange={(e) => set({ accountName: e.target.value })}
                            />
                            <Input
                                label="Account number"
                                className="font-mono sm:text-[13px] tabular-nums"
                                placeholder="0123456789"
                                value={paymentInfo?.accountNumber ?? ''}
                                onChange={(e) => set({ accountNumber: e.target.value })}
                            />
                            <Input
                                label="Routing or sort code"
                                className="font-mono sm:text-[13px]"
                                placeholder="Optional"
                                value={paymentInfo?.routingNumber ?? ''}
                                onChange={(e) => set({ routingNumber: e.target.value })}
                            />
                            <Input
                                label="SWIFT / BIC"
                                className="font-mono sm:text-[13px]"
                                placeholder="Optional"
                                value={paymentInfo?.swift ?? ''}
                                onChange={(e) => set({ swift: e.target.value })}
                            />
                            <Input
                                label="IBAN"
                                className="font-mono sm:text-[13px]"
                                placeholder="Optional"
                                value={paymentInfo?.iban ?? ''}
                                onChange={(e) => set({ iban: e.target.value })}
                            />
                        </div>
                    )}

                    {activeMethod === 'crypto' && (
                        <div className="space-y-3">
                            <Select
                                label="Cryptocurrency"
                                value={paymentInfo?.cryptoCurrency ?? 'BTC'}
                                onChange={(e) => set({ cryptoCurrency: e.target.value })}
                            >
                                {CRYPTO.map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </Select>
                            <Input
                                label="Wallet address"
                                className="font-mono sm:text-[13px]"
                                placeholder="bc1q…"
                                value={paymentInfo?.walletAddress ?? ''}
                                onChange={(e) => set({ walletAddress: e.target.value })}
                            />
                            <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-muted">
                                <AlertTriangle size={14} strokeWidth={1.75} className="mt-0.5 shrink-0 text-ink-faint" />
                                Check the address carefully. Crypto payments can't be reversed.
                            </p>
                        </div>
                    )}

                    {activeMethod === 'other' && (
                        <TextArea
                            label="Payment instructions"
                            rows={4}
                            placeholder="Send payment to account@example.com and include the invoice number."
                            value={paymentInfo?.customInstructions ?? ''}
                            onChange={(e) => set({ customInstructions: e.target.value })}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
