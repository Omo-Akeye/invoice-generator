export const buttonVariants = {
    primary: 'bg-brand text-on-brand hover:bg-brand-hover',
    inverse: 'bg-ink text-canvas hover:opacity-90',
    secondary: 'bg-surface text-ink border border-line-strong hover:bg-subtle',
    outline: 'bg-transparent text-ink border border-line-strong hover:bg-subtle',
    ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-subtle',
    danger: 'bg-transparent text-danger hover:bg-danger/10',
    destructive: 'bg-danger-solid text-white hover:opacity-90',
};

export const buttonSizes = {
    sm: 'h-8 px-3 text-[13px] gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
    lg: 'h-11 px-5 text-[15px] gap-2',
    icon: 'h-9 w-9',
};

export const buttonBase =
    'inline-flex items-center justify-center rounded-control font-medium whitespace-nowrap select-none transition-[background-color,color,opacity,transform] duration-150 ease-out-soft active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-40 disabled:pointer-events-none';
