// frontend/pages/_app.tsx
import DashboardLayout from '@/layout/DashboardLayout';
import '@/styles/global.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PUBLIC_ROUTES = ['/login'];

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(router.pathname);

  return (
    <>
      <Head>
        <title>Aura ATS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isPublic ? (
        <>
          <SpeedInsights />
          <Component {...pageProps} />
        </>
      ) : (
        <>
          <SpeedInsights />
          <DashboardLayout>
            {dashboardProps => <Component {...pageProps} {...dashboardProps} />}
          </DashboardLayout>
        </>
      )}
    </>
  );
}

export default App;
