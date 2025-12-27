import apiClient from '../api/apiClient';

const dashboardService = {
  // Get dashboard overview data
  getDashboardOverview: async () => {
    return await apiClient.get('/dashboard/overview');
  },

  // Get revenue statistics
  getRevenueStats: async (period = '7days') => {
    return await apiClient.get(`/dashboard/revenue-stats?period=${period}`);
  },
};

export default dashboardService;
