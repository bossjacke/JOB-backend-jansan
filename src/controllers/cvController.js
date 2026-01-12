import CV from '../models/CV.js';

// @desc    Upload CV
// @route   POST /api/cv
// @access  Private
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const cv = await CV.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      contentType: req.file.mimetype,
      fileData: req.file.buffer,
      fileSize: req.file.size
    });

    res.status(201).json({
      success: true,
      data: {
        _id: cv._id,
        userId: cv.userId,
        fileName: cv.fileName,
        contentType: cv.contentType,
        fileSize: cv.fileSize,
        uploadedAt: cv.uploadedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's CVs
// @route   GET /api/cv/my
// @access  Private
export const getUserCV = async (req, res) => {
  try {
    const cvs = await CV.find({ userId: req.user.id })
      .select('-fileData') // Exclude binary data from list
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: cvs.length,
      data: cvs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all CVs (admin)
// @route   GET /api/cv
// @access  Private/Admin
export const getAllCVs = async (req, res) => {
  try {
    const cvs = await CV.find()
      .populate('userId', 'name email')
      .select('-fileData') // Exclude binary data from list
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: cvs.length,
      data: cvs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete CV
// @route   DELETE /api/cv/:id
// @access  Private
export const deleteCV = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found'
      });
    }

    // Check if user owns this CV
    if (cv.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this CV'
      });
    }

    // Delete from MongoDB (file data is automatically removed)
    await cv.deleteOne();

    res.status(200).json({
      success: true,
      message: 'CV deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Download CV
// @route   GET /api/cv/:id/download
// @access  Private
export const downloadCV = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found'
      });
    }

    // Check if user owns this CV or is employer/admin
    if (cv.userId.toString() !== req.user.id && req.user.role !== 'employer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this CV'
      });
    }

    // Set content type and disposition headers
    res.setHeader('Content-Type', cv.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${cv.fileName}"`);
    res.setHeader('Content-Length', cv.fileSize);

    // Send file data from MongoDB
    res.send(cv.fileData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    View CV inline
// @route   GET /api/cv/:id/view
// @access  Private
export const viewCV = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found'
      });
    }

    // Check if user owns this CV or is employer/admin
    if (cv.userId.toString() !== req.user.id && req.user.role !== 'employer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this CV'
      });
    }

    // Set content type for inline viewing
    res.setHeader('Content-Type', cv.contentType);
    res.setHeader('Content-Disposition', `inline; filename="${cv.fileName}"`);
    res.setHeader('Content-Length', cv.fileSize);

    // Send file data from MongoDB
    res.send(cv.fileData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete CV (Admin only)
// @route   DELETE /api/cv/admin/:id
// @access  Private/Admin
export const deleteCVAdmin = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found'
      });
    }

    // Delete from MongoDB (file data is automatically removed)
    await cv.deleteOne();

    res.status(200).json({
      success: true,
      message: 'CV deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
