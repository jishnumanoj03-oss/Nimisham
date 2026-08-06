import { Outlet, Link } from 'react-router-dom';
import { Aperture } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-nim-bg flex">
      {/* Left panel — editorial branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-nim-bg via-nim-elevated to-nim-bg" />

        {/* Decorative grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px),
                              linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <Aperture className="w-7 h-7 text-nim-accent" />
            <span className="font-display text-xl font-semibold text-nim-text">Nimisham</span>
          </Link>

          {/* Hero text */}
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="label-meta text-nim-accent mb-4">Creative Platform</p>
              <h1 className="font-display text-4xl xl:text-5xl font-bold text-nim-text leading-tight mb-6">
                Every great image
                <br />
                <span className="text-nim-accent">has a story</span>
              </h1>
              <p className="text-body text-nim-text-secondary leading-relaxed max-w-md">
                Showcase your photography and AI art. Document your creative process.
                Share knowledge with a community that understands the craft.
              </p>
            </motion.div>

            {/* Stats-like metadata */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-8 mt-10 pt-8 border-t border-nim-border"
            >
              {[
                { label: 'Platform', value: 'Photography & AI Art' },
                { label: 'Features', value: 'Portfolio · Learn · Market' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="label-meta text-nim-text-muted mb-1">{stat.label}</p>
                  <p className="text-small text-nim-text-secondary">{stat.value}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Footer metadata */}
          <p className="label-meta text-nim-text-muted">
            © {new Date().getFullYear()} Nimisham · MCA Mini Project
          </p>
        </div>

        {/* Decorative accent line */}
        <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-nim-accent/20 to-transparent" />
      </div>

      {/* Right panel — auth form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden p-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Aperture className="w-7 h-7 text-nim-accent" />
            <span className="font-display text-xl font-semibold text-nim-text">Nimisham</span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
