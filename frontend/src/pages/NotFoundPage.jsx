import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-nim-bg flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-9xl font-bold text-nim-text/10 mb-4 tracking-tighter">404</h1>
      <h2 className="text-h2 font-display text-nim-text mb-4">Page not found</h2>
      <p className="text-body text-nim-text-secondary max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button icon={Home} iconPosition="left">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
