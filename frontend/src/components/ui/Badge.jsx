const variantClasses = {
  default: 'bg-nim-elevated text-nim-text-secondary border border-nim-border',
  accent: 'bg-nim-accent-muted text-nim-accent border border-nim-accent/20',
  success: 'bg-nim-success/12 text-nim-success',
  warning: 'bg-nim-warning/12 text-nim-warning',
  error: 'bg-nim-error/12 text-nim-error',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-nim-sm
        text-label uppercase tracking-wider
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
