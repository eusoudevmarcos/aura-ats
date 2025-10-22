import Image from 'next/image';
import React, { useRef, useState } from 'react';

const SuccessCasesSection: React.FC = () => {
  // Gera automaticamente as 34 imagens da pasta public/landing-page/empresas
  const companyBaseImages = Array.from(
    { length: 34 },
    (_, index) => `/landing-page/empresas/${index + 1}.jpg`
  );

  // Quantidade de repetições para criar a sensação de infinito visual
  // Com 10 repetições, já cobre larguras de tela gigantes e mantém o loop perfeito
  const REPETITIONS = 8;
  const infiniteCompanyImages = Array.from(
    { length: companyBaseImages.length * REPETITIONS },
    (_, i) => companyBaseImages[i % companyBaseImages.length]
  );

  // Referência para o container que vai rolar (viewport)
  const viewportRef = useRef<HTMLDivElement>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  // Para mouse: drag acelerado
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    if (viewportRef.current)
      scrollStartX.current = viewportRef.current.scrollLeft;
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !viewportRef.current) return;
    const deltaX = e.clientX - dragStartX.current;
    // Multiplicador de aceleração: quanto maior, mais rápido
    viewportRef.current.scrollLeft = scrollStartX.current - deltaX * 5;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    document.body.style.cursor = '';
  };

  // Para touch: drag acelerado
  const dragStartTouchX = useRef(0);
  const scrollStartTouchX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartTouchX.current = e.touches[0].clientX;
    if (viewportRef.current)
      scrollStartTouchX.current = viewportRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !viewportRef.current) return;
    const deltaX = e.touches[0].clientX - dragStartTouchX.current;
    viewportRef.current.scrollLeft = scrollStartTouchX.current - deltaX * 5;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="success-cases-section"
      className="
        max-w-[1420px] mx-auto text-center text-[var(--text-color-primary)]
        px-4
      "
    >
      <h2 className="text-primary text-3xl md:text-4xl font-bold mb-6">
        Nossos Cases de Sucesso: Empresas que Confiam na Aura
      </h2>
      <p
        className="
        text-lg md:text-xl text-[var(--text-color-secondary)]
        mb-16 max-w-[800px] mx-auto
      "
      >
        Veja algumas das empresas que já impulsionaram seus resultados com o
        recrutamento estratégico da Aura.
      </p>
      <div
        ref={viewportRef}
        className={`
          relative w-full mt-10
          border-t border-b border-[var(--border-color)]
          overflow-hidden
          py-2
          select-none
        `}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          WebkitOverflowScrolling: 'touch',
          position: 'relative',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`
            flex items-center
            gap-5 md:gap-8
            w-max
            pointer-events-none
            animate-[scrollX_120s_linear_infinite]
            select-none
          `}
          style={{
            userSelect: 'none',
            pointerEvents: 'none',
            // Animation keyframes will be defined below via style jsx
          }}
        >
          {infiniteCompanyImages.map((src, index) => (
            <div
              key={index}
              className={`
                flex-none flex items-center justify-center
                bg-white
                pointer-events-auto
                w-[200px] h-[100px]
                md:w-[200px] md:h-[100px]
                sm:w-[160px] sm:h-[80px]
                min-[320px]:w-[140px] min-[320px]:h-[70px]
                rounded
                shadow-sm
              `}
              style={{
                pointerEvents: 'auto',
              }}
            >
              <Image
                src={src}
                alt={`Logo da Empresa ${(
                  (index % companyBaseImages.length) +
                  1
                ).toString()}`}
                width={180}
                height={90}
                className="max-w-full max-h-full object-contain select-none pointer-events-none"
                style={{
                  objectFit: 'contain',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
                draggable={false}
              />
            </div>
          ))}
        </div>
        {/* CSS extras: esconder scrollbar + keyframes scrollX */}
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            background: transparent;
            display: none;
          }
          div {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 10+ */
          }
          @keyframes scrollX {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default SuccessCasesSection;
