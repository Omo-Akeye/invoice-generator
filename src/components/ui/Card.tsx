import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, title, description, noPadding }) => {
    if (noPadding) return <div className={className}>{children}</div>;

    return (
        <div className={cn('rounded-card border border-line bg-surface', className)}>
            {title && (
                <div className="px-5 pt-5">
                    <h2 className="text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</h2>
                    {description && <p className="mt-0.5 text-[13px] text-ink-muted">{description}</p>}
                </div>
            )}
            <div className="p-5">{children}</div>
        </div>
    );
};
