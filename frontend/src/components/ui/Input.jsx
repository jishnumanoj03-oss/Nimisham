import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-label uppercase tracking-wider text-nim-text-muted mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-nim-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`
            w-full h-11 rounded-nim-md bg-nim-elevated border
            text-nim-text placeholder:text-nim-text-muted
            transition-colors duration-150
            focus:outline-none focus:border-nim-border-focus focus:shadow-nim-glow
            ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'}
            ${error
              ? 'border-nim-error focus:border-nim-error'
              : 'border-nim-border hover:border-nim-text-muted'
            }
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-nim-text-muted hover:text-nim-text-secondary transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-caption text-nim-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
