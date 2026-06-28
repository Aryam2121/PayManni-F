import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg",
      className
    )}
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Enhanced Service Card Component
const ServiceCard = ({ 
  icon, 
  title, 
  description, 
  onClick, 
  className, 
  gradient = "from-blue-500 to-purple-600",
  disabled = false
}) => (
  <motion.div
    className={cn(
      "relative overflow-hidden rounded-2xl p-6 cursor-pointer group",
      `bg-gradient-to-br ${gradient}`,
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
    onClick={!disabled ? onClick : undefined}
    whileHover={!disabled ? { scale: 1.05, rotateY: 5 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    style={{ perspective: "1000px" }}
  >
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20" />
    <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-white/10" />
    
    {/* Content */}
    <div className="relative z-10 flex flex-col items-center text-center text-white">
      <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
    
    {/* Hover Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  </motion.div>
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ServiceCard,
};