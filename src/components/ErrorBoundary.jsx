import React from 'react';
import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen">
          <div className="error-boundary-card card">
            <span className="error-boundary-icon">☕⚠️</span>
            <h1 className="error-boundary-title">Something went wrong.</h1>
            <p className="error-boundary-text">
              We encountered an unexpected error while loading this page. Please try refreshing.
            </p>
            {this.state.error && (
              <pre className="error-boundary-details">
                {this.state.error.message || this.state.error.toString()}
              </pre>
            )}
            <button className="btn btn-primary error-boundary-btn" onClick={this.handleReload}>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
