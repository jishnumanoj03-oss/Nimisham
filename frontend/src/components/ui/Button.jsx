import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-nim-accent text-[#0A0A0B] hover:bg-nim-accent-hover font-semibold',
  secondary: 'bg-nim-elevated text-nim-text border border-nim-border hover:bg-nim-hover',
  ghost: 'text-nim-text-secondary hover:bg-nim-hover hover:text-nim-text',
  danger: 'bg-nim-error/12 text-nim-error hover:bg-nim-error/20',
  outline: 'border border-nim-accent text-nim-accent hover:bg-nim-accent-muted',
};

const sizes = {
  sm: 'h-8 px-3 text-small gap-1.5',
  md: 'h-10 px-4 text-body gap-2',
  lg: 'h-12 px-6 text-body gap-2.5',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      className={`
        inline-flex items-center justify-center rounded-nim-md
        transition-colors duration-150 font-medium
        focus-visible:outline-2 focus-visible:outline-nim-accent focus-visible:outline-offset-2
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-inherit
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
