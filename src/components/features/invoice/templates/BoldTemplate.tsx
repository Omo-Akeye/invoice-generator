import type { Invoice } from '../../../../types/invoice';
import { formatDate } from '../../../../utils/formatters';
import { Money, PaymentFields } from './parts';
import { clientName, companyName, getTotalRows } from './totals';

// Heavy "INVOICE" wordmark, greyscale, with dark wave shapes in the bottom corner.
export const BoldTemplate: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
    <div className="relative w-full aspect-[210/297] overflow-hidden bg-white text-neutral-900">
        <div className="relative z-10 px-9 pt-9 pb-40">
            <div className="flex items-start justify-between">
                {invoice.company.logo ? (
                    <img src={invoice.company.logo} alt="Logo" className="h-10 w-auto object-contain" />
                ) : (
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">{companyName(invoice)}</p>
                )}
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">No. {invoice.invoiceNumber}</p>
            </div>

            <h1 className="mt-8 text-[64px] font-black leading-none tracking-[-0.045em]">INVOICE</h1>
            <p className="mt-4 text-[11px] text-neutral-600">
                <span className="font-bold text-neutral-900">Date:</span> {formatDate(invoice.issueDate)}
                <span className="mx-2 text-neutral-300">/</span>
                <span className="font-bold text-neutral-900">Due:</span> {formatDate(invoice.dueDate)}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-8">
                <div>
                    <p className="text-[11px] font-bold">Billed to:</p>
                    <p className="mt-1 text-[12px] font-semibold">{clientName(invoice)}</p>
                    <p className="text-[11px] leading-relaxed text-neutral-500">{invoice.client.address}</p>
                    <p className="text-[11px] text-neutral-500">{invoice.client.email}</p>
                </div>
                <div>
                    <p className="text-[11px] font-bold">From:</p>
                    <p className="mt-1 text-[12px] font-semibold">{companyName(invoice)}</p>
                    <p className="text-[11px] leading-relaxed text-neutral-500">{invoice.company.address}</p>
                    <p className="text-[11px] text-neutral-500">{invoice.company.email}</p>
                    <p className="text-[11px] text-neutral-500">{invoice.company.phone}</p>
                </div>
            </div>

            <table className="mt-8 w-full table-fixed">
                <thead>
                    <tr className="bg-neutral-100">
                        <th className="w-[46%] rounded-l-md px-3 py-2 text-left text-[10px] font-bold">Item</th>
                        <th className="w-[12%] px-3 py-2 text-center text-[10px] font-bold">Qty</th>
                        <th className="w-[21%] px-3 py-2 text-right text-[10px] font-bold">Price</th>
                        <th className="w-[21%] rounded-r-md px-3 py-2 text-right text-[10px] font-bold">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item) => (
                        <tr key={item.id} className="border-b border-neutral-200">
                            <td className="overflow-hidden px-3 py-2.5">
                                <p className="truncate text-[11px] font-semibold">{item.name || 'Empty Item'}</p>
                                {item.description && <p className="mt-0.5 line-clamp-2 text-[10px] text-neutral-500">{item.description}</p>}
                            </td>
                            <td className="px-3 py-2.5 text-center text-[11px]">{item.quantity}</td>
                            <td className="whitespace-nowrap px-3 py-2.5 text-right text-[11px]"><Money invoice={invoice} value={item.unitPrice} /></td>
                            <td className="whitespace-nowrap px-3 py-2.5 text-right text-[11px] font-semibold"><Money invoice={invoice} value={item.total} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-end">
                <div className="w-[48%] space-y-1.5 text-[11px]">
                    {getTotalRows(invoice).map((row) => (
                        <div key={row.key} className="flex justify-between gap-4 px-3">
                            <span className="text-neutral-500">{row.label}</span>
                            <span className="whitespace-nowrap font-semibold"><Money invoice={invoice} value={row.value} negative={row.key === 'discount'} /></span>
                        </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-4 border-t-2 border-neutral-900 px-3 pt-2.5">
                        <span className="text-[12px] font-black">Total</span>
                        <span className="whitespace-nowrap text-[20px] font-black leading-none"><Money invoice={invoice} value={invoice.total} /></span>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-4 text-[11px]">
                {invoice.paymentInfo && (
                    <div>
                        <p className="mb-1.5 font-bold">Payment method:</p>
                        <PaymentFields info={invoice.paymentInfo} labelClassName="text-[9px] uppercase tracking-wide text-neutral-400" valueClassName="text-[11px] font-medium text-neutral-800" className="max-w-[70%]" />
                    </div>
                )}
                {invoice.notes && (
                    <p className="max-w-[70%] leading-relaxed text-neutral-600">
                        <span className="font-bold text-neutral-900">Note:</span> {invoice.notes}
                    </p>
                )}
            </div>
        </div>

        {/* Decorative waves; purely visual and kept behind content. */}
        <svg aria-hidden className="absolute bottom-0 left-0 h-40 w-full" viewBox="0 0 640 160" preserveAspectRatio="none">
            <path d="M0 110 C 140 60, 260 150, 400 100 S 580 40, 640 70 L 640 160 L 0 160 Z" fill="#d4d4d4" />
            <path d="M260 160 C 340 100, 460 120, 540 80 S 620 40, 640 45 L 640 160 Z" fill="#262626" />
        </svg>
    </div>
);
