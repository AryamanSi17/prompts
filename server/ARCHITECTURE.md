# Backend MVC Architecture Documentation

## Overview
The backend has been refactored to follow the **Model-View-Controller (MVC)** architecture pattern for better code organization, maintainability, and scalability.

## Architecture Structure

```
server/
├── models/          # Data models (MongoDB schemas)
├── views/           # Not applicable (API returns JSON)
├── controllers/     # Request handlers (thin layer)
├── services/        # Business logic layer
├── routes/          # API route definitions
├── middleware/      # Authentication & validation
├── utils/           # Helper functions
└── index.js         # Application entry point
```

## Layer Responsibilities

### 1. Models (`/models`)
**Purpose**: Define data structure and database schema

**Files**:
- `User.js` - User account schema with authentication
- `Prompt.js` - Prompt library schema
- `Post.js` - Social media post schema
- `Follow.js` - User follow relationship schema
- `Comment.js` - Post comment schema

**Responsibilities**:
- Define MongoDB schemas
- Define data validation rules
- Define indexes for performance
- Define instance methods (e.g., password comparison)
- Define pre/post hooks (e.g., password hashing)

### 2. Controllers (`/controllers`)
**Purpose**: Handle HTTP requests and responses (thin layer)

**Files**:
- `authController.js` - Authentication endpoints
- `promptController.js` - Prompt CRUD operations
- `postController.js` - Post management
- `userController.js` - User profile & social features

**Responsibilities**:
- Receive HTTP requests
- Extract request data (params, query, body)
- Call appropriate service methods
- Handle errors and return appropriate HTTP status codes
- Send JSON responses

**Example**:
```javascript
exports.getPrompts = async (req, res) => {
    try {
        const result = await promptService.getPrompts(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

### 3. Services (`/services`)
**Purpose**: Business logic layer (core functionality)

**Files**:
- `authService.js` - Authentication logic (OTP, JWT, email)
- `promptService.js` - Prompt business logic
- `postService.js` - Post business logic
- `userService.js` - User profile & social logic
- `uploadService.js` - File upload handling
- `videoService.js` - Video processing (ffmpeg)
- `emailService.js` - Email sending

**Responsibilities**:
- Implement business logic
- Data validation
- Database operations
- Third-party API calls
- Complex calculations
- Error handling with meaningful messages

**Example**:
```javascript
class PromptService {
    async getPrompts(filters = {}) {
        // Business logic here
        const query = {};
        if (filters.search) {
            query.$or = [
                { title: { $regex: filters.search, $options: 'i' } },
                { prompt: { $regex: filters.search, $options: 'i' } }
            ];
        }
        return await Prompt.find(query).lean();
    }
}
```

### 4. Routes (`/routes`)
**Purpose**: Define API endpoints and map to controllers

**Files**:
- `auth.js` - `/api/auth/*` routes
- `prompts.js` - `/api/prompts/*` routes
- `posts.js` - `/api/posts/*` routes
- `users.js` - `/api/users/*` routes

**Responsibilities**:
- Define HTTP methods (GET, POST, PUT, DELETE)
- Map routes to controller methods
- Apply middleware (auth, validation, upload)

**Example**:
```javascript
router.get('/', promptController.getPrompts);
router.post('/', authMiddleware, promptController.createPrompt);
router.put('/:id', authMiddleware, promptController.updatePrompt);
```

### 5. Middleware (`/middleware`)
**Purpose**: Request processing pipeline

**Files**:
- `auth.js` - JWT authentication & authorization

**Responsibilities**:
- Verify JWT tokens
- Attach user to request object
- Handle authentication errors
- Optional authentication for public routes

### 6. Utils (`/utils`)
**Purpose**: Reusable helper functions

**Responsibilities**:
- Common utilities
- Helper functions
- Constants

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /verify-otp` - Verify email with OTP
- `POST /login` - Login user
- `POST /resend-otp` - Resend OTP
- `GET /me` - Get current user (protected)

### Prompts (`/api/prompts`)
- `GET /` - Get all prompts (with filters)
- `GET /:id` - Get single prompt
- `POST /` - Create prompt (protected)
- `PUT /:id` - Update prompt (protected)
- `DELETE /:id` - Delete prompt (protected)

### Posts (`/api/posts`)
- `GET /feed` - Get feed posts (protected)
- `GET /user/:username` - Get user's posts
- `POST /` - Create post (protected)
- `DELETE /:id` - Delete post (protected)

### Users (`/api/users`)
- `GET /search` - Search users
- `GET /:username` - Get user profile
- `PUT /profile` - Update profile (protected)
- `POST /:id/follow` - Follow user (protected)
- `POST /:id/unfollow` - Unfollow user (protected)
- `GET /:id/followers` - Get followers
- `GET /:id/following` - Get following

## Benefits of MVC Architecture

### 1. Separation of Concerns
- Each layer has a specific responsibility
- Easier to understand and maintain
- Changes in one layer don't affect others

### 2. Reusability
- Services can be reused across multiple controllers
- Business logic is centralized

### 3. Testability
- Each layer can be tested independently
- Mock services for controller testing
- Mock models for service testing

### 4. Scalability
- Easy to add new features
- Easy to modify existing features
- Clear structure for team collaboration

### 5. Maintainability
- Bugs are easier to locate
- Code is more organized
- Documentation is clearer

## Error Handling

### Service Layer
Services throw errors with meaningful messages:
```javascript
if (!user) {
    throw new Error('User not found');
}
```

### Controller Layer
Controllers catch errors and return appropriate HTTP status codes:
```javascript
try {
    const result = await service.method();
    res.json(result);
} catch (error) {
    if (error.message === 'Not found') {
        return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
}
```

## Database Connection

MongoDB connection is managed in `index.js` with:
- Connection pooling
- Auto-reconnection
- Error handling
- Connection state checking middleware

## Authentication Flow

1. User registers → OTP sent via email
2. User verifies OTP → JWT token issued
3. User includes JWT in `Authorization: Bearer <token>` header
4. Middleware verifies token and attaches user to request
5. Controller accesses `req.user` for authenticated operations

## File Upload Flow

1. Request with file → `uploadService` middleware
2. File saved to disk/S3
3. Controller receives file info in `req.file`
4. Service processes file (e.g., video compression)
5. File path saved to database

## Best Practices

1. **Keep controllers thin** - Only handle HTTP layer
2. **Put logic in services** - All business logic goes here
3. **Use meaningful error messages** - Help debugging
4. **Validate input** - In services before processing
5. **Use async/await** - For cleaner async code
6. **Handle errors properly** - Try/catch in controllers
7. **Use lean() for queries** - Better performance when not modifying
8. **Index frequently queried fields** - Faster database queries

## Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

## Environment Variables

Required in `.env`:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Email config
- `AWS_*` - AWS S3 configuration (optional)

## Future Improvements

1. Add validation middleware using Joi or express-validator
2. Add rate limiting middleware
3. Add request logging middleware
4. Add API documentation (Swagger/OpenAPI)
5. Add unit tests for services
6. Add integration tests for controllers
7. Add caching layer (Redis)
8. Add WebSocket support for real-time features
