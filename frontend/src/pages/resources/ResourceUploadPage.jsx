import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, Save, ArrowLeft, FileArchive } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ResourceUploadPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Photography',
    resourceType: 'preset',
    version: '1.0.0',
    compatibility: '',
    license: 'Personal Use',
    isPaid: false,
    price: 0,
    tags: '',
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  const [resourceFile, setResourceFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResourceFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return toast.error('Title and description are required');
    if (!resourceFile) return toast.error('You must upload the resource file (ZIP, PDF, etc.)');

    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      if (thumbnail) data.append('thumbnail', thumbnail);
      if (resourceFile) data.append('file', resourceFile);

      await api.post('/resources', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Resource uploaded successfully');
      navigate('/dashboard'); // or creator portfolio
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        
        <header className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} icon={ArrowLeft}>
            Back
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={loading}
            icon={Save}
          >
            {loading ? 'Uploading...' : 'Publish Resource'}
          </Button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Info */}
          <section className="bg-bg-elevated p-8 rounded-2xl border border-border space-y-6">
            <h2 className="text-xl font-medium text-text-primary mb-6">Resource Details</h2>
            
            <Input 
              label="Resource Title" 
              name="title"
              placeholder="e.g. Cinematic Moody Lightroom Presets" 
              value={formData.title}
              onChange={handleInputChange}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-label mb-2 text-text-muted">Category</label>
                <select
                  name="category"
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Photography">Photography</option>
                  <option value="AI Art">AI Art</option>
                  <option value="Design">Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-label mb-2 text-text-muted">Resource Type</label>
                <select
                  name="resourceType"
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none"
                  value={formData.resourceType}
                  onChange={handleInputChange}
                >
                  <option value="preset">Preset (Lightroom, Capture One)</option>
                  <option value="lut">LUT (Video Color Grading)</option>
                  <option value="prompt_pack">AI Prompt Pack</option>
                  <option value="guide">PDF Guide / Cheat Sheet</option>
                  <option value="asset">Creative Asset / Template</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-label mb-2 text-text-muted">Description</label>
              <textarea
                name="description"
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none h-32 resize-none"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what's included and how to use it..."
              />
            </div>

            <Input 
              label="Tags (comma separated)" 
              name="tags"
              placeholder="e.g. cinematic, moody, portrait, film" 
              value={formData.tags}
              onChange={handleInputChange}
            />
          </section>

          {/* Files Upload */}
          <section className="bg-bg-elevated p-8 rounded-2xl border border-border space-y-6">
            <h2 className="text-xl font-medium text-text-primary mb-6">Media & Files</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Thumbnail */}
              <div>
                <label className="block text-label mb-2 text-text-muted">Cover Thumbnail (Image)</label>
                <div className={`relative aspect-video border-2 border-dashed ${thumbnailPreview ? 'border-border-focus' : 'border-border'} rounded-xl p-4 flex flex-col items-center justify-center bg-bg-secondary overflow-hidden`}>
                  {thumbnailPreview ? (
                    <>
                      <img src={thumbnailPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Change Cover</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="text-text-muted mb-2" size={24} />
                      <p className="text-sm text-text-secondary text-center px-4">Upload attractive cover image</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                </div>
              </div>

              {/* Actual File */}
              <div>
                <label className="block text-label mb-2 text-text-muted">Resource File (ZIP, PDF)</label>
                <div className={`relative aspect-video border-2 border-dashed ${resourceFile ? 'border-accent' : 'border-border'} rounded-xl p-4 flex flex-col items-center justify-center bg-bg-secondary overflow-hidden`}>
                  {resourceFile ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                        <FileArchive className="text-accent" size={32} />
                      </div>
                      <p className="font-medium text-text-primary line-clamp-1 px-4">{resourceFile.name}</p>
                      <p className="text-xs text-text-muted mt-1">{(resourceFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="text-xs text-accent mt-3 opacity-0 group-hover:opacity-100">Click to change file</p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="text-text-muted mb-2" size={24} />
                      <p className="text-sm text-text-secondary text-center px-4">Upload the digital file users will download</p>
                    </>
                  )}
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                </div>
              </div>
            </div>
          </section>
          
          {/* Marketplace Prep */}
          <section className="bg-bg-elevated p-8 rounded-2xl border border-border space-y-6">
            <h2 className="text-xl font-medium text-text-primary mb-6">Pricing & Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-label mb-2 text-text-muted">License Type</label>
                <select
                  name="license"
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none"
                  value={formData.license}
                  onChange={handleInputChange}
                >
                  <option value="Personal Use">Personal Use</option>
                  <option value="Commercial Use">Commercial Use</option>
                  <option value="Free Use">Free Use / Open Source</option>
                </select>
              </div>
              <Input 
                label="Compatibility (e.g. LrC v12+)" 
                name="compatibility"
                value={formData.compatibility}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border">
              <div>
                <h4 className="font-medium text-text-primary">Make this a paid resource</h4>
                <p className="text-sm text-text-muted">Users will need to purchase this resource (Marketplace feature coming soon)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleInputChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

            {formData.isPaid && (
              <Input 
                type="number"
                label="Price ($)" 
                name="price"
                min="1"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
              />
            )}
          </section>

        </form>
      </div>
    </div>
  );
}
