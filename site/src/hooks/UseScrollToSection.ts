// src/hooks/useScrollToSection.ts
import { useCallback } from 'react';

/**
 * Hook para rolar suavemente a tela até uma seção específica.
 * @param sectionId O ID da seção HTML para onde a rolagem deve ocorrer.
 */
export const useScrollToSection = () => {
  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return scrollToSection;
};