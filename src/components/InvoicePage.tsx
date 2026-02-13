import React, { useState } from 'react';
import { useInvoice } from '../store/InvoiceContext';
import { CompanyForm } from './features/invoice/CompanyForm';
import { ClientForm, InvoiceDetailsForm } from './features/invoice/DetailsForm';
import { InvoiceItems } from './features/invoice/InvoiceItems';
import { InvoiceSummary } from './features/invoice/InvoiceSummary';
import { InvoicePreview } from './features/invoice/InvoicePreview';
import { TemplatePicker } from './features/invoice/TemplatePicker';
import { Button } from './ui/Button';
import { TextArea } from './ui/Input';
import { Download, Trash2, ChevronRight, Eye, X, Check, ShieldCheck, Circle } from 'lucide-react';
import { exportToPDF } from '../utils/pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';
import { cn } from '../utils/cn';
import { useMediaQuery } from '../hooks/useMediaQuery';

import { Footer } from './ui/Footer';
import { Loader2 } from 'lucide-react';

type Section = 'template' | 'details' | 'parties' | 'items' | 'summary' | 'notes';

const AccordionSection: React.FC<{
    title: string;
    id: Section;
    activeSection: Section;
    setActiveSection: (id: Section) => void;
    children: React.ReactNode;
    isMobile: boolean;
}> = ({ title, id, activeSection, setActiveSection, children, isMobile }) => {
    const isOpen = !isMobile || activeSection === id;

    return (
        <div className={cn(
            "bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-300",
            isMobile ? "border-b border-neutral-100 dark:border-neutral-800" : "rounded-apple border border-neutral-200 dark:border-neutral-800 mb-8"
        )}>
            {isMobile && (
                <button
                    onClick={() => setActiveSection(id)}
                    className="w-full px-6 py-5 flex items-center justify-between group"
                >
                    <span className={cn(
                        "text-xs font-black tracking-widest uppercase transition-colors",
                        isOpen ? "text-brand-primary" : "text-neutral-400 group-hover:text-neutral-600"
                    )}>
                        {title}
                    </span>
                    <ChevronRight
                        size={16}
                        className={cn(
                            "text-neutral-300 transition-transform duration-300",
                            isOpen ? "rotate-90 text-brand-primary" : ""
                        )}
                    />
                </button>
            )}

            {!isMobile && (
                <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                    <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 tracking-widest uppercase">
                        {title}
                    </h2>
                </div>
            )}

            <motion.div
                initial={isMobile ? false : { opacity: 1 }}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <div className={cn(isMobile ? "px-6 pb-6 pt-2" : "p-6")}>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export const InvoicePage: React.FC = () => {
    const { invoice, isLoading, isValid, updateInvoiceDetails, clearInvoice } = useInvoice();
    const [activeSection, setActiveSection] = useState<Section>('template');
    const [showMobilePreview, setShowMobilePreview] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const isMobile = useMediaQuery('(max-width: 1279px)');

    const handleExport = async () => {
        if (!isValid) {
            alert('Please add a client name and at least one item with a price before exporting.');
            return;
        }

        try {
            setIsExporting(true);
            const filename = invoice.invoiceNumber || 'draft-invoice';
            await exportToPDF('invoice-preview', filename);
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                        <img src="/favicon.svg" alt="Logo" className="w-5 h-5" />
                    </div>
                    <h1 className="text-lg font-black tracking-tight">
                        Invoice<span className="text-brand-primary">Pro</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <ShieldCheck size={16} className="text-brand-primary animate-pulse" />
                    <span>Decrypting your data&hellip;</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
            <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 no-print">
                <div className="invoice-container px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                            <img src="/favicon.svg" alt="Logo" className="w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-black tracking-tight flex items-baseline">
                            Invoice<span className="text-brand-primary">Pro</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 rounded-full">
                            <ShieldCheck size={14} className="text-green-600 dark:text-green-400" />
                            <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-tight">Privacy-First (No Backend)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={clearInvoice} className="xl:hidden text-neutral-400">
                                <Trash2 size={18} />
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleExport}
                                disabled={isExporting}
                                className="hidden sm:flex min-w-[80px]"
                            >
                                {isExporting ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        <Download size={16} className="mr-2" />
                                        PDF
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="invoice-container px-0 sm:px-4 py-0 sm:py-8 flex-1">
                <div className="flex flex-col xl:flex-row gap-8 items-start">

                    <div className="w-full xl:w-[55%] no-print">
                        <div className="px-6 py-8 sm:px-0 sm:pt-0 sm:pb-8 space-y-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-black tracking-tighter">Draft Invoice</h2>
                                <div className="flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-tighter">
                                    <Check size={12} className="text-green-500" />
                                    Saved & Encrypted
                                </div>
                            </div>
                            <p className="text-neutral-500 text-sm">Fill in the details to generate your professional invoice. All data is processed locally.</p>


                        </div>

                        <div className={cn(
                            "space-y-0 xl:space-y-0",
                            isMobile ? "bg-white dark:bg-neutral-900 border-y border-neutral-100 dark:border-neutral-800 shadow-sm sm:rounded-apple sm:border sm:mx-0" : ""
                        )}>
                            <AccordionSection
                                title="Template Design"
                                id="template"
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                isMobile={isMobile}
                            >
                                <TemplatePicker hideHeader />
                            </AccordionSection>

                            <AccordionSection
                                title="Invoice Details"
                                id="details"
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                isMobile={isMobile}
                            >
                                <InvoiceDetailsForm hideHeader />
                            </AccordionSection>

                            <AccordionSection
                                title="Sender & Client"
                                id="parties"
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                isMobile={isMobile}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <CompanyForm hideHeader />
                                    <ClientForm hideHeader />
                                </div>
                            </AccordionSection>

                            <AccordionSection
                                title="Items"
                                id="items"
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                isMobile={isMobile}
                            >
                                <InvoiceItems hideHeader />
                            </AccordionSection>

                            <AccordionSection
                                title="Summary & Settings"
                                id="summary"
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                isMobile={isMobile}
                            >
                                <InvoiceSummary hideHeader onExport={handleExport} />
                            </AccordionSection>

                            <AccordionSection
                                title="Additional Notes"
                                id="notes"
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                isMobile={isMobile}
                            >
                                <TextArea
                                    label="Notes / Terms"
                                    placeholder="Payment is due within 14 days. Thank you for your business!"
                                    value={invoice.notes}
                                    onChange={(e) => updateInvoiceDetails({ notes: e.target.value })}
                                    rows={4}
                                />
                            </AccordionSection>
                        </div>

                        {!isMobile && (
                            <div className="mt-8 flex justify-end gap-3">
                                <Button variant="ghost" onClick={clearInvoice} className="text-red-500 hover:bg-red-50">
                                    <Trash2 size={16} className="mr-2" />
                                    Reset Draft
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="hidden xl:block w-full xl:w-[45%] xl:sticky xl:top-24 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                <div className="relative flex items-center justify-center">
                                    <Circle size={8} className="text-brand-primary fill-brand-primary" />
                                    <Circle size={8} className="absolute text-brand-primary fill-brand-primary animate-pulse-soft" />
                                </div>
                                Live Preview
                            </h3>
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
                                <ShieldCheck size={12} className="text-neutral-300" />
                                <span>AES-256 AES-GCM Encrypted</span>
                            </div>
                        </div>

                        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white shadow-2xl shadow-neutral-200/50 dark:shadow-none">
                            <InvoicePreview />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <AnimatePresence>
                {isMobile && !showMobilePreview && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 no-print"
                    >
                        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight truncate">Total Amount</p>
                                <p className={cn(
                                    "font-black text-brand-primary leading-tight truncate",
                                    invoice.total.toString().length > 15 ? "text-sm" :
                                        invoice.total.toString().length > 10 ? "text-lg" : "text-xl"
                                )}>
                                    {formatCurrency(invoice.total, invoice.settings.currency)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="px-3 min-w-[40px] h-10"
                                    onClick={() => setShowMobilePreview(true)}
                                >
                                    <Eye size={18} className="sm:mr-2" />
                                    <span className="hidden sm:inline">Preview</span>
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="px-3 min-w-[40px] h-10 shadow-lg shadow-blue-500/25"
                                    onClick={handleExport}
                                    disabled={isExporting}
                                >
                                    {isExporting ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Download size={18} />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showMobilePreview && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        className="fixed inset-0 z-[60] bg-neutral-100 dark:bg-neutral-950 flex flex-col no-print"
                    >
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                            <h2 className="font-bold">Invoice Preview</h2>
                            <button
                                onClick={() => setShowMobilePreview(false)}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 flex items-start justify-center">
                            <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden">
                                <InvoicePreview />
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                            <Button variant="primary" className="w-full" onClick={handleExport} disabled={isExporting}>
                                {isExporting ? (
                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                ) : (
                                    <Download size={18} className="mr-2" />
                                )}
                                {isExporting ? 'Generating PDF...' : 'Download PDF'}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isExporting && !isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-neutral-950/20 backdrop-blur-sm flex items-center justify-center no-print"
                    >
                        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                            <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center">
                                <Loader2 size={24} className="text-white animate-spin" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg">Generating PDF</h3>
                                <p className="text-sm text-neutral-500">Please wait while we prepare your invoice...</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
