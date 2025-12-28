import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  Divider,
  Stack,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  LocalShipping as DeliveryIcon,
  ShoppingCart as OrderIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Store as StoreIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import orderService from '../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dialog states
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Cancel dialog states
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    orderDate: '',
    deliveryDate: '',
  });

  // Statistics
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayDeliveries: 0,
    totalOrders: 0,
  });

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getAllOrders(filters);

      if (response.success) {
        setOrders(response.data || []);
        calculateStats(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (ordersList) => {
    const today = new Date().toISOString().split('T')[0];

    const todayOrders = ordersList.filter(
      (order) => new Date(order.createdAt).toISOString().split('T')[0] === today
    ).length;

    const todayDeliveries = ordersList.filter(
      (order) => order.deliveryDate && order.deliveryDate.split('T')[0] === today
    ).length;

    setStats({
      todayOrders,
      todayDeliveries,
      totalOrders: ordersList.length,
    });
  };

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingDetails(true);
      const response = await orderService.getOrderById(orderId);

      if (response.success) {
        setOrderDetails(response.data);
      } else {
        setError(response.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle view order details
  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    setDetailsDialog(true);
    await fetchOrderDetails(order._id);
  };

  // Handle close details dialog
  const handleCloseDetails = () => {
    setDetailsDialog(false);
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    fetchOrders();
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      orderDate: '',
      deliveryDate: '',
    });
    setTimeout(() => {
      fetchOrders();
    }, 100);
  };

  // Handle mark as delivered
  const handleMarkAsDelivered = async () => {
    if (!orderDetails) return;

    try {
      setProcessingAction(true);
      setError(null);

      const response = await orderService.markAsDelivered(orderDetails._id);

      if (response.success) {
        setSuccess('Order marked as delivered successfully');
        setDetailsDialog(false);
        fetchOrders();
        setOrderDetails(null);
      } else {
        setError(response.message || 'Failed to mark order as delivered');
      }
    } catch (err) {
      console.error('Error marking order as delivered:', err);
      setError(err.response?.data?.message || 'Failed to mark order as delivered');
    } finally {
      setProcessingAction(false);
    }
  };

  // Handle open cancel dialog
  const handleOpenCancelDialog = () => {
    setCancelDialog(true);
  };

  // Handle close cancel dialog
  const handleCloseCancelDialog = () => {
    setCancelDialog(false);
    setCancelReason('');
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!orderDetails) return;

    if (!cancelReason.trim()) {
      setError('Please provide a cancellation reason');
      return;
    }

    try {
      setProcessingAction(true);
      setError(null);

      const response = await orderService.cancelOrder(orderDetails._id, cancelReason);

      if (response.success) {
        setSuccess('Order cancelled successfully');
        setCancelDialog(false);
        setDetailsDialog(false);
        fetchOrders();
        setOrderDetails(null);
        setCancelReason('');
      } else {
        setError(response.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setProcessingAction(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      ready: 'secondary',
      out_for_delivery: 'info',
      delivered: 'success',
      cancelled: 'error',
    };
    return statusColors[status] || 'default';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date only
  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Orders Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            View and manage all customer orders
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    {stats.totalOrders}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Orders
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
                  <OrderIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: '#fff',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    {stats.todayOrders}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Orders Placed Today
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: '#fff',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    {stats.todayDeliveries}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Deliveries for Today
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
                  <DeliveryIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Filters
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Order Date"
              type="date"
              size="small"
              value={filters.orderDate}
              onChange={(e) => handleFilterChange('orderDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Delivery Date"
              type="date"
              size="small"
              value={filters.deliveryDate}
              onChange={(e) => handleFilterChange('deliveryDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleApplyFilters}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Apply Filters
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button fullWidth variant="outlined" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Orders Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vendor</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Order Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Delivery Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{order.user?.name || 'N/A'}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {order.user?.email || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={order.vendor?.vendor_image} sx={{ width: 32, height: 32 }}>
                          <StoreIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {order.vendor?.name || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{formatDateOnly(order.delivery_date)}</TableCell>
                    <TableCell>{order.items?.length || 0} items</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{order.total_payable_amount?.toFixed(2) || '0.00'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status || 'pending'}
                        size="small"
                        color={getStatusColor(order.status)}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOrder(order)}
                          sx={{ color: '#667eea' }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Order Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Order Details
          </Typography>
          <IconButton onClick={handleCloseDetails} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetails ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : orderDetails ? (
            <Box>
              {/* Order Info */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f5f7fa' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Order Information
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">
                          Order ID:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          #{orderDetails._id.slice(-8).toUpperCase()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">
                          Order Date:
                        </Typography>
                        <Typography variant="body2">{formatDate(orderDetails.createdAt)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">
                          Delivery Date:
                        </Typography>
                        <Typography variant="body2">{formatDateOnly(orderDetails.deliveryDate)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">
                          Status:
                        </Typography>
                        <Chip
                          label={orderDetails.status}
                          size="small"
                          color={getStatusColor(orderDetails.status)}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      {orderDetails.status === 'Cancelled' && orderDetails.cancel_reason && (
                        <Box sx={{ mt: 2 }}>
                          <Alert severity="error" sx={{ borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                              Cancellation Reason:
                            </Typography>
                            <Typography variant="body2">{orderDetails.cancel_reason}</Typography>
                            {orderDetails.cancelled_at && (
                              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                                Cancelled on: {formatDate(orderDetails.cancelled_at)}
                              </Typography>
                            )}
                          </Alert>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f5f7fa' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Customer Information
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">{orderDetails.user?.name || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">{orderDetails.user?.mobile_number || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }} />
                        <Typography variant="body2">
                          {orderDetails.delivery_address?.address || 'N/A'}
                          {orderDetails.delivery_address?.city && `, ${orderDetails.delivery_address.city}`}
                          {orderDetails.delivery_address?.pincode && ` - ${orderDetails.delivery_address.pincode}`}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              {/* Vendor Information */}
              {orderDetails.vendor && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
                    Vendor Information
                  </Typography>
                  <Paper
                    sx={{
                      p: 2.5,
                      backgroundColor: '#f5f7fa',
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Avatar
                        src={orderDetails.vendor.vendor_image}
                        sx={{ width: 56, height: 56 }}
                      >
                        <StoreIcon />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {orderDetails.vendor.name || 'N/A'}
                        </Typography>
                        {orderDetails.vendor.email && (
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                            {orderDetails.vendor.email}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Stack spacing={1.5}>
                      {orderDetails.vendor.mobile_number && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 18, color: '#667eea' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {orderDetails.vendor.mobile_number}
                          </Typography>
                        </Box>
                      )}
                      {orderDetails.vendor.address && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <LocationIcon sx={{ fontSize: 18, color: '#667eea', mt: 0.2 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {orderDetails.vendor.address}
                          </Typography>
                        </Box>
                      )}
                      {(orderDetails.vendor.open_time || orderDetails.vendor.close_time) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimeIcon sx={{ fontSize: 18, color: '#667eea' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {orderDetails.vendor.open_time || 'N/A'} - {orderDetails.vendor.close_time || 'N/A'}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </Box>
              )}

              {/* Order Items */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Order Items
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetails.items?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product?.name || item.name || 'N/A'}</TableCell>
                          {/* <TableCell>₹{item.price?.toFixed(2) || '0.00'}</TableCell> */}
                          <TableCell>
                            ₹{
                              item.special_price > 0
                                ? item.special_price.toFixed(2)
                                : item.main_price?.toFixed(2) || "0.00"
                            }
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.item_total?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Price Breakdown */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Price Breakdown
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: '#f5f7fa' }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="textSecondary">
                        Subtotal:
                      </Typography>
                      <Typography variant="body2">₹{orderDetails.subtotal?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                    {orderDetails.discount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">
                          Discount:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'success.main' }}>
                          -₹{orderDetails.discount?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="textSecondary">
                        Packaging Charge:
                      </Typography>
                      <Typography variant="body2">₹{orderDetails.packaging_charge?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="textSecondary">
                        Delivery Charge:
                      </Typography>
                      <Typography variant="body2">₹{orderDetails.delivery_charge?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="textSecondary">
                        Convenience Charge:
                      </Typography>
                      <Typography variant="body2">₹{orderDetails.convenience_charge?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Total Payable:
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#667eea' }}>
                        ₹{orderDetails.total_payable_amount?.toFixed(2) || '0.00'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              No details available
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={handleCloseDetails} color="inherit">
            Close
          </Button>
          <Box sx={{ flex: 1 }} />
          {orderDetails && orderDetails.status !== 'Cancelled' && orderDetails.status !== 'Delivered' && (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleOpenCancelDialog}
                disabled={processingAction}
              >
                Cancel Order
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={handleMarkAsDelivered}
                disabled={processingAction}
                sx={{
                  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                }}
              >
                Mark as Delivered
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialog} onClose={handleCloseCancelDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Please provide a reason for cancelling this order:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Cancellation Reason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="e.g., Out of stock, Customer request, etc."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} disabled={processingAction}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelOrder}
            disabled={processingAction || !cancelReason.trim()}
          >
            {processingAction ? <CircularProgress size={24} /> : 'Confirm Cancellation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;
