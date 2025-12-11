import axios from 'axios';
import config from '../config';

const API_URL = `${config.apiBaseUrl}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: config.apiTimeout,
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
  answerQuestion: (id, questionId, answer) =>
    api.put(`/roadmap/${id}/question/${questionId}`, { answer }),
  submitTask: (roadmapId, taskId, submission) =>
    api.put(`/roadmap/${roadmapId}/tasks/${taskId}/submit`, submission),
  reviewTask: (roadmapId, taskId, review) =>
    api.put(`/roadmap/${roadmapId}/tasks/${taskId}/review`, review)
};

// Request API (Mentor-Student matching)
export const requestAPI = {
  getPendingRequests: () => api.get('/requests/pending'),
  sendRequest: (data) => api.post('/requests/send', data),
  respondToRequest: (requestId, data) => api.patch(`/requests/${requestId}/respond`, data)
};

// Chat API
export const chatAPI = {
  getMessages: (userId) => api.get(`/chat/${userId}`)
};

// Gamification API
export const gamificationAPI = {
  awardXP: (data) => api.post('/gamification/award-xp', data),
  awardBadge: (data) => api.post('/gamification/award-badge', data)
};

// Stats API
export const statsAPI = {
  getOverview: () => api.get('/mentors/stats/overview')
};

// Favorites API
export const favoritesAPI = {
  toggleFavorite: (mentorId) => api.post(`/mentors/${mentorId}/favorite`)
};

export default api;
