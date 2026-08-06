import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  error,
  maxLength,
  value = '',
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const charCount = value?.length || 0;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-label uppercase tracking-wider text-nim-text-muted mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        value={value}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        className={`
          w-full min-h-[100px] rounded-nim-md bg-nim-elevated border
          text-nim-text placeholder:text-nim-text-muted
          px-4 py-3 resize-y
          transition-colors duration-150
          focus:outline-none focus:border-nim-border-focus focus:shadow-nim-glow
          ${error
            ? 'border-nim-error focus:border-nim-error'
            : 'border-nim-border hover:border-nim-text-muted'
          }
          ${className}
        `}
        {...props}
      />
      <div className="flex justify-between mt-1.5">
        {error && (
          <p id={`${textareaId}-error`} className="text-caption text-nim-error" role="alert">
            {error}
          </p>
        )}
        {maxLength && (
          <p className={`text-caption ml-auto ${charCount > maxLength * 0.9 ? 'text-nim-warning' : 'text-nim-text-muted'}`}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
