// src/layouts/MainLayout.tsx
import Footer from '@/components/site/Footer/Footer';
import Header from '@/components/site/Header/Header';
import styles from '@/styles/MainLayout.module.css';
import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
