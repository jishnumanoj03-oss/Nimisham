import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Image as ImageIcon, 
  BookOpen, 
  FolderPlus, 
  DownloadCloud, 
  Bot, 
  Compass 
} from 'lucide-react';
import Card from '../../components/ui/Card';

export default function DashboardPage() {
  const { user } = useAuth();

  const timeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    { 
      icon: Plus, 
      label: 'Upload Artwork', 
      description: 'Share photography or AI generated art',
      path: '/artwork/upload',
      color: 'bg-blue-500/10 text-blue-500'
    },
    { 
      icon: FolderPlus, 
      label: 'Manage Portfolios', 
      description: 'Create & curate custom portfolios',
      path: '/portfolios',
      color: 'bg-purple-500/10 text-purple-500'
    },
    { 
      icon: BookOpen, 
      label: 'Write Tutorial', 
      description: 'Share knowledge & techniques',
      path: '/tutorials/editor',
      color: 'bg-amber-500/10 text-amber-500'
    },
    { 
      icon: DownloadCloud, 
      label: 'Upload Resource', 
      description: 'Share presets, LUTs, or PDF guides',
      path: '/resources/upload',
      color: 'bg-green-500/10 text-green-500'
    },
    { 
      icon: Compass, 
      label: 'Learning Center', 
      description: 'Browse community tutorials',
      path: '/tutorials',
      color: 'bg-rose-500/10 text-rose-500'
    },
    { 
      icon: Bot, 
      label: 'AI Prompt Library', 
      description: 'Explore & copy AI prompt recipes',
      path: '/prompts',
      color: 'bg-cyan-500/10 text-cyan-500'
    },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-body text-nim-text-secondary mb-1">{timeGreeting()},</p>
          <h1 className="font-display text-h1 text-nim-text">
            {user?.name?.split(' ')[0] || user?.username}
          </h1>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <Badge variant="accent">Phase 2 Active</Badge>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h4 text-nim-text">Quick Actions & Features</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link to={action.path} className="block h-full group">
                <Card className="h-full flex flex-col justify-between hover:border-nim-accent/50 transition-all duration-300 group-hover:shadow-lg">
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.color}`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-body font-medium text-nim-text mb-1 group-hover:text-nim-accent transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-small text-nim-text-secondary">
                      {action.description}
                    </p>
                  </div>
                  <div className="mt-6 text-xs text-nim-accent font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Access feature &rarr;
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Overview Banner */}
      <section>
        <Card className="p-8 border-nim-accent/20 bg-gradient-to-r from-nim-elevated to-nim-bg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-h3 text-nim-text mb-3">Welcome to Phase 2 of Nimisham</h2>
            <p className="text-nim-text-secondary leading-relaxed mb-6">
              You can now upload photography and AI artworks, document creative processes, publish long-form tutorials, distribute digital presets & LUTs, and curate AI prompt collections.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/artwork/upload" 
                className="px-5 py-2.5 bg-nim-accent text-[#0A0A0B] rounded-nim-md font-semibold text-small hover:bg-nim-accent-hover transition-colors"
              >
                Upload Artwork
              </Link>
              <Link 
                to="/tutorials" 
                className="px-5 py-2.5 bg-nim-elevated border border-nim-border text-nim-text rounded-nim-md font-medium text-small hover:bg-nim-hover transition-colors"
              >
                Explore Tutorials
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

// Inline badge for the dashboard
function Badge({ children, variant = 'default' }) {
  const variantClasses = {
    default: 'bg-nim-elevated text-nim-text-secondary border border-nim-border',
    accent: 'bg-nim-accent-muted text-nim-accent border border-nim-accent/20',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-nim-sm text-xs font-semibold uppercase tracking-wider ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
