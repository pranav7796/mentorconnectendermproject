require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const RoadmapItem = require('../models/RoadmapItem');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await RoadmapItem.deleteMany();
    console.log('Data cleared!');

    // Create students
    const students = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        role: 'student'
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        role: 'student'
      }
    ]);
    console.log('Students created!');

    // Create mentors
    const mentors = await User.create([
      {
        name: 'Dr. Sarah Williams',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'mentor',
        domain: 'Web Development',
        experience: 8,
        bio: 'Full-stack developer with 8 years of experience in building scalable web applications. Specialized in React, Node.js, and cloud technologies.'
      },
      {
        name: 'Prof. Michael Chen',
        email: 'michael@example.com',
        password: 'password123',
        role: 'mentor',
        domain: 'Data Science',
        experience: 10,
        bio: 'Data scientist and ML engineer with a decade of experience. Expert in Python, machine learning algorithms, and data visualization.'
      }
    ]);
    console.log('Mentors created!');

    // Create roadmap items
    const roadmapItems = await RoadmapItem.create([
      {
        title: 'React Fundamentals',
        description: 'Learn the basics of React including components, props, state, and hooks',
        student: students[0]._id,
        mentor: mentors[0]._id,
        status: 'in-progress',
        tasks: [
          { title: 'Complete React documentation tutorial', completed: true },
          { title: 'Build a todo app with React', completed: false },
          { title: 'Learn about React hooks', completed: false }
        ],
        videos: [
          { title: 'React Crash Course', url: 'https://youtube.com/react-crash-course' },
          { title: 'Understanding Hooks', url: 'https://youtube.com/react-hooks' }
        ],
        assignments: [
          { 
            title: 'Build a Weather App', 
            description: 'Create a weather app using React and an external API',
            completed: false 
          }
        ],
        questions: [
          {
            question: 'What is the difference between state and props?',
            answer: 'Props are passed to components from parent, while state is managed within the component itself.',
            askedAt: new Date()
          }
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        title: 'Node.js Backend Development',
        description: 'Master backend development with Node.js, Express, and MongoDB',
        student: students[0]._id,
        mentor: mentors[0]._id,
        status: 'pending',
        tasks: [
          { title: 'Set up Express server', completed: false },
          { title: 'Learn about middleware', completed: false },
          { title: 'Connect to MongoDB', completed: false }
        ],
        videos: [
          { title: 'Node.js Tutorial', url: 'https://youtube.com/nodejs-tutorial' }
        ],
        assignments: [
          { 
            title: 'Build a REST API', 
            description: 'Create a RESTful API with CRUD operations',
            completed: false 
          }
        ],
        questions: [],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days from now
      },
      {
        title: 'Python for Data Analysis',
        description: 'Learn Python programming and data analysis with pandas and numpy',
        student: students[1]._id,
        mentor: mentors[1]._id,
        status: 'in-progress',
        tasks: [
          { title: 'Learn Python basics', completed: true },
          { title: 'Master pandas library', completed: true },
          { title: 'Work with numpy arrays', completed: false }
        ],
        videos: [
          { title: 'Python Data Analysis', url: 'https://youtube.com/python-data-analysis' }
        ],
        assignments: [
          { 
            title: 'Analyze Sales Data', 
            description: 'Use pandas to analyze a sales dataset and create visualizations',
            completed: true 
          }
        ],
        questions: [],
        score: 85,
        feedback: 'Great work on the pandas assignment! Your analysis was thorough.',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
      },
      {
        title: 'Machine Learning Basics',
        description: 'Introduction to machine learning algorithms and scikit-learn',
        student: students[1]._id,
        mentor: mentors[1]._id,
        status: 'pending',
        tasks: [
          { title: 'Understand supervised learning', completed: false },
          { title: 'Learn about regression', completed: false },
          { title: 'Study classification algorithms', completed: false }
        ],
        videos: [
          { title: 'ML Fundamentals', url: 'https://youtube.com/ml-fundamentals' }
        ],
        assignments: [
          { 
            title: 'Build a Classification Model', 
            description: 'Create a model to classify iris flowers',
            completed: false 
          }
        ],
        questions: [],
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
      }
    ]);
    console.log('Roadmap items created!');

    console.log('\n=== Seed Data Summary ===');
    console.log(`Students: ${students.length}`);
    console.log(`Mentors: ${mentors.length}`);
    console.log(`Roadmap Items: ${roadmapItems.length}`);
    console.log('\nLogin credentials (all users):');
    console.log('Password: password123');
    console.log('\nStudents:');
    students.forEach(s => console.log(`  - ${s.email}`));
    console.log('\nMentors:');
    mentors.forEach(m => console.log(`  - ${m.email}`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
