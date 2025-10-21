import React, { useEffect, useState } from 'react';

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

const Slider: React.FC<SliderProps> = ({
  slides,
  autoPlay = true,
  interval = 5000,
  children,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      // Inicia animação de saída
      setIsExiting(true);

      // Após 400ms (duração da animação de saída), muda o slide
      setTimeout(() => {
        setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
        setIsExiting(false);
      }, 400);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
      }}
    >
      {children(slides[currentSlide], isExiting)}
    </div>
  );
};

export default Slider;
