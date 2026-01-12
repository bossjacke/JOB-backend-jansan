import Joi from 'joi';

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: errorMessage
      });
    }
    
    next();
  };
};

// Query parameter validation middleware factory
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({
        success: false,
        message: 'Query parameter validation error',
        error: errorMessage
      });
    }
    
    next();
  };
};

// URL parameter validation middleware factory
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({
        success: false,
        message: 'Parameter validation error',
        error: errorMessage
      });
    }
    
    next();
  };
};

// User Registration Validation Schema
export const userRegistrationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address'
    }),
  
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be 10-15 digits'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    })
});

// User Login Validation Schema
export const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

// Job Creation Validation Schema
export const jobCreationSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Job title is required',
      'string.min': 'Job title must be at least 3 characters',
      'string.max': 'Job title cannot exceed 100 characters'
    }),
  
  department: Joi.string()
    .valid('Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Customer Service', 'IT', 'Management', 'Other')
    .required()
    .messages({
      'string.empty': 'Department is required',
      'any.only': 'Please select a valid department'
    }),
  
  location: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Location is required',
      'string.min': 'Location must be at least 2 characters',
      'string.max': 'Location cannot exceed 100 characters'
    }),
  
  description: Joi.string()
    .min(50)
    .required()
    .messages({
      'string.empty': 'Job description is required',
      'string.min': 'Description must be at least 50 characters'
    }),
  
  requirements: Joi.string()
    .min(20)
    .required()
    .messages({
      'string.empty': 'Requirements are required',
      'string.min': 'Requirements must be at least 20 characters'
    }),
  
  employmentType: Joi.string()
    .valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary')
    .required()
    .messages({
      'string.empty': 'Employment type is required',
      'any.only': 'Please select a valid employment type'
    }),
  
  seats: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .required()
    .messages({
      'number.base': 'Seats must be a number',
      'number.min': 'Must have at least 1 seat',
      'number.max': 'Cannot exceed 100 seats'
    }),
  
  status: Joi.string()
    .valid('Open', 'Closed', 'On Hold', 'Draft')
    .optional(),
  
  salary: Joi.string()
    .optional(),
  
  experience: Joi.string()
    .valid('Entry Level', 'Mid Level', 'Senior Level', 'Manager', 'Director')
    .optional(),
  
  skills: Joi.array()
    .items(Joi.string())
    .optional()
});

// Job Update Validation Schema
export const jobUpdateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .optional(),
  
  department: Joi.string()
    .valid('Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Customer Service', 'IT', 'Management', 'Other')
    .optional(),
  
  location: Joi.string()
    .min(2)
    .max(100)
    .optional(),
  
  description: Joi.string()
    .min(50)
    .optional(),
  
  requirements: Joi.string()
    .min(20)
    .optional(),
  
  employmentType: Joi.string()
    .valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary')
    .optional(),
  
  seats: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional(),
  
  status: Joi.string()
    .valid('Open', 'Closed', 'On Hold', 'Draft')
    .optional(),
  
  salary: Joi.string()
    .optional(),
  
  experience: Joi.string()
    .valid('Entry Level', 'Mid Level', 'Senior Level', 'Manager', 'Director')
    .optional(),
  
  skills: Joi.array()
    .items(Joi.string())
    .optional()
});

// Application Validation Schema
export const applicationSchema = Joi.object({
  resumeUrl: Joi.string()
    .uri()
    .required()
    .messages({
      'string.empty': 'Resume URL is required',
      'string.uri': 'Resume URL must be a valid URL'
    }),
  
  coverLetter: Joi.string()
    .min(50)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Cover letter is required',
      'string.min': 'Cover letter must be at least 50 characters',
      'string.max': 'Cover letter cannot exceed 2000 characters'
    }),
  
  source: Joi.string()
    .valid('Website', 'LinkedIn', 'Referral', 'Other')
    .optional()
});

// Application Status Update Validation Schema
export const applicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid('Pending', 'Under Review', 'Shortlisted', 'Rejected', 'Hired')
    .required()
    .messages({
      'string.empty': 'Status is required',
      'any.only': 'Please select a valid status'
    }),
  
  reviewNotes: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Review notes cannot exceed 500 characters'
    })
});

// Query Parameter Validation Schema
export const jobQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10),
  
  department: Joi.string()
    .valid('Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Customer Service', 'IT', 'Management', 'Other')
    .optional(),
  
  status: Joi.string()
    .valid('Open', 'Closed', 'On Hold', 'Draft')
    .optional(),
  
  search: Joi.string()
    .min(2)
    .optional()
});

// Admin User Role Update Validation Schema
export const adminRoleUpdateSchema = Joi.object({
  role: Joi.string()
    .valid('user', 'admin')
    .required()
    .messages({
      'string.empty': 'Role is required',
      'any.only': 'Role must be either user or admin'
    })
});

// Admin Query Parameter Validation Schema
export const adminQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10),
  
  search: Joi.string()
    .min(2)
    .optional()
    .messages({
      'string.min': 'Search term must be at least 2 characters'
    }),
  
  status: Joi.string()
    .valid('Pending', 'Under Review', 'Shortlisted', 'Rejected', 'Hired')
    .optional()
});

// MongoDB ObjectId Validation Schema
export const objectIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'ID is required',
      'string.pattern.base': 'Invalid ID format'
    })
});
