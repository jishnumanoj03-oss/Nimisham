import { Link } from 'react-router-dom';
import { Download, Star } from 'lucide-react';
import Button from './Button';

const ResourceCard = ({ resource }) => {
  return (
    <div className="group flex flex-col bg-bg-elevated rounded-xl overflow-hidden border border-border hover:border-border-focus transition-all duration-300">
      <Link 
        to={`/resources/${resource._id}`} 
        className="block relative aspect-[4/3] bg-bg-secondary overflow-hidden"
      >
        {resource.thumbnail?.url ? (
          <img
            src={resource.thumbnail.url}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            {resource.resourceType}
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-md uppercase tracking-wider">
            {resource.resourceType.replace('_', ' ')}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-md backdrop-blur-md ${
            resource.isPaid ? 'bg-accent/90 text-white' : 'bg-green-500/90 text-white'
          }`}>
            {resource.isPaid ? `$${resource.price}` : 'Free'}
          </span>
        </div>
      </Link>
      
      <div className="flex flex-col flex-1 p-5">
        <Link to={`/resources/${resource._id}`} className="group-hover:text-accent transition-colors">
          <h3 className="text-lg font-medium text-text-primary mb-1 line-clamp-1">
            {resource.title}
          </h3>
        </Link>
        
        <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <img 
              src={resource.creator?.avatar || `https://ui-avatars.com/api/?name=${resource.creator?.name}&background=random`} 
              alt={resource.creator?.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-text-muted truncate max-w-[100px]">{resource.creator?.name}</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center"><Download size={14} className="mr-1" /> {resource.downloadCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
