import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';

const ImageCard = ({ artwork, aspectRatio = 'square', onDelete, onEdit }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    auto: 'h-auto',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-bg-secondary border border-border hover:border-border-focus transition-colors"
    >
      <Link to={`/artwork/${artwork._id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {artwork.title}</span>
      </Link>
      
      <div className={`relative w-full overflow-hidden bg-bg-elevated ${aspectClasses[aspectRatio]}`}>
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-border/50" />
        )}
        <img
          src={artwork.image.thumbnail || artwork.image.url}
          alt={artwork.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Actions (Edit/Delete) */}
        {(onEdit || onDelete) && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            {onEdit && (
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(artwork); }} 
                className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors" 
                aria-label="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(artwork); }} 
                className="p-2 bg-nim-error/80 hover:bg-nim-error backdrop-blur-md rounded-full text-white transition-colors" 
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        
        {/* Hover content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white font-medium truncate">{artwork.title}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-white/80 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
              {artwork.category}
            </span>
            {artwork.creator && (
              <span className="text-xs text-white/70 truncate">
                by {artwork.creator.name || artwork.creator.username}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;
