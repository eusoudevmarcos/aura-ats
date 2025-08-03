// frontend/pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/global.css";
import "../styles/Login.module.css";
import DashboardLayout from "@/layout/DashboardLayout";

function App({ Component, pageProps }: AppProps) {
  return (
    <DashboardLayout>
      {(dashboardProps) => <Component {...pageProps} {...dashboardProps} />}
    </DashboardLayout>
  );
}

export default App;
