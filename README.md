# Job Vacancy Website Backend

A RESTful API backend for Job Vacancy Website built with Node.js, Express, and MongoDB.

## Features

- User authentication (Register/Login)
- Role-based access control (Jobseeker, Employer)
- Job CRUD operations with search functionality
- Job application management
- CV upload and management

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- BCrypt for password hashing

## Project Structure

```
job-vacancy-backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── userController.js     # User operations
│   ├── jobController.js      # Job operations
│   ├── applicationController.js  # Application operations
│   └── cvController.js       # CV operations
├── middleware/
│   ├── auth.js               # Authentication middleware
│   └── upload.js             # File upload middleware
├── models/
│   ├── User.js               # User model
│   ├── Job.js                # Job model
│   ├── Application.js        # Application model
│   └── CV.js                 # CV model
├── routes/
│   ├── userRoutes.js         # User routes
│   ├── jobRoutes.js          # Job routes
│   ├── applicationRoutes.js  # Application routes
│   └── cvRoutes.js           # CV routes
├── uploads/                  # Uploaded files directory
├── server.js                 # Entry point
├── package.json              # Dependencies
├── .env                      # Environment variables
└── README.md                 # Documentation
```

## API Endpoints

### User Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/users/register | Register new user | Public |
| POST | /api/users/login | Login user | Public |
| GET | /api/users/profile | Get user profile | Private |
| PUT | /api/users/profile | Update profile | Private |
| DELETE | /api/users | Delete user | Private |

### Job Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/jobs | Get all active jobs | Public |
| GET | /api/jobs/search | Search jobs | Public |
| GET | /api/jobs/:id | Get job by ID | Public |
| POST | /api/jobs | Create new job | Private (Employer) |
| PUT | /api/jobs/:id | Update job | Private (Employer) |
| DELETE | /api/jobs/:id | Delete job | Private (Employer) |

### Application Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/applications | Apply for a job | Private |
| GET | /api/applications/my | Get user's applications | Private |
| GET | /api/applications/:id | Get application status | Private |
| DELETE | /api/applications/:id | Delete application | Private |
| GET | /api/applications/job/:jobId | Get job applications | Private (Employer) |
| PUT | /api/applications/:id/status | Update application status | Private (Employer) |

### CV Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/cv | Upload CV | Private |
| GET | /api/cv/my | Get user's CVs | Private |
| DELETE | /api/cv/:id | Delete CV | Private |
| GET | /api/cv/:id/download | Download CV | Private |

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/job_vacancy_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
```

4. Start the server:
```bash
npm run dev
```

## User Model Schema

```javascript
{
  name: String,          // Required
  email: String,         // Required, Unique
  phone: String,         // Required
  password: String,      // Required, Min 6 chars
  role: String,          // 'jobseeker' or 'employer'
  location: String
}
```

## Job Model Schema

```javascript
{
  title: String,         // Required
  companyName: String,   // Required
  jobType: String,       // Required (full-time, part-time, etc.)
  location: String,      // Required
  salary: String,
  description: String,   // Required
  lastDate: Date,        // Required
  status: String         // 'active', 'closed', 'draft'
}
```

## Application Model Schema

```javascript
{
  userId: ObjectId,      // Reference to User
  jobId: ObjectId,       // Reference to Job
  cvId: ObjectId,        // Reference to CV
  status: String         // 'pending', 'reviewing', 'accepted', 'rejected'
}
```

## CV Model Schema

```javascript
{
  userId: ObjectId,      // Reference to User
  fileName: String,      // Required
  filePath: String       // Required
}
```

## Testing with Postman

1. Register a new user with role 'employer' to post jobs
2. Register another user with role 'jobseeker' to apply for jobs
3. Login to get JWT token
4. Use the token in Authorization header: `Bearer <token>`

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| NODE_ENV | Environment mode |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | JWT secret key |
| JWT_EXPIRE | JWT token expiration time |
| UPLOAD_PATH | Path for uploaded files |

## License

MIT

