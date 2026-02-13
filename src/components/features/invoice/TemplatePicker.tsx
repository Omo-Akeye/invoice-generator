import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import type { InvoiceTemplate } from '../../../types/invoice';
import { Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface TemplateOption {
    id: InvoiceTemplate;
    name: string;
    description: string;
}

const templates: TemplateOption[] = [
    {
        id: 'classic',
        name: 'Classic',
        description: 'Clean & minimal',
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Bold & colorful',
    },
    {
        id: 'elegant',
        name: 'Elegant',
        description: 'Refined & warm',
    },
];

const TemplateThumbnail: React.FC<{ templateId: InvoiceTemplate }> = ({ templateId }) => {
    if (templateId === 'classic') {
        return (
            <div className="w-full h-full bg-white rounded p-2 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                        <div className="w-10 h-1.5 bg-neutral-800 rounded-full" />
                        <div className="w-7 h-1 bg-neutral-300 rounded-full" />
                    </div>
                    <div className="w-6 h-2 bg-neutral-800 rounded-sm" />
                </div>
                <div className="w-full h-[1px] bg-neutral-800" />
                <div className="flex-1 space-y-1 mt-0.5">
                    <div className="flex gap-1">
                        <div className="flex-1 h-1 bg-neutral-200 rounded-full" />
                        <div className="w-4 h-1 bg-neutral-200 rounded-full" />
                    </div>
                    <div className="flex gap-1">
                        <div className="flex-1 h-1 bg-neutral-100 rounded-full" />
                        <div className="w-4 h-1 bg-neutral-100 rounded-full" />
                    </div>
                    <div className="flex gap-1">
                        <div className="flex-1 h-1 bg-neutral-200 rounded-full" />
                        <div className="w-4 h-1 bg-neutral-200 rounded-full" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="w-8 h-1.5 bg-neutral-800 rounded-full" />
                </div>
            </div>
        );
    }

    if (templateId === 'modern') {
        return (
            <div className="w-full h-full bg-white rounded overflow-hidden flex flex-col">
                <div
                    className="px-2 py-2 space-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0ea5e9 100%)' }}
                >
                    <div className="w-10 h-1.5 bg-white/80 rounded-full" />
                    <div className="w-6 h-1 bg-white/40 rounded-full" />
                </div>
                <div className="px-2 py-1">
                    <div className="flex gap-1">
                        <div className="flex-1 h-2 bg-sky-50 rounded" />
                        <div className="flex-1 h-2 bg-sky-50 rounded" />
                    </div>
                </div>
                <div className="px-2 flex-1 space-y-0.5">
                    <div className="h-1.5 bg-slate-800 rounded-sm" />
                    <div className="h-1 bg-slate-50 rounded-sm" />
                    <div className="h-1 bg-white rounded-sm" />
                    <div className="h-1 bg-slate-50 rounded-sm" />
                </div>
                <div className="px-2 pb-1.5 flex justify-end">
                    <div
                        className="w-12 h-2 rounded"
                        style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white rounded overflow-hidden flex flex-col p-2 gap-1">
            <div
                className="w-full h-[2px] rounded-full"
                style={{ background: 'linear-gradient(90deg, #92400e, #f59e0b, #92400e)' }}
            />
            <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                    <div className="w-8 h-1.5 rounded-full" style={{ background: '#78350f', fontFamily: 'serif' }} />
                    <div className="w-5 h-1 bg-amber-200 rounded-full" />
                </div>
                <div className="space-y-0.5 flex flex-col items-end">
                    <div className="w-6 h-1 bg-stone-300 rounded-full" />
                    <div className="w-4 h-1 bg-stone-200 rounded-full" />
                </div>
            </div>
            <div className="w-full h-[1px] bg-stone-200" />
            <div className="flex-1 space-y-0.5">
                <div className="flex gap-1">
                    <div className="flex-1 h-1 bg-stone-200 rounded-full" />
                    <div className="w-3 h-1 bg-stone-200 rounded-full" />
                </div>
                <div className="flex gap-1">
                    <div className="flex-1 h-1 bg-stone-100 rounded-full" />
                    <div className="w-3 h-1 bg-stone-100 rounded-full" />
                </div>
                <div className="flex gap-1">
                    <div className="flex-1 h-1 bg-stone-200 rounded-full" />
                    <div className="w-3 h-1 bg-stone-200 rounded-full" />
                </div>
            </div>
            <div className="flex justify-end">
                <div className="w-8 h-1.5 rounded-full" style={{ background: '#78350f' }} />
            </div>
            <div
                className="w-full h-[2px] rounded-full"
                style={{ background: 'linear-gradient(90deg, #92400e, #f59e0b, #92400e)' }}
            />
        </div>
    );
};

export const TemplatePicker: React.FC<{ hideHeader?: boolean }> = ({ hideHeader }) => {
    const { invoice, updateTemplate } = useInvoice();

    return (
        <div className={cn(
            "bg-white dark:bg-neutral-900 overflow-hidden",
            !hideHeader && "rounded-apple border border-neutral-200 dark:border-neutral-800"
        )}>
            {!hideHeader && (
                <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                        TEMPLATE
                    </h2>
                </div>
            )}
            <div className={hideHeader ? "" : "p-6"}>
                <div className="flex xl:grid xl:grid-cols-3 gap-3 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide -mx-1 px-1">
                    {templates.map((template) => {
                        const isActive = invoice.template === template.id;
                        return (
                            <button
                                key={template.id}
                                onClick={() => updateTemplate(template.id)}
                                className={cn(
                                    'relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all duration-200 group cursor-pointer flex-none w-[100px] xl:w-full',
                                    isActive
                                        ? 'border-brand-primary bg-blue-50/50 dark:bg-blue-950/20 shadow-sm'
                                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'
                                )}
                            >
                                {isActive && (
                                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center shadow-md z-10">
                                        <Check size={12} className="text-white" strokeWidth={3} />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        'w-full aspect-[3/4] rounded-lg overflow-hidden border transition-shadow',
                                        isActive
                                            ? 'border-brand-primary/30 shadow-sm'
                                            : 'border-neutral-200 dark:border-neutral-700 group-hover:shadow-sm'
                                    )}
                                >
                                    <TemplateThumbnail templateId={template.id} />
                                </div>
                                <div className="text-center">
                                    <p className={cn(
                                        'text-xs font-bold tracking-tight',
                                        isActive ? 'text-brand-primary' : 'text-neutral-700 dark:text-neutral-300'
                                    )}>
                                        {template.name}
                                    </p>
                                    <p className="text-[10px] text-neutral-400 font-medium">
                                        {template.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
