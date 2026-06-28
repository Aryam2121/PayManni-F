import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error = false,
  label,
  helper,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => (
  <div className="space-y-2">
    {label && (
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    )}
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border bg-background px-3 py-2 text-sm transition-all duration-200",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "hover:border-gray-400 dark:hover:border-gray-500",
          leftIcon && "pl-10",
          rightIcon && "pr-10",
          error 
            ? "border-red-500 focus-visible:ring-red-500" 
            : "border-gray-300 dark:border-gray-600",
          className
        )}
        ref={ref}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
    {helper && (
      <p className={cn(
        "text-xs",
        error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
      )}>
        {helper}
      </p>
    )}
  </div>
));

Input.displayName = "Input";

// Enhanced OTP Input Component
const OTPInput = ({ 
  length = 6, 
  onComplete, 
  className 
}) => {
  const [otp, setOtp] = React.useState(new Array(length).fill(""));
  const inputRefs = React.useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }

    if (element.value && index === length - 1) {
      const otpString = [...otp.slice(0, index), element.value].join("");
      onComplete?.(otpString);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className={cn("flex space-x-3 justify-center", className)}>
      {otp.map((data, index) => (
        <motion.input
          key={index}
          type="text"
          maxLength="1"
          className="w-12 h-12 border-2 rounded-lg text-center text-lg font-semibold border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
          ref={(el) => (inputRefs.current[index] = el)}
          whileFocus={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      ))}
    </div>
  );
};

export { Input, OTPInput };