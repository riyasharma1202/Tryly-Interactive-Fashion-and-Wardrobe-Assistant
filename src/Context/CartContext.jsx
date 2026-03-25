import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.name === product.name);
      if (existingItem) {
        return prevItems.map(item =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Ensure quantity is set to 1 for new items
        const newItem = { ...product, quantity: 1 };
        return [...prevItems, newItem];
      }
    });
  };

  const updateQuantity = (productName, change) => {
    setCartItems((prevItems) => {
      return prevItems.map(item => {
        if (item.name === productName) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(item => item !== null);
    });
  };

  const buyItem = (productName) => {
    alert(`Proceeding to checkout for ${productName}...`);
  };

  const buyAllItems = () => {
    alert('Proceeding to checkout for all items...');
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    buyItem,
    buyAllItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};