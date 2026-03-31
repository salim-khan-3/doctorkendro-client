import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/doctors']
const patientRoutes = ['/patient']
const doctorRoutes = ['/doctor']
const adminRoutes = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth store থেকে token নেওয়া যায় না (server side)
  // Cookie বা header থেকে নিতে হবে
  const authStorage = request.cookies.get('auth-storage')

  let isAuthenticated = false
  let userRole = ''

  if (authStorage) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authStorage.value))
      isAuthenticated = parsed?.state?.isAuthenticated || false
      userRole = parsed?.state?.user?.role || ''
    } catch {
      isAuthenticated = false
    }
  }

  // Public routes — সবাই access করতে পারবে
  const isPublicRoute = publicRoutes.some((route) =>
    pathname === route || pathname.startsWith('/doctors')
  )

  if (isPublicRoute) return NextResponse.next()

  // না থাকলে login এ redirect
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role based protection
  if (pathname.startsWith('/patient') && userRole !== 'PATIENT') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/doctor') && userRole !== 'DOCTOR') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/admin') && userRole !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

