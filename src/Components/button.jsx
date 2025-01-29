// button.js (or button.tsx)
import React from 'react';

const Button = ({ children, ...props }) => {
  return (
    <button {...props} className={`py-3 px-6 rounded-xl ${props.className}`}>
      {children}
    </button>
  );
};

export default Button;
