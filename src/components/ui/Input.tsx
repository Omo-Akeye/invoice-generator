import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export const fieldBase =
    'w-full rounded-control border border-line-strong bg-surface px-3 text-base text-ink sm:text-sm placeholder:text-ink-faint transition-[border-color,box-shadow] duration-150 hover:border-ink-faint/60 focus-visible:outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-50';

export const FieldLabel: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
    <label className={cn('block text-[13px] font-medium text-ink-muted', className)} {...props} />
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, id, ...props }, ref) => {
        const autoId = useId();
        const inputId = id ?? autoId;
        return (
            <div className="w-full space-y-1.5">
                {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        fieldBase,
                        'h-9 py-2',
                        error && 'border-danger focus-visible:border-danger focus-visible:ring-danger/15',
                        className
                    )}
                    aria-invalid={error ? true : undefined}
                    {...props}
                />
                {error && <p className="text-xs text-danger">{error}</p>}
                {helperText && !error && <p className="text-xs text-ink-faint">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }>(
    ({ className, label, id, ...props }, ref) => {
        const autoId = useId();
        const inputId = id ?? autoId;
        return (
            <div className="w-full space-y-1.5">
                {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={cn(fieldBase, 'min-h-24 py-2.5 leading-relaxed resize-y', className)}
                    {...props}
                />
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }>(
    ({ className, label, id, children, ...props }, ref) => {
        const autoId = useId();
        const inputId = id ?? autoId;
        return (
            <div className="w-full space-y-1.5">
                {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
                <div className="relative">
                    <select
                        ref={ref}
                        id={inputId}
                        className={cn(fieldBase, 'h-9 appearance-none pr-9 cursor-pointer', className)}
                        {...props}
                    >
                        {children}
                    </select>
                    <ChevronDown size={15} strokeWidth={1.75} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                </div>
            </div>
        );
    }
);

Select.displayName = 'Select';
