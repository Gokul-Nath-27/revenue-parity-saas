import { NextResponse, type NextRequest } from "next/server"

import { getSessionIdFromCookie, getValidatedSession } from '@/lib/session'

const publicPaths = ['/', '/sign-in', '/sign-up', '/forgot-password']
const _adminPaths: string[] = [] 

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next()
  return response
}

async function middlewareAuth(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle public paths
  if (publicPaths.includes(pathname)) {
    // For root path, always allow access
    if (pathname === '/') return null
    
    const sessionId = await getSessionIdFromCookie()
    if (sessionId) {
      const session = await getValidatedSession(sessionId)
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
    return null
  }

  // Handle protected paths (non-public, non-admin)
  const sessionId = await getSessionIdFromCookie()
  if (!sessionId) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  const session = await getValidatedSession(sessionId)
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return null
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
