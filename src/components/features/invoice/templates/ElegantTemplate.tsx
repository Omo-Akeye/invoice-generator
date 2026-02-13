import type { Invoice } from '../../../../types/invoice';
import { formatCurrency, formatDate } from '../../../../utils/formatters';

interface TemplateProps {
    invoice: Invoice;
}

export const ElegantTemplate: React.FC<TemplateProps> = ({ invoice }) => {
    return (
        <div
            className="bg-white text-black w-full aspect-[210/297] p-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div
                className="w-full h-[3px] rounded-full mb-8"
                style={{ background: 'linear-gradient(90deg, #92400e, #d97706, #f59e0b, #d97706, #92400e)' }}
            />

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2
                        className="text-3xl font-light tracking-wide mb-1"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#78350f' }}
                    >
                        Invoice
                    </h2>
                    <p className="text-[11px] font-semibold text-amber-800/60 tracking-[0.2em] uppercase">
                        {invoice.invoiceNumber}
                    </p>
                </div>

                <div className="text-right space-y-1">
                    {invoice.company.logo && (
                        <img src={invoice.company.logo} alt="Logo" className="h-10 w-auto object-contain ml-auto mb-2" />
                    )}
                    <h1
                        className="text-sm font-semibold tracking-wide"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1c1917' }}
                    >
                        {invoice.company.name || 'YOUR COMPANY'}
                    </h1>
                    <p className="text-[10px] text-stone-400 leading-relaxed">{invoice.company.address}</p>
                    <p className="text-[10px] text-stone-400">{invoice.company.email}</p>
                    <p className="text-[10px] text-stone-400">{invoice.company.phone}</p>
                </div>
            </div>

            <div className="w-full h-[1px] bg-stone-200 mb-6" />

            <div className="flex justify-between mb-8">
                <div>
                    <p
                        className="text-[10px] font-medium uppercase tracking-[0.2em] mb-2"
                        style={{ color: '#b45309' }}
                    >
                        Billed To
                    </p>
                    <p
                        className="text-sm font-semibold leading-tight mb-1"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1c1917' }}
                    >
                        {invoice.client.name || 'CLIENT NAME'}
                    </p>
                    <p className="text-[10px] text-stone-400 leading-relaxed">{invoice.client.address}</p>
                    <p className="text-[10px] text-stone-400">{invoice.client.email}</p>
                </div>

                <div className="text-right space-y-4">
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-0.5" style={{ color: '#b45309' }}>
                            Date Issued
                        </p>
                        <p className="text-xs font-medium text-stone-700">{formatDate(invoice.issueDate)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-0.5" style={{ color: '#b45309' }}>
                            Date Due
                        </p>
                        <p className="text-xs font-medium text-stone-700">{formatDate(invoice.dueDate)}</p>
                    </div>
                </div>
            </div>

            <div className="mb-8 overflow-hidden">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b-2" style={{ borderColor: '#92400e' }}>
                            <th
                                className="pb-2 text-left text-[10px] font-medium uppercase tracking-[0.15em] w-[40%]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#78350f' }}
                            >
                                Description
                            </th>
                            <th
                                className="pb-2 text-center text-[10px] font-medium uppercase tracking-[0.15em] w-[10%]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#78350f' }}
                            >
                                Qty
                            </th>
                            <th
                                className="pb-2 text-right text-[10px] font-medium uppercase tracking-[0.15em] w-[25%]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#78350f' }}
                            >
                                Rate
                            </th>
                            <th
                                className="pb-2 text-right text-[10px] font-medium uppercase tracking-[0.15em] w-[25%]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#78350f' }}
                            >
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item) => (
                            <tr key={item.id} className="border-b border-stone-100">
                                <td className="py-3 pr-2 overflow-hidden">
                                    <p className="text-xs font-medium text-stone-800 truncate">{item.name || 'Empty Item'}</p>
                                    {item.description && (
                                        <p className="text-[10px] text-stone-400 mt-0.5 italic line-clamp-2">{item.description}</p>
                                    )}
                                </td>
                                <td className="py-3 text-center text-xs text-stone-600">{item.quantity}</td>
                                <td className="py-3 text-right text-xs text-stone-600 whitespace-nowrap">
                                    {formatCurrency(item.unitPrice, invoice.settings.currency)}
                                </td>
                                <td className="py-3 text-right text-xs font-semibold text-stone-800 whitespace-nowrap">
                                    {formatCurrency(item.total, invoice.settings.currency)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end">
                <div className="w-1/2 space-y-2">
                    <div className="flex justify-between text-xs py-1">
                        <span className="text-stone-400 font-medium italic">Subtotal</span>
                        <span className="font-medium text-stone-700 whitespace-nowrap">
                            {formatCurrency(invoice.subtotal, invoice.settings.currency)}
                        </span>
                    </div>

                    {invoice.settings.includeTax && (
                        <div className="flex justify-between text-xs py-1">
                            <span className="text-stone-400 font-medium italic">Tax ({invoice.settings.taxRate}%)</span>
                            <span className="font-medium text-stone-700 whitespace-nowrap">
                                {formatCurrency(invoice.taxAmount, invoice.settings.currency)}
                            </span>
                        </div>
                    )}

                    {invoice.settings.discountValue > 0 && (
                        <div className="flex justify-between text-xs py-1">
                            <span className="text-red-700/70 font-medium italic">Discount</span>
                            <span className="font-medium text-red-700/80 whitespace-nowrap">
                                -{formatCurrency(invoice.discountAmount, invoice.settings.currency)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-baseline pt-3 mt-1 border-t-2" style={{ borderColor: '#92400e' }}>
                        <span
                            className="text-xs font-semibold uppercase tracking-[0.1em]"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#78350f' }}
                        >
                            Total Due
                        </span>
                        <span
                            className="text-xl font-bold leading-none whitespace-nowrap"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#78350f' }}
                        >
                            {formatCurrency(invoice.total, invoice.settings.currency)}
                        </span>
                    </div>
                </div>
            </div>

            {invoice.notes && (
                <div className="mt-10 pt-4 border-t border-stone-100">
                    <p
                        className="text-[10px] font-medium uppercase tracking-[0.2em] mb-2"
                        style={{ color: '#b45309' }}
                    >
                        Notes & Terms
                    </p>
                    <p className="text-[10px] text-stone-400 leading-relaxed italic">{invoice.notes}</p>
                </div>
            )}

            <div
                className="w-full h-[3px] rounded-full mt-8"
                style={{ background: 'linear-gradient(90deg, #92400e, #d97706, #f59e0b, #d97706, #92400e)' }}
            />
        </div>
    );
};
