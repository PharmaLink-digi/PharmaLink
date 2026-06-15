import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRepeat, Building } from "react-bootstrap-icons";
import api from "../../utils/api";

const STEP_KEYS = ["Order Placed", "Processing", "Dispatched", "Delivered"];

const STATUS_META = {
  pending:    { label: "Pending",    color: "#f59e0b", bg: "#fef3c7", step: 1 },
  Pending:    { label: "Pending",    color: "#f59e0b", bg: "#fef3c7", step: 1 },
  processing: { label: "Processing", color: "#3b82f6", bg: "#dbeafe", step: 2 },
  Processing: { label: "Processing", color: "#3b82f6", bg: "#dbeafe", step: 2 },
  shipped:    { label: "Dispatched", color: "#8b5cf6", bg: "#ede9fe", step: 3 },
  Completed:  { label: "Delivered",  color: "#16a34a", bg: "#dcfce7", step: 4 },
  completed:  { label: "Delivered",  color: "#16a34a", bg: "#dcfce7", step: 4 },
  Cancelled:  { label: "Cancelled",  color: "#dc2626", bg: "#fee2e2", step: 0 },
  cancelled:  { label: "Cancelled",  color: "#dc2626", bg: "#fee2e2", step: 0 },
};

export default function WarehouseOrderTracking() {
  const navigate   = useNavigate();
  const pharmacyId = localStorage.getItem("userId");

  const [orders,  setOrders]  = useState([]);
  const [details, setDetails] = useState([]);
  const [warehouses, setWarehouses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!pharmacyId) { navigate("/signin", { replace: true }); return; }
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, detailsRes, whRes] = await Promise.all([
        api.get("/orders",             { headers: { "Cache-Control": "no-cache" } }),
        api.get("/order-details",      { headers: { "Cache-Control": "no-cache" } }),
        api.get("/warehouses",         { headers: { "Cache-Control": "no-cache" } }),
      ]);

      const allOrders  = Array.isArray(ordersRes.data)  ? ordersRes.data  : [];
      const allDetails = Array.isArray(detailsRes.data) ? detailsRes.data : [];
      const allWH      = Array.isArray(whRes.data)      ? whRes.data      : [];

      // Pharmacy's warehouse orders — identified by pharm_id on the order
      const myOrders = allOrders
        .filter((o) => String(o.pharm_id) === String(pharmacyId))
        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

      const myOrderIds = new Set(myOrders.map((o) => o.order_id));
      const myDetails  = allDetails.filter((d) => myOrderIds.has(d.order_id));

      const whMap = {};
      allWH.forEach((w) => { whMap[w.warehouse_id] = w; });

      setOrders(myOrders);
      setDetails(myDetails);
      setWarehouses(whMap);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const getDetails = (orderId) => details.filter((d) => d.order_id === orderId);
  const getTotal   = (orderId) => getDetails(orderId).reduce((s, d) => s + (d.line_total || 0), 0);

  const filtered = orders.filter((o) =>
    filterStatus === "all" ? true :
    (o.status || "").toLowerCase() === filterStatus.toLowerCase()
  );

  const countOf = (s) =>
    orders.filter((o) => (o.status || "").toLowerCase() === s.toLowerCase()).length;

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-3 text-muted">Loading orders...</p>
    </div>
  );

  return (
    <div className="p-4" style={{ maxWidth: 860 }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Warehouse Order Tracking</h2>
          <p className="text-muted mb-0">
            Track the status of orders you placed with warehouses
          </p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadOrders}>
          <ArrowRepeat size={15} className="me-1" /> Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Filter pills */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { key: "all",       label: `All (${orders.length})` },
          { key: "pending",   label: `Pending (${countOf("pending")})` },
          { key: "processing",label: `Processing (${countOf("processing")})` },
          { key: "completed", label: `Completed (${countOf("completed") + countOf("Completed")})` },
          { key: "cancelled", label: `Cancelled (${countOf("cancelled") + countOf("Cancelled")})` },
        ].map((f) => (
          <button
            key={f.key}
            className={`btn btn-sm rounded-pill ${filterStatus === f.key ? "btn-dark" : "btn-outline-secondary"}`}
            onClick={() => setFilterStatus(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
          <Building size={40} className="text-muted mb-3 mx-auto opacity-25" />
          <h6 className="text-muted">No orders found</h6>
          <button className="btn btn-primary rounded-pill px-4 mt-3 mx-auto"
            style={{ maxWidth: 200 }}
            onClick={() => navigate("/pharmacy/warehouse-orders")}
          >
            Place an Order
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((order) => {
            const meta        = STATUS_META[order.status] || STATUS_META.pending;
            const isCancelled = meta.step === 0;
            const isExpanded  = expanded === order.order_id;
            const items       = getDetails(order.order_id);
            const total       = getTotal(order.order_id);
            const wh          = warehouses[order.warehouse_id];

            return (
              <div key={order.order_id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                {/* Header row */}
                <div
                  className="d-flex justify-content-between align-items-center px-4 py-3"
                  style={{ cursor: "pointer", borderBottom: isExpanded ? "1px solid #f1f5f9" : "none" }}
                  onClick={() => setExpanded(isExpanded ? null : order.order_id)}
                >
                  <div>
                    <span className="fw-bold text-dark">Order #{order.order_id}</span>
                    <span className="text-muted ms-3" style={{ fontSize: 13 }}>
                      {order.order_date
                        ? new Date(order.order_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                        : "—"}
                    </span>
                    {wh && (
                      <span className="text-muted ms-3" style={{ fontSize: 13 }}>
                        📦 {wh.warehouse_code}
                      </span>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="badge rounded-pill fw-semibold"
                      style={{ background: meta.bg, color: meta.color, padding: "5px 12px" }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-muted" style={{ fontSize: 18 }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 py-3">
                    {/* Progress tracker */}
                    {!isCancelled && (
                      <div className="d-flex align-items-center mb-4">
                        {STEP_KEYS.map((step, i) => {
                          const done   = meta.step > i;
                          const active = meta.step === i + 1;
                          return (
                            <React.Fragment key={step}>
                              <div className="d-flex flex-column align-items-center">
                                <div
                                  className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                                  style={{
                                    width: 30, height: 30, fontSize: 12,
                                    background: done || active ? "#0d6efd" : "#e2e8f0",
                                    color: done || active ? "#fff" : "#94a3b8",
                                  }}
                                >
                                  {done ? "✓" : i + 1}
                                </div>
                                <span className="mt-1 text-center" style={{
                                  fontSize: 11, whiteSpace: "nowrap",
                                  color: done || active ? "#0d6efd" : "#94a3b8",
                                }}>
                                  {step}
                                </span>
                              </div>
                              {i < STEP_KEYS.length - 1 && (
                                <div style={{
                                  flex: 1, height: 2, marginBottom: 18, margin: "0 4px 18px",
                                  background: done ? "#0d6efd" : "#e2e8f0",
                                }} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}

                    {/* Items */}
                    {items.length > 0 && (
                      <div className="border-top pt-3" style={{ borderColor: "#f1f5f9" }}>
                        {items.map((item, idx) => (
                          <div key={idx} className="d-flex justify-content-between align-items-center py-2">
                            <div className="d-flex align-items-center gap-2">
                              <div className="rounded-3 d-flex align-items-center justify-content-center"
                                style={{ width: 36, height: 36, background: "#dbeafe", fontSize: 18 }}>
                                💊
                              </div>
                              <div>
                                <div className="fw-semibold text-dark" style={{ fontSize: 14 }}>
                                  {item.medication_name || `Medicine #${item.medication_id}`}
                                </div>
                                <div className="text-muted" style={{ fontSize: 12 }}>
                                  Qty: {item.quantity} × {item.unit_price} EGP
                                </div>
                              </div>
                            </div>
                            <span className="fw-semibold" style={{ fontSize: 14 }}>
                              {(item.line_total || 0).toFixed(0)} EGP
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer total */}
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top"
                      style={{ borderColor: "#f1f5f9" }}>
                      <span className="text-muted">Total</span>
                      <span className="fw-bold" style={{ color: "#00b289", fontSize: 17 }}>
                        {total.toFixed(0)} EGP
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
