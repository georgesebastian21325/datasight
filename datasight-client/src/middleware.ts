import { NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./utils/amplify-server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user = await authenticatedUser({ request, response });

  const isOnHomePage = request.nextUrl.pathname.startsWith("/home-page");
  const isOnEnterpriseView = request.nextUrl.pathname.startsWith("/enterprise-architecture");
  const isOnSettings = request.nextUrl.pathname.startsWith("/settings");
  const isOnAdminArea = request.nextUrl.pathname.startsWith("/dashboard/admins");

  // Protecting the /home-page route
  if (isOnHomePage) {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (isOnAdminArea && !user.isAdmin) {
      return NextResponse.redirect(new URL("/home-page", request.nextUrl));
    }

    return response;
  }

  // Protecting /enterprise-architecture and /settings routes
  if (isOnEnterpriseView || isOnSettings) {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
    return response;
  }

  // If authenticated, redirect to the home page if trying to access the login page or other restricted areas
  if (user && (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/login")) {
    return NextResponse.redirect(new URL("/home-page", request.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"], // Match all routes except static assets and APIs
};
