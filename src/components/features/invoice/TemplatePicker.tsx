import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useInvoice } from '../../../store/InvoiceContext';
import type { InvoiceTemplate } from '../../../types/invoice';
import { cn } from '../../../utils/cn';
import { InvoiceSheet } from './InvoiceSheet';
import { FEATURED_TEMPLATE_COUNT, TEMPLATES, type TemplateDefinition } from './templates/registry';

const EASE = [0.2, 0.8, 0.2, 1] as const;

const TemplateOption: React.FC<{ template: TemplateDefinition; isActive: boolean; onSelect: (id: InvoiceTemplate) => void }> = ({ template, isActive, onSelect }) => {
    const { invoice } = useInvoice();
    return (
        <button
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(template.id)}
            className="group flex flex-col text-left focus-visible:outline-none"
        >
            <div
                className={cn(
                    'relative aspect-4/5 overflow-hidden rounded-[10px] border bg-subtle p-2 transition-[border-color,box-shadow] duration-150 group-focus-visible:ring-2 group-focus-visible:ring-accent/40',
                    isActive ? 'border-accent ring-1 ring-accent' : 'border-line group-hover:border-line-strong'
                )}
            >
                {/* A live, miniature render of the real template with the user's own data. */}
                <InvoiceSheet invoice={invoice} template={template.id} className="pointer-events-none rounded-sm shadow-sm" />
                {isActive && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                        <Check size={12} strokeWidth={2.5} />
                    </span>
                )}
            </div>
            <p className={cn('mt-2 text-[13px] font-medium', isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink')}>{template.name}</p>
            <p className="text-xs text-ink-faint">{template.description}</p>
        </button>
    );
};

export const TemplatePicker: React.FC<{ hideHeader?: boolean }> = () => {
    const { invoice, updateTemplate } = useInvoice();
    const featured = TEMPLATES.slice(0, FEATURED_TEMPLATE_COUNT);
    const more = TEMPLATES.slice(FEATURED_TEMPLATE_COUNT);
    // If the saved template is one of the hidden ones, start expanded so the selection is visible.
    const [expanded, setExpanded] = useState(() => more.some((t) => t.id === invoice.template));
    const moreId = useId();

    return (
        <div role="radiogroup" aria-label="Invoice template">
            <div className="grid grid-cols-3 gap-3">
                {featured.map((template) => (
                    <TemplateOption key={template.id} template={template} isActive={invoice.template === template.id} onSelect={updateTemplate} />
                ))}
            </div>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        id={moreId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-3 gap-3 pt-4">
                            {more.map((template) => (
                                <TemplateOption key={template.id} template={template} isActive={invoice.template === template.id} onSelect={updateTemplate} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                aria-expanded={expanded}
                aria-controls={moreId}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-control border border-dashed border-line-strong py-2 text-[13px] font-medium text-ink-muted transition-colors hover:border-ink-faint hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
                {expanded ? 'Show fewer templates' : `More templates (${more.length})`}
                <ChevronDown size={15} strokeWidth={1.75} className={cn('transition-transform duration-200', expanded && 'rotate-180')} />
            </button>
        </div>
    );
};
