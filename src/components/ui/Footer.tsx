import React from 'react';
import { Logo } from './Logo';
import { Link } from 'react-router';
import { cn } from '../../utils/cn';

/** `framed` continues the landing page's vertical frame rails. */
export const Footer: React.FC<{ framed?: boolean }> = ({ framed }) => {
    const rail = framed && 'lg:border-x lg:border-line lg:px-10';
    return (
        <footer className="mt-auto border-t border-line no-print">
            <div className={cn('mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between', rail)}>
                <div className="max-w-xs space-y-3">
                    <Link to="/" aria-label="InvoicePro home">
                        <Logo />
                    </Link>
                    <p className="text-[13px] leading-relaxed text-ink-muted">
                        An invoice generator that runs entirely in your browser. No account, no server, no copies of your data.
                    </p>
                </div>

                <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-[13px]">
                    <Link to="/app" className="text-ink-muted transition-colors hover:text-ink">Create invoice</Link>
                    <Link to="/#templates" className="text-ink-muted transition-colors hover:text-ink">Templates</Link>
                    <Link to="/#privacy" className="text-ink-muted transition-colors hover:text-ink">Privacy</Link>
                    <Link to="/#faq" className="text-ink-muted transition-colors hover:text-ink">FAQ</Link>
                </nav>
            </div>

            <div className={cn('mx-auto flex max-w-6xl flex-col gap-2 border-t border-line px-4 py-6 text-xs text-ink-faint sm:flex-row sm:justify-between sm:px-6', rail)}>
                <p>&copy; {new Date().getFullYear()} InvoicePro</p>
                <p>
                    Built by{' '}
                    <a
                        href="https://www.akeyesaheed.tech/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                        Akeye Saheed
                    </a>
                </p>
            </div>
        </footer>
    );
};
