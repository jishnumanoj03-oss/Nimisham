import { Aperture } from 'lucide-react';
import Spinner from '../ui/Spinner';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-nim-bg flex flex-col items-center justify-center gap-4">
      <Aperture className="w-10 h-10 text-nim-accent animate-pulse" />
      <Spinner size="md" />
    </div>
  );
}
