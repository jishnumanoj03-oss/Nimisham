# Nimisham — Backend REST API

Node.js and Express.js RESTful API service for the Nimisham platform.

## Features & Endpoints Implemented

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new user account (User or Creator role)
- `POST /api/auth/login` — Authenticate and return JWT access token
- `GET /api/auth/me` — Get current logged-in user profile
- `POST /api/auth/forgot-password` — Request password reset token
- `POST /api/auth/reset-password/:token` — Reset password using token

### User Profile (`/api/users`)
- `GET /api/users/profile` — Get user profile details
- `PUT /api/users/profile` — Update user/creator profile fields (bio, avatar, socials, portfolio)
- `GET /api/users/:id` — Get public profile by User ID

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Validation**: Express Validator / Custom Middlewares

## Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nimisham
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## Scripts

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start
```
