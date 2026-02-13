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
                <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mb-6">
                        <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight mb-2">Something went wrong</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-md mb-8">
                        The application encountered an unexpected error. This might be due to corrupted data in your local storage.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            <RefreshCcw size={16} className="mr-2" />
                            Try Refreshing
                        </Button>
                        <Button variant="danger" onClick={this.handleReset}>
                            Reset Application Data
                        </Button>
                    </div>
                    {import.meta.env.DEV && (
                        <div className="mt-8 p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-left overflow-auto max-w-2xl">
                            <p className="text-xs font-mono text-red-500">{this.state.error?.toString()}</p>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
