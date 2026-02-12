import React from 'react';
import { useInvoice } from '../store/InvoiceContext';
import { CompanyForm } from './features/invoice/CompanyForm';
import { ClientForm, InvoiceDetailsForm } from './features/invoice/DetailsForm';
import { InvoiceItems } from './features/invoice/InvoiceItems';
import { InvoiceSummary } from './features/invoice/InvoiceSummary';
import { InvoicePreview } from './features/invoice/InvoicePreview';
import { Button } from './ui/Button';
import { TextArea } from './ui/Input';
import { Download, Trash2, Printer, Layout } from 'lucide-react';
import { exportToPDF } from '../utils/pdf';
import { motion } from 'framer-motion';

export const InvoicePage: React.FC = () => {
    const { invoice, updateInvoiceDetails, clearInvoice } = useInvoice();

    const handleExport = async () => {
        await exportToPDF('invoice-preview', `invoice-${invoice.invoiceNumber || 'draft'}`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            {/* Top Navbar */}
            <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 no-print">
                <div className="invoice-container px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-lg leading-none">I</span>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight hidden sm:block">InvoicePro</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={clearInvoice} className="text-neutral-500">
                            <Trash2 size={16} className="mr-2" />
                            Clear
                        </Button>
                        <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-2" />
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                            <Printer size={16} className="mr-2" />
                            Print
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleExport}>
                            <Download size={16} className="mr-2" />
                            Export PDF
                        </Button>
                    </div>
                </div>
            </header>

            <main className="invoice-container px-4 py-8">
                <div className="flex flex-col xl:flex-row gap-8 items-start">

                    {/* Form Side */}
                    <div className="w-full xl:w-[60%] space-y-8 no-print pb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter">Draft Invoice</h2>
                                    <p className="text-neutral-500 mt-1">Fill in the details below to generate your professional invoice.</p>
                                </div>
                            </div>

                            <InvoiceDetailsForm />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <CompanyForm />
                                <ClientForm />
                            </div>

                            <InvoiceItems />

                            <InvoiceSummary />

                            <div className="bg-white dark:bg-neutral-900 rounded-apple p-6 border border-neutral-200 dark:border-neutral-800 shadow-premium">
                                <TextArea
                                    label="Notes / Terms"
                                    placeholder="Payment is due within 14 days. Thank you for your business!"
                                    value={invoice.notes}
                                    onChange={(e) => updateInvoiceDetails({ notes: e.target.value })}
                                    rows={4}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Preview Side */}
                    <div className="w-full xl:w-[40%] xl:sticky xl:top-24 space-y-4">
                        <div className="flex items-center justify-between mb-4 no-print">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center">
                                <Layout size={14} className="mr-2" />
                                Live Preview
                            </h3>
                            <p className="text-[10px] text-neutral-400 font-medium italic">Changes update instantly</p>
                        </div>

                        <div className="xl:scale-[0.6] xl:origin-top-left 2xl:scale-[0.7] transform transition-transform border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xl bg-neutral-100 dark:bg-neutral-900 group">
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none z-10" />
                            <div className="bg-white pointer-events-none xl:pointer-events-auto">
                                <InvoicePreview />
                            </div>
                        </div>

                        <p className="text-center text-xs text-neutral-400 no-print xl:pt-4">
                            Your data is saved automatically to your browser.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
