// src/layouts/MainLayout.tsx
import Footer from '@/components/site/Footer/Footer';
import HeaderLadingPage from '@/components/site/Header/HeaderLadingPage';
import styles from '@/styles/MainLayout.module.css';
import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <HeaderLadingPage />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
