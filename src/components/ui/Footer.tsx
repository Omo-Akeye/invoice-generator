import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-12 mt-auto no-print">
            <div className="invoice-container px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-brand-primary rounded-md flex items-center justify-center">
                                <img src="/favicon.svg" alt="Logo" className="w-4 h-4" />
                            </div>
                            <span className="font-black tracking-tight text-neutral-900 dark:text-neutral-100">
                                Invoice<span className="text-brand-primary">Pro</span>
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 max-w-xs text-center md:text-left leading-relaxed">
                            A professional, privacy-first invoice generator designed for modern businesses and freelancers.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                            <ShieldCheck size={14} className="text-brand-primary" />
                            <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-tight">
                                End-to-End Local Encryption
                            </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-medium">
                            &copy; {new Date().getFullYear()} InvoicePro. Built for professionals.
                        </p>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            <span className="hover:text-brand-primary cursor-pointer transition-colors">Privacy</span>
                            <span className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
                            <span className="hover:text-brand-primary cursor-pointer transition-colors">Terms</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
