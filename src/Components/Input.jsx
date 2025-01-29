// input.js (or input.tsx)
import React from 'react';

const Input = (props) => {
  return (
    <input {...props} className={`border p-3 rounded-xl shadow-sm ${props.className}`} />
  );
};

export default Input;
