import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

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
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#151515] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase font-mono tracking-widest text-[#f4bb28] block">
                System Notice
              </span>
              <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
              <p className="text-xs text-neutral-400 leading-relaxed">
                An unexpected interface anomaly occurred. You can reload the protocol view or return to the main marketplace.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-black/60 border border-white/10 rounded-xl p-3 text-left">
                <p className="text-[11px] font-mono text-rose-300 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload</span>
              </button>

              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold transition-all shadow-md"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
