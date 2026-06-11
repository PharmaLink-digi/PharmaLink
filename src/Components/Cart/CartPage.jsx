import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from './Cart';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cartItems, updateCartQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <Cart
      cartItems={cartItems}
      updateCartQuantity={updateCartQuantity}
      removeFromCart={removeFromCart}
      onNavigateBack={() => navigate(-1)}
      onCheckout={() => navigate('/confirm-order')}
    />
  );
}
