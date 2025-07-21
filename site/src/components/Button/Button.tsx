// src/components/Button/Button.tsx
import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outlined";
  size?: "small" | "medium" | "large";
  children: React.ReactNode | string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  fullWidth?: boolean; // Para botão ocupar 100% da largura
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  onClick,
  href = undefined,
  fullWidth = false,
  className, // Para permitir classes CSS adicionais
  ...rest
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className, // Adiciona classes passadas via prop
  ]
    .filter(Boolean)
    .join(" "); // Remove strings vazias e junta com espaço

  return !!href ? (
    <a
      href={href}
      className={buttonClasses}
      tabIndex={rest.disabled ? -1 : undefined}
      aria-disabled={rest.disabled ? "true" : undefined}
      onClick={rest.disabled ? (e) => e.preventDefault() : undefined}
    >
      {children}
    </a>
  ) : (
    <button className={buttonClasses} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

export default Button;
