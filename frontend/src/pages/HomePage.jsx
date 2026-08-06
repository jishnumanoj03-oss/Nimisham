import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Aperture, ArrowRight, Camera, Cpu, BookOpen } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const features = [
    {
      icon: Camera,
      title: 'Photography',
      description: 'Showcase your high-resolution photography with EXIF data preservation and beautiful gallery layouts.',
    },
    {
      icon: Cpu,
      title: 'AI Art',
      description: 'Document your prompts, models, and generative workflows alongside your final AI creations.',
    },
    {
      icon: BookOpen,
      title: 'Learn & Share',
      description: 'Write detailed tutorials explaining your creative process, or learn new techniques from other artists.',
    },
  ];

  return (
    <div className="min-h-screen bg-nim-bg flex flex-col">
      {/* Minimal Header */}
      <header className="px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <Aperture className="w-8 h-8 text-nim-accent" />
          <span className="font-display text-2xl font-bold text-nim-text">Nimisham</span>
        </div>
        <div className="flex gap-4">
          <Link to="/auth/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/auth/register">
            <Button variant="primary">Join Now</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nim-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl w-full text-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="label-meta text-nim-accent mb-6">Welcome to Phase 1</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-nim-text leading-tight mb-8">
              The creative space for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nim-text via-nim-text to-nim-accent">
                modern artists.
              </span>
            </h1>
            <p className="text-body md:text-h4 text-nim-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Nimisham bridges the gap between traditional photography and generative AI art, creating a unified platform for artists to showcase, learn, and grow.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/register">
                <Button size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                  Start your journey
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Sign in
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Features Preview */}
        <div className="w-full max-w-6xl mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
              className="bg-nim-surface border border-nim-border p-8 rounded-nim-lg"
            >
              <div className="w-12 h-12 bg-nim-elevated rounded-nim-md flex items-center justify-center mb-6 border border-nim-border">
                <feature.icon className="w-6 h-6 text-nim-accent" />
              </div>
              <h3 className="text-h4 text-nim-text mb-3">{feature.title}</h3>
              <p className="text-body text-nim-text-secondary">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
