import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Plus, X } from 'lucide-react';
import { formatCurrency, getCurrencySymbol } from '../../../utils/formatters';
import { CurrencyText } from '../../ui/CurrencyText';
import { motion, AnimatePresence } from 'framer-motion';
import { sanitizeText } from '../../../utils/sanitize';
import { NumericFormat } from 'react-number-format';

const COLUMNS = 'md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_64px_128px_112px_32px]';

export const InvoiceItems: React.FC<{ hideHeader?: boolean }> = () => {
    const { invoice, addItem, updateItem, removeItem } = useInvoice();
    const currency = invoice.settings.currency;

    return (
        <div>
            <div className={`hidden gap-3 pb-2 text-xs font-medium text-ink-faint md:grid ${COLUMNS}`}>
                <div>Item</div>
                <div>Description</div>
                <div>Qty</div>
                <div>Unit price</div>
                <div className="text-right">Amount</div>
                <div />
            </div>

            <ul className="space-y-3 md:space-y-2">
                <AnimatePresence initial={false}>
                    {invoice.items.map((item, index) => (
                        <motion.li
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.12 } }}
                            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                            className={`relative grid grid-cols-2 items-center gap-2 rounded-card border border-line bg-canvas p-3 md:gap-3 md:rounded-none md:border-0 md:bg-transparent md:p-0 ${COLUMNS}`}
                        >
                            <span className="col-span-2 text-xs font-medium text-ink-faint md:hidden">Item {index + 1}</span>
                            <div className="col-span-2 md:col-span-1">
                                <Input
                                    aria-label="Item name"
                                    placeholder="Item name"
                                    value={item.name}
                                    onChange={(e) => updateItem(item.id, { name: sanitizeText(e.target.value, 100) })}
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <Input
                                    aria-label="Description"
                                    placeholder="Optional details"
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, { description: sanitizeText(e.target.value, 200) })}
                                />
                            </div>
                            <NumericFormat
                                customInput={Input}
                                inputMode="decimal"
                                aria-label="Quantity"
                                className="tabular-nums"
                                thousandSeparator=","
                                decimalScale={2}
                                allowNegative={false}
                                placeholder="1"
                                value={item.quantity === 0 ? '' : item.quantity}
                                onValueChange={(values) => updateItem(item.id, { quantity: values.floatValue ?? 0 })}
                                onFocus={(e) => e.target.select()}
                            />
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-ink-faint">
                                    <CurrencyText currency={currency}>{getCurrencySymbol(currency)}</CurrencyText>
                                </span>
                                <NumericFormat
                                    customInput={Input}
                                    inputMode="decimal"
                                    aria-label="Unit price"
                                    className="pl-7 tabular-nums"
                                    thousandSeparator=","
                                    decimalScale={2}
                                    allowNegative={false}
                                    placeholder="0.00"
                                    value={item.unitPrice === 0 ? '' : item.unitPrice}
                                    onValueChange={(values) => updateItem(item.id, { unitPrice: values.floatValue ?? 0 })}
                                    onFocus={(e) => e.target.select()}
                                />
                            </div>
                            <div className="col-span-2 flex h-9 items-center justify-between text-sm font-medium tabular-nums text-ink md:col-span-1 md:justify-end">
                                <span className="text-[13px] font-normal text-ink-muted md:hidden">Amount</span>
                                <CurrencyText currency={currency}>{formatCurrency(item.total, currency)}</CurrencyText>
                            </div>
                            <div className="absolute right-2 top-2 md:static md:flex md:justify-end">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-ink-faint hover:bg-danger/10 hover:text-danger"
                                    onClick={() => removeItem(item.id)}
                                    disabled={invoice.items.length === 1}
                                    aria-label={`Remove ${item.name || `item ${index + 1}`}`}
                                >
                                    <X size={15} strokeWidth={1.75} />
                                </Button>
                            </div>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>

            <Button variant="ghost" size="sm" className="mt-3 -ml-2 text-ink-muted" onClick={addItem}>
                <Plus size={15} strokeWidth={1.75} />
                Add line item
            </Button>
        </div>
    );
};
