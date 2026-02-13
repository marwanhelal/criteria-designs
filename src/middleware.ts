import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that require authentication (write operations)
const PROTECTED_API_ROUTES = [
  '/api/projects',
  '/api/blog',
  '/api/team',
  '/api/services',
  '/api/settings',
  '/api/media',
  '/api/upload',
]

// Routes that are always public
const PUBLIC_API_ROUTES = [
  '/api/auth',
  '/api/setup',
  '/api/contact',
  '/api/uploads',
  '/api/migrate',
]

export async function middleware(request: NextRequest) {
  const { pathname, } = request.nextUrl
  const method = request.method

  // Allow all GET requests to API routes (public data)
  if (pathname.startsWith('/api/') && method === 'GET') {
    return NextResponse.next()
  }

  // Allow public API routes for all methods
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Protect write operations (POST, PUT, DELETE) on admin API routes
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE'].includes(method)) {
    const isProtected = PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))

    if (isProtected) {
      const token = await getToken({ req: request })

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
    }
  }

  // Protect admin pages (redirect to login if not authenticated)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = await getToken({ req: request })

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
