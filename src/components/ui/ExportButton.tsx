import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { Download, ChevronDown, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
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
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
    onExport, 
    isExporting, 
    className, 
    variant = 'primary', 
    size = 'sm',
    fullWidth = false,
    dropUp = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = async (format: 'pdf' | 'png') => {
        setIsOpen(false);
        await onExport(format);
    };

    return (
        <div ref={dropdownRef} className={cn("relative inline-block", fullWidth ? "w-full" : "")}>
            <Button
                variant={variant}
                size={size}
                disabled={isExporting}
                onClick={() => setIsOpen(!isOpen)}
                className={cn("justify-between", className, fullWidth ? "w-full" : "")}
            >
                <div className="flex items-center">
                    {isExporting ? (
                        <Loader2 size={size === 'sm' || size === 'icon' ? 16 : 18} className="animate-spin mr-2" />
                    ) : (
                        <Download size={size === 'sm' || size === 'icon' ? 16 : 18} className={size === 'icon' ? "" : "mr-2"} />
                    )}
                    {size !== 'icon' && (isExporting ? 'Exporting...' : 'Export')}
                </div>
                {size !== 'icon' && (
                    <ChevronDown size={14} className={cn("ml-2 transition-transform duration-200", isOpen ? "rotate-180" : "")} />
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: dropUp ? 8 : -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: dropUp ? 8 : -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute z-50 flex flex-col py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden min-w-45",
                            dropUp ? "bottom-full mb-2" : "top-full mt-2",
                            fullWidth ? "w-full left-0 origin-bottom" : "w-max right-0 origin-top-right"
                        )}
                        style={fullWidth ? {} : { transformOrigin: dropUp ? 'bottom right' : 'top right' }}
                    >
                        <button
                            className="w-full flex items-center px-4 py-3 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300 text-left"
                            onClick={() => handleSelect('pdf')}
                        >
                            <FileText size={16} className="mr-3 text-brand-primary shrink-0" />
                            <div className="flex flex-col items-start">
                                <span>Download as PDF</span>
                                
                            </div>
                        </button>
                        <button
                            className="w-full flex items-center px-4 py-3 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300 group text-left"
                            onClick={() => handleSelect('png')}
                        >
                            <ImageIcon size={16} className="mr-3 text-brand-secondary group-hover:text-brand-primary transition-colors shrink-0" />
                            <div className="flex flex-col items-start">
                                <span>Download as PNG</span>
                              
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
