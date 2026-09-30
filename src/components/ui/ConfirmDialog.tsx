import React, { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: React.ReactNode;
    confirmLabel: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const EASE = [0.2, 0.8, 0.2, 1] as const;

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel = 'Cancel',
    destructive = false,
    onConfirm,
    onCancel,
}) => {
    const titleId = useId();
    const descriptionId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);
    // Read the latest handler without re-running the open/close effect on every render.
    const onCancelRef = useRef(onCancel);
    useEffect(() => {
        onCancelRef.current = onCancel;
    });

    useEffect(() => {
        if (!open) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        // Focus the safe choice first, so Enter never destroys anything by accident.
        cancelRef.current?.focus();
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCancelRef.current();
            }
            // Keep Tab cycling inside the dialog.
            if (event.key === 'Tab' && panelRef.current) {
                const focusable = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled])');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = overflow;
            previouslyFocused?.focus();
        };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-90 flex items-end justify-center p-4 sm:items-center no-print">
                    <motion.div
                        aria-hidden
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onCancel}
                    />
                    <motion.div
                        ref={panelRef}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        className="relative w-full max-w-sm rounded-[18px] border border-line bg-surface p-6 shadow-pop"
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.12 } }}
                        transition={{ duration: 0.22, ease: EASE }}
                    >
                        <h2 id={titleId} className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
                            {title}
                        </h2>
                        <div id={descriptionId} className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                            {description}
                        </div>
                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button ref={cancelRef} variant="secondary" size="lg" className="sm:h-9 sm:px-4 sm:text-sm" onClick={onCancel}>
                                {cancelLabel}
                            </Button>
                            <Button
                                variant={destructive ? 'destructive' : 'primary'}
                                size="lg"
                                className="sm:h-9 sm:px-4 sm:text-sm"
                                onClick={onConfirm}
                            >
                                {confirmLabel}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
