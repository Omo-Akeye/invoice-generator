import React from 'react';
import { cn } from '../../utils/cn';
import { buttonBase, buttonSizes, buttonVariants } from './buttonStyles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
        <button
            ref={ref}
            type={type}
            className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
            {...props}
        />
    )
);

Button.displayName = 'Button';
