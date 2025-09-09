import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')

    if (!authToken) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      )
    }

    // For now, any valid token is considered authenticated
    // In a more secure implementation, you'd verify the token signature/expiration
    return NextResponse.json({
      authenticated: true,
      message: 'Token is valid'
    })

  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
