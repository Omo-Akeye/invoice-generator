import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { Download, ChevronDown, FileText, Image as ImageIcon, Loader2, Share } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportButtonProps {
    onExport: (format: 'pdf' | 'png') => Promise<void> | void;
    isExporting: boolean;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    fullWidth?: boolean;
    dropUp?: boolean;
    /** When set, the menu offers the native share sheet above the download options. */
    onShare?: () => void;
}

const FORMATS = [
    { id: 'pdf' as const, label: 'Download PDF', hint: 'Save a print-ready copy', icon: FileText },
    { id: 'png' as const, label: 'Download PNG', hint: 'Save as an image', icon: ImageIcon },
];

export const ExportButton: React.FC<ExportButtonProps> = ({
    onExport,
    isExporting,
    className,
    variant = 'primary',
    size = 'sm',
    fullWidth = false,
    dropUp = false,
    onShare,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKey);
        };
    }, [isOpen]);

    const handleSelect = async (format: 'pdf' | 'png') => {
        setIsOpen(false);
        await onExport(format);
    };

    const handleShare = () => {
        setIsOpen(false);
        onShare?.();
    };

    const itemClass =
        'flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors hover:bg-subtle focus-visible:bg-subtle focus-visible:outline-none';

    const iconSize = size === 'lg' ? 17 : 15;

    return (
        <div ref={dropdownRef} className={cn('relative inline-block', fullWidth && 'w-full')}>
            <Button
                variant={variant}
                size={size}
                disabled={isExporting}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className={cn(fullWidth && 'w-full', className)}
            >
                {isExporting ? (
                    <Loader2 size={iconSize} className="animate-spin" />
                ) : (
                    <Download size={iconSize} strokeWidth={1.75} />
                )}
                {size !== 'icon' && (
                    <>
                        <span>{isExporting ? 'Preparing…' : 'Download'}</span>
                        <ChevronDown size={14} strokeWidth={1.75} className={cn('-mr-1 opacity-60 transition-transform duration-150', isOpen && 'rotate-180')} />
                    </>
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: dropUp ? 4 : -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                        className={cn(
                            'absolute z-50 min-w-56 rounded-card border border-line bg-surface p-1 shadow-pop',
                            dropUp ? 'bottom-full mb-2' : 'top-full mt-2',
                            fullWidth ? 'left-0 w-full' : 'right-0'
                        )}
                        style={{ transformOrigin: dropUp ? 'bottom right' : 'top right' }}
                    >
                        {onShare && (
                            <>
                                <button role="menuitem" type="button" onClick={handleShare} className={itemClass}>
                                    <Share size={16} strokeWidth={1.75} className="shrink-0 text-accent" />
                                    <span className="min-w-0">
                                        <span className="block text-sm font-medium text-ink">Share PDF</span>
                                        <span className="block text-xs text-ink-faint">WhatsApp, email, and more</span>
                                    </span>
                                </button>
                                <div role="separator" className="mx-3 my-1 h-px bg-line" />
                            </>
                        )}
                        {FORMATS.map(({ id, label, hint, icon: Icon }) => (
                            <button key={id} role="menuitem" type="button" onClick={() => handleSelect(id)} className={itemClass}>
                                <Icon size={16} strokeWidth={1.75} className="shrink-0 text-ink-muted" />
                                <span className="min-w-0">
                                    <span className="block text-sm font-medium text-ink">{label}</span>
                                    <span className="block text-xs text-ink-faint">{hint}</span>
                                </span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
