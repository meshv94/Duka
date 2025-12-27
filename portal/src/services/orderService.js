import apiClient from '../api/apiClient';

const orderService = {
  // Get all orders with optional filters
  getAllOrders: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.orderDate) {
      queryParams.append('orderDate', filters.orderDate);
    }
    if (filters.deliveryDate) {
      queryParams.append('deliveryDate', filters.deliveryDate);
    }
    if (filters.status) {
      queryParams.append('status', filters.status);
    }

    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get(endpoint);
  },

  // Get order by ID
  getOrderById: async (id) => {
    return await apiClient.get(`/orders/${id}`);
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    return await apiClient.put(`/orders/${id}/status`, { status });
  },

  // Get order statistics
  getOrderStats: async () => {
    return await apiClient.get('/orders/stats');
  },

  // Get orders by date range
  getOrdersByDateRange: async (startDate, endDate) => {
    return await apiClient.get(`/orders?startDate=${startDate}&endDate=${endDate}`);
  },
};

export default orderService;
