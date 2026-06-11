import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyOrders.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const STATUS_CONFIG = {
  pending:   { label: 'قيد الانتظار',   color: '#f59e0b', bg: '#fef3c7', step: 1 },
  Pending:   { label: 'قيد الانتظار',   color: '#f59e0b', bg: '#fef3c7', step: 1 },
  processing:{ label: 'جاري التنفيذ',  color: '#3b82f6', bg: '#dbeafe', step: 2 },
  shipped:   { label: 'في الطريق',      color: '#8b5cf6', bg: '#ede9fe', step: 3 },
  Completed: { label: 'تم التسليم',     color: '#16a34a', bg: '#dcfce7', step: 4 },
  completed: { label: 'تم التسليم',     color: '#16a34a', bg: '#dcfce7', step: 4 },
  Cancelled: { label: 'ملغي',           color: '#dc2626', bg: '#fee2e2', step: 0 },
  cancelled: { label: 'ملغي',           color: '#dc2626', bg: '#fee2e2', step: 0 },
};

const STEPS = ['تم الطلب', 'جاري التنفيذ', 'في الطريق', 'تم التسليم'];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) { navigate('/signin'); return; }

    Promise.all([
      fetch(`${API_BASE}/orders?client_id=${userId}`).then((r) => r.json()),
      fetch(`${API_BASE}/order-details?client_id=${userId}`).then((r) => r.json()),
    ])
      .then(([ordersData, detailsData]) => {
        const ordersArr = Array.isArray(ordersData) ? ordersData : [];
        const detailsArr = Array.isArray(detailsData) ? detailsData : [];
        // Sort newest first
        ordersArr.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
        setOrders(ordersArr);
        setDetails(detailsArr);
      })
      .catch(() => setError('فشل في تحميل الطلبات'))
      .finally(() => setLoading(false));
  }, []);

  const getOrderItems = (orderId) =>
    details.filter((d) => d.order_id === orderId);

  const getOrderTotal = (orderId) =>
    getOrderItems(orderId).reduce((sum, d) => sum + (d.line_total || 0), 0);

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-secondary">جاري تحميل طلباتك...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="alert alert-danger d-inline-block rounded-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: '780px' }} dir="rtl">
      <div className="mb-4">
        <h1 className="fw-bold text-dark mb-1" style={{ fontSize: '28px' }}>طلباتي</h1>
        <p className="text-secondary" style={{ fontSize: '15px' }}>
          {orders.length > 0 ? `${orders.length} طلب` : 'لا توجد طلبات بعد'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div style={{ fontSize: '50px' }}>📦</div>
          <h5 className="fw-bold text-dark mt-3 mb-2">لا توجد طلبات</h5>
          <p className="text-secondary mb-4">ابحث عن الأدوية وابدأ طلبك الأول</p>
          <button
            className="btn text-white rounded-pill px-4 py-2 mx-auto"
            style={{ background: 'linear-gradient(90deg,#0d6efd,#10c8a0)', border: 'none', fontWeight: 600, maxWidth: '200px' }}
            onClick={() => navigate('/search')}
          >
            ابحث عن دواء
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => {
            const statusKey = order.status || 'pending';
            const statusCfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
            const items = getOrderItems(order.order_id);
            const total = getOrderTotal(order.order_id);
            const isCancelled = statusCfg.step === 0;

            return (
              <div
                key={order.order_id}
                className="card border rounded-4 bg-white order-card"
                style={{ borderColor: '#f1f5f9' }}
              >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start p-4 pb-3">
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '16px' }}>
                      طلب #{order.order_id}
                    </div>
                    <div className="text-secondary mt-1" style={{ fontSize: '13px' }}>
                      {order.order_date ? new Date(order.order_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                    </div>
                  </div>
                  <span
                    className="badge rounded-pill fw-semibold"
                    style={{ background: statusCfg.bg, color: statusCfg.color, fontSize: '13px', padding: '6px 14px' }}
                  >
                    {statusCfg.label}
                  </span>
                </div>

                {/* Progress Steps */}
                {!isCancelled && (
                  <div className="px-4 pb-3">
                    <div className="d-flex align-items-center">
                      {STEPS.map((step, i) => {
                        const done = statusCfg.step > i;
                        const active = statusCfg.step === i + 1;
                        return (
                          <React.Fragment key={step}>
                            <div className="d-flex flex-column align-items-center" style={{ flex: '0 0 auto' }}>
                              <div
                                className="d-flex align-items-center justify-content-center rounded-circle"
                                style={{
                                  width: '28px', height: '28px', fontSize: '12px', fontWeight: 700,
                                  background: done || active ? '#0d6efd' : '#e2e8f0',
                                  color: done || active ? '#fff' : '#94a3b8',
                                }}
                              >
                                {done ? '✓' : i + 1}
                              </div>
                              <span className="mt-1 text-center" style={{ fontSize: '11px', color: done || active ? '#0d6efd' : '#94a3b8', whiteSpace: 'nowrap' }}>
                                {step}
                              </span>
                            </div>
                            {i < STEPS.length - 1 && (
                              <div
                                style={{ flex: 1, height: '2px', background: done ? '#0d6efd' : '#e2e8f0', margin: '0 4px', marginBottom: '18px' }}
                              />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items */}
                {items.length > 0 && (
                  <div className="px-4 pb-3">
                    <div className="border-top pt-3" style={{ borderColor: '#f1f5f9' }}>
                      {items.map((item, idx) => (
                        <div key={idx} className="d-flex justify-content-between align-items-center py-2">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                              style={{ width: '36px', height: '36px', background: '#dbeafe' }}
                            >
                              💊
                            </div>
                            <div>
                              <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
                                {item.medication?.medication_name || item.medication_name || `دواء #${item.medication_id}`}
                              </div>
                              <div className="text-secondary" style={{ fontSize: '12px' }}>
                                الكمية: {item.quantity}
                                {item.pharmacy?.pharm_name ? ` • ${item.pharmacy.pharm_name}` : ''}
                              </div>
                            </div>
                          </div>
                          <span className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
                            {(item.line_total || 0).toFixed(0)} EGP
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div
                  className="px-4 py-3 d-flex justify-content-between align-items-center rounded-bottom-4"
                  style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}
                >
                  <span className="text-secondary" style={{ fontSize: '13px' }}>الإجمالي</span>
                  <span className="fw-bold" style={{ color: '#00b289', fontSize: '17px' }}>
                    {total.toFixed(0)} EGP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
