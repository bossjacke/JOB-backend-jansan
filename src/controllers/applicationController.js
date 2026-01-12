import Application from '../models/Application.js';
import Job from '../models/Job.js';
import CV from '../models/CV.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
export const applyJob = async (req, res) => {
  try {
    const { jobId, cvId } = req.body;

    // Check if user is authenticated
    if (!req.user) {
      console.error('Auth error: req.user is undefined');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated. Please login to apply.'
      });
    }

    // Get user ID safely
    const userId = req.user._id || req.user.id;
    console.log('Applying for job - User ID:', userId, 'Job ID:', jobId);
    
    if (!userId) {
      console.error('Auth error: user ID is null');
      return res.status(401).json({
        success: false,
        message: 'User ID not found. Please login again.'
      });
    }

    // Check if jobId and cvId are provided
    if (!jobId || !cvId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID and CV ID are required'
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is active
    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if user has already applied for this job
    const existingApplication = await Application.findOne({
      user: userId,
      job: jobId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Already applied'
      });
    }

    // Check if vacancies are available using atomic operation
    const updatedJob = await Job.decrementVacanciesAtomic(jobId);
    
    if (!updatedJob) {
      return res.status(400).json({
        success: false,
        message: 'This job position has been filled. No more applications accepted.'
      });
    }

    // Get the updated job data
    const jobWithVacancies = await Job.findById(jobId);
    const cv = await CV.findById(cvId);
    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found'
      });
    }

    // Create application
    const application = await Application.create({
      user: userId,
      job: jobId,
      cvId
    });

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Apply job error:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to apply for job'
    });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my
// @access  Private
export const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .sort({ appliedAt: -1 })
      .populate('job', 'title companyName location jobType')
      .populate('cvId', '_id fileName contentType uploadedAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get application status
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title companyName')
      .populate('cvId', '_id fileName contentType uploadedAt');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns this application
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all applications for a job (for employers)
// @route   GET /api/applications/job/:jobId
// @access  Private
export const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .sort({ appliedAt: -1 })
      .populate('user', 'name email phone location')
      .populate('cvId', '_id fileName contentType uploadedAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update application status (for employers)
// @route   PUT /api/applications/:id/status
// @access  Private
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns this application
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/applications/admin/all
// @access  Private/Admin
export const getAllApplications = async (req, res) => {
  try {
    console.log('Fetching all applications...');
    const applications = await Application.find({})
      .sort({ appliedAt: -1 })
      .populate('user', 'name email phone location')
      .populate('job', 'title companyName location jobType salary description lastDate status')
      .populate('cvId', '_id fileName contentType uploadedAt')
      .lean();

    console.log('Applications found:', applications.length);
    if (applications.length > 0) {
      console.log('Sample application:', JSON.stringify(applications[0], null, 2));
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update application status (Admin only)
// @route   PUT /api/applications/admin/:id/status
// @access  Private/Admin
export const updateApplicationStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;

    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    .populate('user', 'name email phone location')
    .populate('job', 'title companyName location jobType salary description lastDate status')
    .populate('cvId', '_id fileName contentType uploadedAt')
    .lean();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete application (Admin only)
// @route   DELETE /api/applications/admin/:id
// @access  Private/Admin
export const deleteApplicationAdmin = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
