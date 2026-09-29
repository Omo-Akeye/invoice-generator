import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import type { InvoiceTemplate } from '../../../types/invoice';
import { Check } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { InvoiceSheet } from './InvoiceSheet';

const templates: { id: InvoiceTemplate; name: string; description: string }[] = [
    { id: 'classic', name: 'Classic', description: 'Clean and minimal' },
    { id: 'modern', name: 'Modern', description: 'Bold header' },
    { id: 'elegant', name: 'Elegant', description: 'Serif and warm' },
];

export const TemplatePicker: React.FC<{ hideHeader?: boolean }> = () => {
    const { invoice, updateTemplate } = useInvoice();

    return (
        <div role="radiogroup" aria-label="Invoice template" className="grid grid-cols-3 gap-3">
            {templates.map((template) => {
                const isActive = invoice.template === template.id;
                return (
                    <button
                        key={template.id}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => updateTemplate(template.id)}
                        className="group flex flex-col text-left focus-visible:outline-none"
                    >
                        <div
                            className={cn(
                                'relative aspect-[4/5] overflow-hidden rounded-[10px] border bg-subtle p-2 transition-[border-color,box-shadow] duration-150 group-focus-visible:ring-2 group-focus-visible:ring-accent/40',
                                isActive ? 'border-accent ring-1 ring-accent' : 'border-line group-hover:border-line-strong'
                            )}
                        >
                            {/* A live, miniature render of the real template with the user's own data. */}
                            <InvoiceSheet invoice={invoice} template={template.id} className="pointer-events-none rounded-[4px] shadow-sm" />
                            {isActive && (
                                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                                    <Check size={12} strokeWidth={2.5} />
                                </span>
                            )}
                        </div>
                        <p className={cn('mt-2 text-[13px] font-medium', isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink')}>
                            {template.name}
                        </p>
                        <p className="text-xs text-ink-faint">{template.description}</p>
                    </button>
                );
            })}
        </div>
    );
};
