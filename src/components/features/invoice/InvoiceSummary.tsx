import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { ExportButton } from '../../ui/ExportButton';
import { formatCurrency } from '../../../utils/formatters';
import { CurrencyText } from '../../ui/CurrencyText';
import type { Currency } from '../../../types/invoice';
import { NumericFormat } from 'react-number-format';

export const InvoiceSummary: React.FC<{ hideHeader?: boolean; onExport?: (format: 'pdf' | 'png') => void }> = ({ hideHeader, onExport }) => {
    const { invoice, updateSettings } = useInvoice();

    return (
        <Card title={hideHeader ? "" : "SUMMARY & SETTINGS"} noPadding={hideHeader}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Include Tax (VAT)</label>
                            <input
                                type="checkbox"
                                checked={invoice.settings.includeTax}
                                onChange={(e) => updateSettings({ includeTax: e.target.checked })}
                                className="w-4 h-4 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                            />
                        </div>

                        {invoice.settings.includeTax && (
                            <NumericFormat
                                customInput={Input}
                                label="Tax Rate (%)"
                                decimalScale={2}
                                allowNegative={false}
                                isAllowed={(values) => !values.floatValue || values.floatValue <= 100}
                                placeholder="0"
                                value={invoice.settings.taxRate === 0 ? '' : invoice.settings.taxRate}
                                onValueChange={(values) => updateSettings({ taxRate: values.floatValue ?? 0 })}
                                onFocus={(e) => e.target.select()}
                            />
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1">
                                Currency
                            </label>
                            <select
                                className="flex h-10 w-full rounded-apple border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary transition-all duration-200 cursor-pointer"
                                value={invoice.settings.currency}
                                onChange={(e) => updateSettings({ currency: e.target.value as Currency })}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
                                <option value="NGN">NGN (₦)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Discount</label>
                                <select
                                    className="text-xs bg-transparent border-none focus:ring-0 text-brand-primary font-bold cursor-pointer"
                                    value={invoice.settings.discountType}
                                    onChange={(e) => updateSettings({ discountType: e.target.value as 'percentage' | 'fixed' })}
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>
                            <NumericFormat
                                customInput={Input}
                                thousandSeparator=","
                                decimalScale={2}
                                allowNegative={false}
                                placeholder="0"
                                value={invoice.settings.discountValue === 0 ? '' : invoice.settings.discountValue}
                                onValueChange={(values) => updateSettings({ discountValue: values.floatValue ?? 0 })}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-apple space-y-3 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500 font-medium uppercase tracking-tight">Subtotal</span>
                                <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                                    <CurrencyText currency={invoice.settings.currency}>{formatCurrency(invoice.subtotal, invoice.settings.currency)}</CurrencyText>
                                </span>
                            </div>

                            {invoice.settings.includeTax && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 font-medium uppercase tracking-tight">Tax ({invoice.settings.taxRate}%)</span>
                                    <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                                        + <CurrencyText currency={invoice.settings.currency}>{formatCurrency(invoice.taxAmount, invoice.settings.currency)}</CurrencyText>
                                    </span>
                                </div>
                            )}

                            {invoice.settings.discountValue > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 font-medium uppercase tracking-tight">
                                        Discount {invoice.settings.discountType === 'percentage' ? `(${invoice.settings.discountValue}%)` : ''}
                                    </span>
                                    <span className="text-red-500 font-semibold">
                                        - <CurrencyText currency={invoice.settings.currency}>{formatCurrency(invoice.discountAmount, invoice.settings.currency)}</CurrencyText>
                                    </span>
                                </div>
                            )}

                            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-baseline">
                                <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-tighter">Total</span>
                                <span className="text-2xl font-black text-brand-primary">
                                    <CurrencyText currency={invoice.settings.currency}>{formatCurrency(invoice.total, invoice.settings.currency)}</CurrencyText>
                                </span>
                            </div>
                        </div>
                        {onExport && (
                            <div className="mt-6">
                                <ExportButton 
                                    onExport={onExport} 
                                    isExporting={false} 
                                    fullWidth 
                                    dropUp 
                                    size="md" 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};
