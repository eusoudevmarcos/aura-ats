// frontend/pages/_app.tsx
import DashboardLayout from '@/layout/DashboardLayout';
import MainLayout from '@/layout/MainLayout';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import api from '@/axios';
import ScreenshotGuard from '@/components/auth/ScreenshotGuard';
import { AuthProvider } from '@/context/AuthContext';
import { isAlwaysPublicPath } from '@/proxy';
import '@/styles/global.css';
import '@/styles/landingPage.css';
import { useEffect, useState } from 'react';

const PUBLIC_ROUTES = ['/login'];

// Componente de isolamento do loading
type LoadingWrapperProps = {
  children: React.ReactNode;
};
function LoadingWrapper({ children }: LoadingWrapperProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const start = () => setLoading(true);
    const complete = () => setLoading(false);
    const error = () => setLoading(false);

    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', complete);
    router.events.on('routeChangeError', error);

    setLoading(false);

    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', complete);
      router.events.off('routeChangeError', error);
    };
  }, [router.events]);

  if (loading) {
    return (
      <div className="fixed left-0 right-0 flex flex-col justify-center items-center w-full h-32">
        <div
          className="border-4 border-primary border-t-transparent rounded-full w-12 h-12 animate-spin"
          style={{
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
          }}
        ></div>
        <span className="mt-2 text-primary">Carregando...</span>
        <style jsx global>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(router.pathname);

  useEffect(() => {
    api.get('/api/external/ping');
  }, []);

  if (router.pathname == '/dashboard/cliente') {
    return (
      <AuthProvider>
        <SpeedInsights />
        <DashboardLayout>
          <LoadingWrapper>
            <Component {...pageProps} />
          </LoadingWrapper>
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
            <LoadingWrapper>
              <Component {...pageProps} />
            </LoadingWrapper>
          </MainLayout>
        </>
      ) : isPublic || isAlwaysPublicPath(router.pathname) ? (
        <>
          <SpeedInsights />
          <LoadingWrapper>
            <Component {...pageProps} />
          </LoadingWrapper>
        </>
      ) : (
        <AuthProvider>
          <ScreenshotGuard forceDev={false} durationMs={0} />
          <SpeedInsights />
          <DashboardLayout>
            {dashboardProps => (
              <LoadingWrapper>
                <Component {...pageProps} {...dashboardProps} />
              </LoadingWrapper>
            )}
          </DashboardLayout>
        </AuthProvider>
      )}
    </>
  );
}

export default App;
