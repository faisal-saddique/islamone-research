import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = "default",
  size = "md",
  className = "",
  disabled = false
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: "bg-primary hover:bg-primary-light text-neutral-50",
    outline: "border border-neutral-300 hover:bg-neutral-100 text-neutral-800"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}