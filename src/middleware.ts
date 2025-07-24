import { betterFetch } from '@better-fetch/fetch'
import { NextResponse, type NextRequest } from 'next/server'
import type { Session } from '../auth'

const authRoutes = ['/sign-in', '/sign-up']
const passwordRoutes = ['/reset-password', '/forgot-password']

export default async function authMiddleware(request: NextRequest) {
  console.log('Running auth middleware')
  const pathName = request.nextUrl.pathname
  const isRootRoute = pathName === '/'
  const isAuthRoute = authRoutes.includes(pathName)
  const isPasswordRoute = passwordRoutes.includes(pathName)

  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    }
  )

  // Not logged in
  if (!session) {
    const isInviteRoute = pathName.startsWith('/invite/')

    if (isAuthRoute || isPasswordRoute || isInviteRoute) {
      return NextResponse.next()
    }

    if (isRootRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Already logged in, block auth/password routes
  if (isAuthRoute || isPasswordRoute || isRootRoute) {
    return NextResponse.redirect(new URL('/setting-up-workspace', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|.*\\.svg$).*)'],
}
