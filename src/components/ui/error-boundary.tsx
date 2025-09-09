"use client"

import { Component, ReactNode } from "react"
import { Button } from "./button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-center text-gray-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => window.location.reload()}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.href = "/dashboard"}
              >
                Go to Sign In
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
