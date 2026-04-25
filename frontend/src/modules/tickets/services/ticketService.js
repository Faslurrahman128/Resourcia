import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

const ticketService = {
  // Ticket CRUD operations
  createTicket: async (ticketData) => {
    console.log('Creating ticket with data:', ticketData);
    try {
      const response = await axios.post(`${API_BASE_URL}`, ticketData);
      console.log('Ticket creation response:', response);
      return response.data;
    } catch (error) {
      console.error('Ticket creation error:', error);
      throw error;
    }
  },

  getTicket: async (ticketId) => {
    const response = await axios.get(`${API_BASE_URL}/${ticketId}`);
    return response.data;
  },

  updateTicket: async (ticketId, ticketData) => {
    const response = await axios.put(`${API_BASE_URL}/${ticketId}`, ticketData);
    return response.data;
  },

  deleteTicket: async (ticketId) => {
    await axios.delete(`${API_BASE_URL}/${ticketId}`);
  },

  // Get tickets by various criteria
  getTicketsByUser: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data;
  },

  getTicketsByStatus: async (status) => {
    const response = await axios.get(`${API_BASE_URL}/status/${status}`);
    return response.data;
  },

  getTicketsByTechnician: async (technicianId) => {
    const response = await axios.get(`${API_BASE_URL}/technician/${technicianId}`);
    return response.data;
  },

  // Attachments
  addAttachment: async (ticketId, attachmentData) => {
    const response = await axios.post(`${API_BASE_URL}/${ticketId}/attachments`, attachmentData);
    return response.data;
  },

  removeAttachment: async (attachmentId) => {
    await axios.delete(`${API_BASE_URL}/attachments/${attachmentId}`);
  },

  // Comments
  addComment: async (ticketId, commentData) => {
    const response = await axios.post(`${API_BASE_URL}/${ticketId}/comments`, commentData);
    return response.data;
  },

  updateComment: async (commentId, comment, userId) => {
    const response = await axios.put(`${API_BASE_URL}/comments/${commentId}`, null, {
      params: { comment, userId }
    });
    return response.data;
  },

  deleteComment: async (commentId, userId) => {
    await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
      params: { userId }
    });
  },

  // Technician assignments
  assignTechnician: async (ticketId, assignmentData) => {
    const response = await axios.post(`${API_BASE_URL}/${ticketId}/assign`, assignmentData);
    return response.data;
  },

  updateAssignment: async (ticketId, status, workNotes, timeSpent, technicianId) => {
    const response = await axios.put(`${API_BASE_URL}/${ticketId}/assignment`, null, {
      params: { status, workNotes, timeSpent, technicianId }
    });
    return response.data;
  },

  // Get enum values
  getCategories: async () => {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  },

  getPriorities: async () => {
    const response = await axios.get(`${API_BASE_URL}/priorities`);
    return response.data;
  },

  getStatuses: async () => {
    const response = await axios.get(`${API_BASE_URL}/statuses`);
    return response.data;
  },

  getAssignmentStatuses: async () => {
    const response = await axios.get(`${API_BASE_URL}/assignment-statuses`);
    return response.data;
  }
};

export default ticketService;
