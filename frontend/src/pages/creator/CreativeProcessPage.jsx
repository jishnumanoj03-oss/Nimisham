import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, GripVertical, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';

const CreativeProcessPage = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  
  const [artwork, setArtwork] = useState(null);
  const [processId, setProcessId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    inspirationText: '',
    inspirationGoal: '',
    techniques: '',
    creativeNotes: '',
    lessonsLearned: '',
  });

  const [steps, setSteps] = useState([
    { title: '', description: '', software: '', duration: '', orderIndex: 0 }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artRes = await api.get(`/artworks/${artworkId}`);
        setArtwork(artRes.data.data);

        try {
          const procRes = await api.get(`/creative-process/artwork/${artworkId}`);
          if (procRes.data.data) {
            const data = procRes.data.data;
            setProcessId(data._id);
            setFormData({
              inspirationText: data.inspiration?.text || '',
              inspirationGoal: data.inspiration?.goal || '',
              techniques: data.techniques?.join(', ') || '',
              creativeNotes: data.creativeNotes || '',
              lessonsLearned: data.lessonsLearned || '',
            });
            if (data.workflowSteps && data.workflowSteps.length > 0) {
              setSteps(data.workflowSteps);
            }
          }
        } catch (err) {
          // Process might not exist yet, that's fine
        }
      } catch (error) {
        toast.error('Failed to load artwork details');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [artworkId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, e) => {
    const { name, value } = e.target;
    const newSteps = [...steps];
    newSteps[index][name] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, { title: '', description: '', software: '', duration: '', orderIndex: steps.length }]);
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    // Re-index
    newSteps.forEach((step, i) => step.orderIndex = i);
    setSteps(newSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate steps
    const validSteps = steps.filter(s => s.title && s.description);
    if (validSteps.length === 0 && steps.length > 0) {
      toast.error('Workflow steps must have at least a title and description');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      artworkId,
      inspiration: {
        text: formData.inspirationText,
        goal: formData.inspirationGoal,
      },
      techniques: formData.techniques.split(',').map(t => t.trim()).filter(t => t),
      workflowSteps: validSteps,
      creativeNotes: formData.creativeNotes,
      lessonsLearned: formData.lessonsLearned,
    };

    try {
      if (processId) {
        await api.put(`/creative-process/${processId}`, payload);
        toast.success('Creative process updated');
      } else {
        await api.post('/creative-process', payload);
        toast.success('Creative process saved');
      }
      navigate(`/artwork/${artworkId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save creative process');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-serif text-text-primary mb-1">Document Process</h1>
          <p className="text-text-secondary">for "{artwork?.title}"</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Inspiration & Techniques */}
        <div className="bg-bg-secondary p-6 rounded-xl border border-border space-y-6">
          <h2 className="text-xl font-medium text-text-primary">Inspiration & Concept</h2>
          <Textarea 
            label="What inspired this piece?" 
            name="inspirationText" 
            value={formData.inspirationText} 
            onChange={handleInputChange} 
            rows={3} 
          />
          <Input 
            label="Creative Goal" 
            name="inspirationGoal" 
            value={formData.inspirationGoal} 
            onChange={handleInputChange} 
            placeholder="e.g. To capture the scale of the mountains..." 
          />
          <Input 
            label="Techniques Used (comma separated)" 
            name="techniques" 
            value={formData.techniques} 
            onChange={handleInputChange} 
            placeholder="e.g. Focus Stacking, Long Exposure, Inpainting" 
          />
        </div>

        {/* Workflow Steps */}
        <div className="bg-bg-secondary p-6 rounded-xl border border-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-text-primary">Workflow Timeline</h2>
            <Button type="button" variant="secondary" onClick={addStep} size="sm">
              <Plus size={16} className="mr-2" /> Add Step
            </Button>
          </div>
          
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 p-4 bg-bg-elevated rounded-lg border border-border relative group">
                <div className="flex flex-col items-center pt-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-mono text-sm font-bold mb-2">
                    {index + 1}
                  </div>
                  <GripVertical size={20} className="text-text-muted cursor-move opacity-50 hover:opacity-100" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                      label="Step Title *" 
                      name="title" 
                      value={step.title} 
                      onChange={(e) => handleStepChange(index, e)} 
                      placeholder="e.g. Color Grading" 
                      required
                    />
                    <div className="flex space-x-2">
                      <Input 
                        label="Software / Tool" 
                        name="software" 
                        value={step.software} 
                        onChange={(e) => handleStepChange(index, e)} 
                        placeholder="e.g. Lightroom" 
                        className="flex-1"
                      />
                      <Input 
                        label="Duration" 
                        name="duration" 
                        value={step.duration} 
                        onChange={(e) => handleStepChange(index, e)} 
                        placeholder="e.g. 2 hours" 
                        className="w-1/3"
                      />
                    </div>
                  </div>
                  
                  <Textarea 
                    label="Description *" 
                    name="description" 
                    value={step.description} 
                    onChange={(e) => handleStepChange(index, e)} 
                    rows={2}
                    required
                  />
                </div>

                {steps.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeStep(index)}
                    className="absolute top-4 right-4 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes & Learnings */}
        <div className="bg-bg-secondary p-6 rounded-xl border border-border space-y-6">
          <h2 className="text-xl font-medium text-text-primary">Reflections</h2>
          <Textarea 
            label="Creative Notes" 
            name="creativeNotes" 
            value={formData.creativeNotes} 
            onChange={handleInputChange} 
            rows={3} 
            placeholder="Any additional thoughts on the process..."
          />
          <Textarea 
            label="Lessons Learned" 
            name="lessonsLearned" 
            value={formData.lessonsLearned} 
            onChange={handleInputChange} 
            rows={3} 
            placeholder="What would you do differently next time?"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : <><Save size={18} className="mr-2"/> Save Process</>}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreativeProcessPage;
