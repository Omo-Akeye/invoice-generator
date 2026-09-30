import type { Invoice } from '../../../../types/invoice';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { CurrencyText } from '../../../ui/CurrencyText';
import { mix } from '../../../../utils/color';
import { getBrandTones } from './brand';

interface TemplateProps {
    invoice: Invoice;
}

export const ElegantTemplate: React.FC<TemplateProps> = ({ invoice }) => {
    // Warm amber by default; a brand colour re-tints the gilded bars, headings, labels and payment panel.
    const t = getBrandTones(invoice.brandColor);
    const bar = t
        ? `linear-gradient(90deg, ${t.deep}, ${t.graphic}, ${t.fill}, ${t.graphic}, ${t.deep})`
        : 'linear-gradient(90deg, #92400e, #d97706, #f59e0b, #d97706, #92400e)';
    const heading = t ? t.deep : '#78350f';
    const label = t ? t.text : '#b45309';
    const rule = t ? t.graphic : '#92400e';
    const panel = t ? { background: t.tint, borderColor: t.line } : { background: '#fffbeb' };
    return (
        <div
            className="bg-white text-black w-full aspect-[210/297] p-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div
                className="w-full h-[3px] rounded-full mb-8"
                style={{ background: bar }}
            />

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2
                        className="text-3xl font-light tracking-wide mb-1"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: heading }}
                    >
                        Invoice
                    </h2>
                    <p className="text-[11px] font-semibold text-amber-800/60 tracking-[0.2em] uppercase" style={t ? { color: mix(t.text, '#ffffff', 0.35) } : undefined}>
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
                        style={{ color: label }}
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
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-0.5" style={{ color: label }}>
                            Date Issued
                        </p>
                        <p className="text-xs font-medium text-stone-700">{formatDate(invoice.issueDate)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-0.5" style={{ color: label }}>
                            Date Due
                        </p>
                        <p className="text-xs font-medium text-stone-700">{formatDate(invoice.dueDate)}</p>
                    </div>
                </div>
            </div>

            <div className="mb-8 overflow-hidden">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b-2" style={{ borderColor: rule }}>
                            <th
                                className="pb-2 text-left text-[10px] font-medium uppercase tracking-[0.15em] w-[40%]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: heading }}
                            >
                                Description
                            </th>
                            <th
                                className="pb-2 text-center text-[10px] font-medium uppercase tracking-[0.15em] w-[10%]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: heading }}
                            >
                                Qty
                            </th>
                            <th
                                className="pb-2 text-right text-[10px] font-medium uppercase tracking-[0.15em] w-[25%]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: heading }}
                            >
                                Rate
                            </th>
                            <th
                                className="pb-2 text-right text-[10px] font-medium uppercase tracking-[0.15em] w-[25%]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: heading }}
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
                                    <CurrencyText currency={invoice.settings.currency}>{formatCurrency(item.unitPrice, invoice.settings.currency)}</CurrencyText>
                                </td>
                                <td className="py-3 text-right text-xs font-semibold text-stone-800 whitespace-nowrap">
                                    <CurrencyText currency={invoice.settings.currency}>{formatCurrency(item.total, invoice.settings.currency)}</CurrencyText>
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
                            <CurrencyText currency={invoice.settings.currency}>{formatCurrency(invoice.subtotal, invoice.settings.currency)}</CurrencyText>
                        </span>
                    </div>

                    {invoice.settings.includeTax && (
                        <div className="flex justify-between text-xs py-1">
                            <span className="text-stone-400 font-medium italic">Tax ({invoice.settings.taxRate}%)</span>
                            <span className="font-medium text-stone-700 whitespace-nowrap">
                                <CurrencyText currency={invoice.settings.currency}>{formatCurrency(invoice.taxAmount, invoice.settings.currency)}</CurrencyText>
                            </span>
                        </div>
                    )}

                    {invoice.settings.discountValue > 0 && (
                        <div className="flex justify-between text-xs py-1">
                            <span className="text-red-700/70 font-medium italic">Discount</span>
                            <span className="font-medium text-red-700/80 whitespace-nowrap">
                                -<CurrencyText currency={invoice.settings.currency}>{formatCurrency(invoice.discountAmount, invoice.settings.currency)}</CurrencyText>
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-baseline pt-3 mt-1 border-t-2" style={{ borderColor: rule }}>
                        <span
                            className="text-xs font-semibold uppercase tracking-[0.1em]"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: heading }}
                        >
                            Total Due
                        </span>
                        <span
                            className="text-xl font-bold leading-none whitespace-nowrap"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: heading }}
                        >
                            <CurrencyText currency={invoice.settings.currency}>{formatCurrency(invoice.total, invoice.settings.currency)}</CurrencyText>
                        </span>
                    </div>
                </div>
            </div>

            {invoice.notes && (
                <div className="mt-10 pt-4 border-t border-stone-100">
                    <p
                        className="text-[10px] font-medium uppercase tracking-[0.2em] mb-2"
                        style={{ color: label }}
                    >
                        Notes & Terms
                    </p>
                    <p className="text-[10px] text-stone-400 leading-relaxed italic">{invoice.notes}</p>
                </div>
            )}

            {invoice.paymentInfo && (
                <div className="mt-6 pt-4 border-t border-stone-100">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-3" style={{ color: label }}>Payment Details</p>
                    {invoice.paymentInfo.method === 'bank_transfer' && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 rounded-lg border border-amber-100" style={panel}>
                            {invoice.paymentInfo.bankName && <div><p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: label }}>Bank</p><p className="text-[11px] font-medium text-stone-800">{invoice.paymentInfo.bankName}</p></div>}
                            {invoice.paymentInfo.accountName && <div><p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: label }}>Account Name</p><p className="text-[11px] font-medium text-stone-800">{invoice.paymentInfo.accountName}</p></div>}
                            {invoice.paymentInfo.accountNumber && <div><p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: label }}>Account No.</p><p className="text-[11px] font-medium text-stone-800">{invoice.paymentInfo.accountNumber}</p></div>}
                            {invoice.paymentInfo.routingNumber && <div><p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: label }}>Routing / Sort</p><p className="text-[11px] font-medium text-stone-800">{invoice.paymentInfo.routingNumber}</p></div>}
                            {invoice.paymentInfo.swift && <div><p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: label }}>SWIFT / BIC</p><p className="text-[11px] font-medium text-stone-800">{invoice.paymentInfo.swift}</p></div>}
                            {invoice.paymentInfo.iban && <div className="col-span-2"><p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: label }}>IBAN</p><p className="text-[11px] font-medium text-stone-800 font-mono">{invoice.paymentInfo.iban}</p></div>}
                        </div>
                    )}
                    {invoice.paymentInfo.method === 'crypto' && (
                        <div className="space-y-2 p-3 rounded-lg border border-amber-100" style={panel}>
                            {invoice.paymentInfo.cryptoCurrency && <div><p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: label }}>Currency</p><p className="text-[11px] font-medium text-stone-800">{invoice.paymentInfo.cryptoCurrency}</p></div>}
                            {invoice.paymentInfo.walletAddress && <div><p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: label }}>Wallet Address</p><p className="text-[10px] font-mono text-stone-700 break-all">{invoice.paymentInfo.walletAddress}</p></div>}
                        </div>
                    )}
                    {invoice.paymentInfo.method === 'other' && invoice.paymentInfo.customInstructions && (
                        <p className="text-[10px] text-stone-400 leading-relaxed italic">{invoice.paymentInfo.customInstructions}</p>
                    )}
                </div>
            )}

            <div
                className="w-full h-[3px] rounded-full mt-8"
                style={{ background: bar }}
            />
        </div>
    );
};
