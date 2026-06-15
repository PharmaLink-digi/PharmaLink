import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import ConfirmOrder from './ConfirmOrder';
import { useCart } from '../../context/CartContext';

export default function ConfirmOrderPage() {
  const { cartItems, orderDetails, setOrderDetails, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = async (formData) => {
    const userId = localStorage.getItem('userId');

    // orders table: {order_id, client_id, pharm_id, order_date, status}
    // pharm_id comes from the first cart item (all items assumed same pharmacy)
    const pharmId = cartItems[0]?.pharm_id ?? null;

    const orderRes = await api.post('/orders', {
      client_id: Number(userId),
      pharm_id: pharmId,
      order_date: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
    const newOrder = Array.isArray(orderRes.data) ? orderRes.data[0] : orderRes.data;
    const orderId = newOrder?.order_id;
    if (!orderId) throw new Error('Order creation failed — no order_id returned');

    // order-details: send all fields including medication_name to avoid nulls
    await Promise.all(
      cartItems.map((item) =>
        api.post('/order-details', {
          order_id:        orderId,
          client_id:       Number(userId),
          pharm_id:        item.pharm_id,
          inventory_id:    item.inventory_id,
          medication_id:   item.medication_id,
          medication_name: item.medication_name || null,
          quantity:        item.quantity,
          unit_price:      item.price_sell,
          line_total:      item.price_sell * item.quantity,
        })
      )
    );

    return { success: true };
  };

  return (
    <ConfirmOrder
      cartItems={cartItems}
      orderDetails={orderDetails}
      setOrderDetails={setOrderDetails}
      onNavigateBack={() => navigate('/client/cart')}
      onOrderPlaced={() => {
        clearCart();
        navigate('/client/dashboard');
      }}
      onPlaceOrder={handlePlaceOrder}
    />
  );
}
