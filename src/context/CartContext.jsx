import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [orderDetails, setOrderDetails] = useState({
    address: '',
    phone: '',
    notes: '',
    paymentMethod: 'cash',
    visaDetails: { cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' },
  });

  const addToCart = (medicationName, pharmacyInfo, inventoryRecord) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.inventory_id === inventoryRecord.inventory_id);
      if (existing) {
        return prev.map(item =>
          item.inventory_id === inventoryRecord.inventory_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          ...inventoryRecord,
          medication_name: medicationName,
          pharmacy_name: pharmacyInfo?.pharm_name || '',
          pharmacy_area: pharmacyInfo?.area || '',
          quantity: 1,
        },
      ];
    });
  };

  const updateCartQuantity = (inventoryId, delta) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.inventory_id === inventoryId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (inventoryId) => {
    setCartItems(prev => prev.filter(item => item.inventory_id !== inventoryId));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        orderDetails,
        setOrderDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
