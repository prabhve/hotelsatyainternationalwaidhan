import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      let friendly = this.state.message;
      try {
        const parsed = JSON.parse(this.state.message) as { error?: string; path?: string };
        if (parsed.error) {
          friendly = `Database operation blocked (${parsed.path || 'Firestore'}): ${parsed.error}`;
        }
      } catch {
        // Use raw message
      }

      return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#1A1D20] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-[#E5E0D8] rounded-xl p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8C5E14] font-semibold mb-2">
              Hotel Satya International
            </p>
            <h1 className="font-display text-3xl font-semibold text-[#1A1D20] mb-3">
              Something interrupted your session
            </h1>
            <p className="text-sm text-[#5A5E63] leading-relaxed mb-6">{friendly}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#1A1D20] text-white text-sm font-medium rounded-lg hover:bg-[#2C3136] transition-colors whitespace-nowrap"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
