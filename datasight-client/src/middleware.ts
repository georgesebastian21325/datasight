import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./utils/amplify-server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user = await authenticatedUser({ request, response });

  const isOnDashboard = request.nextUrl.pathname.startsWith("/home-page");
  const isOnHomePage =
    request.nextUrl.pathname.startsWith("/home-page");

  if (isOnDashboard) {
    if (!user)
      return NextResponse.redirect(new URL("/", request.nextUrl));
    if (isOnHomePage && !user.isAdmin)
      return NextResponse.redirect(new URL("/home-page", request.nextUrl));
    return response;
  } 
}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};