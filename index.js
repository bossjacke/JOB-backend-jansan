import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import { startCronJob } from './src/utils/cronJob.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

const setupRoutes = async () => {
  // Define Routes
  app.use('/api/users', (await import('./src/routes/userRoutes.js')).default);
  app.use('/api/jobs', (await import('./src/routes/jobRoutes.js')).default);
  app.use('/api/applications', (await import('./src/routes/applicationRoutes.js')).default);
  app.use('/api/cv', (await import('./src/routes/cvRoutes.js')).default);
};

// Root route
app.get('/', (req, res) => {
  res.send('Job Vacancy API is running...');
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const startServer = async () => {
  await setupRoutes();
  
  // Start the cron job to auto-deactivate expired jobs
  startCronJob();
  
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

startServer();
