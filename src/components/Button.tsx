import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: "primary" | "secondary" | "outline";
}

const Button: React.FC<ButtonProps> = ({ text, className, disabled, variant = "primary", ...props }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return `text-white ${disabled ? 'bg-[#b2171e33]' : 'bg-[#B2171E]'}`;
      case "secondary":
        return `text-white bg-[#2F3140]`;
      case "outline":
        return `text-[#2F3140] bg-[#F4F4F5]`;
      default:
        return `text-white bg-[#B2171E]`;
    }
  };

  return (
    <button
      {...props}
      disabled={disabled}
      className={`w-full font-medium py-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed ${getVariantStyles()} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
