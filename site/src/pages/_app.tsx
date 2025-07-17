// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Importa os estilos globais e variáveis

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;