import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const resourceService = {
  getAllResources: async () => {
    try {
      const response = await api.get('/resources');
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },
  getResourcesByBuilding: async (building) => {
    try {
      const response = await api.get(`/resources/building/${building}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },
};

export default resourceService;
