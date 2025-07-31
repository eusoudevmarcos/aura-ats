// frontend/pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/global.css";
import "../styles/Login.module.css";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
