const sizeClasses = {
  sm: 'w-8 h-8 text-small',
  md: 'w-10 h-10 text-body',
  lg: 'w-14 h-14 text-h4',
  xl: 'w-20 h-20 text-h3',
};

export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colorIndex = name.length % 5;
  const bgColors = [
    'bg-amber-800/60',
    'bg-emerald-800/60',
    'bg-sky-800/60',
    'bg-rose-800/60',
    'bg-violet-800/60',
  ];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-nim-border ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeClasses[size]} ${bgColors[colorIndex]}
        rounded-full flex items-center justify-center
        font-semibold text-nim-text border border-nim-border
        ${className}
      `}
      aria-label={name}
    >
      {initials || '?'}
    </div>
  );
}
