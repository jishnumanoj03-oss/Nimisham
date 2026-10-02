import api from './api';

const analyticsService = {
  getCreatorStats: async () => {
    const response = await api.get('/analytics/creator');
    return response.data;
  },
};

export default analyticsService;
