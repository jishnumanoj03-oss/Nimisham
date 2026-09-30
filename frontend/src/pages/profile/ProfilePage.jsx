import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Image as ImageIcon, BookOpen } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';
import { userService } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingScreen from '../../components/feedback/LoadingScreen';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import MyArtworksSection from './MyArtworksSection';
import MyTutorialsSection from './MyTutorialsSection';
import MyProductsSection from './MyProductsSection';
import MyPortfoliosSection from './MyPortfoliosSection';
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

  const getNormalizedUrl = (platform, input) => {
    if (!input) return null;
    
    let val = input.trim();
    if (val.toLowerCase().startsWith('javascript:') || val.toLowerCase().startsWith('data:') || val.toLowerCase().startsWith('vbscript:')) {
      return null;
    }
    
    if (platform === 'whatsapp') {
      if (val.startsWith('http')) return val; // preserve full URL
      const cleanNum = val.replace(/[^\d+]/g, ''); // Strip spaces, hyphens, parentheses
      const finalNum = cleanNum.replace(/^\+/, ''); // Remove leading +
      return `https://wa.me/${finalNum}`;
    }
    
    if (platform === 'instagram') {
      if (val.startsWith('http')) return val;
      if (val.includes('instagram.com/')) return `https://${val.replace(/^www\./, '')}`;
      const cleanUser = val.replace(/^@/, '');
      return `https://instagram.com/${cleanUser}`;
    }
    
    if (platform === 'github') {
      if (val.startsWith('http')) return val;
      if (val.includes('github.com/')) return `https://${val.replace(/^www\./, '')}`;
      return `https://github.com/${val}`;
    }
    
    if (platform === 'youtube') {
      if (val.startsWith('http')) return val;
      if (val.includes('youtube.com/')) return `https://${val.replace(/^www\./, '')}`;
      if (val.startsWith('UC') && val.length === 24) {
        return `https://youtube.com/channel/${val}`;
      }
      const handle = val.startsWith('@') ? val : `@${val}`;
      return `https://youtube.com/${handle}`;
    }
    
    return null;
  };

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
              {profile.socialLinks?.whatsapp && (
                <a 
                  href={getNormalizedUrl('whatsapp', profile.socialLinks.whatsapp)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-nim-text-muted hover:text-nim-text transition-colors p-1"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks?.instagram && (
                <a 
                  href={getNormalizedUrl('instagram', profile.socialLinks.instagram)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-nim-text-muted hover:text-nim-text transition-colors p-1"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks?.youtube && (
                <a 
                  href={getNormalizedUrl('youtube', profile.socialLinks.youtube)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-nim-text-muted hover:text-nim-text transition-colors p-1"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks?.github && (
                <a 
                  href={getNormalizedUrl('github', profile.socialLinks.github)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-nim-text-muted hover:text-nim-text transition-colors p-1"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <FaGithub className="w-5 h-5" />
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

      {/* User's Uploaded Artworks */}
      {isOwnProfile && (
        <MyArtworksSection userId={profile._id} />
      )}

      {/* User's Marketplace Products (Creator Only or has products) */}
      <MyProductsSection userId={profile._id} isOwnProfile={isOwnProfile} profileName={profile.name} />

      {/* Future Sections (Placeholders for Phase 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MyPortfoliosSection userId={profile._id} isOwnProfile={isOwnProfile} profileName={profile.name} />

        <MyTutorialsSection userId={profile._id} isOwnProfile={isOwnProfile} />
      </div>
    </div>
  );
}
