import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, IconButton, Badge, Stack, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { getCartTotals } = useCartContext();
  const { totalItems } = getCartTotals();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    // Clear cart data
    localStorage.removeItem('deliveryCart');

    // Close drawer and redirect to login
    setDrawerOpen(false);
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fafbfc' }}>
      {/* Header/AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 24px rgba(102, 126, 234, 0.15)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              px: { xs: 0, sm: 2 },
              py: { xs: 1, sm: 1.5 },
              minHeight: { xs: 64, sm: 70 },
            }}
          >
            {/* Logo Section */}
            <Box
              onClick={() => navigate('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  mr: 1.5,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <LocalShippingIcon
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '1.7rem' },
                    color: '#fff',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
              >
                DeliveryApp
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Action Buttons */}
            <Stack direction="row" spacing={1.5}>
              {/* Cart Button with Badge */}
              <IconButton
                color="inherit"
                onClick={() => navigate('/cart')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  width: { xs: 44, sm: 48 },
                  height: { xs: 44, sm: 48 },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'scale(1.08)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Badge
                  badgeContent={totalItems}
                  color="error"
                  overlap="circular"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      minWidth: '20px',
                      height: '20px',
                      padding: '0 4px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: { xs: '1.3rem', sm: '1.4rem' } }} />
                </Badge>
              </IconButton>

              {/* Settings Button */}
              <IconButton
                color="inherit"
                onClick={toggleDrawer(true)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  width: { xs: 44, sm: 48 },
                  height: { xs: 44, sm: 48 },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'scale(1.08)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <SettingsIcon sx={{ fontSize: { xs: '1.3rem', sm: '1.4rem' } }} />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: 280, sm: 320 },
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
          },
        }}
      >
        <Box
          sx={{ width: { xs: 280, sm: 320 } }}
          role="presentation"
        >
          {/* Drawer Header */}
          <Box
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              Settings
            </Typography>
            <IconButton
              onClick={toggleDrawer(false)}
              sx={{
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Menu Items */}
          <List sx={{ pt: 2 }}>
            {/* Profile */}
            <ListItemButton
              onClick={() => {
                setDrawerOpen(false);
                navigate('/profile');
              }}
              sx={{
                py: 2,
                px: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                  pl: 4,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PersonIcon sx={{ color: '#667eea', fontSize: '1.4rem' }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="Profile"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#1a1a1a',
                }}
              />
            </ListItemButton>

            <Divider sx={{ my: 1, mx: 2 }} />

            {/* Address */}
            <ListItemButton
              onClick={() => {
                setDrawerOpen(false);
                navigate('/address');
              }}
              sx={{
                py: 2,
                px: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                  pl: 4,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocationOnIcon sx={{ color: '#1976d2', fontSize: '1.4rem' }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="Address"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#1a1a1a',
                }}
              />
            </ListItemButton>

            <Divider sx={{ my: 1, mx: 2 }} />

            {/* My Orders */}
            <ListItemButton
              onClick={() => {
                setDrawerOpen(false);
                navigate('/my-orders');
              }}
              sx={{
                py: 2,
                px: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                  pl: 4,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingBagIcon sx={{ color: '#764ba2', fontSize: '1.4rem' }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="My Orders"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#1a1a1a',
                }}
              />
            </ListItemButton>

            <Divider sx={{ my: 1, mx: 2 }} />

            {/* Logout */}
            <ListItemButton
              onClick={handleLogout}
              sx={{
                py: 2,
                px: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(239, 83, 80, 0.08)',
                  pl: 4,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'rgba(239, 83, 80, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LogoutIcon sx={{ color: '#ef5350', fontSize: '1.4rem' }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#ef5350',
                }}
              />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
          borderTop: '1px solid #e8e8e8',
          py: { xs: 4, sm: 5 },
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            spacing={3}
            sx={{
              alignItems: 'center',
            }}
          >
            {/* Logo Section */}
            {/* <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                }}
              >
                <LocalShippingIcon
                  sx={{
                    fontSize: '1.3rem',
                    color: '#fff',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                DeliveryApp
              </Typography>
            </Box> */}

            {/* Tagline */}
            {/* <Typography
              variant="body2"
              sx={{
                color: '#666',
                textAlign: 'center',
                maxWidth: 500,
                lineHeight: 1.7,
                fontSize: '0.9rem',
              }}
            >
              Fast, reliable delivery from local vendors. Your favorite meals and products, delivered to your door.
            </Typography> */}

            {/* Divider */}
            <Box
              sx={{
                width: '100%',
                maxWidth: 600,
                height: '1px',
                background: 'linear-gradient(to right, transparent, #e0e0e0, transparent)',
              }}
            />

            {/* Copyright with heart */}
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#888',
                  fontSize: '0.85rem',
                }}
              >
                © 2025 DeliveryApp. Made with
              </Typography>
              <FavoriteIcon
                sx={{
                  fontSize: '1rem',
                  color: '#e74c3c',
                  animation: 'heartbeat 1.5s ease-in-out infinite',
                  '@keyframes heartbeat': {
                    '0%, 100%': {
                      transform: 'scale(1)',
                    },
                    '25%': {
                      transform: 'scale(1.1)',
                    },
                    '50%': {
                      transform: 'scale(1)',
                    },
                  },
                }}
              />
              {/* <Typography
                variant="body2"
                sx={{
                  color: '#888',
                  fontSize: '0.85rem',
                }}
              >
                for food lovers
              </Typography> */}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
