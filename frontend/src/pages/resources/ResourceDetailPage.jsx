import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Share2, AlertCircle, FileArchive } from 'lucide-react';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import Button from '../../components/ui/Button';

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await api.get(`/resources/${id}`);
        setResource(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Resource not found');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // In a real app, this would be an API call to get a secure download URL
      // For now, we redirect to our download endpoint which handles the redirect to S3/Cloudinary
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/resources/${id}/download`;
      
      // We could update local download count optimistically, but it's handled by API on next refresh
    } catch (error) {
      console.error('Download failed', error);
    } finally {
      setTimeout(() => setDownloading(false), 2000); // Reset button after a delay
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
        <ErrorState 
          message={error || 'Resource not found'} 
          action={() => navigate('/resources')}
          actionLabel="Back to Resources"
        />
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Images */}
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="aspect-[4/3] bg-bg-elevated rounded-2xl overflow-hidden border border-border">
            {resource.thumbnail?.url ? (
              <img 
                src={resource.thumbnail.url} 
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <FileArchive size={64} className="opacity-20 mb-4" />
                <span className="uppercase tracking-widest">{resource.resourceType}</span>
              </div>
            )}
          </div>
          
          {/* Previews if any */}
          {resource.previewImages && resource.previewImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {resource.previewImages.map((img, idx) => (
                <div key={idx} className="aspect-square bg-bg-elevated rounded-xl overflow-hidden border border-border group cursor-pointer relative">
                  <img 
                    src={img.url} 
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white text-center">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details & Download Box */}
        <div className="w-full lg:w-2/5">
          <div className="sticky top-24 space-y-8">
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-bg-elevated border border-border rounded-full text-xs font-medium uppercase tracking-wider text-text-secondary">
                  {resource.resourceType.replace('_', ' ')}
                </span>
                <span className={`px-3 py-1 border rounded-full text-xs font-medium uppercase tracking-wider ${
                  resource.isPaid ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-green-500/10 border-green-500/20 text-green-500'
                }`}>
                  {resource.isPaid ? `$${resource.price}` : 'Free'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-serif text-text-primary mb-4">
                {resource.title}
              </h1>
              
              <p className="text-text-secondary whitespace-pre-wrap mb-6 leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Action Box */}
            <div className="bg-bg-elevated rounded-2xl p-6 border border-border shadow-sm">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full mb-4"
                icon={Download}
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? 'Preparing Download...' : resource.isPaid ? `Purchase - $${resource.price}` : 'Download for Free'}
              </Button>
              
              <div className="flex items-center justify-between text-sm text-text-muted mb-6">
                <span>{resource.downloadCount} downloads</span>
                <span>Version {resource.version}</span>
              </div>
              
              <div className="space-y-4">
                {/* Creator */}
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Created by</span>
                  <div className="flex items-center gap-2">
                    <img 
                      src={resource.creator?.avatar || `https://ui-avatars.com/api/?name=${resource.creator?.name}&background=random`} 
                      alt={resource.creator?.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-text-primary font-medium">{resource.creator?.name}</span>
                  </div>
                </div>

                {/* License */}
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">License</span>
                  <span className="text-text-primary font-medium">{resource.license}</span>
                </div>
                
                {/* Compatibility */}
                {resource.compatibility && resource.compatibility.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Compatibility</span>
                    <span className="text-text-primary font-medium max-w-[150px] text-right truncate">
                      {resource.compatibility.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {resource.tags?.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-bg-secondary rounded-md text-sm text-text-secondary">
                  #{tag}
                </span>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
