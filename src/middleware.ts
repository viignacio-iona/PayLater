import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip authentication for API routes, login page, and static files
  if (
    pathname.startsWith('/api/') ||
    pathname === '/login' ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public/')
  ) {
    return NextResponse.next()
  }

  // Check for authentication cookie
  const authToken = request.cookies.get('auth-token')
  
  if (!authToken) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Allow access to protected routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
}
