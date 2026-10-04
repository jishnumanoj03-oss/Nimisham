import Input from '../ui/Input';
import { FaWhatsapp, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';

const socialFields = [
  { key: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, placeholder: '+91XXXXXXXXXX' },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram, placeholder: 'https://instagram.com/username' },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube, placeholder: 'https://youtube.com/@channel' },
  { key: 'github', label: 'GitHub', icon: FaGithub, placeholder: 'https://github.com/username' },
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
