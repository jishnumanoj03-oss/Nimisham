import { motion } from 'framer-motion';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onAction,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-nim-elevated border border-nim-border flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-nim-text-muted" />
        </div>
      )}
      <h3 className="text-h4 text-nim-text mb-2">{title}</h3>
      {description && (
        <p className="text-small text-nim-text-secondary max-w-sm mb-6">{description}</p>
      )}
      {action && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {action}
        </Button>
      )}
    </motion.div>
  );
}
