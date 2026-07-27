import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary - Safeguard against blank/white screen crashes (Chống trắng màn hình khi update)
 * Catches JavaScript errors anywhere in child component tree, logs them, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Uncaught error caught by boundary:', error, errorInfo);
    }

    private handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
                    <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl text-center space-y-4">
                        <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
                            <AlertTriangle size={28} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-100">
                            Đã xảy ra sự cố hiển thị / App Notice
                        </h2>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Hệ thống đã kích hoạt chế độ bảo vệ chống trắng màn hình. Bạn có thể nhấn tải lại để làm mới phiên làm việc.
                        </p>
                        {this.state.error && (
                            <div className="bg-slate-950 p-2.5 rounded-lg text-left text-[11px] font-mono text-red-400 overflow-x-auto max-h-32 border border-slate-800">
                                {this.state.error.message || 'Unknown render error'}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={this.handleReload}
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 cursor-pointer"
                        >
                            <RefreshCw size={14} className="animate-spin-slow" />
                            Tải lại trang / Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
