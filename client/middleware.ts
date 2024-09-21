import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/'
  const isAuthPath = path === '/sign-in' || path === '/sign-up'
  const accessToken = request.cookies.get('accessToken')?.value || ''
  const refreshToken = request.cookies.get('refreshToken')?.value || ''

  if (isPublicPath) {
    return NextResponse.next()
  }

  if (isAuthPath && accessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isAuthPath && !isPublicPath) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    try {
      jwt.verify(accessToken, process.env.JWT_SECRET as string)
      return NextResponse.next()
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError && refreshToken) {
        // Access token expired, try to refresh
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          })

          if (response.ok) {
            const data = await response.json()
            const newResponse = NextResponse.next()
            newResponse.cookies.set('accessToken', data.accessToken, { httpOnly: true, secure: process.env.NODE_ENV !== 'development' })
            newResponse.cookies.set('refreshToken', data.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV !== 'development' })
            return newResponse
          } else {
            throw new Error('Failed to refresh token')
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError)
          return NextResponse.redirect(new URL('/sign-in', request.url))
        }
      }
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/sign-in', '/sign-up', '/tasks', '/api/:path*']
}