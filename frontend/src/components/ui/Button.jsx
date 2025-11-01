import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  // Use more rounded corners and smoother transitions by default
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary: "bg-primary text-white hover:bg-secondary transition",
    secondary: "bg-hover text-textPrimary",
    outline: "border border-border bg-background hover:bg-secondary text-foreground hover:border-primary-500 focus:ring-primary",
    ghost: "text-secondary-600 hover:text-foreground hover:bg-secondary active:bg-secondary-100",
    danger: "bg-danger text-white hover:bg-danger-600 active:bg-danger-700 shadow-soft hover:shadow-glow focus:ring-danger",
    success: "bg-success text-white hover:bg-success-600 active:bg-success-700 shadow-soft hover:shadow-glow focus:ring-success",
    accent: "bg-accent text-white hover:bg-accent-600 active:bg-accent-700 shadow-soft hover:shadow-glow focus:ring-accent",
  };

  const sizes = {
    xs: "h-7 px-2 py-1 text-xs gap-1",
    sm: "h-8 px-3 py-1.5 text-sm gap-1.5",
    md: "h-10 px-4 py-2 text-base gap-2",
    lg: "h-12 px-6 py-3 text-lg gap-2",
    xl: "h-14 px-8 py-4 text-xl gap-3",
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {icon && !loading && icon}
      <span>{children}</span>
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
