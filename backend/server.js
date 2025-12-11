require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message');

// Import routes
const authRoutes = require('./routes/authRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const requestRoutes = require('./routes/requestRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const chatRoutes = require('./routes/chatRoutes'); // New Chat Routes

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://mentorconnectendermproject.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CORS_ORIGIN
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      'https://mentorconnectendermproject.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.CORS_ORIGIN
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('User joined socket:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room: ${userId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { senderId, receiverId, content } = data;

      // Save message to database
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content
      });

      // Emit to receiver's room
      io.to(receiverId).emit('receive_message', newMessage);

    } catch (error) {
      console.error('Socket message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', time: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/chat', chatRoutes); // Use Chat Routes

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'MentorConnect API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    errors: err.errors || null
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
