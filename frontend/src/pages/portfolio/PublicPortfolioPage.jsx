import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Globe, Camera, MessageCircle, Code, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import ImageCard from '../../components/ui/ImageCard';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';

const PublicPortfolioPage = () => {
  const { id } = useParams(); // Creator ID or Portfolio ID? Let's assume this is the creator's main portfolio
  
  const [user, setUser] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' or 'portfolios'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        // Fetch Creator Profile
        const userRes = await api.get(`/users/${id}`);
        setUser(userRes.data.data);

        // Fetch Public Artworks
        const artRes = await api.get(`/artworks?creator=${id}&visibility=public`);
        setArtworks(artRes.data.data);

        // Fetch Public Portfolios
        const portRes = await api.get(`/portfolios?creator=${id}`);
        setPortfolios(portRes.data.data);
      } catch (error) {
        toast.error('Creator not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorData();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center p-24">Loading profile...</div>;
  }

  if (!user) {
    return <div className="flex justify-center p-24">User not found</div>;
  }

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Header / Cover Area */}
      <div className="relative h-[30vh] sm:h-[40vh] bg-bg-elevated border-b border-border overflow-hidden">
        {/* We can use the latest artwork as a cover, or a gradient if none */}
        {artworks.length > 0 ? (
          <>
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img 
              src={artworks[0].image.url} 
              alt="Cover" 
              className="w-full h-full object-cover blur-sm opacity-50"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-bg-secondary to-bg-elevated" />
        )}
      </div>

      {/* Profile Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="relative -mt-16 sm:-mt-24 z-20 flex flex-col sm:flex-row items-center sm:items-end sm:space-x-8 pb-8 border-b border-border">
          <div className="p-1.5 bg-bg-primary rounded-full mb-4 sm:mb-0">
            <Avatar src={user.avatar} alt={user.name} size="xl" className="w-32 h-32 sm:w-40 sm:h-40" />
          </div>
          
          <div className="flex-1 text-center sm:text-left mb-4 sm:mb-0 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-serif text-text-primary">{user.name}</h1>
            <p className="text-lg text-accent">@{user.username}</p>
            {user.creatorType && (
              <span className="inline-block px-3 py-1 bg-bg-elevated border border-border rounded-full text-sm text-text-secondary capitalize">
                {user.creatorType.replace('-', ' ')}
              </span>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center space-x-3 text-text-muted">
              {user.socialLinks?.website && <a href={user.socialLinks.website} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors"><Globe size={20}/></a>}
              {user.socialLinks?.instagram && <a href={user.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors"><Camera size={20}/></a>}
              {user.socialLinks?.twitter && <a href={user.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors"><MessageCircle size={20}/></a>}
              {user.socialLinks?.github && <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors"><Code size={20}/></a>}
              {user.socialLinks?.youtube && <a href={user.socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors"><Video size={20}/></a>}
            </div>
            <Button>Follow Creator</Button>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="py-8 border-b border-border max-w-3xl">
            <h2 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-4">About</h2>
            <p className="text-lg text-text-secondary leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-8 pt-8 mb-8 border-b border-border/50">
          <button 
            className={`pb-4 text-lg font-medium transition-colors relative ${activeTab === 'gallery' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
            onClick={() => setActiveTab('gallery')}
          >
            All Artworks
            {activeTab === 'gallery' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t-full" />
            )}
          </button>
          <button 
            className={`pb-4 text-lg font-medium transition-colors relative ${activeTab === 'portfolios' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
            onClick={() => setActiveTab('portfolios')}
          >
            Portfolios
            {activeTab === 'portfolios' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t-full" />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="pb-24">
          {activeTab === 'gallery' && (
            artworks.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {artworks.map((artwork, index) => (
                  <div key={artwork._id} className="break-inside-avoid">
                    <ImageCard 
                      artwork={artwork} 
                      aspectRatio={
                        artwork.category === 'Photography' ? 
                          (index % 3 === 0 ? 'portrait' : index % 4 === 0 ? 'landscape' : 'square') 
                          : 'square'
                      } 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-text-muted">
                No public artworks available yet.
              </div>
            )
          )}

          {activeTab === 'portfolios' && (
            portfolios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {portfolios.map(portfolio => (
                  <div key={portfolio._id} className="group cursor-pointer">
                    <div className="aspect-video bg-bg-elevated rounded-xl overflow-hidden mb-4 border border-border relative">
                      {portfolio.coverImage?.url && (
                        <img 
                          src={portfolio.coverImage.url} 
                          alt={portfolio.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h3 className="text-2xl font-serif text-text-primary mb-2 group-hover:text-accent transition-colors">{portfolio.title}</h3>
                    <p className="text-text-secondary">{portfolio.items?.length || 0} Works</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-text-muted">
                No public portfolios available yet.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolioPage;
