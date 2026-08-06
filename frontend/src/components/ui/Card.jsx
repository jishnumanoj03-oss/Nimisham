export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`
        bg-nim-surface border border-nim-border rounded-nim-lg p-6
        ${hover ? 'transition-all duration-200 hover:border-nim-text-muted/30 hover:shadow-nim-md cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
