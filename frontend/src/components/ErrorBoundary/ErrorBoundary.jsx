import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './ErrorBoundary.css';

/**
 * Fallback component that displays when an error occurs
 * @param {Error} error - The error that was caught
 * @param {Function} resetErrorBoundary - Function to reset the error boundary and retry
 * @param {Object} fallbackProps - Additional props passed to the fallback
 */
function ErrorFallback({ error, resetErrorBoundary, fallbackProps }) {
  const { errorTitle, errorMessage, showRetry = true } = fallbackProps || {};

  return (
    <div className='ErrorBoundaryComponent'>
      <div className='ErrorBoundaryContent'>
        <h1 className='ErrorBoundaryTitle'>
          {errorTitle || 'Something went wrong!'}
        </h1>
        
        <p className='ErrorBoundaryMessage'>
          {errorMessage || error.message || 'An unexpected error occurred'}
        </p>

        {import.meta.env.DEV && (
          <details className='ErrorBoundaryDetails'>
            <summary>Error Details</summary>
            <pre className='ErrorBoundaryStack'>{error.stack}</pre>
          </details>
        )}

        {showRetry && (
          <button 
            className='ErrorBoundaryButton' 
            onClick={resetErrorBoundary}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Wrapper component that provides error boundary functionality
 * @param {ReactNode} children - Child components to wrap
 * @param {Function} onError - Callback when an error is caught
 * @param {Function} onReset - Callback when error boundary is reset
 * @param {Object} fallbackProps - Props to pass to the fallback component
 */
function ErrorBoundaryWrapper({
  children,
  onError,
  onReset,
  fallbackProps,
}) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // Call custom onError callback if provided
        if (onError) {
          onError(error, errorInfo);
        }
      }}
      onReset={() => {
        // Call custom onReset callback if provided
        if (onReset) {
          onReset();
        }
      }}
      fallbackProps={fallbackProps}
    >
      {children}
    </ErrorBoundary>
  );
}

// Re-export ErrorFallback for individual use
export { ErrorFallback };

// Export wrapper as default
export default ErrorBoundaryWrapper;
