import React, { useEffect, useRef, useState } from 'react';

interface SlideItem {
  id: string;
  imageSrc: string;
  altText: string;
  title: string;
  description: string;
}

interface SliderProps {
  slides: SlideItem[];
  autoPlay?: boolean;
  interval?: number;
  children: (slide: SlideItem, isExiting: boolean) => React.ReactNode;
}

const SLIDE_ANIMATION_DURATION = 400;

const Slider: React.FC<SliderProps> = ({
  slides,
  autoPlay = true,
  interval = 5000,
  children,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [direction, setDirection] = useState<'forwards' | 'backwards'>(
    'forwards'
  ); // Not used for rendering but may be helpful for further enhancements
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Muda para o slide anterior
  const goToPrev = () => {
    if (isExiting) return;
    setDirection('backwards');
    setIsExiting(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
      setIsExiting(false);
    }, SLIDE_ANIMATION_DURATION);
  };

  // Muda para o slide seguinte
  const goToNext = () => {
    if (isExiting) return;
    setDirection('forwards');
    setIsExiting(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
      setIsExiting(false);
    }, SLIDE_ANIMATION_DURATION);
  };

  // AutoPlay
  useEffect(() => {
    if (!autoPlay) return;
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);

    autoPlayRef.current = setInterval(() => {
      goToNext();
    }, interval);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, interval, slides.length, currentSlide]); // including currentSlide for correct cycling

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, []);

  // Component que envolve os botões laterais e o conteúdo do slide recebido via "children"
  return (
    <div className="relative w-full flex items-center justify-center md:px-10">
      {/* Botão anterior */}
      <button
        aria-label="Slide anterior"
        onClick={goToPrev}
        className="absolute left-2 z-10 flex items-center justify-center rounded-full w-12 h-12 text-2xl text-primary transition hover:bg-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        disabled={isExiting}
        tabIndex={0}
      >
        <span
          className="material-icons-outlined text-shadow-2xs"
          style={{ transform: 'scaleX(-1)' }}
        >
          double_arrow
        </span>
      </button>

      {/* Slide atual */}
      <div className="w-full">{children(slides[currentSlide], isExiting)}</div>

      {/* Botão próximo */}
      <button
        aria-label="Próximo slide"
        onClick={goToNext}
        className="absolute right-2 z-10 flex items-center justify-center rounded-full w-12 h-12 text-2xl text-primary transition hover:bg-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        disabled={isExiting}
        tabIndex={0}
      >
        <span className="material-icons-outlined text-shadow-2xs">
          double_arrow
        </span>
      </button>
    </div>
  );
};

export default Slider;
