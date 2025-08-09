// frontend/pages/_app.tsx
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "../styles/global.css";
import "../styles/Login.module.css";
import DashboardLayout from "@/layout/DashboardLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";

const PUBLIC_ROUTES = ["/login"];

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(router.pathname);

  // Se for rota pública, renderiza sem layout
  if (isPublic) {
    return (
      <>
        <SpeedInsights /> <Component {...pageProps} />
      </>
    );
  }

  // Se for rota privada, usa layout do dashboard
  return (
    <>
      <SpeedInsights />
      <DashboardLayout>
        {(dashboardProps) => <Component {...pageProps} {...dashboardProps} />}
      </DashboardLayout>
    </>
  );
}

export default App;
