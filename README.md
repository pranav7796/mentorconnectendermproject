🌟 MentorConnect
Personalized Mentorship Platform built with the MERN Stack

MentorConnect is a full-stack web application that bridges the gap between students and mentors by providing personalized learning roadmaps, progress tracking, and direct mentorship.

This project demonstrates end-to-end MERN development, including authentication, CRUD operations, protected APIs, and a dynamic frontend dashboard.

🚀 Project Overview

“Empowering students to learn smarter with personalized mentorship.”

MentorConnect allows students to:

Find mentors by domain and experience

Access structured learning roadmaps

Track progress and receive feedback

And mentors to:

Create and manage learning roadmaps

Track student performance

Interact and guide students directly

🧩 Key Features
👨‍🎓 Student Side

🔍 Browse Mentors: Explore available mentors with details on expertise and experience.

🗺️ View Roadmaps: Get assigned learning paths with structured tasks and deadlines.

✅ Track Progress: Mark completed tasks and view performance statistics.

💬 Q&A System: Ask mentors questions and get personalized answers.

📊 Progress Reports: Receive mentor evaluations with feedback and scores.

🧑‍🏫 Mentor Side

🛠️ Roadmap Builder: Create custom roadmaps with videos, assignments, and tasks.

🧾 Student Management: Assign students and monitor progress.

💡 Respond to Queries: Interact through Q&A to support learning.

🧮 Evaluate Work: Provide feedback and grades for completed assignments.

⚙️ Tech Stack
Layer	Technology
Frontend	React 18, React Router, Axios, Vite, CSS
Backend	Node.js, Express.js
Database	MongoDB with Mongoose
Authentication	JWT (jsonwebtoken), bcryptjs
Validation & Security	express-validator, CORS
🏗️ System Architecture
Frontend (React)
   ↕ Axios (API Calls)
Backend (Node + Express)
   ↕ Mongoose (ODM)
Database (MongoDB)

🗂️ Project Structure
MentorConnect/
├── backend/
│   ├── config/           → Database connection
│   ├── controllers/      → Business logic for Auth, Mentor, Roadmap
│   ├── middleware/       → JWT Authentication middleware
│   ├── models/           → MongoDB schemas
│   ├── routes/           → Express route definitions
│   ├── scripts/          → Database seeding script
│   ├── .env.example      → Environment variables template
│   └── server.js         → App entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/   → UI components (Navbar, etc.)
│   │   ├── pages/        → Page components (Login, Dashboards)
│   │   ├── services/     → API service layer
│   │   └── main.jsx      → App entry point
│   ├── public/           → Static assets
│   └── vite.config.js    → Vite setup
└── README.md

🔐 Authentication Flow

🔏 Passwords hashed using bcrypt before storage

🪪 JWT tokens issued on login and stored in localStorage

🧭 Protected routes validated using middleware

🔒 Role-based access (student/mentor) enforced for route protection

🧠 Database Models
🧑‍💻 User Model
Field	Type	Description
name	String	User’s name
email	String	Unique email ID
password	String	Hashed password
role	String	“student” or “mentor”
domain	String	Mentor’s area of expertise
experience	String	Mentor experience
bio	String	Mentor profile summary
🗺️ RoadmapItem Model
Field	Type	Description
title	String	Roadmap title
description	String	Roadmap overview
student	ObjectId	Reference to Student
mentor	ObjectId	Reference to Mentor
status	Enum	pending / in-progress / completed
tasks	Array	List of tasks with completion status
videos	Array	Resource links
assignments	Array	Assignments and submissions
questions	Array	Q&A between student and mentor
score	Number	Mentor-assigned score
feedback	String	Mentor feedback
💻 Installation & Setup
1️⃣ Clone the Repository
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

Start Backend:

cd backend
npm run dev


Start Frontend:

cd frontend
npm run dev


🔗 Backend runs on: http://localhost:5000
🌐 Frontend runs on: http://localhost:3000

🌱 Optional: Database Seed

Populate database with sample mentors, students, and roadmaps:

cd backend
npm run seed


Sample Accounts

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
GET	/api/roadmap	Get all user roadmaps
POST	/api/roadmap	Create roadmap (mentor)
PUT	/api/roadmap/:id	Update roadmap
DELETE	/api/roadmap/:id	Delete roadmap (mentor)
POST	/api/roadmap/:id/question	Add question (student)
PUT	/api/roadmap/:id/question/:questionId	Answer question (mentor)
💡 Usage Guide
👨‍🎓 For Students

Register and login

Browse mentors

Join a roadmap

Complete assigned tasks

Ask questions

Track scores and feedback

🧑‍🏫 For Mentors

Register and login

Create custom roadmaps

Assign students

Track their progress

Evaluate submissions and reply to queries

🧩 Development Notes

Modular architecture (controllers, models, routes separated)

Express error handling middleware

React components designed for reusability

Axios service layer for clean API integration

🧭 Deployment Guide
🗄️ Backend

Host on Render / Railway / Heroku

Set environment variables in deployment settings

Use MongoDB Atlas for production DB

🌐 Frontend

Build production version:

npm run build


Deploy /dist folder to Netlify / Vercel

Update API base URL in api.js

🧰 Troubleshooting
Issue	Solution
MongoDB not connecting	Check MONGO_URI, ensure MongoDB service is running
Port in use	Change PORT in .env
CORS error	Ensure backend CORS middleware is enabled
Login fails	Check bcrypt hash or JWT secret consistency
🧾 License

Licensed under the MIT License – free to use for learning, modification, and development.

Built By
Pranav Bharadwaj
