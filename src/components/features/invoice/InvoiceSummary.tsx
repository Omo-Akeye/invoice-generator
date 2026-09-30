import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { FieldLabel, Input } from '../../ui/Input';
import { CurrencyPicker } from './CurrencyPicker';
import { getCurrency } from '../../../utils/currencies';
import { Switch } from '../../ui/Switch';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { formatCurrency } from '../../../utils/formatters';
import { CurrencyText } from '../../ui/CurrencyText';
import { RollingNumber } from '../../ui/RollingNumber';
import { NumericFormat } from 'react-number-format';


export const InvoiceSummary: React.FC<{ hideHeader?: boolean }> = () => {
    const { invoice, updateSettings } = useInvoice();
    const { settings } = invoice;
    const money = (value: number) => <CurrencyText currency={settings.currency}>{formatCurrency(value, settings.currency)}</CurrencyText>;

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-5">
                <CurrencyPicker value={settings.currency} onChange={(currency) => updateSettings({ currency })} />

                <div className="space-y-3">
                    <Switch
                        label="Charge tax"
                        description="Adds VAT or sales tax to the subtotal."
                        checked={settings.includeTax}
                        onChange={(includeTax) => updateSettings({ includeTax })}
                    />
                    {settings.includeTax && (
                        <NumericFormat
                            customInput={Input}
                            inputMode="decimal"
                            aria-label="Tax rate (%)"
                            className="tabular-nums"
                            suffix="%"
                            decimalScale={2}
                            allowNegative={false}
                            isAllowed={(values) => !values.floatValue || values.floatValue <= 100}
                            placeholder="7.5%"
                            value={settings.taxRate === 0 ? '' : settings.taxRate}
                            onValueChange={(values) => updateSettings({ taxRate: values.floatValue ?? 0 })}
                            onFocus={(e) => e.target.select()}
                        />
                    )}
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                        <FieldLabel>Discount</FieldLabel>
                        <SegmentedControl
                            size="sm"
                            className="w-auto"
                            ariaLabel="Discount type"
                            value={settings.discountType}
                            onChange={(discountType) => updateSettings({ discountType })}
                            options={[
                                { value: 'percentage', label: 'Percent' },
                                { value: 'fixed', label: 'Amount' },
                            ]}
                        />
                    </div>
                    <NumericFormat
                        customInput={Input}
                        inputMode="decimal"
                        aria-label="Discount"
                        className="tabular-nums"
                        thousandSeparator=","
                        suffix={settings.discountType === 'percentage' ? '%' : undefined}
                        decimalScale={settings.discountType === 'percentage' ? 2 : getCurrency(settings.currency).decimals}
                        allowNegative={false}
                        placeholder={settings.discountType === 'percentage' ? '0%' : getCurrency(settings.currency).decimals ? '0.00' : '0'}
                        value={settings.discountValue === 0 ? '' : settings.discountValue}
                        onValueChange={(values) => updateSettings({ discountValue: values.floatValue ?? 0 })}
                        onFocus={(e) => e.target.select()}
                    />
                </div>
            </div>

            <dl className="h-fit space-y-3 rounded-card bg-subtle p-5 text-sm tabular-nums">
                <div className="flex justify-between gap-4 text-ink-muted">
                    <dt>Subtotal</dt>
                    <dd className="text-ink">{money(invoice.subtotal)}</dd>
                </div>
                {settings.includeTax && (
                    <div className="flex justify-between gap-4 text-ink-muted">
                        <dt>Tax ({settings.taxRate}%)</dt>
                        <dd className="text-ink">+ {money(invoice.taxAmount)}</dd>
                    </div>
                )}
                {settings.discountValue > 0 && (
                    <div className="flex justify-between gap-4 text-ink-muted">
                        <dt>Discount{settings.discountType === 'percentage' ? ` (${settings.discountValue}%)` : ''}</dt>
                        <dd className="text-ink">− {money(invoice.discountAmount)}</dd>
                    </div>
                )}
                <div className="flex items-baseline justify-between gap-4 border-t border-line-strong pt-3">
                    <dt className="font-medium text-ink">Total due</dt>
                    <dd className="text-xl font-semibold tracking-[-0.02em] text-ink">
                        <CurrencyText currency={settings.currency}>
                            <RollingNumber value={formatCurrency(invoice.total, settings.currency)} />
                        </CurrencyText>
                    </dd>
                </div>
            </dl>
        </div>
    );
};
