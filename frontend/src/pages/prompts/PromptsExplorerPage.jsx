import { useState, useEffect } from 'react';
import { Search, Bot, Layers } from 'lucide-react';
import api from '../../services/api';
import PromptCard from '../../components/ui/PromptCard';
import PromptCollectionCard from '../../components/ui/PromptCollectionCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';

export default function PromptsExplorerPage() {
  const [activeTab, setActiveTab] = useState('prompts'); // 'prompts' or 'collections'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [model, setModel] = useState('All');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        let url = activeTab === 'prompts' ? `/prompts?` : `/prompts/collections/all?`;
        
        if (search) url += `search=${search}&`;
        if (activeTab === 'prompts' && model !== 'All') url += `model=${model}&`;
        
        const res = await api.get(url);
        setItems(res.data.data);
        setError(null);
      } catch (err) {
        setError(`Failed to load ${activeTab}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchItems, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, model, activeTab]);

  return (
    <div className="bg-bg-primary min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-4 flex items-center">
            <Bot className="mr-4 text-accent" size={40} />
            AI Prompt Library
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl">
            Explore and copy high-quality AI prompts for Midjourney, Stable Diffusion, and more.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          <button
            className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'prompts' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('prompts')}
          >
            <div className="flex items-center"><Bot size={16} className="mr-2" /> All Prompts</div>
          </button>
          <button
            className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'collections' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('collections')}
          >
            <div className="flex items-center"><Layers size={16} className="mr-2" /> Curated Collections</div>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input 
              icon={Search}
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {activeTab === 'prompts' && (
            <div className="w-full md:w-64">
              <select
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="All">All Models</option>
                <option value="Midjourney v6">Midjourney v6</option>
                <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                <option value="Flux.1">Flux.1</option>
                <option value="DALL-E 3">DALL-E 3</option>
              </select>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <ErrorState message={error} />
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-bg-elevated rounded-xl border border-border border-dashed">
            {activeTab === 'prompts' ? <Bot size={48} className="mx-auto text-text-muted mb-4" /> : <Layers size={48} className="mx-auto text-text-muted mb-4" />}
            <h3 className="text-xl font-medium text-text-primary mb-2">No {activeTab} found</h3>
            <p className="text-text-secondary">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${activeTab === 'collections' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3'} gap-6`}>
            {items.map(item => (
              activeTab === 'prompts' 
                ? <PromptCard key={item._id} prompt={item} />
                : <PromptCollectionCard key={item._id} collection={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
