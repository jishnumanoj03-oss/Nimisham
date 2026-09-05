import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Aperture,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import Avatar from '../ui/Avatar';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tutorials', path: '/tutorials' },
    { label: 'Resources', path: '/resources' },
    { label: 'AI Prompts', path: '/prompts' },
    { label: 'Portfolios', path: '/portfolios' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-nim-bg/80 backdrop-blur-xl border-b border-nim-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <Aperture className="w-7 h-7 text-nim-accent transition-transform duration-300 group-hover:rotate-45" />
            <span className="font-display text-xl font-semibold text-nim-text tracking-tight">
              Nimisham
            </span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-3 py-2 rounded-nim-md text-small font-medium transition-colors duration-150
                    ${isActive(link.path)
                      ? 'text-nim-accent bg-nim-accent-muted'
                      : 'text-nim-text-secondary hover:text-nim-text hover:bg-nim-hover'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-nim-md text-nim-text-muted hover:text-nim-text hover:bg-nim-hover transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-nim-md hover:bg-nim-hover transition-colors"
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    <Avatar src={user?.avatar} name={user?.name || ''} size="sm" />
                    <ChevronDown className={`w-4 h-4 text-nim-text-muted transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-nim-elevated border border-nim-border rounded-nim-lg shadow-nim-lg overflow-hidden"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-nim-border">
                          <p className="text-small font-medium text-nim-text truncate">{user?.name}</p>
                          <p className="text-caption text-nim-text-muted truncate">@{user?.username}</p>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                          <Link
                            to={`/profile/${user?.username}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-small text-nim-text-secondary hover:bg-nim-hover hover:text-nim-text transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <Link
                            to="/artwork/upload"
                            className="flex items-center gap-3 px-4 py-2.5 text-small text-nim-text-secondary hover:bg-nim-hover hover:text-nim-text transition-colors"
                          >
                            Upload Artwork
                          </Link>
                          <Link
                            to="/tutorials/editor"
                            className="flex items-center gap-3 px-4 py-2.5 text-small text-nim-text-secondary hover:bg-nim-hover hover:text-nim-text transition-colors"
                          >
                            Write Tutorial
                          </Link>
                          <Link
                            to="/resources/upload"
                            className="flex items-center gap-3 px-4 py-2.5 text-small text-nim-text-secondary hover:bg-nim-hover hover:text-nim-text transition-colors"
                          >
                            Upload Resource
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-small text-nim-error hover:bg-nim-error/5 w-full text-left transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Log out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden p-2 rounded-nim-md text-nim-text-muted hover:text-nim-text hover:bg-nim-hover transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-small font-medium text-nim-text-secondary hover:text-nim-text transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 bg-nim-accent text-[#0A0A0B] rounded-nim-md text-small font-semibold hover:bg-nim-accent-hover transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && isAuthenticated && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-nim-border"
            >
              <div className="py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      block px-3 py-2.5 rounded-nim-md text-body font-medium transition-colors
                      ${isActive(link.path)
                        ? 'text-nim-accent bg-nim-accent-muted'
                        : 'text-nim-text-secondary hover:text-nim-text hover:bg-nim-hover'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
