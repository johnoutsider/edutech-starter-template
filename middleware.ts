import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "firebase-session";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isLoginRoute = request.nextUrl.pathname === "/login";

  if (isDashboardRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isDashboardRoute) {
    const roleSegment = request.nextUrl.pathname.split("/")[2];

    if (["admin", "teacher", "student"].includes(roleSegment)) {
      return NextResponse.rewrite(new URL(`/${roleSegment}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"]
};
