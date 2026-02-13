import type { Invoice } from '../../../../types/invoice';
import { formatCurrency, formatDate } from '../../../../utils/formatters';

interface TemplateProps {
    invoice: Invoice;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ invoice }) => {
    return (
        <div className="bg-white text-black w-full aspect-[210/297]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div
                className="px-6 py-8 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)' }}
            >
                <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full opacity-10 bg-white" />
                <div className="absolute bottom-[-20px] right-[60px] w-20 h-20 rounded-full opacity-5 bg-white" />

                <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                        {invoice.company.logo && (
                            <img
                                src={invoice.company.logo}
                                alt="Logo"
                                className="h-10 w-auto object-contain mb-2 brightness-0 invert"
                            />
                        )}
                        <h1 className="text-lg font-extrabold tracking-tight leading-tight">
                            {invoice.company.name || 'YOUR COMPANY'}
                        </h1>
                        <p className="text-[11px] text-blue-200 leading-relaxed">{invoice.company.address}</p>
                        <p className="text-[11px] text-blue-200">{invoice.company.email}</p>
                        <p className="text-[11px] text-blue-200">{invoice.company.phone}</p>
                    </div>
                    <div className="text-right">
                        <div
                            className="inline-block px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] mb-3"
                            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                        >
                            Invoice
                        </div>
                        <p className="text-2xl font-black tracking-tight">{invoice.invoiceNumber}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6">
                <div
                    className="flex gap-6 mb-6 p-4 rounded-xl"
                    style={{ background: '#f0f9ff' }}
                >
                    <div className="flex-1">
                        <p className="text-[9px] font-bold text-sky-400 uppercase tracking-[0.15em] mb-0.5">Issue Date</p>
                        <p className="text-xs font-bold text-slate-800">{formatDate(invoice.issueDate)}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-[9px] font-bold text-sky-400 uppercase tracking-[0.15em] mb-0.5">Due Date</p>
                        <p className="text-xs font-bold text-slate-800">{formatDate(invoice.dueDate)}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-[9px] font-bold text-sky-400 uppercase tracking-[0.15em] mb-0.5">Currency</p>
                        <p className="text-xs font-bold text-slate-800">{invoice.settings.currency}</p>
                    </div>
                </div>

                <div className="mb-6 p-4 rounded-xl border border-slate-100" style={{ background: '#fafbfc' }}>
                    <p className="text-[9px] font-bold text-sky-500 uppercase tracking-[0.15em] mb-2">Bill To</p>
                    <p className="text-sm font-extrabold text-slate-900 leading-tight">{invoice.client.name || 'CLIENT NAME'}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{invoice.client.address}</p>
                    <p className="text-[11px] text-slate-500">{invoice.client.email}</p>
                </div>

                <div className="mb-6 overflow-hidden">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr style={{ background: '#0f172a' }}>
                                <th className="py-2.5 px-3 text-left text-[9px] font-bold text-white uppercase tracking-wider rounded-l-lg w-[40%]">Service</th>
                                <th className="py-2.5 px-3 text-center text-[9px] font-bold text-white uppercase tracking-wider w-[10%]">Qty</th>
                                <th className="py-2.5 px-3 text-right text-[9px] font-bold text-white uppercase tracking-wider w-[25%]">Rate</th>
                                <th className="py-2.5 px-3 text-right text-[9px] font-bold text-white uppercase tracking-wider rounded-r-lg w-[25%]">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr
                                    key={item.id}
                                    style={{ background: index % 2 === 0 ? '#f8fafc' : 'white' }}
                                >
                                    <td className="py-3 px-3 pr-2 overflow-hidden">
                                        <p className="text-xs font-bold text-slate-900 truncate">{item.name || 'Empty Item'}</p>
                                        {item.description && <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>}
                                    </td>
                                    <td className="py-3 px-3 text-center text-xs font-semibold text-slate-700">{item.quantity}</td>
                                    <td className="py-3 px-3 text-right text-xs font-semibold text-slate-700 whitespace-nowrap">{formatCurrency(item.unitPrice, invoice.settings.currency)}</td>
                                    <td className="py-3 px-3 text-right text-xs font-extrabold text-slate-900 whitespace-nowrap">{formatCurrency(item.total, invoice.settings.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <div className="w-3/5 space-y-2">
                        <div className="flex justify-between text-xs py-1">
                            <span className="text-slate-400 font-medium">Subtotal</span>
                            <span className="font-bold text-slate-700 whitespace-nowrap">{formatCurrency(invoice.subtotal, invoice.settings.currency)}</span>
                        </div>

                        {invoice.settings.includeTax && (
                            <div className="flex justify-between text-xs py-1">
                                <span className="text-slate-400 font-medium">Tax ({invoice.settings.taxRate}%)</span>
                                <span className="font-bold text-slate-700 whitespace-nowrap">+{formatCurrency(invoice.taxAmount, invoice.settings.currency)}</span>
                            </div>
                        )}

                        {invoice.settings.discountValue > 0 && (
                            <div className="flex justify-between text-xs py-1">
                                <span className="text-red-400 font-medium">Discount</span>
                                <span className="font-bold text-red-500 whitespace-nowrap">-{formatCurrency(invoice.discountAmount, invoice.settings.currency)}</span>
                            </div>
                        )}

                        <div
                            className="flex justify-between items-baseline px-4 py-3 rounded-xl mt-2"
                            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
                        >
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">Total Due</span>
                            <span className="text-lg font-black text-white leading-none whitespace-nowrap">
                                {formatCurrency(invoice.total, invoice.settings.currency)}
                            </span>
                        </div>
                    </div>
                </div>

                {invoice.notes && (
                    <div className="mt-8 pt-4 border-t border-slate-100">
                        <p className="text-[9px] font-bold text-sky-400 uppercase tracking-[0.15em] mb-2">Notes & Terms</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{invoice.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
