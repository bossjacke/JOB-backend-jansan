import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  companyName: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  jobType: {
    type: String,
    required: [true, 'Please provide job type'],
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote']
  },
  location: {
    type: String,
    required: [true, 'Please provide job location'],
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide job description']
  },
  lastDate: {
    type: Date,
    required: [true, 'Please provide application last date']
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  vacancies: {
    type: Number,
    required: [true, 'Please provide number of vacancies'],
    min: [1, 'At least 1 vacancy is required'],
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search functionality
jobSchema.index({ 
  title: 'text', 
  companyName: 'text', 
  description: 'text',
  location: 'text' 
});

// Instance method to check if job is expired
jobSchema.methods.isExpired = function() {
  return new Date() > this.lastDate;
};

// Instance method to check if vacancies are available
jobSchema.methods.hasVacancies = function() {
  return this.vacancies > 0;
};

// Instance method to decrement vacancies (non-atomic - use with caution)
jobSchema.methods.decrementVacancies = async function() {
  if (this.vacancies > 0) {
    this.vacancies -= 1;
    if (this.vacancies === 0) {
      this.status = 'closed';
    }
    await this.save();
  }
  return this;
};

// Static method to decrement vacancies atomically (prevents race conditions)
jobSchema.statics.decrementVacanciesAtomic = async function(jobId) {
  const result = await this.findOneAndUpdate(
    { 
      _id: jobId, 
      vacancies: { $gt: 0 },
      status: 'active'
    },
    { 
      $inc: { vacancies: -1 },
      $set: { 
        updatedAt: new Date()
      }
    },
    { new: true }
  );
  
  // If vacancies reached 0, close the job
  if (result && result.vacancies === 0) {
    await this.findByIdAndUpdate(jobId, {
      $set: { status: 'closed', updatedAt: new Date() }
    });
    result.status = 'closed';
  }
  
  return result;
};

// Static method to deactivate all expired jobs
jobSchema.statics.deactivateExpiredJobs = async function() {
  const now = new Date();
  const result = await this.updateMany(
    { 
      status: 'active',
      lastDate: { $lt: now }
    },
    { 
      $set: { status: 'closed', updatedAt: now }
    }
  );
  return result.modifiedCount;
};

export default mongoose.model('Job', jobSchema);
