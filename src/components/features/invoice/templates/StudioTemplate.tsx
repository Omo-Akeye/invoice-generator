import type { Invoice } from '../../../../types/invoice';
import { formatDate } from '../../../../utils/formatters';
import { Money, PaymentFields } from './parts';
import { clientName, companyName, getTotalRows } from './totals';

const meta = 'text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-400';

// Swiss-style and type-led: an oversized "Invoice" headline, strict columns and a three-part footer.
export const StudioTemplate: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
    <div className="flex w-full aspect-[210/297] flex-col px-10 py-10 text-stone-900" style={{ background: '#f7f5ef' }}>
        <div className="flex items-start justify-between">
            {invoice.company.logo ? (
                <img src={invoice.company.logo} alt="Logo" className="h-9 w-auto object-contain" />
            ) : (
                <p className="text-[17px] font-extrabold leading-tight tracking-tight">+ {companyName(invoice)}</p>
            )}
            <div className="text-right text-[11px] leading-relaxed">
                <p>Invoice no. {invoice.invoiceNumber}</p>
                <p>Date: {formatDate(invoice.issueDate)}</p>
            </div>
        </div>

        <h1 className="mt-10 text-[76px] font-extrabold leading-[0.9] tracking-[-0.055em]">Invoice</h1>

        <div className="mt-8 grid grid-cols-2 gap-8 border-t border-stone-900 pt-3 text-[11px]">
            <div>
                <p className={meta}>Billed to</p>
                <p className="mt-1.5 text-[13px] font-bold">{clientName(invoice)}</p>
                <p className="leading-relaxed text-stone-500">{invoice.client.address}</p>
                <p className="text-stone-500">{invoice.client.email}</p>
            </div>
            <div>
                <p className={meta}>Amount due</p>
                <p className="mt-1.5 whitespace-nowrap text-[22px] font-extrabold leading-none tracking-tight"><Money invoice={invoice} value={invoice.total} /></p>
                <p className="mt-1.5 text-stone-500">Due {formatDate(invoice.dueDate)}</p>
            </div>
        </div>

        <table className="mt-8 w-full table-fixed">
            <thead>
                <tr className="border-y border-stone-900">
                    <th className={`${meta} w-[48%] py-2 text-left`}>Description</th>
                    <th className={`${meta} w-[12%] py-2 text-center`}>Qty</th>
                    <th className={`${meta} w-[18%] py-2 text-right`}>Rate</th>
                    <th className={`${meta} w-[22%] py-2 text-right`}>Amount</th>
                </tr>
            </thead>
            <tbody>
                {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-stone-300">
                        <td className="overflow-hidden py-2.5 pr-3">
                            <p className="truncate text-[11px] font-semibold">{item.name || 'Empty Item'}</p>
                            {item.description && <p className="mt-0.5 line-clamp-2 text-[10px] text-stone-500">{item.description}</p>}
                        </td>
                        <td className="py-2.5 text-center text-[11px]">{item.quantity}</td>
                        <td className="whitespace-nowrap py-2.5 text-right text-[11px]"><Money invoice={invoice} value={item.unitPrice} /></td>
                        <td className="whitespace-nowrap py-2.5 text-right text-[11px] font-semibold"><Money invoice={invoice} value={item.total} /></td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="mt-4 flex justify-end">
            <div className="w-[44%] space-y-1 text-[11px]">
                {getTotalRows(invoice).map((row) => (
                    <div key={row.key} className="flex justify-between gap-4">
                        <span className="text-stone-500">{row.label}</span>
                        <span className="whitespace-nowrap"><Money invoice={invoice} value={row.value} negative={row.key === 'discount'} /></span>
                    </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 pt-1.5">
                    <span className="font-extrabold">Total</span>
                    <span className="whitespace-nowrap text-[14px] font-extrabold"><Money invoice={invoice} value={invoice.total} /></span>
                </div>
            </div>
        </div>

        {invoice.notes && <p className="mt-6 max-w-[60%] text-[11px] leading-relaxed text-stone-600">{invoice.notes}</p>}

        {/* mt-auto pins the footer to the bottom of the page when the invoice is short. */}
        <div className="mt-auto grid grid-cols-3 gap-6 border-t border-stone-900 pt-3 text-[11px]">
            <div>
                <p className={meta}>Due date</p>
                <p className="mt-1.5">{formatDate(invoice.dueDate)}</p>
            </div>
            <div>
                <p className={meta}>Contact</p>
                <p className="mt-1.5 leading-relaxed">{invoice.company.phone}</p>
                <p className="leading-relaxed">{invoice.company.email}</p>
                <p className="leading-relaxed text-stone-500">{invoice.company.address}</p>
            </div>
            <div>
                <p className={meta}>Payment info</p>
                {invoice.paymentInfo ? (
                    <PaymentFields info={invoice.paymentInfo} columns={1} className="mt-1.5" labelClassName="text-[9px] text-stone-400" valueClassName="text-[11px]" />
                ) : (
                    <p className="mt-1.5 text-stone-500">{companyName(invoice)}</p>
                )}
            </div>
        </div>
    </div>
);
