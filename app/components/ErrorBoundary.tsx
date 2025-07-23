'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { logError, ErrorCategories } from '../../lib/errorHandler'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(
      'React component error caught by boundary',
      ErrorCategories.UI_RENDERING,
      { error: error.message, stack: error.stack, componentStack: errorInfo.componentStack }
    )
    
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-300 mb-6">
              The game encountered an unexpected error. Please refresh the page to continue.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left text-sm text-gray-400">
                <summary className="cursor-pointer mb-2">Error Details (Development)</summary>
                <div className="bg-gray-700 p-3 rounded text-xs overflow-auto max-h-32">
                  <div className="font-bold mb-1">Error:</div>
                  <div className="mb-2">{this.state.error.message}</div>
                  <div className="font-bold mb-1">Stack:</div>
                  <div className="whitespace-pre-wrap">{this.state.error.stack}</div>
                  {this.state.errorInfo && (
                    <>
                      <div className="font-bold mb-1 mt-2">Component Stack:</div>
                      <div className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</div>
                    </>
                  )}
                </div>
              </details>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 