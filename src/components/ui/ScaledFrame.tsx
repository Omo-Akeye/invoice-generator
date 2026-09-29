import React, { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

interface ScaledFrameProps {
    children: React.ReactNode;
    /** Width the content is laid out at before scaling to fit the container. */
    baseWidth?: number;
    className?: string;
    style?: React.CSSProperties;
    'aria-hidden'?: boolean;
}

/**
 * Lays content out at a fixed width, then scales it to the container's width.
 * Invoice templates use fixed pixel type sizes, so this keeps them looking identical at any size.
 * The container's height follows the content, since long invoices run taller than A4.
 */
export const ScaledFrame: React.FC<ScaledFrameProps> = ({ children, baseWidth = 640, className, style, ...rest }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ scale: 1, height: baseWidth * (297 / 210) });

    useLayoutEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;
        const update = () => {
            const scale = container.clientWidth / baseWidth;
            setSize({ scale, height: content.offsetHeight * scale });
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(container);
        observer.observe(content);
        return () => observer.disconnect();
    }, [baseWidth]);

    return (
        <div ref={containerRef} className={cn('relative w-full overflow-hidden', className)} style={{ height: size.height, ...style }} {...rest}>
            <div
                ref={contentRef}
                className="absolute left-0 top-0 origin-top-left"
                style={{ width: baseWidth, transform: `scale(${size.scale})` }}
            >
                {children}
            </div>
        </div>
    );
};
