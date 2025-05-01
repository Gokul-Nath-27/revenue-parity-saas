import { NextResponse, type NextRequest } from "next/server"

import { getSessionIdFromCookie, getValidatedSession, getSessionCookieOptions, updateSessionExpiration } from '@/lib/session'

const publicPaths = ['/', '/sign-in', '/sign-up']
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
    // Clear the expired session cookie
    const response = NextResponse.redirect(new URL('/sign-in', request.url))
    response.cookies.delete('session-key')
    return response
  }

  // Update session expiration for valid session
  await updateSessionExpiration(sessionId)
  
  // Update session cookie expiration
  const response = NextResponse.next()
  const cookieOptions = await getSessionCookieOptions()
  response.cookies.set({
    ...cookieOptions,
    value: sessionId
  })
  return response
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
