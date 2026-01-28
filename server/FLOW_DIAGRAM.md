# MVC Architecture Flow Diagram

## Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                           │
│                    (HTTP: GET, POST, PUT, DELETE)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MIDDLEWARE                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   CORS       │→ │     Auth     │→ │   Upload     │          │
│  │  (index.js)  │  │  (auth.js)   │  │(uploadSvc.js)│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                           ROUTES                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   /api/auth  │  │ /api/prompts │  │  /api/posts  │          │
│  │   (auth.js)  │  │(prompts.js)  │  │  (posts.js)  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│  ┌──────┴───────┐         │                  │                  │
│  │  /api/users  │         │                  │                  │
│  │  (users.js)  │         │                  │                  │
│  └──────┬───────┘         │                  │                  │
└─────────┼─────────────────┼──────────────────┼──────────────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CONTROLLERS (Thin)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │     Auth     │  │    Prompt    │  │     Post     │          │
│  │  Controller  │  │  Controller  │  │  Controller  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│  ┌──────┴───────┐         │                  │                  │
│  │     User     │         │                  │                  │
│  │  Controller  │         │                  │                  │
│  └──────┬───────┘         │                  │                  │
│         │                 │                  │                  │
│         │  • Extract req data                                   │
│         │  • Call service methods                               │
│         │  • Handle errors                                      │
│         │  • Return HTTP response                               │
└─────────┼─────────────────┼──────────────────┼──────────────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICES (Business Logic)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │     Auth     │  │    Prompt    │  │     Post     │          │
│  │   Service    │  │   Service    │  │   Service    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐          │
│  │     User     │  │    Upload    │  │    Video     │          │
│  │   Service    │  │   Service    │  │   Service    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│         │  • Validation                                         │
│         │  • Business rules                                     │
│         │  • Data processing                                    │
│         │  • Third-party APIs                                   │
└─────────┼─────────────────┼──────────────────┼──────────────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                           MODELS                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │     User     │  │    Prompt    │  │     Post     │          │
│  │    Model     │  │    Model     │  │    Model     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│  ┌──────┴───────┐  ┌──────┴───────┐                             │
│  │    Follow    │  │   Comment    │                             │
│  │    Model     │  │    Model     │                             │
│  └──────┬───────┘  └──────┬───────┘                             │
│         │                  │                                     │
│         │  • Schema definition                                  │
│         │  • Validation rules                                   │
│         │  • Indexes                                            │
│         │  • Instance methods                                   │
└─────────┼─────────────────┼─────────────────────────────────────┘
          │                 │
          ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                            │
│                                                                  │
│  Collections: users, prompts, posts, follows, comments          │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
server/
│
├── index.js                    # Entry point, Express setup
│
├── routes/                     # Route definitions
│   ├── auth.js                # Auth routes
│   ├── prompts.js             # Prompt routes
│   ├── posts.js               # Post routes
│   └── users.js               # User routes
│
├── controllers/                # Request handlers (THIN)
│   ├── authController.js      # Auth endpoints
│   ├── promptController.js    # Prompt endpoints
│   ├── postController.js      # Post endpoints
│   └── userController.js      # User endpoints
│
├── services/                   # Business logic (FAT)
│   ├── authService.js         # Auth logic
│   ├── promptService.js       # Prompt logic
│   ├── postService.js         # Post logic
│   ├── userService.js         # User logic
│   ├── uploadService.js       # File upload logic
│   ├── videoService.js        # Video processing
│   └── emailService.js        # Email sending
│
├── models/                     # Database schemas
│   ├── User.js                # User schema
│   ├── Prompt.js              # Prompt schema
│   ├── Post.js                # Post schema
│   ├── Follow.js              # Follow schema
│   └── Comment.js             # Comment schema
│
├── middleware/                 # Request processing
│   └── auth.js                # JWT authentication
│
├── config/                     # Configuration
│   └── database.js            # DB config
│
├── utils/                      # Utilities
│   └── helpers.js             # Helper functions
│
├── uploads/                    # File storage
│   ├── posts/                 # Post media
│   ├── avatars/               # User avatars
│   └── thumbnails/            # Video thumbnails
│
├── .env                        # Environment variables
├── package.json               # Dependencies
├── ARCHITECTURE.md            # Architecture docs
└── FIXES.md                   # Fix summary
```

## Data Flow Examples

### Example 1: Get Prompts (Public)
```
1. GET /api/prompts?search=photo&type=video
2. → routes/prompts.js
3. → promptController.getPrompts()
4. → promptService.getPrompts({ search: 'photo', type: 'video' })
5. → Prompt.find({ ... }).lean()
6. ← Returns: { prompts: [...], total: 50, page: 1, pages: 5 }
7. ← Controller sends JSON response
```

### Example 2: Create Post (Protected)
```
1. POST /api/posts (with file + auth token)
2. → Middleware: CORS → Auth → Upload
3. → routes/posts.js
4. → postController.createPost()
5. → postService.createPost(userId, file, data)
6. → videoService.generateThumbnail() (if video)
7. → Post.save()
8. → User.findByIdAndUpdate() (increment postsCount)
9. ← Returns: { post: { ... } }
10. ← Controller sends 201 Created
```

### Example 3: Login User
```
1. POST /api/auth/login { email, password }
2. → routes/auth.js
3. → authController.login()
4. → authService.login(email, password)
5. → User.findOne({ email })
6. → user.comparePassword(password)
7. → jwt.sign({ userId })
8. ← Returns: { token: '...', user: { ... } }
9. ← Controller sends JSON response
```

## Error Flow

```
Service throws error
    ↓
Controller catches error
    ↓
Maps to HTTP status code
    ↓
Sends JSON error response
    ↓
Client receives error
```

### Example Error Flow
```javascript
// Service
throw new Error('User not found');

// Controller
catch (error) {
    if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
}

// Client receives
{
    "error": "User not found"
}
```

## Authentication Flow

```
1. User registers → OTP sent
2. User verifies OTP → JWT issued
3. User stores JWT in localStorage
4. User makes request with JWT in header
5. Middleware verifies JWT
6. Middleware attaches user to req.user
7. Controller accesses req.user._id
8. Service uses userId for operations
```

## Key Principles

1. **Single Responsibility**: Each layer does one thing
2. **Dependency Injection**: Services are injected into controllers
3. **Error Handling**: Errors bubble up from services to controllers
4. **Validation**: Input validation in services
5. **Authorization**: Ownership checks in services
6. **Separation**: Business logic separate from HTTP layer
