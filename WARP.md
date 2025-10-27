# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MentorConnect is a full-stack MERN application connecting students with mentors for personalized learning roadmaps. The monorepo contains separate backend (Express/MongoDB) and frontend (React/Vite) applications.

## Development Commands

### Backend (from `backend/` directory)
```bash
npm install              # Install dependencies
npm run dev              # Start with nodemon (hot reload)
npm start                # Start production server
npm run seed             # Seed database with sample data
```

### Frontend (from `frontend/` directory)
```bash
npm install              # Install dependencies
npm run dev              # Start Vite dev server (port 3000)
npm run build            # Build for production
npm run preview          # Preview production build
```

### Environment Setup
Backend requires `.env` file with:
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (must be strong in production)
- `NODE_ENV` - Environment (development/production)

Copy from `backend/.env.example` and configure before running.

## Architecture

### Authentication & Authorization Flow
1. **Registration/Login**: User creates account with role (student/mentor)
2. **JWT Token**: Issued on login, stored in localStorage
3. **Token Injection**: Axios interceptor in `frontend/src/services/api.js` adds `Bearer ${token}` to all requests
4. **Middleware Chain**: Backend uses `protect` → role-specific middleware (`mentorOnly`/`studentOnly`)
5. **User Attachment**: `protect` middleware attaches `req.user` (User document without password)

### Data Model Relationships
- **User Model**: Stores both students and mentors (discriminated by `role` field)
  - Mentors have additional fields: `domain`, `experience`, `bio`
  - Password hashed with bcrypt pre-save hook
- **RoadmapItem Model**: Links student and mentor via ObjectId references
  - Contains embedded arrays: `tasks`, `videos`, `assignments`, `questions`
  - Status progression: pending → in-progress → completed → evaluated
  - Mentors create/evaluate, students complete tasks and ask questions

### Request/Response Pattern
All API responses follow consistent structure:
```javascript
{ success: boolean, message: string, data: any, errors: any }
```

Error handling centralized in `server.js` middleware catches errors and formats consistently.

### Frontend State Management
- No global state library (Redux/Context) - uses local component state
- User state managed in `App.jsx`, passed via props
- Authentication state checked from localStorage on mount
- Role-based routing: students → `/student-dashboard`, mentors → `/mentor-dashboard`

### API Service Layer
`frontend/src/services/api.js` exports three modules:
- `authAPI` - Registration, login, user verification
- `mentorAPI` - Fetching mentor data
- `roadmapAPI` - Full CRUD + questions/answers

All use shared axios instance with interceptor for token injection.

### Vite Proxy Configuration
Frontend proxies `/api` requests to `http://localhost:5000` in development (see `vite.config.js`). In production, update `API_URL` in `api.js` to point to deployed backend.

## Key Design Patterns

### Role-Based Access Control (RBAC)
Routes protected by middleware chain:
1. `protect` - Verifies JWT, attaches `req.user`
2. `mentorOnly` / `studentOnly` - Checks `req.user.role`

Example: Only mentors can create roadmaps, only students can ask questions.

### Subdocument Completion Tracking
Tasks/assignments marked complete via updates to embedded arrays:
```javascript
roadmap.tasks[index].completed = true
```
Not separate collections - keeps data co-located for atomic updates.

### Conditional Schema Requirements
User model uses conditional validation:
```javascript
required: function() { return this.role === 'mentor'; }
```
Ensures mentors provide domain/experience/bio, but students don't need these fields.

## Testing Credentials (after `npm run seed`)
All passwords: `password123`

**Students**: alice@example.com, bob@example.com  
**Mentors**: sarah@example.com (Web Development), michael@example.com (Data Science)

## Common Workflows

### Adding New Roadmap Fields
1. Update `backend/models/RoadmapItem.js` schema
2. Update `backend/controllers/roadmapController.js` create/update logic
3. Update `frontend/src/services/api.js` if new endpoints needed
4. Update dashboard components (`MentorDashboard.jsx` / `StudentDashboard.jsx`)

### Adding New User Roles
Currently only student/mentor. To add new role:
1. Update User model `role` enum
2. Create new role-checking middleware in `backend/middleware/auth.js`
3. Add role-specific routes/controllers
4. Create dashboard component and route in `App.jsx`

### Modifying Authentication
JWT logic centralized:
- Generation: `backend/controllers/authController.js` (login/register)
- Verification: `backend/middleware/auth.js` (protect middleware)
- Storage: Frontend localStorage (`token` and `user` keys)

## Notes on Windows Development
This project uses CRLF line endings (Windows). Backend runs on Node.js, MongoDB must be installed or use MongoDB Atlas. PowerShell commands work as expected for npm scripts.
