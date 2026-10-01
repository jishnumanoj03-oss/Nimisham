import api from './api';

const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (page = 1, limit = 20, search = '', role = '') => {
    let url = `/admin/users?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (role) url += `&role=${role}`;
    
    const response = await api.get(url);
    return response.data;
  },

  deleteContent: async (type, id) => {
    const response = await api.delete(`/admin/content/${type}/${id}`);
    return response.data;
  }
};

export default adminService;
