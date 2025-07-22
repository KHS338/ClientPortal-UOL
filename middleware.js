import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  console.log(`Middleware: Checking path: ${pathname}`);
  
  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/subscription',
    '/subscription-info',
    '/invoice',
    '/payments',
    '/roles'
  ];
  
  // Define public routes
  const publicRoutes = [
    '/',
    '/login',
    '/registration',
    '/forgot-password',
    '/reset-password'
  ];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  console.log(`Middleware: Is protected route: ${isProtectedRoute}`);
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  // If it's a protected route, check for authentication
  if (isProtectedRoute) {
    // Get the token from cookies or headers
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    console.log(`Middleware: Protected route accessed. Token exists: ${!!token}`);
    
    // If no token, redirect to login
    if (!token) {
      console.log(`Middleware: No token found, redirecting to login`);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log(`Middleware: Token found, allowing access`);
    // Here you could add token validation logic
    // For now, we'll trust that the client-side authentication is working
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|images).*)',
  ],
};
