import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TimerIcon from '@mui/icons-material/Timer';
import { useCartContext } from '../context/CartContext';

// Fallback product image
const FALLBACK_PRODUCT_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f5f5f5" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3EProduct Image%3C/text%3E%3C/svg%3E';

/**
 * ProductCard Component
 * Displays individual product information with add to cart button
 * Allows quantity selection before adding to cart
 *
 * @param {object} product - Product data object
 * @param {string} vendorId - Vendor ID for the product
 * @param {function} onAddClick - Optional callback when add button is clicked
 */
const ProductCard = ({ product, vendorId, onAddClick }) => {
  const { addToCart, getProductQuantity } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });

  const cartQuantity = getProductQuantity(vendorId, product._id);

  const handleAddClick = (e) => {
    e.stopPropagation();
    setQuantity(1);
    setOpenDialog(true);
  };

  const handleAddToCart = () => {
    try {
      addToCart(vendorId, product, quantity);
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: `${quantity} item${quantity > 1 ? 's' : ''} added to cart!`,
        type: 'success',
      });

      // Call optional callback
      if (onAddClick) {
        onAddClick(product);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add to cart',
        type: 'error',
      });
    }
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Check if product has special price
  const hasSpecialPrice =
    product.special_price && product.special_price < product.main_price;

  // Use correct price fields
  const mainPrice = product.main_price || product.price || 0;
  const specialPrice = product.special_price || 0;

  const displayPrice = hasSpecialPrice ? specialPrice : mainPrice;

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: '#fff',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Product Image */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.productImage || product.image || FALLBACK_PRODUCT_IMAGE}
          alt={product.name}
          loading="lazy"
          sx={{
            objectFit: 'cover',
            backgroundColor: '#f5f5f5',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        {/* Special Price Badge */}
        {hasSpecialPrice && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: '#FF6B6B',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            Sale
          </Box>
        )}

        {/* Cart Badge - Show quantity if already in cart */}
        {cartQuantity > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: '#4CAF50',
              color: '#fff',
              width: 28,
              height: 28,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {cartQuantity}
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '14px',
          gap: 1,
        }}
      >
        {/* Product Name */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            lineHeight: 1.3,
            color: '#1a1a1a',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>

        {/* Description (optional) */}
        {product.description && (
          <Typography
            variant="caption"
            sx={{
              color: '#999',
              fontSize: '0.8rem',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Price Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
          {hasSpecialPrice ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: '#ccc',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                }}
              >
                ${mainPrice.toFixed(2)}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#FF6B6B',
                  fontSize: '1.05rem',
                }}
              >
                ${specialPrice.toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#667eea',
                fontSize: '1.05rem',
              }}
            >
              ${mainPrice.toFixed(2)}
            </Typography>
          )}
        </Box>

        {/* Preparation Time */}
        {product.preparationTime && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimerIcon sx={{ fontSize: '1rem', color: '#ff9800' }} />
            <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
              {product.preparationTime} min
            </Typography>
          </Box>
        )}

        {/* Add Button */}
        <Button
          variant="contained"
          size="small"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            mt: 1.5,
            backgroundColor: '#667eea',
            color: '#fff',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#5568d3',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            },
          }}
        >
          Add to Cart
        </Button>
      </CardContent>

      {/* Add to Cart Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          {product.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Price: <strong>${displayPrice.toFixed(2)}</strong>
            </Typography>
            {hasSpecialPrice && (
              <Typography variant="caption" sx={{ color: '#FF6B6B' }}>
                Save ${(mainPrice - specialPrice).toFixed(2)}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Quantity:</Typography>
            <IconButton size="small" onClick={decrementQuantity} disabled={quantity === 1}>
              <RemoveIcon />
            </IconButton>
            <TextField
              type="number"
              size="small"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1, max: 100, style: { textAlign: 'center', width: '50px' } }}
            />
            <IconButton size="small" onClick={incrementQuantity}>
              <AddIcon />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            variant="contained"
            sx={{
              backgroundColor: '#667eea',
              '&:hover': {
                backgroundColor: '#5568d3',
              },
            }}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ProductCard;
