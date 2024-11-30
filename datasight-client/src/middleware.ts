import { NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./utils/amplify-server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user = await authenticatedUser({ request, response });
  const { pathname } = request.nextUrl;

  // Define the routes that require authentication
  const protectedRoutes = [
    '/typeshit',
    '/onboarding',
    '/dashboard/services',
    '/dashboard/products',
    '/dashboard/offerings',
    '/enterprise-architecture',
  ];

  // Check if the current path is one of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users accessing protected routes to the login page
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Redirect authenticated users away from the login page to the dashboard
  if (user && pathname === "/") {
    return NextResponse.redirect(new URL("/enterprise-architecture", request.nextUrl));
  }

  // Proceed with the response if none of the above conditions are met
  return response;
}
