import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children,
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm hover:shadow-md",
    elevated: "bg-white shadow-lg hover:shadow-xl border-0",
    gradient: "bg-gradient-to-br from-white to-surface border border-gray-200 shadow-sm hover:shadow-md"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg p-6 transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;