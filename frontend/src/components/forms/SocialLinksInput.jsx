import Input from '../ui/Input';
import { Globe, Camera, MessageCircle, Code, Video } from 'lucide-react';

const socialFields = [
  { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://yoursite.com' },
  { key: 'instagram', label: 'Instagram', icon: Camera, placeholder: 'instagram.com/username' },
  { key: 'twitter', label: 'Twitter / X', icon: MessageCircle, placeholder: 'x.com/username' },
  { key: 'github', label: 'GitHub', icon: Code, placeholder: 'github.com/username' },
  { key: 'youtube', label: 'YouTube', icon: Video, placeholder: 'youtube.com/@channel' },
];

export default function SocialLinksInput({ value = {}, onChange }) {
  const handleChange = (key, val) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="w-full space-y-4">
      <label className="block text-label uppercase tracking-wider text-nim-text-muted">
        Social Links
      </label>
      {socialFields.map((field) => (
        <Input
          key={field.key}
          icon={field.icon}
          placeholder={field.placeholder}
          value={value[field.key] || ''}
          onChange={(e) => handleChange(field.key, e.target.value)}
          aria-label={field.label}
        />
      ))}
    </div>
  );
}
