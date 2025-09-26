// src/layouts/MainLayout.tsx
import Footer from '@/components/site/Footer/Footer';
import HeaderLadingPage from '@/components/site/HeaderLadingPage/HeaderLadingPage';
import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-color-light)] pt-14">
      <HeaderLadingPage />
      <main className="flex-grow mx-auto w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
