import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, Info } from 'lucide-react';
import Button from './Button';

const PromptCard = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col bg-bg-secondary rounded-xl overflow-hidden border border-border hover:border-border-focus transition-all duration-300">
      {/* Optional Sample Image */}
      {prompt.sampleImages && prompt.sampleImages.length > 0 && (
        <div className="relative aspect-square sm:aspect-[4/3] bg-bg-elevated overflow-hidden group">
          <img
            src={prompt.sampleImages[0].url}
            alt={prompt.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
            <Button variant="primary" size="sm" icon={copied ? Check : Copy} onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy Prompt'}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-accent px-2 py-0.5 bg-accent/10 rounded-md">
            {prompt.model}
          </span>
          {prompt.difficulty && (
            <span className="text-xs text-text-muted">{prompt.difficulty}</span>
          )}
        </div>
        
        <h3 className="text-lg font-medium text-text-primary mb-3">
          {prompt.title}
        </h3>
        
        {/* Code-like block for prompt text */}
        <div className="bg-bg-primary rounded-lg p-3 border border-border/50 text-sm font-mono text-text-secondary line-clamp-3 mb-4 relative group cursor-text">
          {prompt.promptText}
          
          {(!prompt.sampleImages || prompt.sampleImages.length === 0) && (
            <button 
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 bg-bg-elevated border border-border rounded-md text-text-muted hover:text-text-primary hover:border-text-muted transition-colors opacity-0 group-hover:opacity-100"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          )}
        </div>

        {/* Parameters summary */}
        <div className="grid grid-cols-2 gap-2 text-xs text-text-muted mb-4 mt-auto">
          {prompt.aspectRatio && <div><span className="text-text-secondary font-medium">AR:</span> {prompt.aspectRatio}</div>}
          {prompt.cfgScale && <div><span className="text-text-secondary font-medium">CFG:</span> {prompt.cfgScale}</div>}
          {prompt.steps && <div><span className="text-text-secondary font-medium">Steps:</span> {prompt.steps}</div>}
          {prompt.seed && <div><span className="text-text-secondary font-medium">Seed:</span> {prompt.seed}</div>}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center space-x-2">
            <img 
              src={prompt.creator?.avatar || `https://ui-avatars.com/api/?name=${prompt.creator?.name}&background=random`} 
              alt={prompt.creator?.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-text-muted truncate max-w-[100px]">{prompt.creator?.name}</span>
          </div>
          
          <Button variant="ghost" size="sm" className="h-8 text-xs px-2" icon={Info}>Details</Button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
