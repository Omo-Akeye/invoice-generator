import React from 'react';
import { cn } from '../../utils/cn';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Renders a formatted value (e.g. "₦461,250.00") where each digit slides vertically when it changes.
 * Columns are keyed from the right so the cents stay put while thousands grow on the left.
 * Reduced motion is handled by the global CSS rule that zeroes transition durations.
 */
export const RollingNumber: React.FC<{ value: string; className?: string }> = ({ value, className }) => {
    const chars = value.split('');
    return (
        <span className={cn('inline-flex tabular-nums', className)}>
            <span className="sr-only">{value}</span>
            {chars.map((char, i) => {
                const key = chars.length - i;
                const digit = DIGITS.indexOf(char);
                if (digit === -1) {
                    return (
                        <span key={`s${key}`} aria-hidden>
                            {char}
                        </span>
                    );
                }
                return (
                    <span key={`d${key}`} aria-hidden className="relative inline-block h-[1lh] overflow-hidden">
                        <span className="invisible">0</span>
                        <span
                            className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[250ms] ease-out-soft"
                            style={{ transform: `translateY(-${digit * 10}%)` }}
                        >
                            {DIGITS.map((d) => (
                                <span key={d}>{d}</span>
                            ))}
                        </span>
                    </span>
                );
            })}
        </span>
    );
};
