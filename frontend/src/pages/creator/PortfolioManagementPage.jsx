import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Layout, FolderKanban, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const PortfolioManagementPage = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const { data } = await api.get('/auth/me'); // To get current user ID
        const res = await api.get(`/portfolios?creator=${data.data._id}`);
        setPortfolios(res.data.data);
      } catch (error) {
        toast.error('Failed to load portfolios');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio?')) return;
    
    try {
      await api.delete(`/portfolios/${id}`);
      setPortfolios(portfolios.filter(p => p._id !== id));
      toast.success('Portfolio deleted');
    } catch (error) {
      toast.error('Failed to delete portfolio');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-text-primary mb-2">Portfolio Management</h1>
          <p className="text-text-secondary">Organize your works into professional portfolios.</p>
        </div>
        <Button onClick={() => navigate('/portfolio/new')}>
          <Plus size={18} className="mr-2" /> Create Portfolio
        </Button>
      </div>

      {portfolios.length === 0 ? (
        <div className="bg-bg-secondary border border-border border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-bg-elevated rounded-full flex items-center justify-center mb-4">
            <FolderKanban size={32} className="text-text-muted" />
          </div>
          <h3 className="text-xl font-medium text-text-primary mb-2">No Portfolios Yet</h3>
          <p className="text-text-secondary mb-6 max-w-md">
            Create your first portfolio to showcase your best works to potential clients or the community.
          </p>
          <Button onClick={() => navigate('/portfolio/new')}>
            Create Portfolio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card key={portfolio._id} className="flex flex-col h-full overflow-hidden group">
              <div className="h-48 bg-bg-elevated relative overflow-hidden">
                {portfolio.coverImage?.url ? (
                  <img 
                    src={portfolio.coverImage.url} 
                    alt={portfolio.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <Layout size={48} className="opacity-20" />
                  </div>
                )}
                {!portfolio.isPublic && (
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded text-white">
                    Private
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-medium text-text-primary mb-1">{portfolio.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">
                  {portfolio.description || 'No description provided.'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-text-muted mb-4 pt-4 border-t border-border/50">
                  <span>{portfolio.items?.length || 0} Artworks</span>
                  <span>{portfolio.categories?.length || 0} Categories</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/portfolio/edit/${portfolio._id}`)}>
                    <Edit2 size={14} className="mr-2" /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(portfolio._id)}>
                    <Trash2 size={14} className="mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioManagementPage;
