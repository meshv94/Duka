import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Zoom,
  Fade,
  Grow,
  Stack,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import apiClient from '../api/apiClient';
import confetti from 'canvas-confetti';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCartContext();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' or 'failed'
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');

      if (!sessionId) {
        setPaymentStatus('failed');
        setLoading(false);
        return;
      }

      try {
        // Get token
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        // Verify payment with backend
        const response = await apiClient.post(
          '/app/verify-stripe-payment',
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.success) {
          // Payment verified and order placed
          setPaymentStatus('success');

          // Clear cart from localStorage
          clearCart();

          // Trigger confetti animation
          const duration = 3000;
          const animationEnd = Date.now() + duration;
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

          function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }

          const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
          }, 250);
        } else {
          setPaymentStatus('failed');
          setError(response?.message || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setPaymentStatus('failed');
        setError(err.response?.data?.message || 'Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, clearCart, navigate]);

  if (loading) {
    return (
      <Container sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#667eea' }} />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Processing your payment...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <Container
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 4, md: 8 },
        }}
      >
        <Zoom in timeout={600}>
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 4, md: 6 },
              px: { xs: 2, md: 4 },
              width: '100%',
            }}
          >
            {/* Animated Success Icon */}
            <Box
              sx={{
                position: 'relative',
                width: { xs: 140, md: 180 },
                height: { xs: 140, md: 180 },
                margin: '0 auto',
                mb: 4,
              }}
            >
              <Zoom in timeout={800} style={{ transitionDelay: '200ms' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 15px 50px rgba(76, 175, 80, 0.4)',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%': {
                        transform: 'scale(1)',
                        boxShadow: '0 15px 50px rgba(76, 175, 80, 0.4)',
                      },
                      '50%': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 20px 60px rgba(76, 175, 80, 0.6)',
                      },
                      '100%': {
                        transform: 'scale(1)',
                        boxShadow: '0 15px 50px rgba(76, 175, 80, 0.4)',
                      },
                    },
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: 80, md: 100 },
                      color: '#fff',
                    }}
                  />
                </Box>
              </Zoom>
            </Box>

            {/* Success Message */}
            <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 2,
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'slideUp 0.8s ease-out',
                    '@keyframes slideUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
                >
                  Payment Successful!
                </Typography>
                <Typography
                  variant="h6"
                  color="textSecondary"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    fontWeight: 500,
                  }}
                >
                  Your order has been successfully placed
                </Typography>
              </Box>
            </Fade>

            {/* Animated Decorative Elements */}
            <Grow in timeout={1200} style={{ transitionDelay: '600ms' }}>
              <Box
                sx={{
                  mb: 4,
                  py: 3,
                  px: 2,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  border: '2px solid #bae6fd',
                }}
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{
                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                    lineHeight: 1.8,
                  }}
                >
                  Thank you for your payment! We're preparing your items and will have them delivered soon.
                </Typography>
              </Box>
            </Grow>

            {/* Action Buttons */}
            <Fade in timeout={1400} style={{ transitionDelay: '800ms' }}>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/my-orders')}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    px: { xs: 4, md: 5 },
                    py: { xs: 1.5, md: 2 },
                    borderRadius: '12px',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    textTransform: 'none',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #653a8a 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 40px rgba(102, 126, 234, 0.5)',
                    },
                  }}
                >
                  View My Orders
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/vendors')}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontWeight: 600,
                    px: { xs: 4, md: 5 },
                    py: { xs: 1.5, md: 2 },
                    borderRadius: '12px',
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#667eea',
                      backgroundColor: '#667eea10',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Continue Shopping
                </Button>
              </Stack>
            </Fade>
          </Box>
        </Zoom>
      </Container>
    );
  }

  // Payment Failed
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 8 },
      }}
    >
      <Zoom in timeout={600}>
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 4, md: 6 },
            px: { xs: 2, md: 4 },
            width: '100%',
          }}
        >
          {/* Error Icon */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: 140, md: 180 },
              height: { xs: 140, md: 180 },
              margin: '0 auto',
              mb: 4,
            }}
          >
            <Zoom in timeout={800} style={{ transitionDelay: '200ms' }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 15px 50px rgba(239, 83, 80, 0.4)',
                }}
              >
                <ErrorOutlineIcon
                  sx={{
                    fontSize: { xs: 80, md: 100 },
                    color: '#fff',
                  }}
                />
              </Box>
            </Zoom>
          </Box>

          {/* Error Message */}
          <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  background: 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Payment Failed
              </Typography>
              <Typography
                variant="h6"
                color="textSecondary"
                sx={{
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  fontWeight: 500,
                }}
              >
                Your payment was not successful
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Fade>

          {/* Action Buttons */}
          <Fade in timeout={1400} style={{ transitionDelay: '800ms' }}>
            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/cart')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  px: { xs: 4, md: 5 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: '12px',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  textTransform: 'none',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #653a8a 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.5)',
                  },
                }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/vendors')}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  fontWeight: 600,
                  px: { xs: 4, md: 5 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: '12px',
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#667eea',
                    backgroundColor: '#667eea10',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Continue Shopping
              </Button>
            </Stack>
          </Fade>
        </Box>
      </Zoom>
    </Container>
  );
};

export default PaymentSuccessPage;
