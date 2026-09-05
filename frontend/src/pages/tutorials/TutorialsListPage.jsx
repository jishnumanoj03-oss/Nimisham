import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import api from '../../services/api';
import TutorialCard from '../../components/ui/TutorialCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';

const CATEGORIES = ['All', 'Photography', 'Editing', 'AI Art', 'Creative Business', 'Other'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Professional'];

export default function TutorialsListPage() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        let url = `/tutorials?status=published`;
        
        if (search) url += `&search=${search}`;
        if (category !== 'All') url += `&category=${category}`;
        if (difficulty !== 'All') url += `&difficulty=${difficulty}`;
        
        const res = await api.get(url);
        setTutorials(res.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load tutorials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchTutorials, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, category, difficulty]);

  return (
    <div className="bg-bg-primary min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-4 flex items-center">
            <BookOpen className="mr-4 text-accent" size={40} />
            Learning Center
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl">
            Level up your creative skills with professional tutorials on photography, editing, and AI art.
          </p>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-bg-elevated p-4 rounded-xl border border-border">
          <div className="flex-1">
            <Input 
              icon={Search}
              placeholder="Search tutorials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="bg-bg-secondary border border-border rounded-md px-4 py-2 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
            
            <select
              className="bg-bg-secondary border border-border rounded-md px-4 py-2 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <ErrorState message={error} />
        ) : tutorials.length === 0 ? (
          <div className="text-center py-20 bg-bg-elevated rounded-xl border border-border border-dashed">
            <BookOpen size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-xl font-medium text-text-primary mb-2">No tutorials found</h3>
            <p className="text-text-secondary">Try adjusting your filters or search terms.</p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => { setSearch(''); setCategory('All'); setDifficulty('All'); }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map(tutorial => (
              <TutorialCard key={tutorial._id} tutorial={tutorial} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
