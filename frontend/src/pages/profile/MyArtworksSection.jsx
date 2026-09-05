import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import ImageCard from '../../components/ui/ImageCard';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function MyArtworksSection({ userId }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [deletingArtwork, setDeletingArtwork] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchArtworks = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      setError(null);
      const limit = 12;
      const res = await api.get(`/artworks?creator=${userId}&page=${pageNum}&limit=${limit}`);
      
      const newArtworks = res.data.data;
      if (append) {
        setArtworks(prev => [...prev, ...newArtworks]);
      } else {
        setArtworks(newArtworks);
      }
      
      setTotalCount(res.data.total);
      setHasMore(newArtworks.length === limit);
      setPage(pageNum);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your artworks');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchArtworks(1, false);
  }, [fetchArtworks]);

  const handleDeleteClick = (artwork) => {
    setDeletingArtwork(artwork);
  };

  const confirmDelete = async () => {
    if (!deletingArtwork) return;
    setIsDeleting(true);
    try {
      await api.delete(`/artworks/${deletingArtwork._id}`);
      setArtworks(prev => prev.filter(a => a._id !== deletingArtwork._id));
      setTotalCount(prev => prev - 1);
      toast.success('Artwork deleted successfully');
      setDeletingArtwork(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete this artwork.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && artworks.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-6">
          <ImageIcon className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">My Artworks</h3>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-square bg-nim-surface border border-nim-border rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error && artworks.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-6">
          <ImageIcon className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">My Artworks</h3>
        </div>
        <ErrorState 
          title="Unable to load your artworks" 
          description={error} 
          onRetry={() => fetchArtworks(1, false)} 
        />
      </section>
    );
  }

  if (!loading && artworks.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-6">
          <ImageIcon className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">My Artworks</h3>
        </div>
        <EmptyState
          title="No artworks yet"
          description="Start building your creative collection by uploading your first artwork."
          className="bg-nim-surface border border-nim-border rounded-nim-lg"
          action="Upload Artwork"
          onAction={() => navigate('/artwork/upload')}
        />
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">
            My Artworks <span className="text-nim-text-muted text-body ml-2">({totalCount})</span>
          </h3>
        </div>
        <Button size="sm" variant="secondary" onClick={() => navigate('/artwork/upload')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Upload
        </Button>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {artworks.map((artwork, index) => (
          <div key={artwork._id} className="break-inside-avoid">
            <ImageCard
              artwork={artwork}
              onDelete={handleDeleteClick}
              aspectRatio={
                artwork.category === 'Photography'
                  ? index % 3 === 0
                    ? 'portrait'
                    : index % 4 === 0
                    ? 'landscape'
                    : 'square'
                  : 'square'
              }
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => fetchArtworks(page + 1, true)}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!deletingArtwork} 
        onClose={() => !isDeleting && setDeletingArtwork(null)}
        title="Delete Artwork?"
        size="sm"
      >
        <div className="space-y-6">
          <p className="text-nim-text-secondary">
            Are you sure you want to delete <span className="text-nim-text font-medium">"{deletingArtwork?.title}"</span>?
          </p>
          <div className="p-4 bg-nim-error/10 border border-nim-error/20 rounded-nim-md">
            <p className="text-small text-nim-error">This action cannot be undone. The artwork and all its related interactions will be permanently removed.</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeletingArtwork(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmDelete} disabled={isDeleting} className="bg-nim-error hover:bg-nim-error/90 text-white border-nim-error">
              {isDeleting ? 'Deleting...' : 'Delete Artwork'}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
