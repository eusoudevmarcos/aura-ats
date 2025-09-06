import { NextRequest, NextResponse } from 'next/server';

// A rota "/" deve ser sempre pública (landing page), independente do login
const ALWAYS_PUBLIC_PATHS = ['/'];

// Apenas rotas de login podem ser acessadas sem autenticação
const LOGIN_PATHS = ['/login', '/api/auth/login'];

const DASHBOARD_PATH = '/atividades/agendas';

function isAlwaysPublicPath(pathname: string) {
  return ALWAYS_PUBLIC_PATHS.some(publicPath => pathname === publicPath);
}

function isLoginPath(pathname: string) {
  return LOGIN_PATHS.some(loginPath => pathname.startsWith(loginPath));
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  // Acesso sempre liberado para a landing page "/"
  if (isAlwaysPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Se não estiver autenticado
  if (!token) {
    // Permite acesso apenas às rotas de login e à landing page
    if (isLoginPath(pathname)) {
      return NextResponse.next();
    }

    // Bloqueia acesso a qualquer outra rota (exceto API)
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Para rotas de API protegidas
    return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
  }

  // Se estiver autenticado
  // Não redireciona se já estiver no dashboard para evitar loop
  if (isLoginPath(pathname)) {
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
    }
    return NextResponse.next();
  }

  // Se tentar acessar o dashboard já autenticado, não faz nada (evita loop)
  if (pathname === DASHBOARD_PATH) {
    return NextResponse.next();
  }

  // Usuário autenticado pode acessar qualquer rota (exceto login)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|logo.png|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.woff$|.*\\.woff2$|.*\\.ttf$|.*\\.eot$).*)',
  ],
};
