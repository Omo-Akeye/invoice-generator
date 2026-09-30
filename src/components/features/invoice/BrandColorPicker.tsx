import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Pipette } from 'lucide-react';
import { useInvoice } from '../../../store/InvoiceContext';
import { normalizeHex, readableOn } from '../../../utils/color';
import { cn } from '../../../utils/cn';
import { fieldBase } from '../../ui/Input';

// Curated to print well and stay legible; every template derives its darker and lighter shades from these.
const SWATCHES = [
    { name: 'Lime', hex: '#d4f24a' },
    { name: 'Forest', hex: '#1f7a4d' },
    { name: 'Teal', hex: '#0f766e' },
    { name: 'Ocean', hex: '#1d6fe8' },
    { name: 'Indigo', hex: '#4f46e5' },
    { name: 'Plum', hex: '#9333ea' },
    { name: 'Rose', hex: '#e11d48' },
    { name: 'Tangerine', hex: '#f97316' },
];

const EASE = [0.2, 0.8, 0.2, 1] as const;

const ring = 'ring-2 ring-ink ring-offset-2 ring-offset-surface';
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface';

export const BrandColorPicker: React.FC<{ className?: string }> = ({ className }) => {
    const { invoice, updateBrandColor } = useInvoice();
    const value = invoice.brandColor;
    const custom = value && !SWATCHES.some((s) => s.hex === value) ? value : undefined;
    const hexId = useId();
    const errorId = useId();
    const panelId = useId();
    // Most people keep the template's own colours, so the picker stays tucked away until asked for.
    const [open, setOpen] = useState(false);
    const current = value ? (SWATCHES.find((sw) => sw.hex === value)?.name ?? value.toUpperCase()) : 'Default';

    // null while the hex field isn't being edited, so swatch clicks show straight through.
    const [draft, setDraft] = useState<string | null>(null);
    const shown = draft ?? (value ? value.toUpperCase() : '');
    const draftInvalid = draft !== null && draft.trim() !== '' && !normalizeHex(draft);
    const [showError, setShowError] = useState(false);

    const onHexChange = (text: string) => {
        setDraft(text);
        setShowError(false);
        const hex = normalizeHex(text);
        if (hex) updateBrandColor(hex);
    };

    const onHexBlur = () => {
        if (draftInvalid) {
            setShowError(true);
            return;
        }
        setDraft(null);
    };

    return (
        <div className={className}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-center gap-3 rounded-control py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
                <span
                    aria-hidden
                    className={cn('h-5 w-5 shrink-0 rounded-full border', value ? 'border-black/10' : 'border-dashed border-line-strong')}
                    style={value ? { background: value } : undefined}
                />
                <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium text-ink">Brand colour</span>
                    <span className="block text-xs text-ink-faint">{current}</span>
                </span>
                <span className="flex items-center gap-1 text-[13px] font-medium text-ink-muted">
                    {open ? 'Hide' : 'Customise'}
                    <ChevronDown size={15} strokeWidth={1.75} className={cn('transition-transform duration-200', open && 'rotate-180')} />
                </span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3">
                            <p className="text-xs text-ink-faint">Colours the header, labels and total on every template.</p>

                            <div role="radiogroup" aria-label="Brand colour" className="mt-3 flex flex-wrap items-center gap-1">
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={!value}
                                    onClick={() => {
                                        setDraft(null);
                                        updateBrandColor(undefined);
                                    }}
                                    className={cn(
                                        'mr-1 h-10 rounded-full border px-3.5 text-[13px] font-medium transition-colors duration-150 sm:h-8',
                                        focusRing,
                                        !value ? 'border-brand bg-brand text-on-brand' : 'border-line-strong text-ink-muted hover:border-ink-faint hover:text-ink'
                                    )}
                                >
                                    Default
                                </button>

                                {SWATCHES.map((swatch) => {
                                    const active = value === swatch.hex;
                                    return (
                                        <button
                                            key={swatch.hex}
                                            type="button"
                                            role="radio"
                                            aria-checked={active}
                                            aria-label={swatch.name}
                                            title={swatch.name}
                                            onClick={() => {
                                                setDraft(null);
                                                updateBrandColor(swatch.hex);
                                            }}
                                            // 40px tap target around a 28px dot.
                                            className={cn('flex h-10 w-10 items-center justify-center rounded-full', focusRing)}
                                        >
                                            <span
                                                className={cn(
                                                    'flex h-7 w-7 items-center justify-center rounded-full border border-black/10 transition-shadow duration-150',
                                                    active && ring
                                                )}
                                                style={{ background: swatch.hex, color: readableOn(swatch.hex) }}
                                            >
                                                {active && <Check size={14} strokeWidth={2.5} />}
                                            </span>
                                        </button>
                                    );
                                })}

                                {/* The native colour picker, dressed as a swatch. Shows the custom colour once one is set. */}
                                <label
                                    title="Custom colour"
                                    className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40"
                                >
                                    <input
                                        type="color"
                                        aria-label="Custom colour"
                                        value={value ?? '#1d6fe8'}
                                        onChange={(e) => {
                                            setDraft(null);
                                            updateBrandColor(e.target.value);
                                        }}
                                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    />
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'pointer-events-none flex h-7 w-7 items-center justify-center rounded-full border transition-shadow duration-150',
                                            custom ? cn('border-black/10', ring) : 'border-dashed border-line-strong text-ink-muted'
                                        )}
                                        style={custom ? { background: custom, color: readableOn(custom) } : undefined}
                                    >
                                        {custom ? <Check size={14} strokeWidth={2.5} /> : <Pipette size={14} strokeWidth={1.75} />}
                                    </span>
                                </label>
                            </div>

                            <div className="mt-3 max-w-44">
                                <label htmlFor={hexId} className="sr-only">
                                    Hex code
                                </label>
                                <div className="relative">
                                    <span
                                        aria-hidden
                                        className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-black/10"
                                        style={{ background: normalizeHex(draft ?? '') ?? value ?? 'transparent' }}
                                    />
                                    <input
                                        id={hexId}
                                        value={shown}
                                        placeholder="#1D6FE8"
                                        onFocus={() => setDraft(shown)}
                                        onChange={(e) => onHexChange(e.target.value)}
                                        onBlur={onHexBlur}
                                        spellCheck={false}
                                        autoComplete="off"
                                        autoCapitalize="characters"
                                        maxLength={7}
                                        aria-invalid={showError || undefined}
                                        aria-describedby={showError ? errorId : undefined}
                                        className={cn(
                                            fieldBase,
                                            'h-9 pl-9 font-mono uppercase tabular-nums',
                                            showError && 'border-danger focus-visible:border-danger focus-visible:ring-danger/15'
                                        )}
                                    />
                                </div>
                                {showError && (
                                    <p id={errorId} className="mt-1.5 text-xs text-danger">
                                        Use a hex code like #1D6FE8.
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
