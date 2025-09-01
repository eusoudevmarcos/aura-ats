// frontend/pages/_app.tsx
import DashboardLayout from '@/layout/DashboardLayout';
import MainLayout from '@/layout/MainLayout';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import '@/styles/global.css';
import '@/styles/landingPage.css';

const PUBLIC_ROUTES = ['/login'];

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(router.pathname);

  // A abordagem de importação dinâmica de CSS baseada na rota não funcionou corretamente.
  // Portanto, ambos os arquivos CSS são importados globalmente acima.
  // Recomenda-se que cada CSS tenha escopo suficiente para não conflitar,
  // ou que se utilize CSS Modules para evitar vazamento de estilos.

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
      ) : isPublic ? (
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
