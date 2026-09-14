import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { ThreeDButton } from './ThreeDButton';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('CogniCare UI recovered from an error', error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return (
      <main className="error-shell">
        <section className="panel centered-panel">
          <p className="eyebrow">CogniCare recovered safely</p>
          <h1>No blank screen here.</h1>
          <p>Something unexpected happened, but your local data remains available on this device.</p>
          <ThreeDButton icon={<RefreshCw size={20} />} onClick={() => this.setState({ hasError: false })}>
            Try Again
          </ThreeDButton>
        </section>
      </main>
    );
  }
}

