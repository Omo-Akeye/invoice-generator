import { useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface Option<T extends string> {
    value: T;
    label: string;
    icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
    value: T;
    onChange: (value: T) => void;
    options: Option<T>[];
    ariaLabel: string;
    size?: 'sm' | 'md';
    className?: string;
}

export function SegmentedControl<T extends string>({ value, onChange, options, ariaLabel, size = 'md', className }: SegmentedControlProps<T>) {
    const layoutId = useId();
    return (
        <div role="radiogroup" aria-label={ariaLabel} className={cn('inline-flex w-full rounded-control bg-subtle p-0.5', className)}>
            {options.map((option) => {
                const isActive = option.value === value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            'relative flex flex-1 items-center justify-center gap-1.5 rounded-[6px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                            size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3 text-[13px]',
                            isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
                        )}
                    >
                        {isActive && (
                            <motion.span
                                layoutId={layoutId}
                                className="absolute inset-0 rounded-[6px] bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_var(--line)]"
                                transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
                            />
                        )}
                        <span className="relative flex items-center gap-1.5">
                            {option.icon}
                            {option.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
