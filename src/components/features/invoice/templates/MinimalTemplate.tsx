import type { Invoice } from '../../../../types/invoice';
import { formatDate } from '../../../../utils/formatters';
import { Money, PaymentFields } from './parts';
import { clientName, companyName, getTotalRows } from './totals';

const label = 'text-[9px] font-medium uppercase tracking-[0.25em] text-neutral-400';

// Airy and centred: letter-spaced light type between hairlines, no fills at all.
export const MinimalTemplate: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
    <div className="w-full aspect-[210/297] bg-white px-12 py-12 text-neutral-700">
        {invoice.company.logo && <img src={invoice.company.logo} alt="Logo" className="mx-auto mb-6 h-9 w-auto object-contain" />}
        <div className="flex items-center gap-5">
            <span className="h-px flex-1 bg-neutral-300" />
            <h1 className="text-[26px] font-light tracking-[0.5em] text-neutral-800" style={{ marginRight: '-0.5em' }}>INVOICE</h1>
            <span className="h-px flex-1 bg-neutral-300" />
        </div>

        <div className="mt-10 grid grid-cols-[1fr_1fr_auto] gap-8 text-[10px] leading-relaxed">
            <div>
                <p className={label}>Issued to</p>
                <p className="mt-2 text-[11px] font-medium text-neutral-800">{clientName(invoice)}</p>
                <p className="text-neutral-500">{invoice.client.address}</p>
                <p className="text-neutral-500">{invoice.client.email}</p>
            </div>
            <div>
                <p className={label}>Pay to</p>
                <p className="mt-2 text-[11px] font-medium text-neutral-800">{companyName(invoice)}</p>
                <p className="text-neutral-500">{invoice.company.address}</p>
                <p className="text-neutral-500">{invoice.company.email}</p>
            </div>
            <div className="space-y-2 text-right">
                <div>
                    <p className={label}>Invoice no.</p>
                    <p className="mt-1 text-neutral-800">{invoice.invoiceNumber}</p>
                </div>
                <div>
                    <p className={label}>Date</p>
                    <p className="mt-1 text-neutral-800">{formatDate(invoice.issueDate)}</p>
                </div>
                <div>
                    <p className={label}>Due</p>
                    <p className="mt-1 text-neutral-800">{formatDate(invoice.dueDate)}</p>
                </div>
            </div>
        </div>

        <table className="mt-10 w-full table-fixed">
            <thead>
                <tr className="border-y border-neutral-300">
                    <th className={`${label} w-[46%] py-2.5 text-left`}>Description</th>
                    <th className={`${label} w-[20%] py-2.5 text-right`}>Unit price</th>
                    <th className={`${label} w-[12%] py-2.5 text-center`}>Qty</th>
                    <th className={`${label} w-[22%] py-2.5 text-right`}>Total</th>
                </tr>
            </thead>
            <tbody>
                {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-neutral-100">
                        <td className="overflow-hidden py-3 pr-3">
                            <p className="truncate text-[11px] text-neutral-800">{item.name || 'Empty Item'}</p>
                            {item.description && <p className="mt-0.5 line-clamp-2 text-[10px] font-light text-neutral-400">{item.description}</p>}
                        </td>
                        <td className="whitespace-nowrap py-3 text-right text-[11px] font-light"><Money invoice={invoice} value={item.unitPrice} /></td>
                        <td className="py-3 text-center text-[11px] font-light">{item.quantity}</td>
                        <td className="whitespace-nowrap py-3 text-right text-[11px] text-neutral-800"><Money invoice={invoice} value={item.total} /></td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="mt-5 flex justify-end">
            <div className="w-[44%] space-y-2 text-[10px]">
                {getTotalRows(invoice).map((row) => (
                    <div key={row.key} className="flex justify-between gap-4">
                        <span className="uppercase tracking-[0.2em] text-neutral-400">{row.label}</span>
                        <span className="whitespace-nowrap text-neutral-700"><Money invoice={invoice} value={row.value} negative={row.key === 'discount'} /></span>
                    </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 border-t border-neutral-300 pt-3">
                    <span className="uppercase tracking-[0.25em] text-neutral-500">Total</span>
                    <span className="whitespace-nowrap text-[18px] font-light text-neutral-900"><Money invoice={invoice} value={invoice.total} /></span>
                </div>
            </div>
        </div>

        {(invoice.notes || invoice.paymentInfo) && (
            <div className="mt-12 grid grid-cols-2 gap-10 border-t border-neutral-200 pt-6">
                <div>
                    {invoice.paymentInfo && (
                        <>
                            <p className={`${label} mb-2`}>Payment</p>
                            <PaymentFields info={invoice.paymentInfo} columns={1} labelClassName="text-[9px] tracking-wide text-neutral-400" valueClassName="text-[10px] text-neutral-700" />
                        </>
                    )}
                </div>
                <div>
                    {invoice.notes && (
                        <>
                            <p className={`${label} mb-2`}>Notes</p>
                            <p className="text-[10px] font-light leading-relaxed text-neutral-500">{invoice.notes}</p>
                        </>
                    )}
                </div>
            </div>
        )}

        {invoice.company.phone && <p className="mt-12 text-center text-[9px] tracking-[0.2em] text-neutral-400">{invoice.company.phone}</p>}
    </div>
);
