import React from 'react';
import Card from './Card';

interface DataCardProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const DataCardComponent: React.FC<DataCardProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <Card
      title={
        typeof title === 'string' ? (
          <strong className="text-primary text-lg">{title}</strong>
        ) : (
          title
        )
      }
      className={className}
    >
      {children}
    </Card>
  );
};

export const DataCard = React.memo<DataCardProps>(DataCardComponent);

DataCard.displayName = 'DataCard';
