import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        window.localStorage.removeItem('invoice-data');
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-canvas p-6 text-center">
                    <AlertTriangle className="mb-5 text-danger" size={24} strokeWidth={1.75} />
                    <h1 className="mb-2 text-2xl font-normal tracking-[-0.035em] text-ink sm:text-[28px]">Something went wrong</h1>
                    <p className="mb-8 max-w-md text-[15px] leading-relaxed text-ink-muted">
                        The app hit an unexpected error. Refreshing usually fixes it. If it keeps happening, your saved draft may be damaged and resetting will clear it.
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            <RefreshCcw size={15} strokeWidth={1.75} />
                            Refresh
                        </Button>
                        <Button variant="danger" onClick={this.handleReset}>
                            Clear saved draft
                        </Button>
                    </div>
                    {import.meta.env.DEV && (
                        <div className="mt-8 max-w-2xl overflow-auto rounded-control bg-subtle p-4 text-left">
                            <p className="font-mono text-xs text-danger">{this.state.error?.toString()}</p>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
