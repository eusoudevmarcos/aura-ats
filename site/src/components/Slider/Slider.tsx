// src/components/Slider/Slider.tsx
import React, { useState, useEffect, useCallback, Children, isValidElement } from 'react';
import styles from './Slider.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Ícones de navegação

interface SliderProps {
  children: React.ReactNode; // Deve receber uma função que renderiza o slide
  slides: { id: string; [key: string]: any }[]; // Array de dados dos slides
  autoPlay?: boolean;
  interval?: number; // Tempo em ms para autoPlay
  showControls?: boolean;
  showPagination?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  children,
  slides,
  autoPlay = false,
  interval = 5000,
  showControls = true,
  showPagination = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (autoPlay) {
      const timer = setInterval(nextSlide, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, nextSlide]);

  // Renderiza o slide atual passando os dados para a função children
  const renderCurrentSlide = () => {
    if (slides.length === 0) return null;
    const slideData = slides[currentSlide];
    // Garante que children é uma função antes de chamar
    if (typeof children === 'function') {
      return children(slideData);
    }
    // Fallback caso children não seja uma função ou seja um elemento direto
    const childrenArray = Children.toArray(children);
    if (isValidElement(childrenArray[currentSlide])) {
        return childrenArray[currentSlide];
    }
    return null;
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderContent}>
        {renderCurrentSlide()}
      </div>

      {showControls && (
        <>
          <button className={`${styles.controlButton} ${styles.prev}`} onClick={prevSlide} aria-label="Slide Anterior">
            <FaChevronLeft />
          </button>
          <button className={`${styles.controlButton} ${styles.next}`} onClick={nextSlide} aria-label="Próximo Slide">
            <FaChevronRight />
          </button>
        </>
      )}

      {showPagination && slides.length > 1 && (
        <div className={styles.pagination}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.paginationDot} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;