"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Error UI...
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <AlertTriangle className="text-rose-500 mb-4" size={48} />
          <h2 className="text-xl font-bold">Something went wrong.</h2>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Try Again
          </button>
        </div>
      );
    }

    // CRITICAL FIX HERE: Use this.props.children, NOT this.children
    return this.props.children; 
  }
}