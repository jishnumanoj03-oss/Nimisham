import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';

const TutorialCard = ({ tutorial }) => {
  return (
    <div className="group flex flex-col bg-bg-secondary rounded-xl overflow-hidden border border-border hover:border-border-focus transition-all duration-300 hover:shadow-lg">
      <Link to={`/tutorials/${tutorial._id}`} className="block relative overflow-hidden aspect-[16/9] bg-bg-elevated">
        {tutorial.featuredImage?.url ? (
          <img
            src={tutorial.featuredImage.url}
            alt={tutorial.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <span className="uppercase text-sm tracking-widest">{tutorial.category}</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <DifficultyBadge level={tutorial.difficultyLevel} className="bg-bg-primary/80 backdrop-blur-md" />
        </div>
      </Link>
      
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center space-x-2 text-xs font-medium text-accent mb-2">
          <span>{tutorial.category}</span>
          {tutorial.subCategory && (
            <>
              <span className="text-text-muted">•</span>
              <span className="text-text-secondary">{tutorial.subCategory}</span>
            </>
          )}
        </div>
        
        <Link to={`/tutorials/${tutorial._id}`} className="group-hover:text-accent transition-colors">
          <h3 className="text-xl font-serif font-medium text-text-primary mb-2 line-clamp-2">
            {tutorial.title}
          </h3>
        </Link>
        
        <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-1">
          {tutorial.summary}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50 text-sm text-text-muted">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><Clock size={14} className="mr-1.5" /> {tutorial.estimatedReadTime} min</span>
            <span className="flex items-center"><Eye size={14} className="mr-1.5" /> {tutorial.views || 0}</span>
          </div>
          <span className="truncate max-w-[120px]">By {tutorial.creator?.name || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
};

export default TutorialCard;
