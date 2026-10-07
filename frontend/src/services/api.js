import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Public endpoints
export const getPublishedEvents = async () => {
  const response = await api.get('/public/events');
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/public/events/${id}`);
  return response.data;
};

// User endpoints
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

// Creator endpoints
export const createEvent = async (eventData) => {
  const response = await api.post('/creator/events', eventData);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/creator/events/${id}`, eventData);
  return response.data;
};

export const getCreatorEvents = async () => {
  const response = await api.get('/creator/events');
  return response.data;
};

export const getEventSalesSummary = async (id) => {
  const response = await api.get(`/creator/events/${id}/sales`);
  return response.data;
};

export const validateTicketCode = async (validationData) => {
  const response = await api.post('/creator/tickets/validate', validationData);
  return response.data;
};

// Admin endpoints
export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const toggleUserSuspension = async (userId, suspended) => {
  const response = await api.put(`/admin/users/${userId}/suspension?suspended=${suspended}`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/roles?role=${role}`);
  return response.data;
};

export const updateCreatorVerification = async (userId, status) => {
  const response = await api.put(`/admin/users/${userId}/creator-verification?status=${status}`);
  return response.data;
};

export const getAllAdminEvents = async () => {
  const response = await api.get('/admin/events');
  return response.data;
};

export const updateEventApproval = async (eventId, approvalData) => {
  const response = await api.put(`/admin/events/${eventId}/approval`, approvalData);
  return response.data;
};

export const configureCommission = async (commissionData) => {
  const response = await api.post('/admin/commissions', commissionData);
  return response.data;
};

export const getAdminOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const processAdminRefund = async (orderId) => {
  const response = await api.put(`/admin/orders/${orderId}/refund`);
  return response.data;
};

export const getPlatformSettings = async () => {
  const response = await api.get('/public/settings');
  return response.data;
};

export const getAdminSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateAdminSettings = async (settings) => {
  const response = await api.put('/admin/settings', settings);
  return response.data;
};

export default api;
