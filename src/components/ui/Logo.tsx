import React from 'react';
import { cn } from '../../utils/cn';

export const LogoMark: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('h-6 w-6', className)}>
        <rect width="24" height="24" rx="6" className="fill-ink" />
        <path d="M7.5 5.5h9v13l-2.25-1.5L12 18.5l-2.25-1.5L7.5 18.5z" className="fill-canvas" />
        <path d="M9.6 11.4l1.7 1.7 3.2-3.6" fill="none" className="stroke-accent" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <span className={cn('inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-ink', className)}>
        <LogoMark />
        InvoicePro
    </span>
);
