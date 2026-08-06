import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-nim-error/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-nim-error" />
      </div>
      <h3 className="text-h4 text-nim-text mb-2">{title}</h3>
      {description && (
        <p className="text-small text-nim-text-secondary max-w-sm mb-6">{description}</p>
      )}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
