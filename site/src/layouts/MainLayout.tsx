// src/layouts/MainLayout.tsx
import React from "react";
import Header from "@/components/Header/Header"; // Certifique-se de que o Header é importado aqui
import Footer from "@/components/Footer/Footer"; // E o Footer, se existir
import styles from "./MainLayout.module.css"; // Importe os estilos

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      {" "}
      {/* Adicionamos um container com os estilos */}
      <Header />
      <main className={styles.mainContent}>
        {" "}
        {/* Adicionamos uma classe para o conteúdo principal */}
        {children}
      </main>
      <Footer /> {/* Se você tem um componente Footer */}
    </div>
  );
};

export default MainLayout;
