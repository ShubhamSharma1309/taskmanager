import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/'
  const isAuthPath = path === '/sign-in' || path === '/sign-up'
  const token = request.cookies.get('accessToken')?.value || ''

  if (isPublicPath) {
    return NextResponse.next()
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isAuthPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/sign-in', '/sign-up', '/create-task', '/tasks/:path*'],
}