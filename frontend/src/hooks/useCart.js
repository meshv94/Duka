import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing cart with localStorage persistence
 * Cart structure: { cart: [{ vendor: string, products: [{ product_id, quantity }] }] }
 */
export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('deliveryCart');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCart(Array.isArray(parsed.cart) ? parsed.cart : []);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('deliveryCart', JSON.stringify({ cart }));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, loading]);

  /**
   * Add product to cart or increase quantity if exists
   * @param {string} vendorId - Vendor ID
   * @param {object} product - Product object with _id, name, price, etc.
   * @param {number} quantity - Quantity to add (default 1)
   */
  const addToCart = useCallback((vendorId, product, quantity = 1) => {
    if (!vendorId || !product?._id) {
      console.error('Invalid vendor or product');
      return;
    }

    setCart((prevCart) => {
      // Find existing vendor in cart
      const vendorIndex = prevCart.findIndex((v) => v.vendor === vendorId);

      if (vendorIndex > -1) {
        // Vendor exists, update products
        const updatedCart = JSON.parse(JSON.stringify(prevCart)); // Deep clone
        const productIndex = updatedCart[vendorIndex].products.findIndex(
          (p) => p.product_id === product._id
        );

        if (productIndex > -1) {
          // Product exists, increase quantity
          updatedCart[vendorIndex].products[productIndex].quantity += quantity;
        } else {
          // New product for this vendor
          updatedCart[vendorIndex].products.push({
            product_id: product._id,
            quantity,
          });
        }
        return updatedCart;
      } else {
        // New vendor, add to cart
        return [
          ...prevCart,
          {
            vendor: vendorId,
            products: [
              {
                product_id: product._id,
                quantity,
              },
            ],
          },
        ];
      }
    });
  }, []);

  /**
   * Update product quantity in cart
   * @param {string} vendorId - Vendor ID
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   */
  const updateQuantity = useCallback((vendorId, productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(vendorId, productId);
      return;
    }

    setCart((prevCart) => {
      const updatedCart = JSON.parse(JSON.stringify(prevCart));
      const vendorIndex = updatedCart.findIndex((v) => v.vendor === vendorId);

      if (vendorIndex > -1) {
        const productIndex = updatedCart[vendorIndex].products.findIndex(
          (p) => p.product_id === productId
        );

        if (productIndex > -1) {
          updatedCart[vendorIndex].products[productIndex].quantity = quantity;
        }
      }

      return updatedCart;
    });
  }, []);

  /**
   * Remove product from cart
   * @param {string} vendorId - Vendor ID
   * @param {string} productId - Product ID
   */
  const removeFromCart = useCallback((vendorId, productId) => {
    setCart((prevCart) => {
      let updatedCart = JSON.parse(JSON.stringify(prevCart));
      const vendorIndex = updatedCart.findIndex((v) => v.vendor === vendorId);

      if (vendorIndex > -1) {
        updatedCart[vendorIndex].products = updatedCart[vendorIndex].products.filter(
          (p) => p.product_id !== productId
        );

        // Remove vendor if no products left
        if (updatedCart[vendorIndex].products.length === 0) {
          updatedCart = updatedCart.filter((_, idx) => idx !== vendorIndex);
        }
      }

      return updatedCart;
    });
  }, []);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('deliveryCart');
  }, []);

  /**
   * Get cart totals
   */
  const getCartTotals = useCallback(() => {
    let totalItems = 0;
    let totalVendors = cart.length;

    cart.forEach((vendor) => {
      vendor.products.forEach((product) => {
        totalItems += product.quantity;
      });
    });

    return { totalItems, totalVendors };
  }, [cart]);

  /**
   * Get vendor cart (products for specific vendor)
   */
  const getVendorCart = useCallback(
    (vendorId) => {
      const vendorCart = cart.find((v) => v.vendor === vendorId);
      return vendorCart?.products || [];
    },
    [cart]
  );

  /**
   * Check if product is in cart
   */
  const isProductInCart = useCallback(
    (vendorId, productId) => {
      const vendorCart = cart.find((v) => v.vendor === vendorId);
      return vendorCart?.products.some((p) => p.product_id === productId) || false;
    },
    [cart]
  );

  /**
   * Get product quantity in cart
   */
  const getProductQuantity = useCallback(
    (vendorId, productId) => {
      const vendorCart = cart.find((v) => v.vendor === vendorId);
      const product = vendorCart?.products.find((p) => p.product_id === productId);
      return product?.quantity || 0;
    },
    [cart]
  );

  return {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    getVendorCart,
    isProductInCart,
    getProductQuantity,
  };
};

export default useCart;
