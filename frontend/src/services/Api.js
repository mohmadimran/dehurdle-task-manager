import axios from "axios";

// Backend Base URL
const API_URL = "https://dehurdle-task-manager.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Logout only if token exists and it has become invalid
    if (
      error.response?.status === 401 &&
      localStorage.getItem("token")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Auth APIs

export const register = (userData) => {
  return api.post("/api/auth/register", userData);
};

export const login = (credentials) => {
  return api.post("/api/auth/login", credentials);
};

// Task APIs

export const getTasks = (status = "") => {
  const url = status
    ? `/api/tasks?status=${status}`
    : "/api/tasks";

  return api.get(url);
};

export const createTask = (taskData) => {
  return api.post("/api/tasks", taskData);
};

export const updateTask = (id, taskData) => {
  return api.patch(`/api/tasks/${id}`, taskData);
};

export const deleteTask = (id) => {
  return api.delete(`/api/tasks/${id}`);
};

export default api;
