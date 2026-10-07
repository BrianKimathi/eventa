import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('client_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getPublishedEvents = async () => {
  const response = await api.get('/public/events');
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/public/events/${id}`);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const purchaseTicket = async (purchaseData) => {
  const response = await api.post('/users/me/tickets/purchase', purchaseData);
  return response.data;
};

export const getMyTickets = async () => {
  const response = await api.get('/users/me/tickets');
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post('/creator/events', eventData);
  return response.data;
};

export const getCreatorEvents = async () => {
  const response = await api.get('/creator/events');
  return response.data;
};

export const getPlatformSettings = async () => {
  const response = await api.get('/public/settings');
  return response.data;
};

export default api;
