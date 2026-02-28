import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = "default", size = "md", className }) => {
  let base = "rounded px-4 py-2 font-semibold transition-colors";
  let variantStyle = "";

  switch (variant) {
    case "destructive":
      variantStyle = "bg-red-500 text-white hover:bg-red-600";
      break;
    case "outline":
      variantStyle = "border border-gray-300 text-gray-700 hover:bg-gray-100";
      break;
    default:
      variantStyle = "bg-blue-500 text-white hover:bg-blue-600";
  }

  let sizeStyle = "";
  switch (size) {
    case "sm":
      sizeStyle = "text-sm py-1 px-3";
      break;
    case "lg":
      sizeStyle = "text-lg py-3 px-6";
      break;
    default:
      sizeStyle = "text-base py-2 px-4";
  }

  return (
    <button onClick={onClick} className={`${base} ${variantStyle} ${sizeStyle} ${className}`}>
      {children}
    </button>
  );
};
