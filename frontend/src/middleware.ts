// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const PUBLIC_API_PATHS = ["/api/login", "/api/set-cookie", "/api/public"];

function isPublic(pathname: string) {
  return (
    pathname === "/login" ||
    PUBLIC_API_PATHS.some((publicPath) => pathname.startsWith(publicPath))
  );
}
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Libera rotas públicas SEM checar token
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Se não tiver token, manda para login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const userData = verify(token, process.env.JWT_SECRET || "");

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user", JSON.stringify(userData));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("token"); // apaga cookie inválido para evitar loop
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|logo.png).*)",
  ],
};
