import api from './api';

const searchService = {
  globalSearch: async (params) => {
    // params can include: q, type, category, tag, sort, page, limit
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/search?${queryString}`);
    return response.data;
  }
};

export default searchService;
