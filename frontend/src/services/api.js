import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Mentor API
export const mentorAPI = {
  getAllMentors: () => api.get('/mentors'),
  getMentorById: (id) => api.get(`/mentors/${id}`),
  getStudents: () => api.get('/mentors/students')
};

// Roadmap API
export const roadmapAPI = {
  getAllRoadmaps: () => api.get('/roadmap'),
  getRoadmapById: (id) => api.get(`/roadmap/${id}`),
  createRoadmap: (data) => api.post('/roadmap', data),
  updateRoadmap: (id, data) => api.put(`/roadmap/${id}`, data),
  deleteRoadmap: (id) => api.delete(`/roadmap/${id}`),
  addQuestion: (id, question) => api.post(`/roadmap/${id}/question`, { question }),
  answerQuestion: (id, questionId, answer) => api.put(`/roadmap/${id}/question/${questionId}`, { answer })
};

export default api;
