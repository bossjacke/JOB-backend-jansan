import mongoose from 'mongoose';

// Job Vacancy Schema Definition
const jobVacancySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    enum: [
      'Engineering',
      'Marketing',
      'Sales',
      'HR',
      'Finance',
      'Operations',
      'Customer Service',
      'IT',
      'Management',
      'Other'
    ]
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    minlength: [50, 'Description must be at least 50 characters']
  },
  requirements: {
    type: String,
    required: [true, 'Requirements are required'],
    trim: true,
    minlength: [20, 'Requirements must be at least 20 characters']
  },
  employmentType: {
    type: String,
    required: [true, 'Employment type is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary']
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [1, 'Must have at least 1 seat'],
    max: [100, 'Cannot exceed 100 seats']
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'On Hold', 'Draft'],
    default: 'Open'
  },
  // Optional fields for enhanced functionality
  salary: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Manager', 'Director'],
    default: 'Entry Level'
  },
  skills: [{
    type: String,
    trim: true
  }],
  // Reference to the admin who created this job posting
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for better search performance
jobVacancySchema.index({ title: 'text', description: 'text' });
jobVacancySchema.index({ department: 1 });
jobVacancySchema.index({ status: 1 });
jobVacancySchema.index({ createdAt: -1 });

// Virtual for application count (if you want to track applications)
jobVacancySchema.virtual('applicationCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'jobId',
  count: true
});

// Method to check if job is still accepting applications
jobVacancySchema.methods.isAcceptingApplications = function() {
  return this.status === 'Open' && this.seats > 0;
};

// Method to get job summary for listings
jobVacancySchema.methods.toSummary = function() {
  return {
    id: this._id,
    title: this.title,
    department: this.department,
    location: this.location,
    employmentType: this.employmentType,
    seats: this.seats,
    status: this.status,
    createdAt: this.createdAt
  };
};

const JobVacancy = mongoose.model('JobVacancy', jobVacancySchema);

export default JobVacancy;
