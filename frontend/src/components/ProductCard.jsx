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
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 2,
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: '#fff',
        overflow: 'hidden',
        border: '1px solid #f0f0f0',
        height: 'auto',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)',
          borderColor: '#667eea',
        },
      }}
    >
      {/* Content - Left Side */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '12px 14px',
          gap: 0.5,
          minWidth: 0,
        }}
      >
        {/* Product Name */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: '0.9rem',
            lineHeight: 1.3,
            color: '#1a1a1a',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 0.5,
          }}
        >
          {product.name}
        </Typography>

        {/* Description (optional) */}
        {product.description && (
          <Typography
            variant="caption"
            sx={{
              color: '#888',
              fontSize: '0.75rem',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 0.5,
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Price Section */}
        <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center', gap: 1, mb: 0.5 }}>
          {hasSpecialPrice ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: '#999',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                }}
              >
                INR {mainPrice.toFixed(2)}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: '#FF6B6B',
                  fontSize: '1rem',
                }}
              >
                INR {specialPrice.toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: '#667eea',
                fontSize: '1rem',
              }}
            >
              INR {mainPrice.toFixed(2)}
            </Typography>
          )}
        </Box>

        {/* Preparation Time & Cart Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {product.preparation_time_min && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimerIcon sx={{ fontSize: '0.9rem', color: '#ff9800' }} />
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 500, fontSize: '0.7rem' }}>
                {product.preparation_time_min} min
              </Typography>
            </Box>
          )}
          {cartQuantity > 0 && (
            <Chip
              label={`${cartQuantity} in cart`}
              size="small"
              sx={{
                backgroundColor: '#4CAF50',
                color: '#fff',
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 700,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}
        </Box>
      </CardContent>

      {/* Product Image with Button - Right Side */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Image */}
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
            overflow: 'hidden',
          }}
        >
          <CardMedia
            component="img"
            image={product.productImage || product.image || FALLBACK_PRODUCT_IMAGE}
            alt={product.name}
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#f5f5f5',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />

          {/* Special Price Badge - Top of Image */}
          {hasSpecialPrice && (
            <Box
              sx={{
                position: 'absolute',
                top: 6,
                left: 6,
                right: 6,
                backgroundColor: '#FF6B6B',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              Sale
            </Box>
          )}
        </Box>

        {/* Add Button - Below Image */}
        <Button
          variant="contained"
          size="small"
          fullWidth
          startIcon={<AddIcon sx={{ fontSize: '0.85rem' }} />}
          onClick={handleAddClick}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 0,
            padding: '6px 8px',
            fontSize: '0.7rem',
            boxShadow: 'none',
            minHeight: 'auto',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
            },
          }}
        >
          Add
        </Button>
      </Box>

      {/* Add to Cart Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          {product.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Price: <strong>INR {displayPrice.toFixed(2)}</strong>
            </Typography>
            {hasSpecialPrice && (
              <Typography variant="caption" sx={{ color: '#FF6B6B' }}>
                Save INR {(mainPrice - specialPrice).toFixed(2)}
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
