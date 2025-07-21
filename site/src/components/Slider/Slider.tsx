import React, { useState, useEffect } from 'react';

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
  children: (slide: SlideItem) => React.ReactNode; // <- aqui!
}

const Slider: React.FC<SliderProps> = ({ slides, autoPlay = true, interval = 5000, children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
      {children(slides[currentSlide])}
    </div>
  );
};

export default Slider;
