import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

function isPublic(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/api/public");
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  if (isPublic(pathname) && !token) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /**
     * Protege tudo, exceto arquivos estáticos e recursos internos do Next.js
     */
    "/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|logo.png).*)",
  ],
};
