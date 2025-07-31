import React from "react";

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-2 border-b pb-1">{title}</h2>
      {children}
    </div>
  );
};

export default Card;
