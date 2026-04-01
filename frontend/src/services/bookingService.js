import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token only if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  getUserBookings: async (userId) => {
    try {
      const response = await api.get('/bookings/user/' + userId);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  getAllBookings: async (filters = {}) => {
    try {
      const response = await api.get('/bookings', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  getBookingById: async (id) => {
    try {
      const response = await api.get('/bookings/' + id);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  updateBookingStatus: async (id, statusData) => {
    try {
      const response = await api.patch('/bookings/' + id + '/status', statusData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  cancelBooking: async (id) => {
    try {
      const response = await api.put('/bookings/' + id + '/cancel');
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  deleteBooking: async (id) => {
    try {
      const response = await api.delete('/bookings/' + id);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  }
};

export default bookingService;
