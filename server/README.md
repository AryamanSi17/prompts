# nano prompts Backend

Clean, scalable MVC architecture for the nano prompts API.

## Structure

```
server/
├── config/           # Configuration files
│   └── index.js     # Centralized config
├── controllers/      # Business logic
│   ├── authController.js
│   ├── postController.js
│   ├── promptController.js
│   └── userController.js
├── middleware/       # Custom middleware
│   └── auth.js      # Authentication middleware
├── models/          # Database models
│   ├── Comment.js
│   ├── Follow.js
│   ├── Post.js
│   ├── Prompt.js
│   └── User.js
├── routes/          # API routes
│   ├── auth.js
│   ├── posts.js
│   ├── prompts.js
│   └── users.js
├── services/        # External services
│   ├── uploadService.js
│   └── videoService.js
├── utils/           # Helper functions
│   └── helpers.js
└── index.js         # Entry point
```

## Features

- **MVC Architecture**: Clean separation of concerns
- **Scalable**: Modular design for easy expansion
- **No Comments**: Self-documenting code
- **Security**: JWT authentication, input validation
- **Error Handling**: Centralized error management
- **Self-Follow Prevention**: Users cannot follow themselves

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - Login
- `POST /api/auth/resend-otp` - Resend OTP

### Users
- `GET /api/users/search` - Search users
- `GET /api/users/:username` - Get user profile
- `PUT /api/users/profile` - Update profile (auth)
- `POST /api/users/:id/follow` - Follow user (auth)
- `DELETE /api/users/:id/follow` - Unfollow user (auth)

### Posts
- `GET /api/posts` - Get feed (auth)
- `POST /api/posts` - Create post (auth)
- `GET /api/posts/user/:username` - Get user posts
- `DELETE /api/posts/:id` - Delete post (auth)

### Prompts
- `GET /api/prompts` - Get prompts
- `POST /api/prompts` - Create prompt (auth)
- `GET /api/prompts/:id` - Get prompt by ID
- `PUT /api/prompts/:id` - Update prompt (auth)
- `DELETE /api/prompts/:id` - Delete prompt (auth)

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prompts
JWT_SECRET=your_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

## Running

```bash
npm start
```
