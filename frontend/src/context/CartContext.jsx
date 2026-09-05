import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  
  // Load cart from localStorage on init
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`nimisham_cart_${user._id}`);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart");
        }
      }
    } else {
      setCart([]);
    }
  }, [user]);

  // Save to localStorage when cart changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`nimisham_cart_${user._id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product) => {
    if (!user) {
      toast.error('Please login to use the cart');
      return;
    }
    
    // Check if it's already in the cart (prevent duplicates for digital goods)
    const exists = cart.find(item => item._id === product._id);
    if (exists) {
      toast.error('Item is already in your cart');
      return;
    }

    if (product.isFree) {
      toast.error('Free items can be downloaded directly');
      return;
    }

    setCart(prev => [...prev, product]);
    toast.success('Added to cart');
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price || 0), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal,
      itemCount: cart.length
    }}>
      {children}
    </CartContext.Provider>
  );
};
