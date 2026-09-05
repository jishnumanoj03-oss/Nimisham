import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import TutorialViewer from '../../components/ui/TutorialViewer';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';

export default function TutorialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const res = await api.get(`/tutorials/${id}`);
        setTutorial(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Tutorial not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTutorial();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
        <ErrorState 
          message={error || 'Tutorial not found'} 
          action={() => navigate('/tutorials')}
          actionLabel="Back to Tutorials"
        />
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen">
      <TutorialViewer tutorial={tutorial} />
    </div>
  );
}
