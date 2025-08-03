// frontend/pages/_app.tsx
import type { AppProps, AppContext } from "next/app";
import { useRouter } from "next/router";
import "../styles/global.css";
import "../styles/Login.module.css";
import DashboardLayout from "@/layout/DashboardLayout";
import nookies from "nookies";
import { useEffect } from "react";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPage =
    router.pathname === "/login" || router.pathname === "/register";

  // Redirecionamento no client caso não tenha token (fallback extra)
  useEffect(() => {
    if (!isAuthPage) {
      const cookies = nookies.get(null);
      if (!cookies.token) {
        router.replace("/login");
      }
    }
  }, [router.pathname]);

  if (isAuthPage) {
    return <Component {...pageProps} />;
  }

  return (
    <DashboardLayout>
      {(dashboardProps) => <Component {...pageProps} {...dashboardProps} />}
    </DashboardLayout>
  );
}

// Verificação do token no backend (Next.js SSR)
App.getInitialProps = async (appContext: AppContext) => {
  const { ctx } = appContext;
  const appProps = {
    ...(await (await import("next/app")).default.getInitialProps(appContext)),
  };

  // Páginas de autenticação não precisam de token
  const isAuthPage = ctx.pathname === "/login" || ctx.pathname === "/register";

  if (!isAuthPage) {
    const cookies = nookies.get(ctx);
    if (!cookies.token) {
      if (ctx.res) {
        ctx.res.writeHead(302, { Location: "/login" });
        ctx.res.end();
      }
    }
  }

  return { ...appProps };
};

export default App;
