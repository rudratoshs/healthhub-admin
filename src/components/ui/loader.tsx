
import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "primary" | "secondary" | "accent";
}

const Loader: React.FC<LoaderProps> = ({ 
  size = "md", 
  className,
  variant = "primary"
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const variantClasses = {
    primary: "before:bg-primary after:bg-primary-300",
    secondary: "before:bg-secondary after:bg-secondary-300",
    accent: "before:bg-accent after:bg-accent-300",
  };

  return (
    <div className={cn(
      "relative rounded-full", 
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      <div className="absolute inset-0 rounded-full opacity-70 animate-ping" 
        style={{ 
          animationDuration: "1.5s",
          backgroundColor: "currentColor"
        }} 
      />
      <div className="absolute inset-0 rounded-full opacity-40 animate-ping" 
        style={{ 
          animationDuration: "2s",
          animationDelay: "0.2s",
          backgroundColor: "currentColor"
        }} 
      />
    </div>
  );
};

export { Loader };
