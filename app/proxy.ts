import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware to redirect unauthenticated users
// Redirects to sign-in page for protected routes (except home)
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Auth routes - allow access without redirection
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return NextResponse.next()
  }
  
  // Home page - allow access
  if (pathname === '/') {
    return NextResponse.next()
  }
  
  // API routes - allow access
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }
  
  // For other protected routes, redirect to sign-in if not on auth pages
  // In a full implementation, you'd check the session here
  // For now, redirect to sign-in for any other route
  return NextResponse.redirect(new URL('/sign-in', request.url))
}

// Configuration: apply middleware to all routes
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css$|js$|png$|jpg$|jpeg$|svg$|webp$|ico$).*)',
  ],
}