import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Edgeランタイムを使用することを明示
export const runtime = "edge";

export function middleware(request: NextRequest) {
  // すでに/loginページにいる場合はリダイレクトしない
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  // その他のすべてのリクエストを/loginにリダイレクト
  return NextResponse.redirect(new URL("/login", request.url));
}

// すべてのパスに対してmiddlewareを適用
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
