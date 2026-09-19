import api from './api';

export const sessionService = {
  getSessions: () => api.get('/sessions'),
  getSession: (id) => api.get(`/sessions/${id}`),
  createSession: (data) => api.post('/sessions', data),
  updateSession: (id, data) => api.put(`/sessions/${id}`, data),
  deleteSession: (id) => api.delete(`/sessions/${id}`)
};
