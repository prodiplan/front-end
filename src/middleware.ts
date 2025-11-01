import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Jika user sudah login dan akses halaman auth, redirect ke dashboard
  if (token && pathname === "/auth") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Jika user belum login dan akses protected routes, redirect ke auth
  if (
    !token &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/essay-grader"))
  ) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth", "/dashboard/:path*", "/essay-grader/:path*"],
};
