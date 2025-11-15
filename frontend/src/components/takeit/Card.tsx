import React from 'react';

interface CardProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 min-h-28 ${className}`}>
      {typeof title == 'string' ? (
        <h2 className="text-lg font-semibold mb-2 border-b border-gray-400 pb-1">
          {title}
        </h2>
      ) : (
        title
      )}

      {children}
    </div>
  );
};

export default Card;
