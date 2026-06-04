import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

export function PreviewErrorFallback({ message }: { message?: string }) {
  return (
    <main className="min-h-[100vh] bg-[#0B1F1E] px-6 py-20 text-[#FBE2B6]">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl md:text-6xl">Preview error</h1>
        <p className="mt-4 text-lg">
          The page loaded, but one section failed to render. Refresh the preview or continue editing.
        </p>
        {message ? <p className="mt-4 font-copy text-sm opacity-80">{message}</p> : null}
      </div>
    </main>
  );
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, message: error instanceof Error ? error.message : 'Unknown error' };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    console.error('Preview render error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <PreviewErrorFallback message={this.state.message} />;
    }

    return this.props.children ?? null;
  }
}