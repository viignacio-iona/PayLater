import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const APP_PASSWORD = process.env.APP_PASSWORD || 'PayLater2024!'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Debug logging
    console.log('Environment check:', {
      APP_PASSWORD: process.env.APP_PASSWORD,
      fallback: 'PayLater2024!',
      finalPassword: APP_PASSWORD,
      receivedPassword: password,
      match: password === APP_PASSWORD
    })

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password !== APP_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create authentication token (simple timestamp-based token)
    const token = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64')
    
    // Set cookie with 1 week expiration
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 1 week in seconds
      path: '/'
    })

    return NextResponse.json({
      message: 'Authentication successful',
      authenticated: true
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
