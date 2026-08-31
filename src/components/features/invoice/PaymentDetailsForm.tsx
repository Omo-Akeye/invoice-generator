import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { Input } from '../../ui/Input';
import { Card } from '../../ui/Card';
import type { PaymentMethod } from '../../../types/invoice';
import { Building2, Bitcoin, MoreHorizontal, X } from 'lucide-react';
import { cn } from '../../../utils/cn';

const METHODS: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'bank_transfer', label: 'Bank', icon: <Building2 size={14} /> },
    { id: 'crypto', label: 'Crypto', icon: <Bitcoin size={14} /> },
    { id: 'other', label: 'Other', icon: <MoreHorizontal size={14} /> },
];

export const PaymentDetailsForm: React.FC<{ hideHeader?: boolean }> = ({ hideHeader }) => {
    const { invoice, updatePaymentInfo } = useInvoice();
    const paymentInfo = invoice.paymentInfo;
    const isEnabled = !!paymentInfo;
    const activeMethod = paymentInfo?.method ?? 'bank_transfer';

    const handleToggle = () => {
        if (isEnabled) {
            updatePaymentInfo(undefined);
        } else {
            updatePaymentInfo({ method: 'bank_transfer' });
        }
    };

    const set = (fields: Parameters<typeof updatePaymentInfo>[0]) => {
        if (fields !== undefined) updatePaymentInfo(fields);
    };

    return (
        <Card title={hideHeader ? '' : 'PAYMENT DETAILS'} noPadding={hideHeader}>
            <div className="space-y-5">
                {/* Enable toggle */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            Include Payment Instructions
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                            Shown on the invoice so clients know how to pay you.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleToggle}
                        className={cn(
                            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                            isEnabled ? 'bg-brand-primary' : 'bg-neutral-200 dark:bg-neutral-700'
                        )}
                        role="switch"
                        aria-checked={isEnabled}
                    >
                        <span
                            className={cn(
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                isEnabled ? 'translate-x-5' : 'translate-x-0'
                            )}
                        />
                    </button>
                </div>

                {isEnabled && (
                    <div className="space-y-5">
                        {/* Method tabs */}
                        <div>
                            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1 block mb-2">
                                Payment Method
                            </label>
                            <div className="grid grid-cols-4 gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                                {METHODS.map(m => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => set({ method: m.id })}
                                        className={cn(
                                            'flex flex-col items-center gap-1 py-2 px-1 rounded-md text-[11px] font-semibold transition-all duration-200',
                                            activeMethod === m.id
                                                ? 'bg-white dark:bg-neutral-900 text-brand-primary shadow-sm'
                                                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                        )}
                                    >
                                        {m.icon}
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bank Transfer */}
                        {activeMethod === 'bank_transfer' && (
                            <div className="space-y-3">
                                <Input
                                    label="Bank Name"
                                    placeholder="e.g. First Bank Nigeria"
                                    value={paymentInfo?.bankName ?? ''}
                                    onChange={e => set({ bankName: e.target.value })}
                                />
                                <Input
                                    label="Account Name"
                                    placeholder="e.g. Acme Design Studio"
                                    value={paymentInfo?.accountName ?? ''}
                                    onChange={e => set({ accountName: e.target.value })}
                                />
                                <Input
                                    label="Account Number"
                                    placeholder="e.g. 0123456789"
                                    value={paymentInfo?.accountNumber ?? ''}
                                    onChange={e => set({ accountNumber: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Routing / Sort Code"
                                        placeholder="e.g. 021000021"
                                        value={paymentInfo?.routingNumber ?? ''}
                                        onChange={e => set({ routingNumber: e.target.value })}
                                    />
                                    <Input
                                        label="SWIFT / BIC"
                                        placeholder="e.g. XXXXXXXX"
                                        value={paymentInfo?.swift ?? ''}
                                        onChange={e => set({ swift: e.target.value })}
                                    />
                                </div>
                                <Input
                                    label="IBAN (optional)"
                                    placeholder="e.g. GB29 NWBK 6016 1331 9268 19"
                                    value={paymentInfo?.iban ?? ''}
                                    onChange={e => set({ iban: e.target.value })}
                                />
                            </div>
                        )}

                        {/* Crypto */}
                        {activeMethod === 'crypto' && (
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1">
                                        Cryptocurrency
                                    </label>
                                    <select
                                        className="flex h-10 w-full rounded-apple border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary transition-all duration-200 cursor-pointer"
                                        value={paymentInfo?.cryptoCurrency ?? 'BTC'}
                                        onChange={e => set({ cryptoCurrency: e.target.value })}
                                    >
                                        <option value="BTC">Bitcoin (BTC)</option>
                                        <option value="ETH">Ethereum (ETH)</option>
                                        <option value="USDT">Tether (USDT)</option>
                                        <option value="USDC">USD Coin (USDC)</option>
                                        <option value="SOL">Solana (SOL)</option>
                                        <option value="BNB">BNB</option>
                                        <option value="XRP">XRP</option>
                                        <option value="LTC">Litecoin (LTC)</option>
                                    </select>
                                </div>
                                <Input
                                    label="Wallet Address"
                                    placeholder="e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf Na"
                                    value={paymentInfo?.walletAddress ?? ''}
                                    onChange={e => set({ walletAddress: e.target.value })}
                                />
                                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-900/40">
                                    <Bitcoin size={14} className="text-amber-600 mt-0.5 shrink-0" />
                                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                                        Double-check your wallet address. Crypto transactions are irreversible.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Other */}
                        {activeMethod === 'other' && (
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1">
                                        Custom Payment Instructions
                                    </label>
                                    <textarea
                                        className="flex w-full rounded-apple border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary transition-all duration-200 resize-none placeholder:text-neutral-400"
                                        rows={4}
                                        placeholder="e.g. Please send payment via Wise to account@example.com, referencing your invoice number."
                                        value={paymentInfo?.customInstructions ?? ''}
                                        onChange={e => set({ customInstructions: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Clear button */}
                        <button
                            type="button"
                            onClick={() => updatePaymentInfo(undefined)}
                            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 transition-colors"
                        >
                            <X size={12} />
                            Remove payment details
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
};
