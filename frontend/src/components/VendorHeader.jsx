import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Button,
  IconButton,
  Avatar,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CallIcon from '@mui/icons-material/Call';
import ShareIcon from '@mui/icons-material/Share';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

/**
 * VendorHeader Component
 * Displays vendor information including banner, name, description, and meta info
 *
 * @param {object} vendor - Vendor data object
 */
const VendorHeader = ({ vendor }) => {
  const navigate = useNavigate();
  const [bannerError, setBannerError] = useState(false);
  const [showShareSnackbar, setShowShareSnackbar] = useState(false);

  if (!vendor) {
    return null;
  }

  // Format time (assuming HH:mm format)
  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  // Check if vendor is open
  const isOpen = vendor.isOpen !== false;

  // Format address
  const address =
    vendor.address ||
    (vendor.location ? `${vendor.location.city}, ${vendor.location.country}` : 'Address not available');

  // Get banner image URL or use fallback
  const bannerImage = vendor.vendor_image || vendor.banner;
  const hasBanner = bannerImage && !bannerError;

  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: vendor.name,
          text: `Check out ${vendor.name} on DeliveryApp!`,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareSnackbar(true);
  };

  // Build meta items array for vendor charges and info
  const metaItems = [];

  // Delivery Charge
  // if (vendor.delivery_charge !== undefined && vendor.delivery_charge !== null) {
  //   metaItems.push({
  //     id: 'delivery',
  //     icon: <DeliveryDiningIcon sx={{ fontSize: '1.1rem' }} />,
  //     label: 'Delivery Charge',
  //     value: `₹ ${vendor.delivery_charge.toFixed(2)}`,
  //     color: '#ff9800',
  //   });
  // }

  // // Packaging Charge
  // if (vendor.packaging_charge !== undefined && vendor.packaging_charge !== null) {
  //   metaItems.push({
  //     id: 'packaging',
  //     icon: <LocalShippingIcon sx={{ fontSize: '1.1rem' }} />,
  //     label: 'Packaging Charge',
  //     value: `₹ ${vendor.packaging_charge.toFixed(2)}`,
  //     color: '#2196f3',
  //   });
  // }

  // // Convenience Charge
  // if (vendor.convenience_charge !== undefined && vendor.convenience_charge !== null) {
  //   metaItems.push({
  //     id: 'convenience',
  //     icon: <LocalOfferIcon sx={{ fontSize: '1.1rem' }} />,
  //     label: 'Convenience Charge',
  //     value: `₹ ${vendor.convenience_charge.toFixed(2)}`,
  //     color: '#9c27b0',
  //   });
  // }

  // // Preparation Time
  // if (vendor.preparation_time_minutes !== undefined && vendor.preparation_time_minutes !== null) {
  //   metaItems.push({
  //     id: 'prep',
  //     icon: <AccessTimeIcon sx={{ fontSize: '1.1rem' }} />,
  //     label: 'Est. Prep Time',
  //     value: `${vendor.preparation_time_minutes} min`,
  //     color: '#4caf50',
  //   });
  // }

  return (
    <>
      {/* Back Button - Fixed at top */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            color: '#667eea',
            padding: { xs: 1, sm: 1.25 },
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
        </IconButton>
      </Box>

      {/* Banner Section */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 200, sm: 280, md: 320 },
          position: 'relative',
          overflow: 'hidden',
          background: hasBanner
            ? 'transparent'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {hasBanner ? (
          <Box
            component="img"
            src={bannerImage}
            alt={`${vendor.name} banner`}
            onError={() => setBannerError(true)}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                                  radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
              }}
            >
              <StorefrontIcon
                sx={{
                  fontSize: { xs: '3rem', sm: '4rem' },
                  color: 'rgba(255, 255, 255, 0.9)',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                }}
              />
            </Box>
          </Box>
        )}

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isOpen
              ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)'
              : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%)',
            zIndex: 1,
          }}
        />
      </Box>

      {/* Vendor Info Section */}
      <Box
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 3, md: 3.5 } }}>
          {/* Header with Status */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2, gap: 2 }}
          >
            <Box flex={1}>
              {/* Vendor Name */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                  lineHeight: 1.3,
                  color: '#1a1a1a',
                  mb: 0,
                }}
              >
                {vendor.name}
              </Typography>
            </Box>

            {/* Status Badge */}
            {/* <Chip
              label={isOpen ? 'Open' : 'Closed'}
              color={isOpen ? 'success' : 'error'}
              variant="filled"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.8rem', sm: '0.85rem' },
                height: { xs: 28, sm: 32 },
                minWidth: { xs: 70, sm: 80 },
              }}
            /> */}
          </Stack>

          {/* Description */}
          {vendor.description && (
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                lineHeight: 1.7,
                mb: 3,
                maxWidth: { xs: '100%', sm: '85%', md: '80%' },
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                textAlign: 'center',
                mx: 'auto'
              }}
            >
              {vendor.description}
            </Typography>
          )}

          {/* Meta Info Bar */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 3 }}
            sx={{
              mb: 3,
              justifyContent: 'center',
              alignItems: { xs: 'stretch', sm: 'center' },
            }}
          >
            {/* Open Time */}
            {/* {vendor.open_time && vendor.close_time && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  minHeight: 48,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                <AccessTimeIcon
                  sx={{
                    color: '#4caf50',
                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#999',
                      display: 'block',
                      fontSize: '0.7rem',
                      mb: 0.25,
                      lineHeight: 1,
                    }}
                  >
                    Hours
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#1a1a1a',
                      fontSize: { xs: '0.875rem', sm: '0.9rem' },
                      lineHeight: 1.4,
                    }}
                  >
                    {formatTime(vendor.open_time)} – {formatTime(vendor.close_time)}
                  </Typography>
                </Box>
              </Box>
            )} */}

            {/* Location */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minHeight: 48,
                width: { xs: '100%', sm: 'auto' },
                maxWidth: { sm: 300 },
              }}
            >
              <LocationOnIcon
                sx={{
                  color: '#1976d2',
                  fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  flexShrink: 0,
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {/* <Typography
                  variant="caption"
                  sx={{
                    color: '#999',
                    display: 'block',
                    fontSize: '0.7rem',
                    mb: 0.25,
                    lineHeight: 1,
                  }}
                >
                  Location
                </Typography> */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    fontSize: { xs: '0.875rem', sm: '0.9rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.4,
                  }}
                  title={address}
                >
                  {address}
                </Typography>
              </Box>
            </Box>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
            {vendor.mobile_number && (
              <Button
                variant="contained"
                size="medium"
                startIcon={<CallIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' } }} />}
                href={`tel:${vendor.mobile_number}`}
                sx={{
                  flex: { xs: 1, sm: 'initial' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.25 },
                  fontSize: { xs: '0.875rem', sm: '0.9rem' },
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  textTransform: 'none',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Call
              </Button>
            )}

            <Button
              variant="outlined"
              size="medium"
              startIcon={<ShareIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' } }} />}
              onClick={handleShare}
              sx={{
                flex: { xs: 1, sm: 'initial' },
                borderColor: '#e0e0e0',
                color: '#666',
                fontWeight: 600,
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.25 },
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                borderWidth: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#667eea',
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  color: '#667eea',
                  borderWidth: 1.5,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Share
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Vendor Meta Bar - Charges and Info */}
      {metaItems.length > 0 && (
        <Box
          sx={{
            backgroundColor: '#fff',
            borderBottom: '1px solid #e8e8e8',
            py: { xs: 1.5, sm: 2 },
            position: 'sticky',
            top: { xs: 56, sm: 64 },
            zIndex: 50,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Container maxWidth="lg">
            <Stack
              direction="row"
              spacing={{ xs: 1.5, sm: 2 }}
              sx={{
                overflowX: 'auto',
                overflowY: 'hidden',
                pb: 0.5,
                scrollbarWidth: 'thin',
                scrollbarColor: '#ddd transparent',
                '&::-webkit-scrollbar': {
                  height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#ddd',
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: '#bbb',
                  },
                },
              }}
            >
              {metaItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    backgroundColor: '#fafafa',
                    border: '1px solid #f0f0f0',
                    borderRadius: '16px',
                    padding: { xs: '10px 14px', sm: '12px 16px' },
                    minWidth: 'fit-content',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#fff',
                      borderColor: item.color,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${item.color}20`,
                    },
                  }}
                >
                  {/* Icon with background */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: '12px',
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                      flexShrink: 0,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      sx: { fontSize: { xs: '1.2rem', sm: '1.35rem' } },
                    })}
                  </Box>

                  {/* Text content */}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#888',
                        display: 'block',
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        fontWeight: 500,
                        letterSpacing: '0.3px',
                        textTransform: 'uppercase',
                        lineHeight: 1.2,
                        mb: 0.25,
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#1a1a1a',
                        fontWeight: 700,
                        fontSize: { xs: '0.9rem', sm: '0.95rem' },
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Container>
        </Box>
      )}

      {/* Share Snackbar */}
      <Snackbar
        open={showShareSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowShareSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setShowShareSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          Link copied to clipboard!
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default VendorHeader;
