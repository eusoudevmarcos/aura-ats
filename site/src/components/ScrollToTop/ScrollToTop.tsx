// src/components/ScrollToTop/ScrollToTop.tsx
import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import styles from './ScrollToTop.module.css';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollToTop } = useSmoothScroll();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleClick = () => {
    scrollToTop({ duration: 600 });
  };

  if (!isVisible) return null;

  return (
    <button
      className={styles.scrollToTop}
      onClick={handleClick}
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
    >
      <FaArrowUp />
    </button>
  );
};

export default ScrollToTop;
