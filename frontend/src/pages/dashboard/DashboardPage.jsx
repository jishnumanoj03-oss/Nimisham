import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Plus, Image as ImageIcon, BookOpen, Compass } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();

  const timeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    { icon: Plus, label: 'Upload Artwork', description: 'Share your latest photography or AI creation', disabled: true },
    { icon: BookOpen, label: 'Write Tutorial', description: 'Share your knowledge with the community', disabled: true },
    { icon: Compass, label: 'Explore', description: 'Discover new artists and techniques', disabled: true },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <section>
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
      </section>

      {/* Quick Actions (Phase 1 Placeholders) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h4 text-nim-text">Quick Actions</h2>
          <Badge variant="accent">Phase 2 Preview</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col justify-between opacity-70 cursor-not-allowed">
                <div>
                  <div className="w-10 h-10 rounded-full bg-nim-elevated flex items-center justify-center mb-4">
                    <action.icon className="w-5 h-5 text-nim-text-secondary" />
                  </div>
                  <h3 className="text-body font-medium text-nim-text mb-1">{action.label}</h3>
                  <p className="text-small text-nim-text-secondary">{action.description}</p>
                </div>
                <div className="mt-6">
                  <Button variant="secondary" size="sm" disabled className="w-full">
                    Coming Soon
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity (Phase 1 Placeholder) */}
      <section>
        <h2 className="text-h4 text-nim-text mb-6">Recent Activity</h2>
        <Card className="py-12 text-center border-dashed">
          <div className="w-16 h-16 rounded-full bg-nim-elevated flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-6 h-6 text-nim-text-muted" />
          </div>
          <p className="text-body text-nim-text-secondary mb-2">Your feed is quiet right now.</p>
          <p className="text-small text-nim-text-muted">Activity tracking will be available in Phase 2.</p>
        </Card>
      </section>
    </div>
  );
}

// Inline badge for the dashboard preview
function Badge({ children, variant = 'default' }) {
  const variantClasses = {
    default: 'bg-nim-elevated text-nim-text-secondary border border-nim-border',
    accent: 'bg-nim-accent-muted text-nim-accent border border-nim-accent/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-nim-sm text-label uppercase tracking-wider ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
