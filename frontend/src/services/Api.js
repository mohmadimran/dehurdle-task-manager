import axios from 'axios';

const API_URL = "https://dehurdle-task-manager.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

// Task APIs
export const getTasks = (status = '') => {
  const url = status ? `/tasks?status=${status}` : '/tasks';
  return api.get(url);
};
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.patch(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;
