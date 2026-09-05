import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Bot, Upload, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import ImageDropzone from '../../components/ui/ImageDropzone';

const ArtworkUploadPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Photography', // Default
    subCategory: '',
    tags: '',
    visibility: 'public',
    license: 'Standard',
  });

  const [photographyMetadata, setPhotographyMetadata] = useState({
    camera: '', lens: '', iso: '', aperture: '', shutterSpeed: '', focalLength: '', whiteBalance: '', location: ''
  });

  const [aiMetadata, setAiMetadata] = useState({
    aiTool: '', model: '', prompt: '', negativePrompt: '', generationSteps: '', cfgScale: '', seed: '', aspectRatio: '', upscaler: ''
  });

  const photographyCategories = ['Landscape', 'Portrait', 'Street', 'Wildlife', 'Nature', 'Travel', 'Macro', 'Architecture', 'Event', 'Sports', 'Others'];
  const aiCategories = ['Concept Art', 'Character Design', 'Illustration', 'Digital Painting', '3D Render', 'Abstract', 'Fantasy', 'Sci-Fi', 'Others'];

  useEffect(() => {
    // Cleanup preview URL to avoid memory leaks
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageSelect = (file) => {
    setImage(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    setImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Reset subcategory if category changes
    if (name === 'category') {
      setFormData(prev => ({ ...prev, subCategory: '' }));
    }
  };

  const handlePhotoMetaChange = (e) => {
    const { name, value } = e.target;
    setPhotographyMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleAiMetaChange = (e) => {
    const { name, value } = e.target;
    setAiMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      toast.error('Please select an image to upload');
      return;
    }
    
    if (!formData.title || !formData.category || !formData.subCategory) {
      toast.error('Please fill in all required fields (Title, Category, Sub-Category)');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Uploading artwork... This may take a moment.');

    try {
      const data = new FormData();
      data.append('image', image);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('subCategory', formData.subCategory);
      
      // Process tags
      const tagArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      data.append('tags', JSON.stringify(tagArray));
      
      data.append('visibility', formData.visibility);
      data.append('license', formData.license);

      if (formData.category === 'Photography') {
        data.append('photographyMetadata', JSON.stringify(photographyMetadata));
      } else {
        data.append('aiMetadata', JSON.stringify(aiMetadata));
      }

      const res = await api.post('/artworks', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Artwork uploaded successfully!', { id: loadingToast });
      
      // Ask user if they want to add creative process or view artwork
      navigate(`/artwork/${res.data.data._id}`);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload artwork', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategories = formData.category === 'Photography' ? photographyCategories : aiCategories;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-text-primary mb-2">Upload Artwork</h1>
        <p className="text-text-secondary">Share your latest creation with the community.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div className="bg-bg-secondary p-6 rounded-xl border border-border">
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
              <h2 className="text-xl font-medium text-text-primary mb-4">Basic Information</h2>
              
              <Input
                label="Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give your artwork a name"
                required
              />
              
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell the story behind this piece..."
                rows={4}
              />
              
              <Input
                label="Tags (comma separated)"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="landscape, nature, sunset"
              />
            </div>

            {/* Dynamic Metadata Section */}
            <div className="bg-bg-secondary p-6 rounded-xl border border-border">
              <div className="flex items-center space-x-2 mb-6">
                {formData.category === 'Photography' ? <Camera className="text-accent" /> : <Bot className="text-accent" />}
                <h2 className="text-xl font-medium text-text-primary">{formData.category} Metadata</h2>
              </div>

              <AnimatePresence mode="wait">
                {formData.category === 'Photography' ? (
                  <motion.div 
                    key="photography"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <Input label="Camera" name="camera" value={photographyMetadata.camera} onChange={handlePhotoMetaChange} placeholder="e.g. Sony A7III" />
                    <Input label="Lens" name="lens" value={photographyMetadata.lens} onChange={handlePhotoMetaChange} placeholder="e.g. 24-70mm f/2.8" />
                    <Input label="Focal Length" name="focalLength" value={photographyMetadata.focalLength} onChange={handlePhotoMetaChange} placeholder="e.g. 35mm" />
                    <Input label="Aperture" name="aperture" value={photographyMetadata.aperture} onChange={handlePhotoMetaChange} placeholder="e.g. f/8" />
                    <Input label="Shutter Speed" name="shutterSpeed" value={photographyMetadata.shutterSpeed} onChange={handlePhotoMetaChange} placeholder="e.g. 1/250s" />
                    <Input label="ISO" name="iso" value={photographyMetadata.iso} onChange={handlePhotoMetaChange} placeholder="e.g. 100" />
                    <Input label="White Balance" name="whiteBalance" value={photographyMetadata.whiteBalance} onChange={handlePhotoMetaChange} placeholder="e.g. Auto, 5500K" />
                    <Input label="Location" name="location" value={photographyMetadata.location} onChange={handlePhotoMetaChange} placeholder="Where was this taken?" />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="ai"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <Input label="AI Tool" name="aiTool" value={aiMetadata.aiTool} onChange={handleAiMetaChange} placeholder="e.g. Midjourney, Stable Diffusion" />
                    <Input label="Model" name="model" value={aiMetadata.model} onChange={handleAiMetaChange} placeholder="e.g. SDXL 1.0, v6" />
                    <div className="sm:col-span-2">
                      <Textarea label="Prompt" name="prompt" value={aiMetadata.prompt} onChange={handleAiMetaChange} placeholder="The prompt used to generate..." rows={3} />
                    </div>
                    <div className="sm:col-span-2">
                      <Textarea label="Negative Prompt" name="negativePrompt" value={aiMetadata.negativePrompt} onChange={handleAiMetaChange} placeholder="Negative prompt..." rows={2} />
                    </div>
                    <Input label="Aspect Ratio" name="aspectRatio" value={aiMetadata.aspectRatio} onChange={handleAiMetaChange} placeholder="e.g. 16:9, 1:1" />
                    <Input label="Seed" name="seed" value={aiMetadata.seed} onChange={handleAiMetaChange} placeholder="e.g. 123456789" />
                    <Input label="Steps" name="generationSteps" value={aiMetadata.generationSteps} onChange={handleAiMetaChange} type="number" placeholder="e.g. 30" />
                    <Input label="CFG Scale" name="cfgScale" value={aiMetadata.cfgScale} onChange={handleAiMetaChange} type="number" step="0.1" placeholder="e.g. 7.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <div className="bg-bg-secondary p-6 rounded-xl border border-border space-y-4 sticky top-24">
              <h2 className="text-xl font-medium text-text-primary mb-4">Settings</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary block">Category *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'Photography', subCategory: '' })}
                    className={`py-2 px-3 text-sm rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                      formData.category === 'Photography' 
                        ? 'bg-accent/10 text-accent border border-accent/20' 
                        : 'bg-bg-elevated text-text-secondary border border-transparent hover:text-text-primary'
                    }`}
                  >
                    <Camera size={16} />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'AI Art', subCategory: '' })}
                    className={`py-2 px-3 text-sm rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                      formData.category === 'AI Art' 
                        ? 'bg-accent/10 text-accent border border-accent/20' 
                        : 'bg-bg-elevated text-text-secondary border border-transparent hover:text-text-primary'
                    }`}
                  >
                    <Bot size={16} />
                    <span>AI Art</span>
                  </button>
                </div>
              </div>

              <Select
                label="Sub-Category *"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                options={[
                  { value: '', label: 'Select category...' },
                  ...currentCategories.map(c => ({ value: c, label: c }))
                ]}
                required
              />

              <Select
                label="Visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                options={[
                  { value: 'public', label: 'Public - Visible to everyone' },
                  { value: 'draft', label: 'Draft - Only you can see it' },
                ]}
              />

              <div className="pt-4 mt-4 border-t border-border">
                <Button 
                  type="submit" 
                  className="w-full flex justify-center items-center" 
                  disabled={isSubmitting || !image}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">Uploading...</span>
                  ) : (
                    <span className="flex items-center"><Upload size={18} className="mr-2" /> Publish Artwork</span>
                  )}
                </Button>
                {!image && (
                  <p className="text-xs text-error mt-2 flex items-center justify-center">
                    <AlertCircle size={12} className="mr-1" /> Image required
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArtworkUploadPage;
