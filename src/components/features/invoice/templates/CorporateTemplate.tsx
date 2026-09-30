import type { Invoice } from '../../../../types/invoice';
import { formatDate } from '../../../../utils/formatters';
import { Money, PaymentFields } from './parts';
import { clientName, companyName, getTotalRows } from './totals';
import { getBrandTones } from './brand';

const NAVY = '#0b2a5b';
const BLUE = '#1d6fe8';

// Navy header band with an angled blue edge, navy table header and a strong total bar.
export const CorporateTemplate: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    // Navy and blue by default; a brand colour takes the blue role and a deep shade of it replaces the navy.
    const t = getBrandTones(invoice.brandColor);
    const navy = t ? t.deep : NAVY;
    const blue = t ? t.fill : BLUE;
    const label = { color: t ? t.text : BLUE };
    const muted = t ? { color: t.onDeepMuted } : undefined;
    return (
        <div className="w-full aspect-[210/297] bg-white text-slate-800">
            <div className="px-9 pb-4 pt-9 text-white" style={{ background: navy }}>
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <h1 className="text-[32px] font-extrabold leading-none tracking-tight">INVOICE</h1>
                        <p className="mt-2 text-[11px] font-medium text-blue-100" style={muted}>No: {invoice.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                        {invoice.company.logo && (
                            <div className="mb-2 ml-auto inline-block rounded-md bg-white p-1.5">
                                <img src={invoice.company.logo} alt="Logo" className="h-8 w-auto object-contain" />
                            </div>
                        )}
                        <p className="text-[14px] font-bold">{companyName(invoice)}</p>
                        <p className="text-[10px] text-blue-100" style={muted}>{invoice.company.email}</p>
                        <p className="text-[10px] text-blue-100" style={muted}>{invoice.company.phone}</p>
                    </div>
                </div>
            </div>
            {/* Angled edge drawn as SVG (not clip-path) so it survives PDF export. */}
            <svg aria-hidden className="block h-11 w-full" viewBox="0 0 640 44" preserveAspectRatio="none">
                <polygon points="0,0 640,0 640,8 0,34" fill={navy} />
                <polygon points="0,34 640,8 640,14 0,42" fill={blue} />
            </svg>

            <div className="px-9">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={label}>Bill to</p>
                        <p className="mt-1 text-[13px] font-bold text-slate-900">{clientName(invoice)}</p>
                        <p className="text-[11px] leading-relaxed text-slate-500">{invoice.client.address}</p>
                        <p className="text-[11px] text-slate-500">{invoice.client.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={label}>From</p>
                        <p className="mt-1 text-[13px] font-bold text-slate-900">{companyName(invoice)}</p>
                        <p className="text-[11px] leading-relaxed text-slate-500">{invoice.company.address}</p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-lg border border-slate-200 text-[10px]">
                    <div className="px-4 py-2.5">
                        <p className="font-semibold uppercase tracking-wider text-slate-400">Issue date</p>
                        <p className="mt-0.5 text-[12px] font-semibold text-slate-900">{formatDate(invoice.issueDate)}</p>
                    </div>
                    <div className="border-x border-slate-200 px-4 py-2.5">
                        <p className="font-semibold uppercase tracking-wider text-slate-400">Due date</p>
                        <p className="mt-0.5 text-[12px] font-semibold text-slate-900">{formatDate(invoice.dueDate)}</p>
                    </div>
                    <div className="px-4 py-2.5 text-white" style={{ background: blue, color: t?.onFill }}>
                        <p className="font-semibold uppercase tracking-wider text-blue-100" style={t ? { color: t.onFill, opacity: 0.75 } : undefined}>Amount due</p>
                        <p className="mt-0.5 whitespace-nowrap text-[12px] font-bold"><Money invoice={invoice} value={invoice.total} /></p>
                    </div>
                </div>

                <table className="mt-6 w-full table-fixed">
                    <thead>
                        <tr className="text-white" style={{ background: navy }}>
                            <th className="w-[44%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider">Description</th>
                            <th className="w-[12%] px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider">Qty</th>
                            <th className="w-[22%] px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider">Rate</th>
                            <th className="w-[22%] px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={item.id} style={{ background: index % 2 ? '#ffffff' : t ? t.tint : '#f4f7fb' }}>
                                <td className="overflow-hidden px-3 py-2.5">
                                    <p className="truncate text-[11px] font-semibold text-slate-900">{item.name || 'Empty Item'}</p>
                                    {item.description && <p className="mt-0.5 line-clamp-2 text-[10px] text-slate-500">{item.description}</p>}
                                </td>
                                <td className="px-3 py-2.5 text-center text-[11px]">{item.quantity}</td>
                                <td className="whitespace-nowrap px-3 py-2.5 text-right text-[11px]"><Money invoice={invoice} value={item.unitPrice} /></td>
                                <td className="whitespace-nowrap px-3 py-2.5 text-right text-[11px] font-semibold text-slate-900"><Money invoice={invoice} value={item.total} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-end">
                    <div className="w-[46%] space-y-1.5 text-[11px]">
                        {getTotalRows(invoice).map((row) => (
                            <div key={row.key} className="flex justify-between gap-4 px-3">
                                <span className="text-slate-500">{row.label}</span>
                                <span className="whitespace-nowrap font-semibold"><Money invoice={invoice} value={row.value} negative={row.key === 'discount'} /></span>
                            </div>
                        ))}
                        <div className="flex items-baseline justify-between gap-4 rounded-md px-3 py-2.5 text-white" style={{ background: navy }}>
                            <span className="text-[11px] font-bold uppercase tracking-wider">Total</span>
                            <span className="whitespace-nowrap text-[17px] font-extrabold leading-none"><Money invoice={invoice} value={invoice.total} /></span>
                        </div>
                    </div>
                </div>

                {(invoice.paymentInfo || invoice.notes) && (
                    <div className="mt-8 grid grid-cols-2 gap-6">
                        <div>
                            {invoice.paymentInfo && (
                                <div className="rounded-lg border border-slate-200 p-3">
                                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={label}>Payment information</p>
                                    <PaymentFields info={invoice.paymentInfo} labelClassName="text-[9px] uppercase tracking-wide text-slate-400" valueClassName="text-[11px] font-semibold text-slate-800" />
                                </div>
                            )}
                        </div>
                        <div>
                            {invoice.notes && (
                                <>
                                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={label}>Notes</p>
                                    <p className="text-[11px] leading-relaxed text-slate-500">{invoice.notes}</p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-10 flex items-center gap-4 pb-9">
                    <span className="h-[3px] flex-1 rounded-full" style={{ background: navy }} />
                    <p className="text-[12px] font-bold" style={{ color: navy }}>Thank you for your business</p>
                </div>
            </div>
        </div>
    );
};
