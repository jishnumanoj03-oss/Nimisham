import { useState } from 'react';
import { X } from 'lucide-react';

export default function SkillsInput({ value = [], onChange, maxSkills = 15 }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const skill = input.trim();
    if (skill && !value.includes(skill) && value.length < maxSkills) {
      onChange([...value, skill]);
      setInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(value.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeSkill(value[value.length - 1]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-label uppercase tracking-wider text-nim-text-muted mb-2">
        Skills
      </label>
      <div className="min-h-[44px] bg-nim-elevated border border-nim-border rounded-nim-md px-3 py-2 flex flex-wrap gap-2 focus-within:border-nim-border-focus focus-within:shadow-nim-glow transition-colors">
        {value.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-nim-accent-muted text-nim-accent rounded-nim-sm text-caption"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="hover:text-nim-text transition-colors"
              aria-label={`Remove ${skill}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {value.length < maxSkills && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addSkill}
            placeholder={value.length === 0 ? 'Type a skill and press Enter' : 'Add more...'}
            className="flex-1 min-w-[120px] bg-transparent text-nim-text placeholder:text-nim-text-muted outline-none text-small py-1"
          />
        )}
      </div>
      <p className="mt-1.5 text-caption text-nim-text-muted">
        {value.length}/{maxSkills} skills · Press Enter to add
      </p>
    </div>
  );
}
