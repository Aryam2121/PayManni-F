import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg",
  destructive: "bg-red-600 text-white hover:bg-red-700 shadow-lg",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  ghost: "hover:bg-gray-100 text-gray-900",
  link: "text-blue-600 underline-offset-4 hover:underline",
  gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg",
  success: "bg-green-600 text-white hover:bg-green-700 shadow-lg",
  warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg",
};

const sizeVariants = {
  default: "h-10 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-sm",
  lg: "h-12 rounded-md px-8 text-lg",
  xl: "h-14 rounded-md px-10 text-xl",
  icon: "h-10 w-10",
};

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  loading = false,
  children, 
  ...props 
}, ref) => {
  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95",
        buttonVariants[variant],
        sizeVariants[size],
        loading && "opacity-70 cursor-not-allowed",
        className
      )}
      ref={ref}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };