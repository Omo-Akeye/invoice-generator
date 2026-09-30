import type { Invoice } from '../../../../types/invoice';
import { formatDate } from '../../../../utils/formatters';
import { Money, PaymentFields } from './parts';
import { clientName, companyName, getTotalRows } from './totals';
import { mix } from '../../../../utils/color';
import { getBrandTones } from './brand';

const BROWN = '#6b4a34';
const TAN = '#c9ab8c';
const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const script = { fontFamily: "'Instrument Serif', 'Playfair Display', Georgia, serif", fontStyle: 'italic' as const };

// Warm cream paper, serif headings, a white line-item card and a handwritten-style thank-you.
export const BoutiqueTemplate: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    const initial = (invoice.company.name || 'Y').trim().charAt(0).toUpperCase();
    // Brown on cream by default; a brand colour tints the paper and replaces the brown and tan.
    const t = getBrandTones(invoice.brandColor);
    const paper = t ? mix(t.fill, '#ffffff', 0.9) : '#f7f1ea';
    const brown = t ? t.text : BROWN;
    const tan = t ? mix(t.text, paper, 0.4) : TAN;
    const block = t ? { background: t.fill, color: t.onFill } : { background: BROWN };
    return (
        <div className="w-full aspect-[210/297] px-9 py-9 text-stone-700" style={{ background: paper }}>
            <div className="flex items-start justify-between gap-6">
                {invoice.company.logo ? (
                    <img src={invoice.company.logo} alt="Logo" className="h-14 w-auto object-contain" />
                ) : (
                    <div className="flex h-14 w-14 items-center justify-center text-[26px] text-white" style={{ ...serif, ...block }}>
                        {initial}
                    </div>
                )}
                <div className="text-right">
                    <h1 className="text-[34px] leading-none tracking-[0.12em]" style={{ ...serif, color: brown }}>INVOICE</h1>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">{invoice.invoiceNumber}</p>
                </div>
            </div>

            <div className="mt-9 flex justify-between gap-8 text-[11px]">
                <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: tan }}>Invoice to</p>
                    <p className="mt-1.5 text-[14px]" style={{ ...serif, color: brown }}>{clientName(invoice)}</p>
                    <p className="leading-relaxed text-stone-500">{invoice.client.address}</p>
                    <p className="text-stone-500">{invoice.client.email}</p>
                </div>
                <div className="space-y-2 text-right">
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: tan }}>Date</p>
                        <p className="mt-0.5 text-stone-700">{formatDate(invoice.issueDate)}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: tan }}>Due</p>
                        <p className="mt-0.5 text-stone-700">{formatDate(invoice.dueDate)}</p>
                    </div>
                </div>
            </div>

            <div className="mt-7 rounded-md bg-white px-5 py-4">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b" style={{ borderColor: t ? t.line : '#eadfd3' }}>
                            <th className="w-[46%] pb-2 text-left text-[10px] font-normal uppercase tracking-[0.15em]" style={{ ...serif, color: brown }}>Product</th>
                            <th className="w-[20%] pb-2 text-right text-[10px] font-normal uppercase tracking-[0.15em]" style={{ ...serif, color: brown }}>Price</th>
                            <th className="w-[12%] pb-2 text-center text-[10px] font-normal uppercase tracking-[0.15em]" style={{ ...serif, color: brown }}>Qty</th>
                            <th className="w-[22%] pb-2 text-right text-[10px] font-normal uppercase tracking-[0.15em]" style={{ ...serif, color: brown }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item) => (
                            <tr key={item.id} className="border-b" style={{ borderColor: t ? mix(t.fill, '#ffffff', 0.88) : '#f3ece4' }}>
                                <td className="overflow-hidden py-2.5 pr-3">
                                    <p className="truncate text-[11px] text-stone-800">{item.name || 'Empty Item'}</p>
                                    {item.description && <p className="mt-0.5 line-clamp-2 text-[10px] text-stone-400">{item.description}</p>}
                                </td>
                                <td className="whitespace-nowrap py-2.5 text-right text-[11px]"><Money invoice={invoice} value={item.unitPrice} /></td>
                                <td className="py-2.5 text-center text-[11px]">{item.quantity}</td>
                                <td className="whitespace-nowrap py-2.5 text-right text-[11px] text-stone-800"><Money invoice={invoice} value={item.total} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-end">
                    <div className="w-[48%] space-y-1.5 text-[11px]">
                        {getTotalRows(invoice).map((row) => (
                            <div key={row.key} className="flex justify-between gap-4">
                                <span className="text-stone-500">{row.label}</span>
                                <span className="whitespace-nowrap"><Money invoice={invoice} value={row.value} negative={row.key === 'discount'} /></span>
                            </div>
                        ))}
                        <div className="flex items-baseline justify-between gap-4 px-3 py-2 text-white" style={block}>
                            <span className="text-[11px] uppercase tracking-[0.15em]" style={serif}>Total</span>
                            <span className="whitespace-nowrap text-[16px] font-semibold leading-none"><Money invoice={invoice} value={invoice.total} /></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 items-end gap-8">
                <div className="space-y-4 text-[10px]">
                    {invoice.paymentInfo && (
                        <div>
                            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: tan }}>Payment details</p>
                            <PaymentFields info={invoice.paymentInfo} columns={1} labelClassName="text-[9px] text-stone-400" valueClassName="text-[11px] text-stone-700" />
                        </div>
                    )}
                    {invoice.notes && <p className="leading-relaxed text-stone-500">{invoice.notes}</p>}
                </div>
                <div className="text-right">
                    <p className="text-[46px] leading-none" style={{ ...script, color: brown }}>Thank you</p>
                    <p className="mt-3 text-[11px]" style={{ ...serif, color: brown }}>{companyName(invoice)}</p>
                    <p className="text-[10px] text-stone-500">{invoice.company.phone}</p>
                    <p className="text-[10px] text-stone-500">{invoice.company.email}</p>
                    <p className="text-[10px] text-stone-500">{invoice.company.address}</p>
                </div>
            </div>
        </div>
    );
};
