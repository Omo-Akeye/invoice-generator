import { forwardRef } from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export const InvoicePreview = forwardRef<HTMLDivElement>((_, ref) => {
    const { invoice } = useInvoice();

    return (
        <div
            ref={ref}
            className="bg-white text-black p-6 w-full min-h-[calc(100vh-8rem)]"
            id="invoice-preview"
        >

            <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-5 mb-6">
                <div className="space-y-2">
                    {invoice.company.logo && (
                        <img src={invoice.company.logo} alt="Logo" className="h-10 w-auto object-contain" />
                    )}
                    <div>
                        <h1 className="text-base font-black uppercase tracking-tight leading-tight">{invoice.company.name || 'YOUR COMPANY'}</h1>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">{invoice.company.address}</p>
                        <p className="text-[11px] text-neutral-500">{invoice.company.email}</p>
                        <p className="text-[11px] text-neutral-500">{invoice.company.phone}</p>
                    </div>
                </div>

                <div className="text-right">
                    <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight mb-2">Invoice</h2>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Invoice Number</p>
                    <p className="text-sm font-bold">{invoice.invoiceNumber}</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Bill To</h3>
                        <p className="text-sm font-bold leading-tight">{invoice.client.name || 'CLIENT NAME'}</p>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">{invoice.client.address}</p>
                        <p className="text-[11px] text-neutral-500">{invoice.client.email}</p>
                    </div>
                    <div className="flex gap-4 shrink-0">
                        <div>
                            <h3 className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1 whitespace-nowrap">Issue Date</h3>
                            <p className="text-xs font-bold whitespace-nowrap">{formatDate(invoice.issueDate)}</p>
                        </div>
                        <div>
                            <h3 className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1 whitespace-nowrap">Due Date</h3>
                            <p className="text-xs font-bold whitespace-nowrap">{formatDate(invoice.dueDate)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-200">
                            <th className="py-2 text-left text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Item</th>
                            <th className="py-2 text-center text-[9px] font-bold text-neutral-400 uppercase tracking-wider w-10">Qty</th>
                            <th className="py-2 text-right text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Rate</th>
                            <th className="py-2 text-right text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {invoice.items.map((item) => (
                            <tr key={item.id}>
                                <td className="py-3">
                                    <p className="text-xs font-bold text-neutral-900">{item.name || 'Empty Item'}</p>
                                    {item.description && <p className="text-[10px] text-neutral-500 mt-0.5">{item.description}</p>}
                                </td>
                                <td className="py-3 text-center text-xs font-medium">{item.quantity}</td>
                                <td className="py-3 text-right text-xs font-medium whitespace-nowrap">{formatCurrency(item.unitPrice, invoice.settings.currency)}</td>
                                <td className="py-3 text-right text-xs font-bold whitespace-nowrap">{formatCurrency(item.total, invoice.settings.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end">
                <div className="w-1/2 space-y-2">
                    <div className="flex justify-between text-xs py-0.5">
                        <span className="text-neutral-500 font-medium">Subtotal</span>
                        <span className="font-bold whitespace-nowrap">{formatCurrency(invoice.subtotal, invoice.settings.currency)}</span>
                    </div>

                    {invoice.settings.includeTax && (
                        <div className="flex justify-between text-xs py-0.5">
                            <span className="text-neutral-500 font-medium">Tax ({invoice.settings.taxRate}%)</span>
                            <span className="font-bold whitespace-nowrap">{formatCurrency(invoice.taxAmount, invoice.settings.currency)}</span>
                        </div>
                    )}

                    {invoice.settings.discountValue > 0 && (
                        <div className="flex justify-between text-xs py-0.5 text-red-600">
                            <span className="font-medium">Discount</span>
                            <span className="font-bold whitespace-nowrap">-{formatCurrency(invoice.discountAmount, invoice.settings.currency)}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-baseline pt-3 border-t border-neutral-900">
                        <span className="text-[10px] font-black uppercase tracking-tight">Total Due</span>
                        <span className="text-lg font-black text-neutral-900 leading-none whitespace-nowrap">
                            {formatCurrency(invoice.total, invoice.settings.currency)}
                        </span>
                    </div>
                </div>
            </div>

            {invoice.notes && (
                <div className="mt-8 pt-4 border-t border-neutral-100">
                    <h3 className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Notes</h3>
                    <p className="text-[11px] text-neutral-500 leading-relaxed italic">{invoice.notes}</p>
                </div>
            )}

           
        </div>
    );
});

InvoicePreview.displayName = 'InvoicePreview';
