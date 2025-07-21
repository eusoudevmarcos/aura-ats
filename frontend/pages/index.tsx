// frontend/pages/_app.tsx
import type { AppProps } from "next/app";

function Root({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default Root;
