import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Globe, Camera, MessageCircle, Code, Video, Image as ImageIcon, BookOpen } from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingScreen from '../../components/feedback/LoadingScreen';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await userService.getPublicProfile(username);
        setProfile(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState title="Profile Not Found" description={error} />;
  if (!profile) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const hasSocialLinks = profile.socialLinks && Object.values(profile.socialLinks).some(val => val);

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Profile Header */}
      <section className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="shrink-0"
        >
          <Avatar src={profile.avatar} name={profile.name} size="xl" className="w-32 h-32 md:w-40 md:h-40" />
        </motion.div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-h2 text-nim-text mb-1">{profile.name}</h1>
              <p className="text-body text-nim-text-secondary">@{profile.username}</p>
            </div>
            
            {isOwnProfile && (
              <Link to="/profile/edit">
                <Button variant="secondary">Edit Profile</Button>
              </Link>
            )}
          </div>

          {/* Badges & Meta */}
          <div className="flex flex-wrap gap-3 items-center">
            {profile.role === 'admin' && (
              <Badge variant="error">Admin</Badge>
            )}
            {profile.creatorType && (
              <Badge variant="accent">{profile.creatorType.replace('-', ' ')}</Badge>
            )}
            <div className="flex items-center gap-1.5 text-small text-nim-text-muted">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatDate(profile.createdAt)}</span>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-body text-nim-text max-w-2xl leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Social Links */}
          {hasSocialLinks && (
            <div className="flex gap-4 pt-2">
              {profile.socialLinks.website && (
                <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-nim-text-muted hover:text-nim-text transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.instagram && (
                <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-nim-text-muted hover:text-nim-text transition-colors">
                  <Camera className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-nim-text-muted hover:text-nim-text transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-nim-text-muted hover:text-nim-text transition-colors">
                  <Code className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.youtube && (
                <a href={profile.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-nim-text-muted hover:text-nim-text transition-colors">
                  <Video className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <section>
          <h3 className="text-label uppercase tracking-wider text-nim-text-muted mb-4">Skills & Focus</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <Badge key={skill} variant="default">{skill}</Badge>
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      <hr className="border-t border-nim-border" />

      {/* Future Sections (Placeholders for Phase 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <ImageIcon className="w-5 h-5 text-nim-text-muted" />
            <h3 className="text-h4 text-nim-text">Portfolio</h3>
          </div>
          <EmptyState 
            title="No works yet" 
            description={`${isOwnProfile ? 'You haven\'t' : profile.name + ' hasn\'t'} uploaded any artwork or photography yet.`}
            className="bg-nim-surface border border-nim-border rounded-nim-lg"
          />
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-nim-text-muted" />
            <h3 className="text-h4 text-nim-text">Tutorials</h3>
          </div>
          <EmptyState 
            title="No tutorials" 
            description={`${isOwnProfile ? 'You haven\'t' : profile.name + ' hasn\'t'} published any tutorials yet.`}
            className="bg-nim-surface border border-nim-border rounded-nim-lg"
          />
        </section>
      </div>
    </div>
  );
}
