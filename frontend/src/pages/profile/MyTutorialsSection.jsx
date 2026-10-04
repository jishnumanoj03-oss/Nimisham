import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function MyTutorialsSection({ userId, isOwnProfile }) {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [deletingTutorial, setDeletingTutorial] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchTutorials = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      setError(null);
      const limit = 12;
      const res = await api.get(`/tutorials?creator=${userId}&page=${pageNum}&limit=${limit}`);
      
      const newTutorials = res.data.data;
      if (append) {
        setTutorials(prev => [...prev, ...newTutorials]);
      } else {
        setTutorials(newTutorials);
      }
      
      setTotalCount(res.data.count || newTutorials.length);
      setHasMore(newTutorials.length === limit);
      setPage(pageNum);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tutorials');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchTutorials(1, false);
    }
  }, [fetchTutorials, userId]);

  const handleDeleteClick = (tutorial) => {
    setDeletingTutorial(tutorial);
  };

  const confirmDelete = async () => {
    if (!deletingTutorial) return;
    setIsDeleting(true);
    try {
      await api.delete(`/tutorials/${deletingTutorial._id}`);
      setTutorials(prev => prev.filter(t => t._id !== deletingTutorial._id));
      setTotalCount(prev => prev - 1);
      toast.success('Tutorial deleted successfully');
      setDeletingTutorial(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete this tutorial.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && tutorials.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">Tutorials</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-square bg-nim-surface border border-nim-border/20 rounded-[4px] md:rounded-[6px] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error && tutorials.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">Tutorials</h3>
        </div>
        <ErrorState 
          title="Unable to load tutorials" 
          description={error} 
          onRetry={() => fetchTutorials(1, false)} 
        />
      </section>
    );
  }

  if (!loading && tutorials.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">Tutorials</h3>
        </div>
        <EmptyState
          title="No tutorials yet"
          description={isOwnProfile ? "Share your knowledge and help other creators learn." : "This user hasn't published any tutorials yet."}
          className="bg-nim-surface border border-nim-border rounded-nim-lg"
          action={isOwnProfile ? "Create Tutorial" : undefined}
          onAction={isOwnProfile ? () => navigate('/tutorials/editor') : undefined}
        />
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">
            Tutorials <span className="text-nim-text-muted text-body ml-2">({totalCount})</span>
          </h3>
        </div>
        {isOwnProfile && (
          <Button size="sm" variant="secondary" onClick={() => navigate('/tutorials/editor')} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2">
        {tutorials.map((tutorial) => (
          <div key={tutorial._id} className="group relative aspect-square overflow-hidden bg-nim-surface border border-nim-border/20 rounded-[4px] md:rounded-[6px]">
            <Link to={`/tutorials/${tutorial._id}`} className="absolute inset-0 z-10">
              <span className="sr-only">View {tutorial.title}</span>
            </Link>
            
            {tutorial.featuredImage?.url ? (
              <img
                src={tutorial.featuredImage.url}
                alt={tutorial.title}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-200 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-nim-text-muted bg-nim-bg-elevated transition-all duration-200 group-hover:scale-[1.02]">
                <span className="uppercase text-sm tracking-widest">{tutorial.category}</span>
              </div>
            )}
            
            {/* Dark Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 pointer-events-none z-10" />
            
            {/* Metadata on Hover/Mobile */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-0 md:translate-y-2 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 z-20 pointer-events-none bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-medium truncate text-sm md:text-base drop-shadow-md">
                {tutorial.title}
              </p>
              
              <div className="flex items-center gap-3 mt-1 drop-shadow-md">
                <span className="flex items-center text-xs text-white/90">
                  <span className="mr-1">📁</span> {tutorial.category}
                </span>
                <span className="flex items-center text-xs text-white/90">
                  <span className="mr-1">⭐</span> {tutorial.difficultyLevel}
                </span>
                {(tutorial.views > 0) && (
                  <span className="flex items-center text-xs text-white/90">
                    <span className="mr-1">👁</span> {tutorial.views}
                  </span>
                )}
              </div>
            </div>

            {/* Actions (Only show if owner) */}
            {isOwnProfile && (
              <div className="absolute top-2 right-2 flex gap-1.5 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/tutorials/editor?id=${tutorial._id}`); }}
                  className="p-1.5 md:p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-colors"
                  aria-label="Edit tutorial"
                >
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteClick(tutorial); }}
                  className="p-1.5 md:p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors"
                  aria-label="Delete tutorial"
                >
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => fetchTutorials(page + 1, true)}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!deletingTutorial} 
        onClose={() => !isDeleting && setDeletingTutorial(null)}
        title="Delete Tutorial?"
        size="sm"
      >
        <div className="space-y-6">
          <p className="text-nim-text-secondary">
            Are you sure you want to delete <span className="text-nim-text font-medium">"{deletingTutorial?.title}"</span>?
          </p>
          <div className="p-4 bg-nim-error/10 border border-nim-error/20 rounded-nim-md">
            <p className="text-small text-nim-error">This action cannot be undone. The tutorial and all its resources will be permanently removed.</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeletingTutorial(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmDelete} disabled={isDeleting} className="bg-nim-error hover:bg-nim-error/90 text-white border-nim-error">
              {isDeleting ? 'Deleting...' : 'Delete Tutorial'}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
