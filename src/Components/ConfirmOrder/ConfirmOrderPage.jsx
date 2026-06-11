import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmOrder from './ConfirmOrder';
import { useCart } from '../../context/CartContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ConfirmOrderPage() {
  const { cartItems, orderDetails, setOrderDetails, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = async (formData) => {
    const userId = localStorage.getItem('userId');

    // 1. Create order
    const orderRes = await axios.post(`${API_BASE}/orders`, {
      client_id: userId,
      order_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: formData.notes || '',
    });
    const newOrder = orderRes.data;

    // 2. Create order details for each cart item
    await Promise.all(
      cartItems.map((item) =>
        axios.post(`${API_BASE}/order-details`, {
          order_id: newOrder.order_id,
          client_id: userId,
          pharm_id: item.pharm_id,
          inventory_id: item.inventory_id,
          medication_id: item.medication_id,
          quantity: item.quantity,
          unit_price: item.price_sell,
          line_total: item.price_sell * item.quantity,
        })
      )
    );

    // 3. If Paymob, get payment iframe URL
    if (formData.paymentMethod === 'paymob') {
      const payRes = await axios.post(`${API_BASE}/payment/paymob`, {
        amount: formData.total,
        merchant_order_id: newOrder.order_id,
        billing: {
          phone: formData.phone,
          address: formData.address,
        },
      });
      return { paymobIframeUrl: payRes.data.iframe_url };
    }

    return { success: true };
  };

  return (
    <ConfirmOrder
      cartItems={cartItems}
      orderDetails={orderDetails}
      setOrderDetails={setOrderDetails}
      onNavigateBack={() => navigate('/cart')}
      onOrderPlaced={() => {
        clearCart();
        navigate('/my-orders');
      }}
      onPlaceOrder={handlePlaceOrder}
    />
  );
}
