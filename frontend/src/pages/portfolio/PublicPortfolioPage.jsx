import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';

const PublicPortfolioPage = () => {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get(`/portfolios/${id}`);
        setPortfolio(res.data.data);
      } catch (error) {
        toast.error('Portfolio not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center p-24 text-text-secondary">Loading portfolio...</div>;
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <h2 className="text-2xl font-serif text-text-primary mb-4">Portfolio Not Found</h2>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  const { creator } = portfolio;

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Cover Image */}
          <div className="aspect-video sm:aspect-[21/9] bg-bg-elevated relative overflow-hidden">
            {portfolio.coverImage?.url ? (
              <img 
                src={portfolio.coverImage.url} 
                alt={portfolio.title}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-text-muted bg-gradient-to-br from-bg-secondary to-bg-elevated">
                No Cover Image
              </div>
            )}
          </div>

          <div className="p-8 sm:p-12">
            {/* Creator Info */}
            {creator && (
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/50">
                <Link to={`/profile/${creator.username}`}>
                  <Avatar src={creator.avatar} name={creator.name} size="lg" />
                </Link>
                <div>
                  <Link to={`/profile/${creator.username}`} className="hover:text-accent transition-colors">
                    <h3 className="font-medium text-text-primary">{creator.name}</h3>
                  </Link>
                  <p className="text-sm text-text-secondary">@{creator.username}</p>
                </div>
              </div>
            )}

            {/* Portfolio Content */}
            <div className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-serif text-text-primary mb-6">{portfolio.title}</h1>
              {portfolio.description && (
                <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
                  {portfolio.description}
                </p>
              )}
            </div>

            {/* Action Button */}
            <div className="flex justify-start">
              <a 
                href={portfolio.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" className="flex items-center gap-2">
                  <Globe size={20} />
                  Visit Portfolio Website
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolioPage;
