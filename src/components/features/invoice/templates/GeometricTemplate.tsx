import type { Invoice } from '../../../../types/invoice';
import { formatDate } from '../../../../utils/formatters';
import { Money, PaymentFields } from './parts';
import { clientName, companyName, getTotalRows } from './totals';

const TEAL = '#0f766e';
const CORAL = '#f3a39b';

// Clean layout framed by overlapping teal and coral triangles in two corners.
export const GeometricTemplate: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
    <div className="relative w-full aspect-[210/297] overflow-hidden bg-white text-slate-700">
        <div className="relative z-10 px-10 pb-28 pt-10">
            {invoice.company.logo && <img src={invoice.company.logo} alt="Logo" className="mb-4 h-9 w-auto object-contain" />}
            <h1 className="text-[30px] font-bold tracking-[0.18em] text-slate-800">INVOICE</h1>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">{companyName(invoice)}</p>

            <div className="mt-8 grid grid-cols-3 gap-6 text-[11px]">
                <div>
                    <p className="text-[10px] font-bold text-slate-900">Date issued:</p>
                    <p className="mt-1">{formatDate(invoice.issueDate)}</p>
                    <p className="mt-3 text-[10px] font-bold text-slate-900">Due date:</p>
                    <p className="mt-1">{formatDate(invoice.dueDate)}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-900">Issued to:</p>
                    <p className="mt-1 font-semibold text-slate-800">{clientName(invoice)}</p>
                    <p className="leading-relaxed text-slate-500">{invoice.client.address}</p>
                    <p className="text-slate-500">{invoice.client.email}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-900">Invoice no:</p>
                    <p className="mt-1">{invoice.invoiceNumber}</p>
                    <p className="mt-3 text-[10px] font-bold text-slate-900">From:</p>
                    <p className="mt-1 leading-relaxed text-slate-500">{invoice.company.address}</p>
                </div>
            </div>

            <table className="mt-8 w-full table-fixed border-collapse">
                <thead>
                    <tr style={{ background: '#eef6f5' }}>
                        <th className="w-[8%] px-2 py-2.5 text-center text-[9px] font-bold uppercase tracking-wider" style={{ color: TEAL }}>No</th>
                        <th className="w-[40%] px-2 py-2.5 text-left text-[9px] font-bold uppercase tracking-wider" style={{ color: TEAL }}>Description</th>
                        <th className="w-[10%] px-2 py-2.5 text-center text-[9px] font-bold uppercase tracking-wider" style={{ color: TEAL }}>Qty</th>
                        <th className="w-[20%] px-2 py-2.5 text-right text-[9px] font-bold uppercase tracking-wider" style={{ color: TEAL }}>Price</th>
                        <th className="w-[22%] px-2 py-2.5 text-right text-[9px] font-bold uppercase tracking-wider" style={{ color: TEAL }}>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item, index) => (
                        <tr key={item.id} className="border-b border-slate-200">
                            <td className="px-2 py-2.5 text-center text-[11px] text-slate-400">{index + 1}</td>
                            <td className="overflow-hidden px-2 py-2.5">
                                <p className="truncate text-[11px] font-medium text-slate-800">{item.name || 'Empty Item'}</p>
                                {item.description && <p className="mt-0.5 line-clamp-2 text-[10px] text-slate-400">{item.description}</p>}
                            </td>
                            <td className="px-2 py-2.5 text-center text-[11px]">{item.quantity}</td>
                            <td className="whitespace-nowrap px-2 py-2.5 text-right text-[11px]"><Money invoice={invoice} value={item.unitPrice} /></td>
                            <td className="whitespace-nowrap px-2 py-2.5 text-right text-[11px] font-medium text-slate-800"><Money invoice={invoice} value={item.total} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-end">
                <div className="w-[46%] space-y-1.5 text-[11px]">
                    {getTotalRows(invoice).map((row) => (
                        <div key={row.key} className="flex justify-between gap-4 px-2">
                            <span className="text-slate-500">{row.label}</span>
                            <span className="whitespace-nowrap"><Money invoice={invoice} value={row.value} negative={row.key === 'discount'} /></span>
                        </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-4 border-t-2 px-2 pt-2" style={{ borderColor: TEAL }}>
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: TEAL }}>Grand total</span>
                        <span className="whitespace-nowrap text-[17px] font-bold leading-none text-slate-900"><Money invoice={invoice} value={invoice.total} /></span>
                    </div>
                </div>
            </div>

            <div className="mt-10 grid grid-cols-[1.3fr_1fr] items-end gap-8">
                <div className="space-y-3 text-[11px]">
                    {invoice.notes && (
                        <p className="leading-relaxed text-slate-500">
                            <span className="font-bold text-slate-800">Note:</span> {invoice.notes}
                        </p>
                    )}
                    {invoice.paymentInfo && (
                        <div>
                            <p className="mb-1.5 text-[10px] font-bold text-slate-800">Payment:</p>
                            <PaymentFields info={invoice.paymentInfo} labelClassName="text-[9px] uppercase tracking-wide text-slate-400" valueClassName="text-[11px] text-slate-700" />
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <div className="border-b border-slate-300 pb-1 text-[13px] italic text-slate-600" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                        {companyName(invoice)}
                    </div>
                    <p className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-slate-400">Authorised signature</p>
                </div>
            </div>
        </div>

        {/* Corner triangles use the CSS border technique: html2canvas drops small fixed-size SVGs from exports. */}
        <div aria-hidden className="absolute right-0 top-0 h-0 w-0" style={{ borderTop: `90px solid ${CORAL}`, borderLeft: '90px solid transparent' }} />
        <div aria-hidden className="absolute right-0 top-0 h-0 w-0" style={{ borderTop: `60px solid ${TEAL}`, borderLeft: '60px solid transparent' }} />
        <div aria-hidden className="absolute bottom-0 left-0 h-0 w-0" style={{ borderBottom: `90px solid ${TEAL}`, borderRight: '90px solid transparent' }} />
        <div aria-hidden className="absolute bottom-0 left-0 h-0 w-0" style={{ borderBottom: `55px solid ${CORAL}`, borderRight: '55px solid transparent' }} />
    </div>
);
