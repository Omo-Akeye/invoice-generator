import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Search } from 'lucide-react';
import { FieldLabel, fieldBase } from '../../ui/Input';
import { cn } from '../../../utils/cn';
import { getCurrency, searchCurrencies, type CurrencyCode, type CurrencyInfo } from '../../../utils/currencies';

const CurrencySymbol: React.FC<{ currency: CurrencyInfo; className?: string }> = ({ currency, className }) => (
    <span className={cn('inline-flex min-w-9 shrink-0 justify-center tabular-nums', currency.fallbackFont && 'font-currency', className)}>
        {currency.symbol}
    </span>
);

interface CurrencyPickerProps {
    value: CurrencyCode;
    onChange: (code: CurrencyCode) => void;
    label?: string;
}

export const CurrencyPicker: React.FC<CurrencyPickerProps> = ({ value, onChange, label = 'Currency' }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const baseId = useId();
    const listId = `${baseId}-list`;
    const optionId = (code: string) => `${baseId}-${code}`;

    const selected = getCurrency(value);
    const results = useMemo(() => searchCurrencies(query), [query]);
    const showGroups = query.trim() === '';

    const openList = () => {
        setQuery('');
        // Start on the current currency so arrow keys move from where the user already is.
        setActiveIndex(Math.max(0, searchCurrencies('').findIndex((c) => c.code === value)));
        setOpen(true);
    };

    const close = (returnFocus = true) => {
        setOpen(false);
        if (returnFocus) triggerRef.current?.focus();
    };

    const choose = (currency: CurrencyInfo) => {
        onChange(currency.code as CurrencyCode);
        close();
    };

    useEffect(() => {
        if (!open) return;
        const handlePointer = (event: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handlePointer);
        return () => document.removeEventListener('mousedown', handlePointer);
    }, [open]);

    // Keep the highlighted option visible while arrowing through a long list.
    useEffect(() => {
        if (!open) return;
        const option = results[activeIndex];
        if (option) document.getElementById(`${baseId}-${option.code}`)?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex, open, results, baseId]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
                break;
            case 'Home':
                event.preventDefault();
                setActiveIndex(0);
                break;
            case 'End':
                event.preventDefault();
                setActiveIndex(results.length - 1);
                break;
            case 'Enter':
                event.preventDefault();
                if (results[activeIndex]) choose(results[activeIndex]);
                break;
            case 'Escape':
                event.preventDefault();
                close();
                break;
            case 'Tab':
                close(false);
                break;
        }
    };

    return (
        <div ref={rootRef} className="relative w-full space-y-1.5">
            <FieldLabel id={`${baseId}-label`}>{label}</FieldLabel>
            <div className="relative">
                <button
                    ref={triggerRef}
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-labelledby={`${baseId}-label ${baseId}-value`}
                    onClick={() => (open ? close() : openList())}
                    onKeyDown={(e) => {
                        if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                            e.preventDefault();
                            openList();
                        }
                    }}
                    className={cn(fieldBase, 'flex h-9 items-center gap-2 pr-9 text-left', open && 'border-accent ring-[3px] ring-accent/15')}
                >
                    <span id={`${baseId}-value`} className="flex min-w-0 items-center gap-2">
                        <span className="font-mono text-[13px] font-medium text-ink">{selected.code}</span>
                        <span className="truncate text-ink-muted">{selected.name}</span>
                    </span>
                    <CurrencySymbol currency={selected} className="ml-auto text-ink-faint" />
                    <ChevronDown
                        size={15}
                        strokeWidth={1.75}
                        className={cn('pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-transform duration-150', open && 'rotate-180')}
                    />
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                        className="absolute inset-x-0 top-full z-50 mt-1.5 overflow-hidden rounded-card border border-line bg-surface shadow-pop"
                    >
                        <div className="relative border-b border-line">
                            <Search size={15} strokeWidth={1.75} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                            <input
                                autoFocus
                                type="text"
                                role="combobox"
                                aria-expanded="true"
                                aria-controls={listId}
                                aria-autocomplete="list"
                                aria-activedescendant={results[activeIndex] ? optionId(results[activeIndex].code) : undefined}
                                aria-label="Search currencies"
                                placeholder="Search by name, code or country"
                                autoComplete="off"
                                spellCheck={false}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setActiveIndex(0);
                                }}
                                onKeyDown={handleKeyDown}
                                className="h-11 w-full bg-transparent pl-9 pr-3 text-base text-ink placeholder:text-ink-faint focus:outline-none sm:text-sm"
                            />
                        </div>

                        <ul id={listId} role="listbox" aria-label="Currencies" className="max-h-72 overflow-y-auto overscroll-contain p-1">
                            {results.length === 0 && (
                                <li className="px-3 py-6 text-center text-[13px] text-ink-muted">
                                    No currency matches “{query.trim()}”.
                                </li>
                            )}
                            {results.map((currency, index) => {
                                const isSelected = currency.code === value;
                                const isActive = index === activeIndex;
                                const startsGroup = showGroups && (index === 0 || results[index - 1].group !== currency.group);
                                return (
                                    <React.Fragment key={currency.code}>
                                        {startsGroup && (
                                            <li role="presentation" className={cn('px-3 pb-1 text-xs font-medium text-ink-faint', index === 0 ? 'pt-1.5' : 'pt-3')}>
                                                {currency.group}
                                            </li>
                                        )}
                                        <li
                                            id={optionId(currency.code)}
                                            role="option"
                                            aria-selected={isSelected}
                                            onMouseMove={() => setActiveIndex(index)}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => choose(currency)}
                                            className={cn(
                                                'flex cursor-pointer items-center gap-3 rounded-[8px] px-3 py-2 text-sm',
                                                isActive ? 'bg-subtle' : 'bg-transparent'
                                            )}
                                        >
                                            <CurrencySymbol currency={currency} className="text-ink-muted" />
                                            <span className="min-w-0 flex-1 truncate text-ink">{currency.name}</span>
                                            <span className="font-mono text-xs text-ink-faint">{currency.code}</span>
                                            <Check size={14} strokeWidth={2} className={cn('shrink-0 text-accent', isSelected ? 'opacity-100' : 'opacity-0')} />
                                        </li>
                                    </React.Fragment>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
