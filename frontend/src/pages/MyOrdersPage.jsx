import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Fade,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  Avatar,
  Stack,
  Button,
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Store as StoreIcon,
  Phone as PhoneIcon,
  Receipt as ReceiptIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await apiClient.get('/app/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.message || 'Failed to load orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setTimeout(() => setSelectedOrder(null), 200);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed':
        return { bg: '#e3f2fd', color: '#1976d2' };
      case 'Delivered':
        return { bg: '#e8f5e9', color: '#2e7d32' };
      case 'Cancelled':
        return { bg: '#ffebee', color: '#c62828' };
      case 'Refunded':
        return { bg: '#fff3e0', color: '#e65100' };
      default:
        return { bg: '#f5f5f5', color: '#616161' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading State
  if (loading) {
    return (
      <Container sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#667eea' }} />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading your orders...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, md: 4 }, px: { xs: 1, md: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: 'rgba(102, 126, 234, 0.1)',
              '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' },
            }}
          >
            <ArrowBackIcon sx={{ color: '#667eea' }} />
          </IconButton>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              My Orders
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
              Track and manage all your orders
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Fade in>
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: '12px' }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Empty State */}
      {orders.length === 0 ? (
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', py: { xs: 4, md: 8 } }}>
            <Box
              sx={{
                width: { xs: 120, md: 160 },
                height: { xs: 120, md: 160 },
                margin: '0 auto',
                mb: 3,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
              }}
            >
              <ShoppingBagIcon sx={{ fontSize: { xs: 60, md: 80 }, color: '#fff' }} />
            </Box>
            <Typography
              variant="h5"
              sx={{ mb: 2, fontWeight: 700, fontSize: { xs: '1.5rem', md: '1.75rem' } }}
            >
              No Orders Yet
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              Start ordering delicious food from our vendors!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/vendors')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #653a8a 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                },
              }}
            >
              Browse Vendors
            </Button>
          </Box>
        </Fade>
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {orders.map((order, index) => {
            const statusStyle = getStatusColor(order.status);
            return (
              <Grid item xs={12} sm={6} md={4} key={order._id}>
                <Fade in timeout={400 + index * 100}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      '&:hover': {
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                    onClick={() => handleOrderClick(order)}
                  >
                    <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                      {/* Order Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                          >
                            Order ID
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {order._id}
                          </Typography>
                        </Box>
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            ml: 1,
                          }}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Vendor Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Avatar
                          src={order.vendor?.vendor_image}
                          sx={{ width: 40, height: 40 }}
                        >
                          <StoreIcon />
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {order.vendor?.name || 'Unknown Vendor'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {order.total_quantity} {order.total_quantity === 1 ? 'item' : 'items'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Order Date */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(order.createdAt)}
                        </Typography>
                      </Box>

                      {/* Delivery Date */}
                      {order.delivery_date && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="textSecondary">
                            Delivery: {formatDate(order.delivery_date)}
                          </Typography>
                        </Box>
                      )}

                      <Divider sx={{ my: 2 }} />

                      {/* Total Amount */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1.5,
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Total Amount
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          ₹{order.total_payable_amount?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>

                      {/* View Details Button */}
                      <Button
                        fullWidth
                        size="small"
                        sx={{
                          mt: 2,
                          color: '#667eea',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                          },
                        }}
                      >
                        View Details →
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            m: { xs: 2, sm: 3 },
          },
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Order Details
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  ID: {selectedOrder._id}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={selectedOrder.status}
                  sx={{
                    backgroundColor: getStatusColor(selectedOrder.status).bg,
                    color: getStatusColor(selectedOrder.status).color,
                    fontWeight: 700,
                  }}
                />
                <IconButton onClick={handleCloseDetails}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              {/* Vendor Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#667eea' }}>
                  Vendor Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Avatar src={selectedOrder.vendor?.vendor_image} sx={{ width: 56, height: 56 }}>
                    <StoreIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {selectedOrder.vendor?.name || 'Unknown Vendor'}
                    </Typography>
                    {selectedOrder.vendor?.mobile_number && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="textSecondary">
                          {selectedOrder.vendor.mobile_number}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Delivery Address */}
              {selectedOrder.address && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#667eea' }}>
                    Delivery Address
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <LocationIcon sx={{ fontSize: 20, color: '#667eea', mt: 0.2 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {selectedOrder.address.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {selectedOrder.address.address}
                        </Typography>
                        {(selectedOrder.address.city || selectedOrder.address.pincode) && (
                          <Typography variant="body2" color="textSecondary">
                            {selectedOrder.address.city}
                            {selectedOrder.address.pincode && ` - ${selectedOrder.address.pincode}`}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Order Items */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#667eea' }}>
                  Order Items ({selectedOrder.total_quantity})
                </Typography>
                <Stack spacing={1}>
                  {selectedOrder.items.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        bgcolor: index % 2 === 0 ? '#fafafa' : '#fff',
                        borderRadius: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <Avatar
                          src={item.product?.image}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        >
                          <ReceiptIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ₹{item.special_price || item.main_price} × {item.quantity}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#667eea' }}>
                        ₹{item.item_total.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Order Dates */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#667eea' }}>
                  Order Timeline
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Order Placed
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                        {formatDateTime(selectedOrder.createdAt)}
                      </Typography>
                    </Box>
                  </Grid>
                  {selectedOrder.delivery_date && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="caption" color="textSecondary">
                          Delivery Date
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                          {formatDate(selectedOrder.delivery_date)}
                          {selectedOrder.delivery_time && ` (${selectedOrder.delivery_time})`}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>

              {/* Price Breakdown */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#667eea' }}>
                  Price Breakdown
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="textSecondary">
                      Subtotal
                    </Typography>
                    <Typography variant="body2">₹{selectedOrder.subtotal?.toFixed(2)}</Typography>
                  </Box>
                  {selectedOrder.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="textSecondary">
                        Discount
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                        -₹{selectedOrder.discount?.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="textSecondary">
                      Packaging Charge
                    </Typography>
                    <Typography variant="body2">₹{selectedOrder.packaging_charge?.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="textSecondary">
                      Delivery Charge
                    </Typography>
                    <Typography variant="body2">₹{selectedOrder.delivery_charge?.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="textSecondary">
                      Convenience Charge
                    </Typography>
                    <Typography variant="body2">₹{selectedOrder.convenience_charge?.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Total Paid
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      ₹{selectedOrder.total_payable_amount?.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MyOrdersPage;
