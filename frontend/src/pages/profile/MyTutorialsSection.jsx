import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import TutorialCard from '../../components/ui/TutorialCard';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Button from '../../components/ui/Button';

export default function MyTutorialsSection({ userId, isOwnProfile }) {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
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

  if (loading && tutorials.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">Tutorials</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-[16/9] bg-nim-surface border border-nim-border rounded-xl animate-pulse" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <TutorialCard
            key={tutorial._id}
            tutorial={tutorial}
          />
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
    </section>
  );
}
