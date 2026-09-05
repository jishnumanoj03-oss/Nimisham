import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, AlertCircle, Layout } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import ImageDropzone from '../../components/ui/ImageDropzone';
import { useAuth } from '../../context/AuthContext';
import ImageCard from '../../components/ui/ImageCard';

const PortfolioEditorPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: 'default',
    categories: '',
    isPublic: 'true',
  });

  const [myArtworks, setMyArtworks] = useState([]);
  const [selectedArtworks, setSelectedArtworks] = useState([]);

  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const artworksRes = await api.get(`/artworks?creator=${user?._id}`);
        setMyArtworks(artworksRes.data.data);

        if (isEditing) {
          const portRes = await api.get(`/portfolios/${id}`);
          const p = portRes.data.data;
          
          if (p.creator._id !== user?._id) {
            toast.error("You cannot edit someone else's portfolio.");
            navigate('/portfolios');
            return;
          }

          setFormData({
            title: p.title || '',
            description: p.description || '',
            theme: p.theme || 'default',
            categories: p.categories ? p.categories.join(', ') : '',
            isPublic: p.isPublic ? 'true' : 'false',
          });

          if (p.coverImage?.url) {
            setPreviewUrl(p.coverImage.url);
          }
          
          if (p.items) {
            setSelectedArtworks(p.items.map(i => i._id || i));
          }
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchInitialData();
    }
  }, [id, isEditing, user, navigate]);

  const handleImageSelect = (file) => {
    setCoverImage(file);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    setCoverImage(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleArtworkSelection = (artworkId) => {
    setSelectedArtworks(prev => 
      prev.includes(artworkId) 
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please enter a portfolio title');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(isEditing ? 'Updating portfolio...' : 'Creating portfolio...');

    try {
      const data = new FormData();
      if (coverImage) {
        data.append('coverImage', coverImage);
      }
      
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('theme', formData.theme);
      data.append('isPublic', formData.isPublic);
      
      const categoryArray = formData.categories.split(',').map(c => c.trim()).filter(c => c);
      data.append('categories', JSON.stringify(categoryArray));
      data.append('items', JSON.stringify(selectedArtworks));

      if (isEditing) {
        await api.put(`/portfolios/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Portfolio updated successfully!', { id: loadingToast });
      } else {
        await api.post('/portfolios', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Portfolio created successfully!', { id: loadingToast });
      }
      
      navigate('/portfolios');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save portfolio', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-text-secondary">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-text-primary mb-2">
          {isEditing ? 'Edit Portfolio' : 'Create Portfolio'}
        </h1>
        <p className="text-text-secondary">
          {isEditing ? 'Update your portfolio details.' : 'Organize your best works to showcase to the world.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cover Image Upload */}
        <div className="bg-bg-secondary p-6 rounded-xl border border-border">
          <h2 className="text-xl font-medium text-text-primary mb-4">Cover Image</h2>
          <ImageDropzone 
            onImageSelect={handleImageSelect}
            previewUrl={previewUrl}
            onClear={handleClearImage}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-bg-secondary p-6 rounded-xl border border-border space-y-4">
              <h2 className="text-xl font-medium text-text-primary mb-4">Portfolio Details</h2>
              
              <Input
                label="Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Best of 2026"
                required
              />
              
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the theme or purpose of this portfolio..."
                rows={4}
              />
              
              <Input
                label="Categories (comma separated)"
                name="categories"
                value={formData.categories}
                onChange={handleInputChange}
                placeholder="Photography, AI Art, Conceptual"
              />
            </div>

            {/* Artwork Selection */}
            <div className="bg-bg-secondary p-6 rounded-xl border border-border space-y-4">
              <h2 className="text-xl font-medium text-text-primary mb-4">Select Artworks</h2>
              {myArtworks.length === 0 ? (
                <div className="text-text-secondary text-sm p-4 bg-bg-elevated rounded-lg text-center">
                  You don't have any artworks uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                  {myArtworks.map(artwork => {
                    const isSelected = selectedArtworks.includes(artwork._id);
                    return (
                      <div 
                        key={artwork._id}
                        onClick={() => toggleArtworkSelection(artwork._id)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                          isSelected ? 'border-accent' : 'border-transparent'
                        }`}
                      >
                        <ImageCard artwork={artwork} aspectRatio="square" />
                        {isSelected && (
                          <div className="absolute top-2 left-2 bg-accent text-white rounded-full p-1 z-20 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity z-10 flex items-center justify-center pointer-events-none">
                          <span className="text-white font-medium text-sm">
                            {isSelected ? 'Deselect' : 'Select'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <div className="bg-bg-secondary p-6 rounded-xl border border-border space-y-4 sticky top-24">
              <h2 className="text-xl font-medium text-text-primary mb-4">Settings</h2>

              <Select
                label="Theme"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                ]}
              />

              <Select
                label="Visibility"
                name="isPublic"
                value={formData.isPublic}
                onChange={handleInputChange}
                options={[
                  { value: 'true', label: 'Public - Visible to everyone' },
                  { value: 'false', label: 'Draft - Only you can see it' },
                ]}
              />

              <div className="pt-4 mt-4 border-t border-border">
                <Button 
                  type="submit" 
                  className="w-full flex justify-center items-center" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">Saving...</span>
                  ) : (
                    <span className="flex items-center">
                      {isEditing ? <Layout size={18} className="mr-2" /> : <Upload size={18} className="mr-2" />} 
                      {isEditing ? 'Update Portfolio' : 'Create Portfolio'}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PortfolioEditorPage;
