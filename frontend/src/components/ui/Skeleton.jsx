export default function Skeleton({ className = '', rounded = false }) {
  return (
    <div
      className={`skeleton ${rounded ? 'rounded-full' : ''} ${className}`}
      aria-hidden="true"
    />
  );
}
