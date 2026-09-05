import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import searchService from '../../services/searchService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import ImageCard from '../../components/ui/ImageCard';
import Avatar from '../../components/ui/Avatar';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';
  const initialCategory = searchParams.get('category') || '';
  const initialSort = searchParams.get('sort') || 'newest';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState(initialType);
  const [filters, setFilters] = useState({
    category: initialCategory,
    sort: initialSort
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const data = await searchService.globalSearch(params);
      setResults(data);
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ q: searchQuery, type: activeType, ...filters, page: 1 });
  };

  const updateParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    updateParams({ type, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    updateParams({ [key]: value, page: 1 });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary-500 mb-4" size={40} />
          <p className="text-gray-500">Searching...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 text-red-500">
          <p>{error}</p>
          <Button onClick={fetchResults} variant="outline" className="mt-4">Try Again</Button>
        </div>
      );
    }

    if (!results || !results.data) return null;

    const { artworks, users, tutorials, resources } = results.data;
    const { totalResults } = results.meta;

    if (totalResults === 0) {
      return (
        <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      );
    }

    return (
      <div className="space-y-12">
        {/* Artworks */}
        {artworks?.length > 0 && (
          <section>
            <h3 className="text-2xl font-serif mb-6 flex items-center justify-between">
              <span>Artworks</span>
              <span className="text-sm font-sans font-medium bg-gray-100 text-gray-600 py-1 px-3 rounded-full">
                {results.meta.counts.artworks}
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworks.map(art => (
                <Link to={`/artwork/${art._id}`} key={art._id} className="group">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 relative mb-3">
                    <img src={art.image.url} alt={art.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h4 className="font-medium text-gray-900 truncate">{art.title}</h4>
                  <p className="text-sm text-gray-500">by {art.creator?.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Creators */}
        {users?.length > 0 && (
          <section>
            <h3 className="text-2xl font-serif mb-6 flex items-center justify-between">
              <span>Creators</span>
              <span className="text-sm font-sans font-medium bg-gray-100 text-gray-600 py-1 px-3 rounded-full">
                {results.meta.counts.users}
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {users.map(user => (
                <Link to={`/profile/${user._id}`} key={user._id} className="flex items-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                  <Avatar src={user.avatar} size="md" className="mr-4" />
                  <div className="overflow-hidden">
                    <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
                    <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Similar sections can be added for Tutorials and Resources once implemented */}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-serif text-center mb-8">Discover Creation</h1>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for artworks, creators, tutorials..."
              className="w-full pl-12 pr-32 py-4 rounded-full border-gray-300 shadow-sm text-lg focus:ring-primary-500 focus:border-primary-500"
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6"
            >
              Search
            </Button>
          </form>

          {/* Quick Filters */}
          <div className="flex justify-center mt-8 gap-2 overflow-x-auto pb-2">
            {['all', 'artwork', 'user', 'tutorial', 'resource'].map(type => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap capitalize ${
                  activeType === type 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal size={20} />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
                options={[
                  { value: '', label: 'All Categories' },
                  { value: 'Photography', label: 'Photography' },
                  { value: 'AI Art', label: 'AI Art' }
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <Select 
                value={filters.sort} 
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                options={[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'popular', label: 'Most Popular' },
                  { value: 'most_liked', label: 'Most Liked' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
