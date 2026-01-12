import multer from 'multer';
import path from 'path';

// Use memory storage to store file in buffer (for MongoDB)
const storage = multer.memoryStorage();

// Check file type
function checkFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /pdf|doc|docx/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: PDF, DOC, or DOCX files only!');
  }
}

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

export default upload;
