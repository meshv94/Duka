import React, { createContext, useContext } from 'react';
import useCart from '../hooks/useCart';

/**
 * Cart Context for global cart state management
 * Provides cart data and methods to all components
 */
const CartContext = createContext(null);

/**
 * CartProvider Component
 * Wraps the app to provide cart context
 */
export const CartProvider = ({ children }) => {
  const cartData = useCart();

  return <CartContext.Provider value={cartData}>{children}</CartContext.Provider>;
};

/**
 * Custom hook to use Cart Context
 * Must be used within CartProvider
 */
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
};

export default CartContext;
