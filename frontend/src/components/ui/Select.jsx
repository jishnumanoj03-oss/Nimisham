import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select...',
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-label uppercase tracking-wider text-nim-text-muted mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          className={`
            w-full h-11 rounded-nim-md bg-nim-elevated border
            text-nim-text appearance-none cursor-pointer
            pl-4 pr-10
            transition-colors duration-150
            focus:outline-none focus:border-nim-border-focus focus:shadow-nim-glow
            ${error
              ? 'border-nim-error'
              : 'border-nim-border hover:border-nim-text-muted'
            }
            ${className}
          `}
          {...props}
        >
          <option value="" className="text-nim-text-muted">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nim-text-muted pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1.5 text-caption text-nim-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
