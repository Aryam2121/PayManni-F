// card.js or card.tsx
import React from "react";

export const Card = ({ children, className, ...props }) => {
  return (
    <div className={`p-4 rounded-xl shadow-lg bg-white ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="text-gray-800">{children}</div>;
};
