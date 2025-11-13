import { useEffect, useState } from 'react';
import { PrimaryButton } from './PrimaryButton';

export default function ButtonCopy({ value, className }: any) {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(value);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 4000);
    }
  };

  useEffect(() => {
    let span: HTMLSpanElement | null = null;
    if (copiado) {
      span = document.createElement('span');
      span.className =
        'fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-[#8c53ff] text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium';
      span.innerText = 'Copiado para a área de transferência!';
      document.body.appendChild(span);
    }

    return () => {
      if (span && document.body.contains(span)) {
        document.body.removeChild(span);
      }
    };
  }, [copiado]);

  return (
    <PrimaryButton
      title={copiado ? 'Copiado!' : 'Copiar'}
      className={`min-w-0 shrink-0 rounded-full! bg-white! hover:scale-[1.1] ${className}`}
      onClick={handleCopy}
    >
      <span className="material-icons text-sm!">
        {copiado ? 'done' : 'content_copy'}
      </span>
    </PrimaryButton>
  );
}
