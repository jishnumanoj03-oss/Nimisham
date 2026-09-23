import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Layout } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import ImageDropzone from '../../components/ui/ImageDropzone';
import { useAuth } from '../../context/AuthContext';

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
    websiteUrl: '',
  });

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
            websiteUrl: p.websiteUrl || '',
          });

          if (p.coverImage?.url) {
            setPreviewUrl(p.coverImage.url);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please enter a portfolio title');
      return;
    }

    if (!formData.websiteUrl || !/^(https?:\/\/)/i.test(formData.websiteUrl)) {
      toast.error('Please enter a valid HTTP/HTTPS website URL');
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
      data.append('websiteUrl', formData.websiteUrl);

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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-text-primary mb-2">
          {isEditing ? 'Edit Portfolio' : 'Create Portfolio'}
        </h1>
        <p className="text-text-secondary">
          {isEditing ? 'Update your portfolio showcase details.' : 'Link your external portfolio to showcase your work.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-bg-secondary p-6 rounded-xl border border-border space-y-4">
          <Input
            label="Portfolio Title *"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Jishnu PM — Photography Portfolio"
            required
          />
          
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Photography, visual storytelling and selected creative works."
            rows={3}
            maxLength={300}
          />
          
          <Input
            label="Portfolio Website URL *"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleInputChange}
            placeholder="https://example.com"
            required
          />
        </div>

        <div className="bg-bg-secondary p-6 rounded-xl border border-border">
          <h2 className="text-xl font-medium text-text-primary mb-4">Cover Image</h2>
          <ImageDropzone 
            onImageSelect={handleImageSelect}
            previewUrl={previewUrl}
            onClear={handleClearImage}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">Saving...</span>
            ) : (
              <span className="flex items-center justify-center">
                {isEditing ? <Layout size={18} className="mr-2" /> : <Upload size={18} className="mr-2" />} 
                {isEditing ? 'Update Portfolio' : 'Create Portfolio'}
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PortfolioEditorPage;
