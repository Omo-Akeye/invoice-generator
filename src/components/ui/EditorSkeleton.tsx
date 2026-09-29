import React from 'react';
import { LogoMark } from './Logo';

const Bar: React.FC<{ className: string }> = ({ className }) => <div className={`animate-pulse rounded-md bg-subtle ${className}`} />;

/** Placeholder shaped like the editor, shown while its code loads and the saved draft decrypts. */
export const EditorSkeleton: React.FC = () => (
    <div className="min-h-screen bg-canvas" aria-busy="true" aria-label="Loading editor">
        <div className="border-b border-line">
            <div className="invoice-container flex h-14 items-center gap-3 px-4 sm:px-6">
                <LogoMark />
                <Bar className="h-4 w-28" />
                <div className="ml-auto flex gap-2">
                    <Bar className="h-8 w-24" />
                    <Bar className="hidden h-8 w-28 xl:block" />
                </div>
            </div>
        </div>
        <div className="invoice-container grid gap-10 px-4 pt-8 sm:px-6 sm:pt-10 xl:grid-cols-[minmax(0,1fr)_minmax(440px,0.82fr)]">
            <div>
                <Bar className="h-8 w-48" />
                <Bar className="mt-3 h-4 w-80 max-w-full" />
                <div className="mt-8 space-y-4">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="rounded-card border border-line bg-surface p-5">
                            <Bar className="h-4 w-32" />
                            <Bar className="mt-2 h-3 w-56 max-w-full" />
                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <Bar className="h-9" />
                                <Bar className="h-9" />
                                <Bar className="h-9" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="hidden xl:block">
                <Bar className="h-4 w-16" />
                <div className="mt-3 rounded-[20px] bg-subtle p-6">
                    <div className="aspect-[210/297] rounded-[6px] bg-surface" />
                </div>
            </div>
        </div>
    </div>
);
