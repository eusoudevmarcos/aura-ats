import { mostrarValor } from '@/utils/exportCSV';
import React from 'react';

interface InfoProps {
  label?: string | React.ReactNode;
  value?: string | number | null | undefined;
  hideIfEmpty?: boolean;
}

const InfoComponent: React.FC<InfoProps> = ({ label, value, hideIfEmpty = false }) => {
  if (
    hideIfEmpty &&
    (value === undefined ||
      value === null ||
      (typeof value === 'string' && !value.trim()))
  ) {
    return null;
  }
  // Se label for string, adicione ":". Se for ReactNode, não adicione ":"
  const isStringLabel = typeof label === 'string';
  return (
    <p className="font-medium mb-0 w-fit flex gap-1">
      {label !== undefined && label !== null && (
        <span className="text-primary">
          {label}
          {isStringLabel && ':'}
        </span>
      )}
      {mostrarValor(value)}
    </p>
  );
};

export const Info = React.memo<InfoProps>(InfoComponent);
