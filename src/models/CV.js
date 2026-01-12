import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: [true, 'Please provide file name'],
    trim: true
  },
  contentType: {
    type: String,
    required: [true, 'Please provide content type'],
    enum: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  fileData: {
    type: Buffer,
    required: [true, 'Please provide file data']
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
cvSchema.index({ userId: 1, uploadedAt: -1 });

export default mongoose.model('CV', cvSchema);
