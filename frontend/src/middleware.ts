import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/login"];

// 2. Defina o caminho do DASHBOARD (para onde redirecionar após o login)
const DASHBOARD_PATH = "/atividades/agendas";

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((publicPath) => pathname.startsWith(publicPath));
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log(
    `Middleware: Pathname: ${pathname}, Token: ${!!token}, IsPublic: ${isPublicPath(
      pathname
    )}`
  );

  // CENÁRIO 1: Usuário JÁ autenticado
  if (token) {
    // Se o usuário tem um token E está tentando acessar uma rota pública (como /login ou /api/login)
    if (isPublicPath(pathname)) {
      console.log(
        `Middleware: Token existe, redirecionando de ${pathname} para ${DASHBOARD_PATH}`
      );
      // Redireciona APENAS se for uma requisição de PÁGINA (não de API)
      // Requisições de API devem retornar um 401 ou 200, não redirecionar
      if (!pathname.startsWith("/api")) {
        return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
      }
      // Para API Routes públicas, se já logado, apenas passa (se não houver um fluxo específico de "já logado, não pode usar esta API")
      return NextResponse.next();
    }
    // Se o usuário tem um token e está em uma rota protegida (tudo ok)
    console.log(`Middleware: Token existe, permitindo acesso a ${pathname}`);
    return NextResponse.next();
  }

  // CENÁRIO 2: Usuário NÃO autenticado
  // Se o usuário NÃO tem um token
  // E está tentando acessar uma rota que NÃO é pública
  if (!token && !isPublicPath(pathname)) {
    console.log(
      `Middleware: Token NÃO existe e ${pathname} NÃO é pública, redirecionando para /login`
    );
    // Redireciona APENAS se for uma requisição de PÁGINA.
    // Para API Routes sem token, o backend DEVE retornar 401.
    if (!pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Para API Routes que não são públicas e não têm token, o fluxo deve ir para a API
    // e ela deve retornar um 401. Não redirecione aqui para evitar o erro JSON.
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  // CENÁRIO 3: Usuário NÃO autenticado e em uma rota pública
  // Se o usuário NÃO tem um token E está em uma rota pública (como /login ou /api/login)
  console.log(
    `Middleware: Token NÃO existe e ${pathname} É pública, permitindo acesso.`
  );
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Isso aplica o middleware a TODAS as rotas, exceto arquivos estáticos e recursos internos do Next.js
    // Mantido abrangente para interceptar todas as requisições de página/API.
    "/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|logo.png|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.woff$|.*\\.woff2$|.*\\.ttf$|.*\\.eot$).*)",
  ],
};
