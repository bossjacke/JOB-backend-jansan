import cron from 'node-cron';
import Job from '../models/Job.js';

// Function to deactivate expired jobs
const deactivateExpiredJobs = async () => {
  try {
    console.log(`[${new Date().toISOString()}] Running scheduled job to deactivate expired jobs...`);
    
    const now = new Date();
    
    // Find all active jobs where lastDate has passed
    const result = await Job.updateMany(
      { 
        status: 'active',
        lastDate: { $lt: now }
      },
      { 
        $set: { status: 'closed', updatedAt: now }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ Successfully deactivated ${result.modifiedCount} expired job(s)`);
    } else {
      console.log('ℹ️ No expired jobs found');
    }
    
  } catch (error) {
    console.error('❌ Error deactivating expired jobs:', error.message);
  }
};

// Start the cron job scheduler
const startCronJob = () => {
  // Run every minute to check for expired jobs
  cron.schedule('* * * * *', () => {
    deactivateExpiredJobs();
  });
  
  console.log('⏰ Cron job scheduled: Check for expired jobs every minute');
  
  // Run immediately on startup to catch any jobs that expired while server was down
  deactivateExpiredJobs();
};

export { startCronJob, deactivateExpiredJobs };

