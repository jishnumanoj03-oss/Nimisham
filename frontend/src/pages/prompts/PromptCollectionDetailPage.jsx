import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layers, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import PromptCard from '../../components/ui/PromptCard';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import Button from '../../components/ui/Button';

export default function PromptCollectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await api.get(`/prompts/collections/${id}`);
        setCollection(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Collection not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
        <ErrorState 
          message={error || 'Collection not found'} 
          action={() => navigate('/prompts')}
          actionLabel="Back to Library"
        />
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/prompts')} className="mb-6">
          Back to Library
        </Button>

        {/* Collection Header */}
        <div className="bg-bg-elevated rounded-2xl border border-border overflow-hidden mb-12 flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 relative aspect-square md:aspect-auto">
            {collection.coverImage?.url ? (
              <img 
                src={collection.coverImage.url} 
                alt={collection.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-bg-secondary flex flex-col items-center justify-center text-text-muted">
                <Layers size={48} className="mb-4 opacity-50" />
                <span className="uppercase tracking-widest font-medium text-sm">Collection</span>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-serif text-text-primary mb-4">
              {collection.title}
            </h1>
            
            <p className="text-text-secondary text-lg mb-8 leading-relaxed max-w-2xl">
              {collection.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-text-muted mt-auto">
              <div className="flex items-center gap-2">
                <img 
                  src={collection.creator?.avatar || `https://ui-avatars.com/api/?name=${collection.creator?.name}&background=random`} 
                  alt={collection.creator?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-text-primary font-medium">{collection.creator?.name}</span>
              </div>
              <span>•</span>
              <span>{collection.prompts?.length || 0} Prompts</span>
              <span>•</span>
              <span>{collection.views || 0} Views</span>
            </div>
            
            {collection.tags && collection.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {collection.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-bg-primary rounded-md text-sm text-text-secondary">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-text-primary mb-6">Prompts in this Collection</h2>
          
          {collection.prompts && collection.prompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collection.prompts.map(prompt => (
                <PromptCard key={prompt._id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-bg-elevated rounded-xl border border-border border-dashed">
              <Layers size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
              <p className="text-text-secondary">This collection is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
