🌟 MentorConnect
Personalized Mentorship Platform built with the MERN Stack

MentorConnect is a full-stack web application that bridges the gap between students and mentors through personalized learning roadmaps, progress tracking, and direct mentorship.

💡 “Empowering students to learn smarter with personalized mentorship.”

🚀 Overview

MentorConnect enables:

👨‍🎓 Students to

Discover mentors by domain and experience

Access structured learning roadmaps

Track progress and receive feedback

🧑‍🏫 Mentors to

Create and manage custom roadmaps

Track student performance

Interact and guide students directly

🧩 Key Features
🎓 Student Dashboard

🔍 Browse Mentors: Explore mentors by expertise and experience.

🗺️ Learning Roadmaps: Follow structured learning paths with goals and tasks.

✅ Progress Tracking: Mark completed tasks and monitor overall progress.

💬 Q&A System: Ask mentors questions and get personalized replies.

📊 Performance Reports: View mentor evaluations and feedback.

🧑‍🏫 Mentor Dashboard

🛠️ Roadmap Builder: Add videos, assignments, and custom learning tasks.

🧾 Student Management: Assign and track multiple students.

💡 Respond to Queries: Support students through built-in Q&A.

🧮 Evaluate Work: Provide feedback and grades for each roadmap.

⚙️ Tech Stack
Layer	Technology
Frontend	React 18, React Router, Axios, Vite, CSS
Backend	Node.js, Express.js
Database	MongoDB with Mongoose
Authentication	JWT (jsonwebtoken), bcryptjs
Validation & Security	express-validator, CORS
🏗️ System Architecture
Frontend (React)
   ↕  Axios (API Calls)
Backend (Node + Express)
   ↕  Mongoose (ODM)
Database (MongoDB)

🗂️ Project Structure
MentorConnect/
├── backend/
│   ├── config/           → Database connection
│   ├── controllers/      → Business logic (Auth, Mentor, Roadmap)
│   ├── middleware/       → JWT Authentication middleware
│   ├── models/           → MongoDB schemas
│   ├── routes/           → Express route definitions
│   ├── scripts/          → Database seeding script
│   ├── .env.example      → Environment variables template
│   └── server.js         → App entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/   → Reusable UI components (Navbar, Cards, etc.)
│   │   ├── pages/        → Page views (Login, Dashboard, Mentor, etc.)
│   │   ├── services/     → API service layer
│   │   └── main.jsx      → App entry
│   ├── public/           → Static assets
│   └── vite.config.js    → Vite setup
└── README.md

🔐 Authentication Flow

🔏 Passwords are hashed using bcrypt before storage

🪪 JWT tokens are issued upon login and stored in localStorage

🧭 Protected routes validated via custom middleware

🔒 Role-based access for student and mentor dashboards

🧠 Database Models
🧑‍💻 User Model
Field	Type	Description
name	String	User’s name
email	String	Unique email ID
password	String	Hashed password
role	String	"student" or "mentor"
domain	String	Mentor’s area of expertise
experience	String	Years of experience
bio	String	Mentor profile summary
🗺️ RoadmapItem Model
Field	Type	Description
title	String	Roadmap title
description	String	Overview
student	ObjectId	Reference to Student
mentor	ObjectId	Reference to Mentor
status	Enum	pending / in-progress / completed
tasks	Array	List of tasks
videos	Array	Resource links
assignments	Array	Assignments and submissions
questions	Array	Q&A between student and mentor
score	Number	Mentor-assigned score
feedback	String	Mentor feedback
💻 Installation & Setup
1️⃣ Clone Repository
git clone <repository-url>
cd MentorConnect

2️⃣ Backend Setup
cd backend
npm install
cp .env.example .env


Edit .env:

PORT=5000
MONGO_URI=mongodb://localhost:27017/mentorconnect
JWT_SECRET=your_secure_secret
NODE_ENV=development

3️⃣ Frontend Setup
cd ../frontend
npm install

4️⃣ Run Application

Start Backend

cd backend
npm run dev


Start Frontend

cd frontend
npm run dev


🌐 Frontend: http://localhost:3000

🔗 Backend: http://localhost:5000

🌱 Optional: Database Seeding

To populate with sample data:

cd backend
npm run seed

Role	Email	Password
Student	alice@example.com
	password123
Student	bob@example.com
	password123
Mentor	sarah@example.com
	password123
Mentor	michael@example.com
	password123
🔌 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
GET	/api/auth/me	Get current user
🧑‍🏫 Mentors
Method	Endpoint	Description
GET	/api/mentors	Get all mentors
GET	/api/mentors/:id	Get mentor by ID
🗺️ Roadmaps
Method	Endpoint	Description
GET	/api/roadmap	Get user roadmaps
POST	/api/roadmap	Create roadmap (mentor)
PUT	/api/roadmap/:id	Update roadmap
DELETE	/api/roadmap/:id	Delete roadmap
POST	/api/roadmap/:id/question	Add question (student)
PUT	/api/roadmap/:id/question/:questionId	Answer question (mentor)
💡 Usage Guide
👨‍🎓 For Students

Register and login

Browse mentors

Join a roadmap

Complete assigned tasks

Ask questions

View scores and feedback

🧑‍🏫 For Mentors

Register and login

Create roadmaps

Assign students

Track progress

Evaluate submissions and reply to queries

🧩 Development Highlights

🧱 Modular architecture with separate controllers, routes, and models

⚙️ Express middleware for unified error handling

🎨 Reusable React components for UI consistency

🌐 Axios service layer for clean API management

🧭 Deployment
🗄️ Backend

Hosted on Render: https://mentorconnectendermproject.onrender.com

Use MongoDB Atlas for production DB

Configure environment variables on Render

🌐 Frontend

Deployed on Vercel: https://mentorconnectendermproject-almf3surd.vercel.app

Build production files:

npm run build


Deploy /dist folder to Vercel or Netlify

Update API base URL in api.js

🧰 Troubleshooting
Issue	Solution
MongoDB not connecting	Check MONGO_URI and ensure MongoDB service is active
Port in use	Change PORT in .env
CORS error	Ensure CORS middleware is enabled
Login fails	Verify bcrypt hash and JWT secret consistency
🧾 License

Licensed under the MIT License – free for use, learning, and development.

👨‍💻 Built By

Pranav Bharadwaj

Backend & Full-Stack Developer

🌍 Backend: Render Deployment:https://mentorconnectendermproject.onrender.com
💻 Frontend: Vercel Deployment:https://mentorconnectendermproject.vercel.app
