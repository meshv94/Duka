import React from 'react';
import { Box, Button, Badge, Fab } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

/**
 * Floating Cart Button Component
 * Displays a sticky button at the bottom with cart count and directs to checkout
 */
const FloatingCartButton = () => {
  const navigate = useNavigate();
  const { getCartTotals } = useCartContext();
  const { totalItems } = getCartTotals();

  if (totalItems === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 999,
      }}
    >
      <Fab
        color="primary"
        onClick={() => navigate('/cart')}
        sx={{
          backgroundColor: '#667eea',
          width: 80,
          height: 80,
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#5568d3',
            transform: 'scale(1.1)',
            boxShadow: '0 12px 32px rgba(102, 126, 234, 0.6)',
          },
        }}
      >
        <Badge
          badgeContent={totalItems}
          color="error"
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#ff6b6b',
              fontWeight: 700,
              fontSize: '0.8rem',
            },
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 40 }} />
        </Badge>
      </Fab>
    </Box>
  );
};

export default FloatingCartButton;
