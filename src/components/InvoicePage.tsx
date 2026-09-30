import React, { useEffect, useMemo, useState } from 'react';
import { useInvoice } from '../store/InvoiceContext';
import { CompanyForm } from './features/invoice/CompanyForm';
import { ClientForm, InvoiceDetailsForm } from './features/invoice/DetailsForm';
import { InvoiceItems } from './features/invoice/InvoiceItems';
import { InvoiceSummary } from './features/invoice/InvoiceSummary';
import { InvoicePreview } from './features/invoice/InvoicePreview';
import { TemplatePicker } from './features/invoice/TemplatePicker';
import { getTemplate } from './features/invoice/templates/registry';
import { PaymentDetailsForm } from './features/invoice/PaymentDetailsForm';
import { Button } from './ui/Button';
import { ExportButton } from './ui/ExportButton';
import { TextArea } from './ui/Input';
import { ScaledFrame } from './ui/ScaledFrame';
import { Logo, LogoMark } from './ui/Logo';
import { EditorSkeleton } from './ui/EditorSkeleton';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { ThemeToggle } from './ui/ThemeToggle';
import { Footer } from './ui/Footer';
import { CurrencyText } from './ui/CurrencyText';
import { RollingNumber } from './ui/RollingNumber';
import { Check, ChevronDown, Eye, Loader2, RotateCcw, Share, X } from 'lucide-react';
import { canShareFiles, createInvoiceFile, downloadFile, shareFile, type ExportFormat } from '../utils/pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';
import { cn } from '../utils/cn';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { sanitizeText } from '../utils/sanitize';
import { Link } from 'react-router';

type Notice = { message: string; action?: { label: string; onClick: () => void } };

type Section = 'template' | 'details' | 'parties' | 'items' | 'summary' | 'payment' | 'notes';

const EASE = [0.2, 0.8, 0.2, 1] as const;

// Every export renders the preview at this width, so PDFs look the same on every device.
const PAGE_WIDTH = 640;

const PAYMENT_NAMES = { bank_transfer: 'Bank transfer', crypto: 'Crypto', other: 'Custom' } as const;

const EditorSection: React.FC<{
    id: Section;
    index: number;
    title: string;
    description: string;
    hint?: React.ReactNode;
    isOpen: boolean;
    collapsible: boolean;
    onToggle: (id: Section) => void;
    children: React.ReactNode;
}> = ({ id, index, title, description, hint, isOpen, collapsible, onToggle, children }) => {
    const number = <span className="w-5 shrink-0 pt-px font-mono text-xs tabular-nums text-ink-faint">{String(index).padStart(2, '0')}</span>;

    return (
        <section id={`section-${id}`} className="scroll-mt-20 rounded-card border border-line bg-surface">
            {collapsible ? (
                <button
                    type="button"
                    onClick={() => onToggle(id)}
                    aria-expanded={isOpen}
                    aria-controls={`section-body-${id}`}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40 rounded-card"
                >
                    {number}
                    <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</span>
                        {!isOpen && hint && <span className="mt-0.5 block truncate text-[13px] text-ink-muted">{hint}</span>}
                    </span>
                    <ChevronDown size={16} strokeWidth={1.75} className={cn('shrink-0 text-ink-faint transition-transform duration-200', isOpen && 'rotate-180')} />
                </button>
            ) : (
                <div className="flex gap-3 px-5 pt-5">
                    {number}
                    <div>
                        <h2 className="text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</h2>
                        <p className="mt-0.5 text-[13px] text-ink-muted">{description}</p>
                    </div>
                </div>
            )}

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={`section-body-${id}`}
                        initial={collapsible ? { height: 0, opacity: 0 } : false}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24, ease: EASE }}
                        className="overflow-hidden"
                    >
                        <div className={cn(collapsible ? 'px-4 pb-5 pt-1' : 'p-5 pl-13')}>{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export const InvoicePage: React.FC = () => {
    const { invoice, isLoading, isValid, updateInvoiceDetails, clearInvoice } = useInvoice();
    const [activeSection, setActiveSection] = useState<Section | null>('template');
    const [showMobilePreview, setShowMobilePreview] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [confirmReset, setConfirmReset] = useState(false);
    const isMobile = useMediaQuery('(max-width: 1279px)');
    const canShare = useMemo(canShareFiles, []);

    useEffect(() => {
        if (!notice) return;
        // Notices with an action wait longer so there is time to tap it.
        const timer = window.setTimeout(() => setNotice(null), notice.action ? 15000 : 4500);
        return () => window.clearTimeout(timer);
    }, [notice]);

    const filename = invoice.invoiceNumber || 'draft-invoice';

    const renderFile = async (format: ExportFormat): Promise<File | null> => {
        if (!isValid) {
            setNotice({ message: 'Add a client name and at least one priced item first.' });
            return null;
        }
        try {
            setIsExporting(true);
            return await createInvoiceFile('invoice-preview', filename, format);
        } catch (error) {
            console.error(`${format.toUpperCase()} Export Error:`, error);
            setNotice({ message: `Couldn't create the ${format.toUpperCase()}. Please try again.` });
            return null;
        } finally {
            setIsExporting(false);
        }
    };

    const handleExport = async (format: ExportFormat = 'pdf') => {
        const file = await renderFile(format);
        if (file) downloadFile(file);
    };

    const share = async (file: File) => {
        try {
            const result = await shareFile(file, `Invoice ${invoice.invoiceNumber}`.trim());
            if (result === 'needs-gesture') {
                // Rendering outlasted the tap's permission window (Safari); ask for one more tap.
                setNotice({ message: 'Your PDF is ready to send.', action: { label: 'Share', onClick: () => share(file) } });
            } else {
                setNotice(null);
            }
        } catch (error) {
            console.error('Share Error:', error);
            setNotice({ message: "Couldn't open sharing. Download the PDF and send it instead.", action: { label: 'Download', onClick: () => downloadFile(file) } });
        }
    };

    const handleShare = async () => {
        const file = await renderFile('pdf');
        if (file) await share(file);
    };

    if (isLoading) return <EditorSkeleton />;

    const currency = invoice.settings.currency;
    const money = (value: number) => <CurrencyText currency={currency}>{formatCurrency(value, currency)}</CurrencyText>;
    const namedItems = invoice.items.filter((item) => item.name.trim()).length;

    const sections: { id: Section; title: string; description: string; hint?: React.ReactNode; body: React.ReactNode }[] = [
        {
            id: 'template',
            title: 'Template',
            description: 'Pick a look. You can switch any time.',
            hint: getTemplate(invoice.template).name,
            body: <TemplatePicker />,
        },
        {
            id: 'details',
            title: 'Invoice details',
            description: 'Number and dates shown at the top.',
            hint: invoice.invoiceNumber,
            body: <InvoiceDetailsForm />,
        },
        {
            id: 'parties',
            title: 'From and bill to',
            description: 'Who is sending this, and who pays.',
            hint: invoice.client.name ? `To ${invoice.client.name}` : 'Add your client',
            body: (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <CompanyForm />
                    <ClientForm />
                </div>
            ),
        },
        {
            id: 'items',
            title: 'Line items',
            description: 'What you are charging for.',
            hint: namedItems === 0 ? 'No items yet' : `${namedItems} ${namedItems === 1 ? 'item' : 'items'}`,
            body: <InvoiceItems />,
        },
        {
            id: 'summary',
            title: 'Currency, tax and discount',
            description: 'Totals update as you type.',
            hint: <>Total {money(invoice.total)}</>,
            body: <InvoiceSummary />,
        },
        {
            id: 'payment',
            title: 'Payment details',
            description: 'Tell your client how to pay you.',
            hint: invoice.paymentInfo ? PAYMENT_NAMES[invoice.paymentInfo.method] : 'Not shown',
            body: <PaymentDetailsForm />,
        },
        {
            id: 'notes',
            title: 'Notes',
            description: 'Terms, thanks, or anything else.',
            hint: invoice.notes ? invoice.notes : 'Optional',
            body: (
                <TextArea
                    aria-label="Notes or terms"
                    placeholder="Payment is due within 14 days. Thank you for your business."
                    value={invoice.notes}
                    onChange={(e) => updateInvoiceDetails({ notes: sanitizeText(e.target.value, 500) })}
                    rows={4}
                />
            ),
        },
    ];

    // Exactly one #invoice-preview must exist at a time; the exporters look it up by id.
    const preview = (
        <ScaledFrame baseWidth={PAGE_WIDTH} className="rounded-md bg-white shadow-paper">
            <InvoicePreview />
        </ScaledFrame>
    );

    return (
        <div className="flex min-h-screen flex-col bg-canvas">
            <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md no-print">
                <div className="invoice-container flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <Link to="/" aria-label="InvoicePro home" className="shrink-0">
                            <LogoMark className="sm:hidden" />
                            <Logo className="hidden sm:inline-flex" />
                        </Link>
                        <span aria-hidden className="text-line-strong">/</span>
                        <span className="truncate font-mono text-[13px] tabular-nums text-ink">{invoice.invoiceNumber || 'Untitled'}</span>
                        <span className="hidden items-center gap-1 text-xs text-ink-faint md:inline-flex">
                            <Check size={13} strokeWidth={2} className="text-positive" />
                            Saved on this device
                        </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                        <ThemeToggle className="mr-1" />
                        <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)} aria-label="Start a new invoice">
                            <RotateCcw size={14} strokeWidth={1.75} />
                            <span className="hidden sm:inline">Start over</span>
                        </Button>
                        <div className="hidden xl:block">
                            <ExportButton onExport={handleExport} onShare={canShare ? handleShare : undefined} isExporting={isExporting} size="sm" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="invoice-container w-full flex-1 px-4 pb-32 pt-8 sm:px-6 sm:pt-10 xl:pb-16">
                <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(440px,0.82fr)]">
                    <div className="min-w-0 no-print">
                        <div className="mb-8">
                            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-[28px]">New invoice</h1>
                            <p className="mt-1.5 text-[15px] text-ink-muted">
                                Your draft saves automatically to this browser, and nowhere else.
                            </p>
                        </div>

                        <div className="space-y-3 xl:space-y-4">
                            {sections.map((section, i) => (
                                <EditorSection
                                    key={section.id}
                                    id={section.id}
                                    index={i + 1}
                                    title={section.title}
                                    description={section.description}
                                    hint={section.hint}
                                    collapsible={isMobile}
                                    isOpen={!isMobile || activeSection === section.id}
                                    onToggle={(id) => setActiveSection((current) => (current === id ? null : id))}
                                >
                                    {section.body}
                                </EditorSection>
                            ))}
                        </div>
                    </div>

                    {!isMobile && (
                        <aside className="sticky top-18 flex max-h-[calc(100vh-5.5rem)] flex-col no-print" aria-label="Invoice preview">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-[13px] font-medium text-ink">Preview</p>
                                <p className="text-xs text-ink-faint">{getTemplate(invoice.template).name} · A4</p>
                            </div>
                            <div className="min-h-0 overflow-y-auto rounded-[20px] bg-subtle p-6">{preview}</div>
                        </aside>
                    )}
                </div>
            </main>

            <Footer />

            {/* Mobile: keep the preview mounted off-screen so downloads work without opening it. */}
            {isMobile && !showMobilePreview && (
                <div aria-hidden className="pointer-events-none fixed -left-2500 top-0" style={{ width: PAGE_WIDTH }}>
                    {preview}
                </div>
            )}

            <AnimatePresence>
                {isMobile && !showMobilePreview && (
                    <motion.div
                        initial={{ y: 80 }}
                        animate={{ y: 0 }}
                        exit={{ y: 80 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl no-print"
                    >
                        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-xs text-ink-faint">Total due</p>
                                <p className="truncate text-lg font-semibold tracking-[-0.02em] text-ink">
                                    <CurrencyText currency={currency}>
                                        <RollingNumber value={formatCurrency(invoice.total, currency)} />
                                    </CurrencyText>
                                </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <Button variant="secondary" size="md" className="px-3 min-[420px]:px-4" onClick={() => setShowMobilePreview(true)} aria-label="Preview invoice">
                                    <Eye size={15} strokeWidth={1.75} />
                                    <span className="hidden min-[420px]:inline">Preview</span>
                                </Button>
                                <ExportButton onExport={handleExport} onShare={canShare ? handleShare : undefined} isExporting={isExporting} size="md" dropUp />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showMobilePreview && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Invoice preview"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 24 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="fixed inset-0 z-60 flex flex-col bg-canvas no-print"
                    >
                        <div className="flex h-14 items-center justify-between border-b border-line px-4">
                            <p className="text-[15px] font-medium text-ink">Preview</p>
                            <Button variant="ghost" size="icon" onClick={() => setShowMobilePreview(false)} aria-label="Close preview">
                                <X size={18} strokeWidth={1.75} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-subtle p-4">
                            <div className="mx-auto max-w-2xl">{preview}</div>
                        </div>
                        <div className="border-t border-line bg-canvas p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
                            {canShare ? (
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="lg" className="flex-1" onClick={handleShare} disabled={isExporting}>
                                        <Share size={17} strokeWidth={1.75} />
                                        Share
                                    </Button>
                                    <div className="flex-1">
                                        <ExportButton onExport={handleExport} isExporting={isExporting} size="lg" fullWidth dropUp />
                                    </div>
                                </div>
                            ) : (
                                <ExportButton onExport={handleExport} isExporting={isExporting} size="lg" fullWidth dropUp />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmDialog
                open={confirmReset}
                title="Start a new invoice?"
                description="This clears everything in your current draft, including your logo, client and payment details. It can't be undone."
                confirmLabel="Clear draft"
                destructive
                onCancel={() => setConfirmReset(false)}
                onConfirm={() => {
                    clearInvoice();
                    setConfirmReset(false);
                    setActiveSection('template');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />

            <AnimatePresence>
                {notice && (
                    <motion.div
                        role="status"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="fixed inset-x-4 bottom-24 z-70 mx-auto flex max-w-md items-start gap-3 rounded-card bg-ink px-4 py-3 text-sm text-canvas shadow-pop xl:bottom-8 no-print"
                    >
                        <p className="flex-1 self-center leading-relaxed">{notice.message}</p>
                        {notice.action && (
                            <button
                                type="button"
                                onClick={() => {
                                    const { onClick } = notice.action!;
                                    setNotice(null);
                                    onClick();
                                }}
                                className="-my-1 shrink-0 rounded-control bg-canvas px-3 py-1.5 text-[13px] font-medium text-ink transition-opacity hover:opacity-90"
                            >
                                {notice.action.label}
                            </button>
                        )}
                        <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss" className="mt-0.5 opacity-60 transition-opacity hover:opacity-100">
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isExporting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center bg-canvas/60 backdrop-blur-sm no-print"
                    >
                        <div className="flex items-center gap-3 rounded-card border border-line bg-surface px-5 py-4 shadow-pop">
                            <Loader2 size={18} className="animate-spin text-ink-muted" />
                            <p className="text-sm text-ink">Preparing your download…</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
