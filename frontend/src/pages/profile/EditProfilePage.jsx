import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import SkillsInput from '../../components/forms/SkillsInput';
import SocialLinksInput from '../../components/forms/SocialLinksInput';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

const creatorTypeOptions = [
  { value: 'photographer', label: 'Photographer' },
  { value: 'ai-artist', label: 'AI Artist' },
  { value: 'both', label: 'Both' },
];

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: '',
    username: '',
    bio: '',
    creatorType: '',
    avatar: '',
    skills: [],
    socialLinks: {}
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  // Load current user data
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        creatorType: user.creatorType || '',
        avatar: user.avatar || '',
        skills: user.skills || [],
        socialLinks: user.socialLinks || {}
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSkillsChange = (newSkills) => {
    setForm({ ...form, skills: newSkills });
  };

  const handleSocialChange = (newLinks) => {
    setForm({ ...form, socialLinks: newLinks });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const res = await userService.uploadAvatar(formData);
      updateUser(res.data.user);
      setForm(prev => ({ ...prev, avatar: res.data.user.avatar }));
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success('Profile photo updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to upload profile photo');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (!/^[a-z0-9_]+$/.test(form.username)) errs.username = 'Only lowercase letters, numbers, and underscores';
    if (form.bio && form.bio.length > 500) errs.bio = 'Bio must be less than 500 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const res = await userService.updateProfile(form);
      updateUser(res.data.user);
      toast.success('Profile updated successfully');
      navigate(`/profile/${res.data.user.username}`);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to={`/profile/${user?.username}`}
          className="p-2 -ml-2 text-nim-text-muted hover:text-nim-text hover:bg-nim-hover rounded-nim-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-h3 text-nim-text">Edit Profile</h1>
          <p className="text-body text-nim-text-secondary">Update your personal information and settings.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10" noValidate>
        {/* Basic Info Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-nim-border">
            <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick} title="Change Profile Photo">
              <Avatar src={avatarPreview || form.avatar} name={form.name} size="xl" className="w-24 h-24 md:w-32 md:h-32 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg,image/png,image/webp" 
              onChange={handleFileChange} 
            />
            <div className="flex-1 flex flex-col items-start gap-2">
              <h3 className="text-h4 text-nim-text">Profile Photo</h3>
              <p className="text-small text-nim-text-secondary">Recommended: Square image, max 5MB.</p>
              {avatarFile && (
                <Button 
                  type="button"
                  size="sm" 
                  onClick={handleAvatarUpload} 
                  loading={uploadingAvatar}
                  disabled={uploadingAvatar}
                >
                  Save Photo
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Input
              label="Username"
              name="username"
              placeholder="username"
              value={form.username}
              onChange={handleChange}
              error={errors.username}
            />
          </div>

          <Textarea
            label="Bio"
            name="bio"
            placeholder="Tell us about yourself and your work..."
            value={form.bio}
            onChange={handleChange}
            error={errors.bio}
            maxLength={500}
          />
        </section>

        {/* Creator Info Section */}
        <section className="space-y-6 pt-6 border-t border-nim-border">
          <h2 className="text-h4 text-nim-text">Creator Details</h2>
          
          <Select
            label="Primary Focus"
            name="creatorType"
            value={form.creatorType || ''}
            onChange={handleChange}
            options={creatorTypeOptions}
            placeholder="Select your main creative focus"
          />

          <SkillsInput 
            value={form.skills} 
            onChange={handleSkillsChange} 
          />
        </section>

        {/* Social Links Section */}
        <section className="space-y-6 pt-6 border-t border-nim-border">
          <SocialLinksInput 
            value={form.socialLinks} 
            onChange={handleSocialChange} 
          />
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-nim-border sticky bottom-0 bg-nim-bg py-4 z-10">
          <Link to={`/profile/${user?.username}`}>
            <Button variant="secondary" type="button" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" loading={loading} icon={Save} iconPosition="left">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
