'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LoginPage() {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const success = await login(password)
    
    if (success) {
      // Redirect to dashboard after successful login
      router.push('/dashboard')
    } else {
      setError('Invalid password. Please try again.')
      setPassword('')
    }
    
    setIsLoading(false)
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg animate-pulse">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PayLater
          </h1>
          <p className="text-gray-600">
            Enter password to access the application
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                size="lg"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading || !password.trim()}
              isLoading={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Secure access to PayLater expense tracking
          </p>
        </div>
      </div>
    </div>
  )
}
