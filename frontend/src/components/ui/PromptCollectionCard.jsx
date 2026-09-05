import { Link } from 'react-router-dom';
import { Layers, Image as ImageIcon } from 'lucide-react';

const PromptCollectionCard = ({ collection }) => {
  return (
    <Link 
      to={`/prompt-collections/${collection._id}`}
      className="group flex flex-col bg-bg-secondary rounded-xl overflow-hidden border border-border hover:border-border-focus transition-all duration-300 hover:shadow-lg"
    >
      {/* Folder/Stack Visual Effect */}
      <div className="relative pt-4 px-4 bg-bg-elevated/50">
        <div className="absolute top-2 left-6 right-6 h-full bg-bg-elevated rounded-t-xl border-t border-x border-border opacity-50 transform translate-y-1 transition-transform group-hover:-translate-y-1" />
        <div className="absolute top-0 left-8 right-8 h-full bg-bg-elevated rounded-t-xl border-t border-x border-border opacity-25 transform translate-y-2 transition-transform group-hover:-translate-y-2" />
        
        <div className="relative z-10 aspect-[16/9] bg-bg-primary rounded-xl overflow-hidden border border-border shadow-sm">
          {collection.coverImage?.url ? (
            <img
              src={collection.coverImage.url}
              alt={collection.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-bg-secondary">
              <Layers size={32} className="mb-2 opacity-50" />
              <span className="text-sm font-medium tracking-wide uppercase">Collection</span>
            </div>
          )}
          
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md flex items-center text-xs text-white font-medium">
            <ImageIcon size={12} className="mr-1.5" />
            {collection.prompts?.length || 0}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col bg-bg-secondary z-20">
        <h3 className="text-xl font-medium text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-1">
          {collection.title}
        </h3>
        <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">
          {collection.description || 'A curated collection of AI prompts.'}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center space-x-2">
            <img 
              src={collection.creator?.avatar || `https://ui-avatars.com/api/?name=${collection.creator?.name}&background=random`} 
              alt={collection.creator?.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-text-muted truncate max-w-[120px]">{collection.creator?.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PromptCollectionCard;
