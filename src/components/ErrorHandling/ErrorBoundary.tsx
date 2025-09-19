
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  level?: 'page' | 'component' | 'widget';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: crypto.randomUUID()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error for monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Report to error tracking service
    this.reportError(error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In production, send to error tracking service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      console.log('Error Report:', errorReport);
      // await errorTrackingService.report(errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private renderErrorFallback = () => {
    const { level = 'component', showErrorDetails = false } = this.props;
    const { error, errorId } = this.state;

    if (level === 'widget') {
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Widget Error</span>
          </div>
          <p className="text-sm text-red-600 mb-3">
            This component encountered an error and couldn't load.
          </p>
          <Button size="sm" variant="outline" onClick={this.handleRetry}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
      );
    }

    if (level === 'component') {
      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Component Error
            </CardTitle>
            <CardDescription>
              This section encountered an error and couldn't load properly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {showErrorDetails && error && (
                <Alert variant="destructive">
                  <Bug className="h-4 w-4" />
                  <AlertDescription>
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium">
                        Error Details (ID: {errorId?.slice(0, 8)})
                      </summary>
                      <pre className="mt-2 text-xs overflow-auto bg-red-100 p-2 rounded">
                        {error.message}
                      </pre>
                    </details>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={this.handleRetry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button size="sm" variant="outline" onClick={this.handleReload}>
                  Reload Page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Page level error
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Something went wrong</CardTitle>
            <CardDescription>
              We're sorry, but something unexpected happened. Our team has been notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showErrorDetails && error && (
              <Alert variant="destructive">
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  <details>
                    <summary className="cursor-pointer font-medium">
                      Technical Details (ID: {errorId?.slice(0, 8)})
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto bg-red-100 p-2 rounded max-h-32">
                      {error.message}
                    </pre>
                  </details>
                </AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-2">
              <Button onClick={this.handleRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={this.handleReload} className="w-full">
                Reload Page
              </Button>
              <Button variant="ghost" onClick={this.handleGoHome} className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderErrorFallback();
    }

    return this.props.children;
  }
}
