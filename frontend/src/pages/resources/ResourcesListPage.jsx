import { useState, useEffect } from 'react';
import { Search, Filter, DownloadCloud } from 'lucide-react';
import api from '../../services/api';
import ResourceCard from '../../components/ui/ResourceCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';

const CATEGORIES = ['All', 'Photography', 'AI Art', 'Design', 'Other'];
const TYPES = ['All', 'preset', 'lut', 'profile', 'prompt_pack', 'guide', 'asset'];

export default function ResourcesListPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');
  const [isPaid, setIsPaid] = useState('All');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        let url = `/resources?`;
        
        if (search) url += `search=${search}&`;
        if (category !== 'All') url += `category=${category}&`;
        if (type !== 'All') url += `resourceType=${type}&`;
        if (isPaid !== 'All') url += `isPaid=${isPaid === 'Paid' ? 'true' : 'false'}&`;
        
        const res = await api.get(url);
        setResources(res.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load resources. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResources, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, category, type, isPaid]);

  return (
    <div className="bg-bg-primary min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-4 flex items-center">
            <DownloadCloud className="mr-4 text-accent" size={40} />
            Resource Hub
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl">
            Download professional Lightroom presets, LUTs, AI prompt packs, and creative guides.
          </p>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-bg-elevated p-4 rounded-xl border border-border">
          <div className="flex-1 min-w-[200px]">
            <Input 
              icon={Search}
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              className="bg-bg-secondary border border-border rounded-md px-4 py-2 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TYPES.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t.replace('_', ' ')}</option>
              ))}
            </select>

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
              value={isPaid}
              onChange={(e) => setIsPaid(e.target.value)}
            >
              <option value="All">Free & Paid</option>
              <option value="Free">Free Only</option>
              <option value="Paid">Paid Only</option>
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
        ) : resources.length === 0 ? (
          <div className="text-center py-20 bg-bg-elevated rounded-xl border border-border border-dashed">
            <DownloadCloud size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-xl font-medium text-text-primary mb-2">No resources found</h3>
            <p className="text-text-secondary">Try adjusting your filters or search terms.</p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => { setSearch(''); setCategory('All'); setType('All'); setIsPaid('All'); }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map(resource => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
