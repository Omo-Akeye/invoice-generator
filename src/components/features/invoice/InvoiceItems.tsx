import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

export const InvoiceItems: React.FC = () => {
    const { invoice, addItem, updateItem, removeItem } = useInvoice();

    return (
        <Card title="LINE ITEMS">
            <div className="space-y-4">
                {/* Header - visible only on desktop */}
                <div className="hidden md:grid grid-cols-[1fr_2fr_80px_120px_100px_40px] gap-4 px-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    <div>Item Name</div>
                    <div>Description</div>
                    <div>Qty</div>
                    <div>Unit Price</div>
                    <div className="text-right">Total</div>
                    <div></div>
                </div>

                <div className="space-y-3">
                    <AnimatePresence initial={false}>
                        {invoice.items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="grid grid-cols-1 md:grid-cols-[1fr_2fr_80px_120px_100px_40px] gap-2 md:gap-4 items-start p-3 md:p-0 rounded-apple md:rounded-none border md:border-0 border-neutral-100 dark:border-neutral-800"
                            >
                                <Input
                                    placeholder="Item name"
                                    value={item.name}
                                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                                />
                                <Input
                                    placeholder="Short description"
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                                />
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                                    <Input
                                        className="pl-6"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.unitPrice}
                                        onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="flex items-center justify-end h-10 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                    {formatCurrency(item.total, invoice.settings.currency)}
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        onClick={() => removeItem(item.id)}
                                        disabled={invoice.items.length === 1}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <Button
                    variant="secondary"
                    className="w-full mt-4 border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-transparent hover:border-brand-primary h-12"
                    onClick={addItem}
                >
                    <Plus size={18} className="mr-2" />
                    Add New Item
                </Button>
            </div>
        </Card>
    );
};
