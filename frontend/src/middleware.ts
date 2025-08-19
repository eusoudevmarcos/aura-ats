import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/login"];

const DASHBOARD_PATH = "/atividades/agendas";

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((publicPath) => pathname.startsWith(publicPath));
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  if (token) {
    if (isPublicPath(pathname)) {
      if (!pathname.startsWith("/api")) {
        return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
      }

      return NextResponse.next();
    }

    return NextResponse.next();
  }

  if (!token && !isPublicPath(pathname)) {
    if (!pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|logo.png|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.woff$|.*\\.woff2$|.*\\.ttf$|.*\\.eot$).*)",
  ],
};
