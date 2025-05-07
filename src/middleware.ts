import { NextResponse, type NextRequest } from "next/server"

import { isPrivatePath, isPublicPath, isValidRoute } from '@/lib/routeConfig'
import { getSessionIdFromCookie, getValidatedSession, getSessionCookieOptions, updateSessionExpiration } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (!isValidRoute(pathname)) {
    return NextResponse.rewrite(new URL('/not-found', request.url))
  }
  
  const response = (await middlewareAuth(request)) ?? NextResponse.next()
  return response
}

async function middlewareAuth(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle public paths
  if (isPublicPath(pathname)) {
    const sessionId = await getSessionIdFromCookie()
    if (sessionId) {
      const session = await getValidatedSession(sessionId)
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
    return null
  }
  

  if (isPrivatePath(pathname)) {
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
    const cookieOptions = await getSessionCookieOptions()
    const response = NextResponse.next()
    response.cookies.set({
      ...cookieOptions,
      value: sessionId
    })
    return response
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
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)/',
  ],
}
