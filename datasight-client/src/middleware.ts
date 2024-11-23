import { NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./utils/amplify-server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user = await authenticatedUser({ request, response });
  const { pathname } = request.nextUrl;

  // Define the routes that require authentication
  const protectedRoutes = [
    "/onboarding",
    "/dashboard/resources",
    "/dashboard/services",
    "/dashboard/products",
    "/dashboard/offerings",
    "/enterprise-architecture",
  ];

  // Check if the current path is one of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users accessing protected routes to the login page
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Redirect authenticated users away from the login page
  if (user && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/dashboard/resources", request.nextUrl));
  }

  // Proceed with the response if none of the above conditions are met
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"], // Exclude static files and API routes
};
