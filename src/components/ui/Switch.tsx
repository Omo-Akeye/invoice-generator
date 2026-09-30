import React from 'react';
import { cn } from '../../utils/cn';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
    className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, description, className }) => (
    <label className={cn('flex items-start justify-between gap-4 cursor-pointer', className)}>
        <span className="min-w-0">
            <span className="block text-sm font-medium text-ink">{label}</span>
            {description && <span className="mt-0.5 block text-[13px] text-ink-muted">{description}</span>}
        </span>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={cn(
                'relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                checked ? 'bg-brand' : 'bg-line-strong'
            )}
        >
            <span
                className={cn(
                    'inline-block h-4 w-4 rounded-full shadow-sm transition-[transform,background-color] duration-150 ease-out-soft',
                    checked ? 'translate-x-4.5 bg-on-brand' : 'translate-x-0.5 bg-white'
                )}
            />
        </button>
    </label>
);
