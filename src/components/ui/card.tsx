import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-neutral-50 border border-neutral-300 rounded-lg ${className}`}>
      {children}
    </div>
  );
}