import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Image as ImageIcon, Send, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function TutorialEditorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Photography');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [sections, setSections] = useState([
    { title: 'Introduction', content: '', order: 1 }
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addSection = () => {
    setSections([...sections, { title: '', content: '', order: sections.length + 1 }]);
  };

  const removeSection = (index) => {
    if (sections.length === 1) return;
    const newSections = sections.filter((_, i) => i !== index);
    // Re-order
    setSections(newSections.map((sec, i) => ({ ...sec, order: i + 1 })));
  };

  const updateSection = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const handleSave = async (status) => {
    if (!title || !summary) {
      return toast.error('Title and Summary are required');
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('category', category);
      formData.append('difficultyLevel', difficulty);
      formData.append('status', status);
      formData.append('sections', JSON.stringify(sections));
      
      if (featuredImage) {
        formData.append('featuredImage', featuredImage);
      }

      await api.post('/tutorials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(`Tutorial ${status === 'published' ? 'published' : 'saved as draft'}`);
      navigate('/dashboard'); // or creator portfolio
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save tutorial');
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
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleSave('draft')} 
              disabled={loading}
              icon={Save}
            >
              Save Draft
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleSave('published')} 
              disabled={loading}
              icon={Send}
            >
              Publish
            </Button>
          </div>
        </header>

        <div className="space-y-8">
          {/* Main Info */}
          <section className="bg-bg-elevated p-8 rounded-2xl border border-border space-y-6">
            <h2 className="text-xl font-medium text-text-primary mb-6">Tutorial Details</h2>
            
            <Input 
              label="Tutorial Title" 
              placeholder="e.g. Mastering Light in Portrait Photography" 
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-label mb-2 text-text-muted">Category</label>
                <select
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="Photography">Photography</option>
                  <option value="Editing">Editing</option>
                  <option value="AI Art">AI Art</option>
                  <option value="Creative Business">Creative Business</option>
                </select>
              </div>
              <div>
                <label className="block text-label mb-2 text-text-muted">Difficulty</label>
                <select
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none"
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-label mb-2 text-text-muted">Summary (Short description)</label>
              <textarea
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none h-24 resize-none"
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="What will users learn in this tutorial?"
              />
            </div>

            <div>
              <label className="block text-label mb-2 text-text-muted">Featured Image</label>
              <div 
                className={`relative border-2 border-dashed ${imagePreview ? 'border-border-focus' : 'border-border'} rounded-xl p-8 flex flex-col items-center justify-center bg-bg-secondary overflow-hidden`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="relative z-10 flex flex-col items-center">
                      <Button variant="outline" size="sm" className="bg-bg-primary/80 backdrop-blur-md">Change Cover</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="text-text-muted mb-4" size={32} />
                    <p className="text-sm text-text-secondary">Click to upload a high-quality cover image</p>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                />
              </div>
            </div>
          </section>

          {/* Sections */}
          <section className="space-y-6">
            <h2 className="text-xl font-medium text-text-primary flex items-center justify-between">
              Content Sections
              <Button variant="ghost" size="sm" icon={Plus} onClick={addSection}>Add Section</Button>
            </h2>

            {sections.map((section, index) => (
              <div key={index} className="bg-bg-elevated p-6 rounded-2xl border border-border relative group">
                {sections.length > 1 && (
                  <button 
                    onClick={() => removeSection(index)}
                    className="absolute top-4 right-4 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                
                <div className="mb-4 pr-8">
                  <Input 
                    placeholder="Section Title (e.g. Step 1: Camera Settings)"
                    value={section.title}
                    onChange={e => updateSection(index, 'title', e.target.value)}
                    className="text-lg font-medium"
                  />
                </div>
                
                <textarea
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-4 text-text-primary focus:border-border-focus focus:ring-1 focus:ring-accent outline-none min-h-[200px] font-mono text-sm leading-relaxed"
                  value={section.content}
                  onChange={e => updateSection(index, 'content', e.target.value)}
                  placeholder="Write your section content here... (Supports basic formatting via newlines for this MVP)"
                />
              </div>
            ))}
          </section>

          <div className="flex justify-center pt-8">
            <Button variant="outline" icon={Plus} onClick={addSection} className="w-full sm:w-auto">
              Add Another Section
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
