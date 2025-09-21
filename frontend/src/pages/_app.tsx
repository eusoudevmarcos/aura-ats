// frontend/pages/_app.tsx
import DashboardLayout from '@/layout/DashboardLayout';
import MainLayout from '@/layout/MainLayout';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AuthProvider } from '@/context/AuthContext';
import { isAlwaysPublicPath } from '@/middleware';
import '@/styles/global.css';
import '@/styles/landingPage.css';

const PUBLIC_ROUTES = ['/login'];

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(router.pathname);
  console.log(router.pathname);
  if (router.pathname == '/dashboard/cliente') {
    return (
      <AuthProvider>
        <SpeedInsights />
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      </AuthProvider>
    );
  }

  return (
    <>
      <Head>
        <title>Aura ATS</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Aura: O match perfeito para sua empresa. Especialistas em recrutamento médico, TI e vagas executivas com agilidade e efetividade."
        />
      </Head>

      {router.pathname === '/' ? (
        <>
          <SpeedInsights />
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </>
      ) : isPublic || isAlwaysPublicPath(router.pathname) ? (
        <>
          <SpeedInsights />
          <Component {...pageProps} />
        </>
      ) : (
        <AuthProvider>
          <SpeedInsights />
          <DashboardLayout>
            {dashboardProps => <Component {...pageProps} {...dashboardProps} />}
          </DashboardLayout>
        </AuthProvider>
      )}
    </>
  );
}

export default App;
