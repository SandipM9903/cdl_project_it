import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const baseStyle =
    "px-5 py-2 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-red-500 text-red-500 hover:bg-red-50",
    gray: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  };

  const disabledStyle =
    "bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${
        disabled ? disabledStyle : variants[variant]
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;