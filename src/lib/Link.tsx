import React from 'react';
import { navigate } from './navigation';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ href, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
        if (e.defaultPrevented || isModified || props.target === '_blank' || !href.startsWith('/')) return;
        e.preventDefault();
        navigate(href);
    };
    return <a ref={ref} href={href} onClick={handleClick} {...props} />;
});

Link.displayName = 'Link';
