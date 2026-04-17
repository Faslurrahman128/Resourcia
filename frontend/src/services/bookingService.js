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

const buildUserHeaders = (user) => {
  if (!user) {
    return {};
  }

  return {
    'X-User-Id': String(user.id),
    'X-User-Role': String(user.role || 'USER')
  };
};

const bookingService = {
  createBooking: async (bookingData, user) => {
    try {
      const response = await api.post('/bookings', bookingData, {
        headers: buildUserHeaders(user)
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  getUserBookings: async (userId, user) => {
    try {
      const response = await api.get('/bookings/user/' + userId, {
        headers: buildUserHeaders(user)
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  getAllBookings: async (filters = {}, user) => {
    try {
      const response = await api.get('/bookings', {
        params: filters,
        headers: buildUserHeaders(user)
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  getBookingById: async (id, user) => {
    try {
      const response = await api.get('/bookings/' + id, {
        headers: buildUserHeaders(user)
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  updateBooking: async (id, bookingData, user) => {
    try {
      const response = await api.put('/bookings/' + id, bookingData, {
        headers: buildUserHeaders(user)
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  updateBookingStatus: async (id, statusData, user) => {
    try {
      const response = await api.patch('/bookings/' + id + '/status', statusData, {
        headers: buildUserHeaders(user)
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  cancelBooking: async (id, user) => {
    try {
      const response = await api.put('/bookings/' + id + '/cancel', {}, {
        headers: buildUserHeaders(user)
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  deleteBooking: async (id, user) => {
    try {
      const response = await api.delete('/bookings/' + id, {
        headers: buildUserHeaders(user)
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  }
};

export default bookingService;
