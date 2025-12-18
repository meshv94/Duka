import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Grid,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import apiClient from '../api/apiClient';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, clearCart } = useCartContext();
  const [checkoutData, setCheckoutData] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);

  // Call checkout API on page load
  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        setCheckoutLoading(true);
        setError(null);

        // Get cart from localStorage
        const cartData = JSON.parse(localStorage.getItem('deliveryCart') || '[]');

        // Check if cart is empty
        if (!cartData.cart || cartData.cart.length === 0) {
          setCheckoutLoading(false);
          return;
        }

        // Prepare checkout payload
        const checkoutPayload = {
          cart: cartData.cart || [],
        };

        // Get token from localStorage
        const token = localStorage.getItem('token');

        // Call checkout API with Bearer token
        const response = await apiClient.post('/app/checkout', checkoutPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Handle successful response
        if (response?.success) {
          setCheckoutData(response.data);
        } else {
          setError(response?.message || 'Failed to load checkout data.');
        }
      } catch (err) {
        console.error('Checkout error:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load checkout data. Please try again.'
        );
      } finally {
        setCheckoutLoading(false);
      }
    };

    if (cart.length > 0) {
      fetchCheckout();
    }
  }, [cart]);

  const handlePay = () => {
    // TODO: Implement payment logic
    console.log('Processing payment for orders:', checkoutData);
    alert('Payment functionality to be implemented');
  };

  const calculateGrandTotal = () => {
    if (!checkoutData || checkoutData.length === 0) return 0;
    return checkoutData.reduce((total, order) => total + (order.total_payable_amount || 0), 0);
  };

  if (loading || checkoutLoading) {
    return (
      <Container sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (cart.length === 0 || !checkoutData || checkoutData.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Your Cart is Empty
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Start adding items from vendors to build your order
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/vendors')}
            sx={{
              backgroundColor: '#667eea',
              '&:hover': { backgroundColor: '#5568d3' },
            }}
          >
            Browse Vendors
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Order Summary
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left: Order Details */}
        <Grid item xs={12} md={8}>
          {checkoutData.map((order, orderIndex) => (
            <Card key={order._id} sx={{ mb: 3 }}>
              <CardContent>
                {/* Vendor Header */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Order #{orderIndex + 1}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
                  Order ID: {order._id}
                </Typography>

                {/* Products Table */}
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>Qty</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.product}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.name}
                            </Typography>
                            {item.special_price && item.special_price < item.main_price && (
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Typography
                                  variant="caption"
                                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                >
                                  ${item.main_price.toFixed(2)}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                  ${item.special_price.toFixed(2)}
                                </Typography>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">
                            ${(item.special_price || item.main_price).toFixed(2)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            ${item.item_total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider sx={{ my: 2 }} />

                {/* Order Pricing Summary */}
                <Box sx={{ px: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Subtotal:</Typography>
                    <Typography variant="body2">${order.subtotal.toFixed(2)}</Typography>
                  </Box>
                  {order.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">Discount:</Typography>
                      <Typography variant="body2" sx={{ color: '#4caf50' }}>
                        -${order.discount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Packaging Charge:</Typography>
                    <Typography variant="body2">${order.packaging_charge.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Delivery Charge:</Typography>
                    <Typography variant="body2">${order.delivery_charge.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">Convenience Charge:</Typography>
                    <Typography variant="body2">${order.convenience_charge.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total Payable:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                      ${order.total_payable_amount.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                    Total Quantity: {order.total_quantity} items
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Right: Payment Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Payment Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Orders:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {checkoutData.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Items:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {checkoutData.reduce((total, order) => total + order.total_quantity, 0)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Grand Total:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                    ${calculateGrandTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handlePay}
                sx={{
                  backgroundColor: '#667eea',
                  fontWeight: 600,
                  padding: '14px',
                  '&:hover': {
                    backgroundColor: '#5568d3',
                  },
                }}
              >
                Pay Now
              </Button>

              <Button
                variant="outlined"
                fullWidth
                size="small"
                onClick={() => navigate('/vendors')}
                sx={{ mt: 2 }}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
