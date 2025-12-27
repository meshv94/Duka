import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  Store as StoreIcon,
  ShoppingCart as CartIcon,
  LocalShipping as DeliveryIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  PendingActions as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import dashboardService from '../services/dashboardService';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography color="text.secondary" gutterBottom sx={{ fontSize: 14, fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 800, mb: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getDashboardOverview();

      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      Placed: 'info',
      Delivered: 'success',
      Cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>
          Dashboard Overview
        </Typography>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  const { overview, today, thisMonth, topVendors, topProducts, topUsers, dailyOrders, recentOrders } =
    dashboardData || {};

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening with your business today.
        </Typography>
      </Box>

      {/* Main Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(overview?.totalRevenue || 0)}
            icon={<MoneyIcon fontSize="large" />}
            color="#43e97b"
            subtitle={`Today: ${formatCurrency(today?.revenue || 0)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={overview?.totalOrders || 0}
            icon={<CartIcon fontSize="large" />}
            color="#667eea"
            subtitle={`Today: ${today?.orders || 0} orders`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Vendors"
            value={overview?.totalVendors || 0}
            icon={<StoreIcon fontSize="large" />}
            color="#f093fb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={overview?.totalUsers || 0}
            icon={<PeopleIcon fontSize="large" />}
            color="#4facfe"
          />
        </Grid>
      </Grid>

      {/* Secondary Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: '#ffa726', width: 48, height: 48 }}>
                  <PendingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {overview?.pendingOrders || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pending Orders
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: '#66bb6a', width: 48, height: 48 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {overview?.deliveredOrders || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Delivered Orders
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: '#ef5350', width: 48, height: 48 }}>
                  <CancelIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {overview?.cancelledOrders || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cancelled Orders
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: '#42a5f5', width: 48, height: 48 }}>
                  <DeliveryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {today?.deliveries || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Today's Deliveries
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Daily Orders Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Daily Orders (Last 7 Days)
            </Typography>
            <Box sx={{ minHeight: 300 }}>
              {dailyOrders && dailyOrders.length > 0 ? (
                <Box>
                  {dailyOrders.map((day, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(day.date)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {day.count} orders - {formatCurrency(day.revenue)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          height: 8,
                          bgcolor: '#f0f0f0',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${Math.min((day.count / Math.max(...dailyOrders.map((d) => d.count))) * 100, 100)}%`,
                            height: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No data available</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Top Vendors */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Top Vendors
            </Typography>
            <List>
              {topVendors && topVendors.length > 0 ? (
                topVendors.map((vendor, index) => (
                  <React.Fragment key={vendor._id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: '#667eea',
                            width: 40,
                            height: 40,
                            fontSize: '1rem',
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {vendor.name}
                          </Typography>
                        }
                        secondary={
                          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {vendor.totalOrders} orders
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#43e97b' }}>
                              {formatCurrency(vendor.totalRevenue)}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                    {index < topVendors.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No vendors data available
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Top Products
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Sold</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts && topProducts.length > 0 ? (
                    topProducts.map((product, index) => (
                      <TableRow key={product._id} hover>
                        <TableCell>
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{
                              bgcolor: '#667eea',
                              color: '#fff',
                              fontWeight: 700,
                              width: 40,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {product.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{product.totalQuantity} units</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#43e97b' }}>
                            {formatCurrency(product.totalRevenue)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No products data available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Top Users */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Top Customers
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Orders</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Spent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topUsers && topUsers.length > 0 ? (
                    topUsers.map((user, index) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{
                              bgcolor: '#f093fb',
                              color: '#fff',
                              fontWeight: 700,
                              width: 40,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{user.totalOrders}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#43e97b' }}>
                            {formatCurrency(user.totalSpent)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No users data available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Recent Orders
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Vendor</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders && recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            #{order._id.slice(-8).toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{order.user?.name || 'N/A'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.user?.email || ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{order.vendor?.name || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{order.total_payable_amount?.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            size="small"
                            color={getStatusColor(order.status)}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No recent orders
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
