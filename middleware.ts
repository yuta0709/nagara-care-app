import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 認証が不要なパス
const publicPaths = ["/login", "/admin/login"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

  // 認証が不要なパスの場合はスキップ
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 認証が必要なパスでトークンがない場合は/loginにリダイレクト
  if (!token) {
    const url = new URL("/admin/login", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// すべてのパスに対してミドルウェアを適用
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
