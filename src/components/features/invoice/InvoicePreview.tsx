import { forwardRef } from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export const InvoicePreview = forwardRef<HTMLDivElement>((_, ref) => {
    const { invoice } = useInvoice();

    return (
        <div
            ref={ref}
            className="bg-white text-black p-12 shadow-2xl min-h-[1100px] w-full max-w-[800px] mx-auto origin-top transition-transform duration-500"
            id="invoice-preview"
        >
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-8 mb-12">
                <div className="space-y-4">
                    {invoice.company.logo && (
                        <img src={invoice.company.logo} alt="Logo" className="h-16 w-auto object-contain" />
                    )}
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black uppercase tracking-tighter">{invoice.company.name || 'YOUR COMPANY'}</h1>
                        <p className="text-sm text-neutral-500 whitespace-pre-line leading-relaxed">{invoice.company.address}</p>
                        <p className="text-sm text-neutral-500">{invoice.company.email}</p>
                        <p className="text-sm text-neutral-500">{invoice.company.phone}</p>
                    </div>
                </div>

                <div className="text-right space-y-1">
                    <h2 className="text-5xl font-black text-neutral-900 uppercase tracking-tighter mb-4">Invoice</h2>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Invoice Number</p>
                        <p className="text-lg font-bold">{invoice.invoiceNumber}</p>
                    </div>
                </div>
            </div>

            {/* Client and Info */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Bill To</h3>
                    <div className="space-y-1">
                        <p className="text-lg font-bold">{invoice.client.name || 'CLIENT NAME'}</p>
                        <p className="text-sm text-neutral-500 whitespace-pre-line leading-relaxed">{invoice.client.address}</p>
                        <p className="text-sm text-neutral-500">{invoice.client.email}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Issue Date</h3>
                        <p className="text-sm font-bold">{formatDate(invoice.issueDate)}</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Due Date</h3>
                        <p className="text-sm font-bold">{formatDate(invoice.dueDate)}</p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-12">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-200">
                            <th className="py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-widest w-1/2">Item Description</th>
                            <th className="py-3 text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">Qty</th>
                            <th className="py-3 text-right text-xs font-bold text-neutral-400 uppercase tracking-widest">Rate</th>
                            <th className="py-3 text-right text-xs font-bold text-neutral-400 uppercase tracking-widest">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {invoice.items.map((item) => (
                            <tr key={item.id}>
                                <td className="py-4">
                                    <p className="font-bold text-neutral-900">{item.name || 'Empty Item'}</p>
                                    <p className="text-xs text-neutral-500 mt-0.5">{item.description}</p>
                                </td>
                                <td className="py-4 text-center text-sm font-medium">{item.quantity}</td>
                                <td className="py-4 text-right text-sm font-medium">{formatCurrency(item.unitPrice, invoice.settings.currency)}</td>
                                <td className="py-4 text-right text-sm font-bold">{formatCurrency(item.total, invoice.settings.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Calculations */}
            <div className="flex justify-end">
                <div className="w-1/3 space-y-3">
                    <div className="flex justify-between text-sm py-1">
                        <span className="text-neutral-500 font-medium">Subtotal</span>
                        <span className="font-bold">{formatCurrency(invoice.subtotal, invoice.settings.currency)}</span>
                    </div>

                    {invoice.settings.includeTax && (
                        <div className="flex justify-between text-sm py-1 border-b border-neutral-100 pb-2">
                            <span className="text-neutral-500 font-medium text-xs">Tax ({invoice.settings.taxRate}%)</span>
                            <span className="font-bold">{formatCurrency(invoice.taxAmount, invoice.settings.currency)}</span>
                        </div>
                    )}

                    {invoice.settings.discountValue > 0 && (
                        <div className="flex justify-between text-sm py-1 text-red-600">
                            <span className="font-medium text-xs">Discount</span>
                            <span className="font-bold">-{formatCurrency(invoice.discountAmount, invoice.settings.currency)}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-baseline pt-4">
                        <span className="text-sm font-black uppercase tracking-tighter">Total Amount Due</span>
                        <span className="text-2xl font-black text-neutral-900 leading-none">
                            {formatCurrency(invoice.total, invoice.settings.currency)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
                <div className="mt-16 pt-8 border-t border-neutral-100">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Notes</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed italic">{invoice.notes}</p>
                </div>
            )}

            {/* Footer */}
            <div className="mt-20 text-center">
                <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Generated by Invoice Pro • Apple-Standard Export</p>
            </div>
        </div>
    );
});

InvoicePreview.displayName = 'InvoicePreview';
