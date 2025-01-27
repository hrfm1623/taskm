import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Edgeランタイムを使用することを明示
export const runtime = "experimental-edge";

export function middleware(request: NextRequest) {
  // すでに/loginページにいる場合はリダイレクトしない
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  // その他のすべてのリクエストを/loginにリダイレクト
  return NextResponse.redirect(new URL("/login", request.url));
}

// すべてのパスに対してmiddlewareを適用（_next/dataを除外）
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (Next.js data files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico).*)",
  ],
};
