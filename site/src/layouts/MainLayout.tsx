// src/layouts/MainLayout.tsx
import React from 'react';
import Header from '@/components/Header/Header'; 
import Footer from '@/components/Footer/Footer'; 
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}> 
      <Header />
      <main className={styles.mainContent}> 
        {children}
      </main>
      <Footer /> 
    </div>
  );
};

export default MainLayout;