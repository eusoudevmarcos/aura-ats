// src/hooks/useSmoothScroll.ts
import { useCallback } from 'react';

interface SmoothScrollOptions {
  offset?: number;
  duration?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export const useSmoothScroll = () => {
  const scrollToSection = useCallback((
    sectionId: string, 
    options: SmoothScrollOptions = {}
  ) => {
    const {
      offset = 80, // Offset padrão para o header
      duration = 800, // Duração em ms
      easing = 'ease-out'
    } = options;

    const section = document.getElementById(sectionId);
    if (!section) return;

    const startPosition = window.pageYOffset;
    const targetPosition = section.offsetTop - offset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  const scrollToTop = useCallback((options: SmoothScrollOptions = {}) => {
    const { duration = 600, easing = 'ease-out' } = options;
    
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      window.scrollTo(0, startPosition * (1 - easedProgress));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  return {
    scrollToSection,
    scrollToTop
  };
};
