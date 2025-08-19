// frontend/pages/_app.tsx
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "../styles/global.css";
import "../styles/Login.module.css";
import DashboardLayout from "@/layout/DashboardLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { StrictMode } from "react";
import Head from "next/head";

const PUBLIC_ROUTES = ["/login"];

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(router.pathname);

  return (
    <>
      <Head>
        <title>Aura ATS</title> {/* Título da sua página */}
        <link rel="icon" href="/favicon.ico" /> {/* Referência ao favicon */}
        {/* Opcional: Para outros tamanhos ou formatos, adicione mais tags aqui */}
        {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /> */}
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /> */}
      </Head>
      {isPublic ? (
        <>
          <SpeedInsights />
          <Component {...pageProps} />
        </>
      ) : (
        <StrictMode>
          <SpeedInsights />
          <DashboardLayout>
            {(dashboardProps) => (
              <Component {...pageProps} {...dashboardProps} />
            )}
          </DashboardLayout>
        </StrictMode>
      )}
    </>
  );
}

export default App;
