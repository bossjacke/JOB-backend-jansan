import express from 'express';
import User from '../models/User.js';
import JobVacancy from '../models/JobVacancy.js';
import Application from '../models/Application.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, validateQuery, validateParams } from '../middleware/validation.js';
import { adminRoleUpdateSchema, adminQuerySchema, objectIdSchema } from '../middleware/validation.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/users', authenticate, authorize('admin'), validateQuery(adminQuerySchema), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('-passwordHash') // Exclude password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalUsers: total,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// Update user role (Admin only)
router.put('/users/:id/role', authenticate, authorize('admin'), validateParams(objectIdSchema), validate(adminRoleUpdateSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user role'
    });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', authenticate, authorize('admin'), validateParams(objectIdSchema), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user has applications
    const applicationCount = await Application.countDocuments({ userId: id });
    if (applicationCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with existing applications'
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
});

// Get all applications (Admin only)
router.get('/applications', authenticate, authorize('admin'), validateQuery(adminQuerySchema), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};
    if (status) query.status = status;
    if (search) {
      query = {
        ...query,
        $or: [
          { 'userId.name': { $regex: search, $options: 'i' } },
          { 'userId.email': { $regex: search, $options: 'i' } },
          { 'jobId.title': { $regex: search, $options: 'i' } }
        ]
      };
    }

    const applications = await Application.find(query)
      .populate('userId', 'name email phone')
      .populate('jobId', 'title department location')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Application.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalApplications: total,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// Get dashboard statistics (Admin only)
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = totalUsers - adminUsers;

    // Job statistics
    const totalJobs = await JobVacancy.countDocuments();
    const openJobs = await JobVacancy.countDocuments({ status: 'Open' });
    const closedJobs = await JobVacancy.countDocuments({ status: 'Closed' });

    // Application statistics
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'Pending' });
    const underReviewApplications = await Application.countDocuments({ status: 'Under Review' });
    const shortlistedApplications = await Application.countDocuments({ status: 'Shortlisted' });
    const rejectedApplications = await Application.countDocuments({ status: 'Rejected' });
    const hiredApplications = await Application.countDocuments({ status: 'Hired' });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    const recentApplications = await Application.countDocuments({
      appliedAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admin: adminUsers,
          regular: regularUsers,
          recent: recentUsers
        },
        jobs: {
          total: totalJobs,
          open: openJobs,
          closed: closedJobs
        },
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          underReview: underReviewApplications,
          shortlisted: shortlistedApplications,
          rejected: rejectedApplications,
          hired: hiredApplications,
          recent: recentApplications
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

export default router;
