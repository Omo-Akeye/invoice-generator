import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title }) => {
    return (
        <div className={cn(
            'bg-white dark:bg-neutral-900 rounded-apple border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all duration-300',
            className
        )}>
            {title && (
                <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h2>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};
