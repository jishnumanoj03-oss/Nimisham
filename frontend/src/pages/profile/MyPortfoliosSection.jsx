import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

export default function MyPortfoliosSection({ userId, isOwnProfile, profileName }) {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/portfolios?creator=${userId}`);
        setPortfolios(res.data.data);
      } catch (error) {
        toast.error('Failed to load portfolios');
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchPortfolios();
    }
  }, [userId]);

  const handleDeletePortfolio = async (portfolioId) => {
    if (!window.confirm('Delete Portfolio?\n\nAre you sure you want to remove this portfolio?')) return;
    
    try {
      await api.delete(`/portfolios/${portfolioId}`);
      setPortfolios(portfolios.filter(p => p._id !== portfolioId));
      toast.success('Portfolio deleted');
    } catch (error) {
      toast.error('Failed to delete portfolio');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-48 bg-nim-surface rounded-nim-lg"></div>;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">Portfolio</h3>
        </div>
        {isOwnProfile && (
          <Button onClick={() => navigate('/portfolio/new')} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        )}
      </div>

      {portfolios.length === 0 ? (
        <EmptyState 
          title="No portfolio added yet" 
          description={`${isOwnProfile ? 'Showcase your professional portfolio by adding a cover, description, and website link.' : profileName + ' hasn\'t added a portfolio yet.'}`}
          className="bg-nim-surface border border-nim-border rounded-nim-lg"
          action={isOwnProfile ? {
            label: 'Create Portfolio',
            onClick: () => navigate('/portfolio/new')
          } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {portfolios.map((portfolio) => (
            <div key={portfolio._id} className="bg-nim-bg rounded-nim-lg border border-nim-border overflow-hidden group shadow-sm flex flex-col md:flex-row">
              {/* Cover Image */}
              <div className="relative aspect-video md:aspect-[4/3] md:w-1/3 overflow-hidden bg-nim-elevated flex-shrink-0">
                {portfolio.coverImage?.url ? (
                  <img 
                    src={portfolio.coverImage.url} 
                    alt={portfolio.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-nim-text-muted">
                    No Cover Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors pointer-events-none" />
                
                {isOwnProfile && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => navigate(`/portfolio/edit/${portfolio._id}`)}
                      className="p-1.5 bg-nim-bg/90 hover:bg-nim-bg text-nim-text rounded-full shadow-sm transition-colors border border-nim-border"
                      title="Edit Portfolio"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeletePortfolio(portfolio._id)}
                      className="p-1.5 bg-nim-bg/90 hover:bg-nim-error hover:text-white text-nim-text rounded-full shadow-sm transition-colors border border-nim-border"
                      title="Delete Portfolio"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h4 className="text-h4 text-nim-text mb-2 line-clamp-1">{portfolio.title}</h4>
                  <p className="text-body text-nim-text-secondary line-clamp-3">
                    {portfolio.description}
                  </p>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <a 
                    href={portfolio.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button>Portfolio</Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
