import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Camera, Bot, Calendar, Eye, Share2, ArrowLeft, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/ui/Button';

import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import LikeButton from '../../components/interaction/LikeButton';
import BookmarkButton from '../../components/interaction/BookmarkButton';
import ShareButton from '../../components/interaction/ShareButton';
import CommentSection from '../../components/interaction/CommentSection';
import FollowButton from '../../components/interaction/FollowButton';
import RatingStars from '../../components/interaction/RatingStars';

const ArtworkDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [artwork, setArtwork] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user (ignore error if not logged in)
        try {
          const userRes = await api.get('/auth/me');
          setCurrentUser(userRes.data.data);
        } catch (e) {}

        const artRes = await api.get(`/artworks/${id}`);
        setArtwork(artRes.data.data);


      } catch (error) {
        toast.error('Artwork not found or private');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (isLoading) {
    return <div className="flex justify-center p-24">Loading artwork...</div>;
  }

  if (!artwork) return null;

  const isOwner = currentUser && artwork.creator && currentUser._id === artwork.creator._id;
  
  const formattedDate = new Date(artwork.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="bg-bg-primary min-h-screen pb-20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="px-2">
            <ArrowLeft size={20} className="mr-2" /> Back
          </Button>
          
          <div className="flex items-center space-x-2">
            <ShareButton title={artwork.title} />
            {isOwner && (
              <Button size="sm" onClick={() => navigate(`/artwork/edit/${artwork._id}`)}>
                <Edit size={16} className="mr-2" /> Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Image View */}
      <div className="w-full bg-bg-secondary flex items-center justify-center py-8 px-4 sm:px-8 border-b border-border">
        <div className="relative max-w-5xl w-full flex justify-center">
          <img 
            src={artwork.image.url} 
            alt={artwork.title} 
            className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details & Process */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="accent">{artwork.category}</Badge>
              <Badge variant="secondary">{artwork.subCategory}</Badge>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif text-text-primary leading-tight">
              {artwork.title}
            </h1>
            
            <p className="text-lg text-text-secondary whitespace-pre-wrap leading-relaxed">
              {artwork.description}
            </p>
            
            <div className="flex flex-wrap gap-2 pt-4">
              {artwork.tags.map(tag => (
                <span key={tag} className="text-sm text-text-muted bg-bg-secondary px-3 py-1 rounded-full border border-border">
                  #{tag}
                </span>
              ))}
            </div>
          </div>



          {/* Comments Section */}
          <CommentSection contentId={artwork._id} onModel="Artwork" />
        </div>

        {/* Right Column: Meta & Creator */}
        <div className="space-y-8">
          
          {/* Creator Profile Card */}
          <div className="bg-bg-secondary p-6 rounded-xl border border-border">
            <Link to={`/profile/${artwork.creator?._id}`} className="flex items-center space-x-4 mb-4 group">
              <Avatar src={artwork.creator?.avatar} alt={artwork.creator?.name} size="lg" />
              <div>
                <h3 className="text-lg font-medium text-text-primary group-hover:text-accent transition-colors">
                  {artwork.creator?.name}
                </h3>
                <p className="text-sm text-text-muted">@{artwork.creator?.username}</p>
              </div>
            </Link>
            {artwork.creator?.bio && (
              <p className="text-sm text-text-secondary line-clamp-3 mb-4">{artwork.creator.bio}</p>
            )}
            <FollowButton targetUserId={artwork.creator?._id} className="w-full mt-4" />
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between text-sm text-text-muted px-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center"><Eye size={16} className="mr-1.5"/> {artwork.views} Views</span>
              <LikeButton contentId={artwork._id} onModel="Artwork" initialLikes={artwork.likes} />
              <BookmarkButton contentId={artwork._id} onModel="Artwork" />
            </div>
            <span className="flex items-center"><Calendar size={16} className="mr-1.5"/> {formattedDate}</span>
          </div>

          {/* Metadata Display */}
          <div className="bg-bg-secondary p-6 rounded-xl border border-border space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              {artwork.category === 'Photography' ? <Camera className="text-text-muted"/> : <Bot className="text-text-muted"/>}
              <h3 className="text-sm font-medium text-text-primary uppercase tracking-wider">Metadata</h3>
            </div>
            
            <div className="space-y-3">
              {artwork.category === 'Photography' && artwork.photographyMetadata ? (
                <>
                  {Object.entries(artwork.photographyMetadata).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} className="flex justify-between text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                        <span className="text-text-muted capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-text-primary font-medium text-right max-w-[60%] truncate" title={value}>{value}</span>
                      </div>
                    );
                  })}
                </>
              ) : artwork.category === 'AI Art' && artwork.aiMetadata ? (
                <>
                  {Object.entries(artwork.aiMetadata).map(([key, value]) => {
                    if (!value) return null;
                    // Don't show long prompts in the small table
                    if (key === 'prompt' || key === 'negativePrompt') return null;
                    return (
                      <div key={key} className="flex justify-between text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                        <span className="text-text-muted capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-text-primary font-medium text-right max-w-[60%] truncate" title={value}>{value}</span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p className="text-sm text-text-muted italic">No metadata available</p>
              )}
            </div>

            {/* AI Prompts (Shown separately if AI Art) */}
            {artwork.category === 'AI Art' && artwork.aiMetadata?.prompt && (
              <div className="pt-4 border-t border-border mt-4">
                <h4 className="text-xs font-medium text-text-muted uppercase mb-2">Prompt</h4>
                <p className="text-sm text-text-secondary font-mono bg-bg-elevated p-3 rounded-lg break-words">
                  {artwork.aiMetadata.prompt}
                </p>
              </div>
            )}
          </div>

          {/* Rating Component */}
          <div className="bg-bg-secondary p-6 rounded-xl border border-border space-y-4">
            <h3 className="text-sm font-medium text-text-primary uppercase tracking-wider mb-2">Community Rating</h3>
            <RatingStars 
              artworkId={artwork._id} 
              initialAverage={artwork.ratingAverage} 
              initialCount={artwork.ratingCount} 
              currentUser={currentUser} 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtworkDetailsPage;
