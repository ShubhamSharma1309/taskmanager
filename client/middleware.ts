import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (res.ok) {
    return NextResponse.next()
  } else {
    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: request.headers.get('cookie') || ''
      },
      credentials: 'include',
    })

    if (refreshRes.ok) {
      const response = NextResponse.next()
      const newToken = await refreshRes.json()

      response.cookies.set('accessToken', newToken.accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      })

      if (newToken.refreshToken) {
        response.cookies.set('refreshToken', newToken.refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
        })
      }

      return response
    } else {
      console.error('Refresh token failed:', await refreshRes.text())
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }
}

export const config = {
  matcher: ['/', '/sign-in', '/sign-up', '/create-task', '/tasks/:path*'],
} 