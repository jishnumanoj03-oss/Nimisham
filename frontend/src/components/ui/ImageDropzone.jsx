import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const ImageDropzone = ({ onImageSelect, previewUrl, onClear, label = "Upload Image" }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      
      <AnimatePresence mode="wait">
        {previewUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full rounded-lg overflow-hidden border border-border group"
          >
            <img src={previewUrl} alt="Preview" className="w-full h-auto object-cover max-h-[60vh]" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                variant="danger" 
                onClick={(e) => {
                  e.preventDefault();
                  onClear();
                  if(inputRef.current) inputRef.current.value = "";
                }}
                className="flex items-center space-x-2"
              >
                <X size={16} />
                <span>Remove Image</span>
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative w-full p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center
              cursor-pointer transition-colors duration-200
              ${isDragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-border-focus hover:bg-bg-hover'}
            `}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={inputRef}
              onChange={handleChange}
            />
            <div className="p-4 rounded-full bg-bg-elevated mb-4">
              <UploadCloud size={32} className={isDragActive ? 'text-accent' : 'text-text-muted'} />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-1">
              Drag & Drop your image here
            </h3>
            <p className="text-sm text-text-secondary mb-6 text-center max-w-sm">
              Supports JPG, PNG, WEBP up to 10MB. High resolution recommended for artwork.
            </p>
            <Button variant="secondary" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} type="button">
              <ImageIcon size={16} className="mr-2" />
              Browse Files
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageDropzone;
