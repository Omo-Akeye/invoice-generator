import type { Invoice } from '../../../../types/invoice';
import { formatDate } from '../../../../utils/formatters';
import { Money, PaymentFields } from './parts';
import { clientName, companyName, getTotalRows } from './totals';

const YELLOW = '#facc15';
const MIN_ROWS = 6;
const cell = 'border border-neutral-800 px-2.5 py-2';

// Spreadsheet-style: a fully ruled grid with a highlighted header and total, padded to look like a ledger.
export const LedgerTemplate: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    const blankRows = Math.max(0, MIN_ROWS - invoice.items.length);
    return (
        <div className="w-full aspect-[210/297] bg-white px-10 py-10 text-neutral-900">
            <div className="flex items-start justify-between gap-8">
                <div>
                    {invoice.company.logo && <img src={invoice.company.logo} alt="Logo" className="mb-3 h-9 w-auto object-contain" />}
                    <h1 className="text-[34px] font-extrabold leading-none tracking-tight">Invoice</h1>
                    <div className="mt-4 space-y-1 text-[11px]">
                        <p><span className="inline-block w-24 font-semibold">Date:</span>{formatDate(invoice.issueDate)}</p>
                        <p><span className="inline-block w-24 font-semibold">Due date:</span>{formatDate(invoice.dueDate)}</p>
                        <p><span className="inline-block w-24 font-semibold">Invoice number:</span>{invoice.invoiceNumber}</p>
                        <p><span className="inline-block w-24 font-semibold">Billed to:</span>{clientName(invoice)}</p>
                        {invoice.client.address && <p className="pl-24 text-neutral-500">{invoice.client.address}</p>}
                    </div>
                </div>
                <div className="max-w-[45%] text-right text-[11px]">
                    <p className="text-[13px] font-bold">{companyName(invoice)}</p>
                    <p className="leading-relaxed text-neutral-500">{invoice.company.address}</p>
                    <p className="text-neutral-500">{invoice.company.email}</p>
                    <p className="text-neutral-500">{invoice.company.phone}</p>
                </div>
            </div>

            <table className="mt-8 w-full table-fixed border-collapse text-[11px]">
                <thead>
                    <tr style={{ background: YELLOW }}>
                        <th className={`${cell} w-[46%] text-left font-bold`}>Description</th>
                        <th className={`${cell} w-[12%] text-center font-bold`}>Qty</th>
                        <th className={`${cell} w-[20%] text-right font-bold`}>Price</th>
                        <th className={`${cell} w-[22%] text-right font-bold`}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item) => (
                        <tr key={item.id}>
                            <td className={`${cell} overflow-hidden`}>
                                <p className="truncate font-medium">{item.name || 'Empty Item'}</p>
                                {item.description && <p className="mt-0.5 line-clamp-2 text-[10px] text-neutral-500">{item.description}</p>}
                            </td>
                            <td className={`${cell} text-center`}>{item.quantity}</td>
                            <td className={`${cell} whitespace-nowrap text-right`}><Money invoice={invoice} value={item.unitPrice} /></td>
                            <td className={`${cell} whitespace-nowrap text-right font-medium`}><Money invoice={invoice} value={item.total} /></td>
                        </tr>
                    ))}
                    {Array.from({ length: blankRows }, (_, i) => (
                        <tr key={`blank-${i}`} aria-hidden>
                            <td className={cell}>&nbsp;</td>
                            <td className={cell} />
                            <td className={cell} />
                            <td className={cell} />
                        </tr>
                    ))}
                    {getTotalRows(invoice).map((row) => (
                        <tr key={row.key}>
                            <td colSpan={2} className="border-0" />
                            <td className={`${cell} text-right font-semibold`}>{row.label}</td>
                            <td className={`${cell} whitespace-nowrap text-right`}><Money invoice={invoice} value={row.value} negative={row.key === 'discount'} /></td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2} className="border-0" />
                        <td className={`${cell} text-right font-extrabold`} style={{ background: YELLOW }}>Total</td>
                        <td className={`${cell} whitespace-nowrap text-right text-[13px] font-extrabold`} style={{ background: YELLOW }}>
                            <Money invoice={invoice} value={invoice.total} />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-9 grid grid-cols-2 gap-8">
                <div>
                    <p className="text-[18px] font-extrabold tracking-tight">THANK YOU</p>
                    {invoice.notes && <p className="mt-2 text-[11px] leading-relaxed text-neutral-600">{invoice.notes}</p>}
                </div>
                {invoice.paymentInfo && (
                    <div className="border border-neutral-800 p-3">
                        <p className="mb-2 text-[11px] font-bold">Payment method</p>
                        <PaymentFields info={invoice.paymentInfo} columns={1} labelClassName="text-[9px] uppercase tracking-wide text-neutral-500" valueClassName="text-[11px] font-medium" />
                    </div>
                )}
            </div>
        </div>
    );
};
