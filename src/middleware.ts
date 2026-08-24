import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that require authentication (write operations)
const PROTECTED_API_ROUTES = [
  '/api/projects',
  '/api/team',
  '/api/services',
  '/api/awards',
  '/api/clients',
  '/api/settings',
  '/api/about-settings',
  '/api/philosophy',
  '/api/media',
  '/api/upload',
  '/api/admin',
  '/api/migrate',
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

  // Maintenance mode: show the "under construction" page on the public domain only,
  // while /admin, /api, and other domains (e.g. the temp working domain) keep working normally.
  if (
    process.env.MAINTENANCE_MODE === 'true' &&
    !pathname.startsWith('/maintenance') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/admin')
  ) {
    const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '')
      .split(':')[0]
      .toLowerCase()
    const maintenanceDomains = (process.env.MAINTENANCE_DOMAIN || '')
      .split(',')
      .map(d => d.trim().toLowerCase())
      .filter(Boolean)

    if (maintenanceDomains.includes(host)) {
      return NextResponse.rewrite(new URL('/maintenance', request.url))
    }
  }

  // Allow all GET requests to API routes (public data) — except admin-only routes
  if (pathname.startsWith('/api/') && method === 'GET' && !pathname.startsWith('/api/admin')) {
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|uploads/).*)'],
}
