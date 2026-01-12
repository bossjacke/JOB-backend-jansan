# Job Vacancy Website Backend - Implementation Plan

## Project Setup
- [x] Initialize Node.js project with package.json
- [x] Install dependencies (express, mongoose, dotenv, bcryptjs, jsonwebtoken, multer, cors)

## Database & Configuration
- [x] Create config/db.js for MongoDB connection
- [x] Create .env file for environment variables

## Models
- [x] Create User model (name, email, phone, password, role, location)
- [x] Create Job model (title, companyName, jobType, location, salary, description, lastDate, status)
- [x] Create Application model (userId, jobId, cvId, status)
- [x] Create CV model (userId, fileName, filePath)

## Controllers
- [x] Create User controller (register, login, profile, update, delete)
- [x] Create Job controller (getAll, getById, search)
- [x] Create Application controller (apply, getUserApplications, getStatus)
- [x] Create CV controller (upload, getUserCV, delete)

## Routes
- [x] Create user routes
- [x] Create job routes
- [x] Create application routes
- [x] Create CV routes

## Middleware
- [x] Create auth middleware for authentication
- [x] Create file upload middleware (multer)

## Server
- [x] Create main server.js file
- [x] Set up Express app with all routes

## Documentation
- [x] Create README.md with API documentation

## Next Steps
1. Install dependencies: `npm install`
2. Start MongoDB
3. Run server: `npm run dev`

