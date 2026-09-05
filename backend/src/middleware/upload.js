import multer from 'multer';

// Use memory storage to process files before sending to Cloudinary
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Configured multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max size
  },
});

export const uploadRaw = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max size for resources
  },
});

export { upload };
export default upload;
