import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { setTheme, useResolvedTheme } from '../../lib/theme';
import { cn } from '../../utils/cn';

const OPTIONS: { value: 'light' | 'dark'; label: string; icon: React.ElementType }[] = [
    { value: 'light', label: 'Light theme', icon: Sun },
    { value: 'dark', label: 'Dark theme', icon: Moon },
];

/**
 * Until the user picks one, the site follows the device's theme and the matching option shows as active.
 * Picking the other option saves an explicit choice.
 */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
    const theme = useResolvedTheme();
    const layoutId = useId();

    return (
        <div role="radiogroup" aria-label="Colour theme" className={cn('inline-flex shrink-0 rounded-full border border-line bg-subtle p-0.5', className)}>
            {OPTIONS.map(({ value, label, icon: Icon }) => {
                const isActive = theme === value;
                return (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        aria-label={label}
                        title={label}
                        onClick={() => {
                            if (!isActive) setTheme(value);
                        }}
                        className={cn(
                            'relative flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                            isActive ? 'text-ink' : 'text-ink-faint hover:text-ink'
                        )}
                    >
                        {isActive && (
                            <motion.span
                                layoutId={layoutId}
                                className="absolute inset-0 rounded-full bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.1),0_0_0_1px_var(--line)]"
                                transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
                            />
                        )}
                        <Icon size={14} strokeWidth={1.75} className="relative" />
                    </button>
                );
            })}
        </div>
    );
};
