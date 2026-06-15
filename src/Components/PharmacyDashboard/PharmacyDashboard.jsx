import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BoxSeam, ArrowLeftRight, Building, ClipboardCheck,
  ExclamationTriangleFill, CheckCircleFill, HourglassSplit,
} from "react-bootstrap-icons";
import api from "../../utils/api";
import "./PharmacyDashboard.css";

export default function PharmacyDashboard() {
  const navigate   = useNavigate();
  const pharmacyId = localStorage.getItem("userId");

  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (!pharmacyId) { navigate("/signin", { replace: true }); return; }
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const [invRes, exchRes, ordersRes] = await Promise.all([
        api.get("/pharm-inventory",  { headers: { "Cache-Control": "no-cache" } }),
        api.get("/exchange-pharm",   { headers: { "Cache-Control": "no-cache" } }),
        api.get("/orders",           { headers: { "Cache-Control": "no-cache" } }),
      ]);

      // Inventory — filter to this pharmacy
      const inv = (Array.isArray(invRes.data) ? invRes.data : [])
        .filter((i) => String(i.pharm_id) === String(pharmacyId));

      const totalItems = inv.length;
      const lowStock   = inv.filter((i) => i.quantity > 0 && i.quantity < 30).length;
      const outStock   = inv.filter((i) => i.quantity <= 0).length;

      // Exchange requests
      const allExch = Array.isArray(exchRes.data) ? exchRes.data : [];
      const incomingPending = allExch.filter(
        (r) => String(r.to_pharm_id) === String(pharmacyId) &&
               (r.status === "Pending" || r.status === "pending")
      ).length;
      const outgoingTotal = allExch.filter(
        (r) => String(r.from_pharm_id) === String(pharmacyId)
      ).length;

      // Warehouse orders placed by this pharmacy
      const allOrders = (Array.isArray(ordersRes.data) ? ordersRes.data : [])
        .filter((o) => String(o.pharm_id) === String(pharmacyId))
        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

      const pendingOrders = allOrders.filter(
        (o) => o.status === "pending" || o.status === "Pending"
      ).length;

      setStats({ totalItems, lowStock, outStock, incomingPending, outgoingTotal, pendingOrders, totalOrders: allOrders.length });
      setRecentOrders(allOrders.slice(0, 5));
    } catch (err) {
      // Show zeros rather than crash
      setStats({ totalItems: 0, lowStock: 0, outStock: 0, incomingPending: 0, outgoingTotal: 0, pendingOrders: 0, totalOrders: 0 });
    } finally {
      setLoading(false);
    }
  }

  const STAT_CARDS = stats ? [
    {
      label: "Inventory Items",
      value: stats.totalItems,
      icon: <BoxSeam size={24} />,
      color: "#0d6efd",
      bg: "#e8f0fe",
      sub: stats.outStock > 0 ? `${stats.outStock} out of stock` : stats.lowStock > 0 ? `${stats.lowStock} low stock` : "All stocked",
      subColor: stats.outStock > 0 ? "#dc3545" : stats.lowStock > 0 ? "#f59e0b" : "#16a34a",
      onClick: () => navigate("/pharmacy/inventory"),
    },
    {
      label: "Pending Exchange",
      value: stats.incomingPending,
      icon: <ArrowLeftRight size={24} />,
      color: "#f59e0b",
      bg: "#fef3c7",
      sub: `${stats.outgoingTotal} outgoing sent`,
      subColor: "#6b7280",
      onClick: () => navigate("/pharmacy/exchange"),
    },
    {
      label: "Warehouse Orders",
      value: stats.totalOrders,
      icon: <Building size={24} />,
      color: "#10b981",
      bg: "#d1fae5",
      sub: `${stats.pendingOrders} pending`,
      subColor: stats.pendingOrders > 0 ? "#f59e0b" : "#16a34a",
      onClick: () => navigate("/pharmacy/order-tracking"),
    },
    {
      label: "Low Stock Alert",
      value: stats.lowStock + stats.outStock,
      icon: <ExclamationTriangleFill size={24} />,
      color: "#ef4444",
      bg: "#fee2e2",
      sub: stats.lowStock + stats.outStock > 0 ? "Needs attention" : "All good",
      subColor: stats.lowStock + stats.outStock > 0 ? "#dc3545" : "#16a34a",
      onClick: () => navigate("/pharmacy/inventory"),
    },
  ] : [];

  const statusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed") return <span className="badge bg-success">Completed</span>;
    if (s === "pending")   return <span className="badge bg-warning text-dark">Pending</span>;
    if (s === "cancelled") return <span className="badge bg-danger">Cancelled</span>;
    return <span className="badge bg-secondary">{status}</span>;
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Pharmacy Dashboard</h2>
        <p className="text-muted mb-0">Overview of your pharmacy operations</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            {STAT_CARDS.map((card) => (
              <div key={card.label} className="col-6 col-xl-3">
                <div
                  className="card border-0 shadow-sm rounded-4 p-3 h-100 stat-card"
                  onClick={card.onClick}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div
                      className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                      style={{ background: card.bg, color: card.color, width: 44, height: 44 }}
                    >
                      {card.icon}
                    </div>
                  </div>
                  <div className="fw-bold fs-3 text-dark">{card.value}</div>
                  <div className="text-muted small mb-1">{card.label}</div>
                  <div style={{ color: card.subColor, fontSize: "12px", fontWeight: 500 }}>
                    {card.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h6 className="fw-bold text-dark mb-3">Quick Actions</h6>
                <div className="d-flex flex-wrap gap-2">
                  <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/pharmacy/warehouse-orders")}>
                    <Building size={15} className="me-2" /> Order from Warehouse
                  </button>
                  <button className="btn btn-outline-warning rounded-pill px-4" onClick={() => navigate("/pharmacy/exchange")}>
                    <ArrowLeftRight size={15} className="me-2" /> Exchange Requests
                  </button>
                  <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate("/pharmacy/inventory")}>
                    <BoxSeam size={15} className="me-2" /> View Inventory
                  </button>
                  <button className="btn btn-outline-info rounded-pill px-4" onClick={() => navigate("/pharmacy/order-tracking")}>
                    <ClipboardCheck size={15} className="me-2" /> Track Orders
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Warehouse Orders */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0">Recent Warehouse Orders</h6>
              <button
                className="btn btn-sm btn-outline-primary rounded-pill"
                onClick={() => navigate("/pharmacy/order-tracking")}
              >
                View All
              </button>
            </div>
            <div className="card-body px-0 pb-0">
              {recentOrders.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <Building size={32} className="mb-2 opacity-25" />
                  <p className="mb-0">No warehouse orders yet</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4">Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={o.order_id}>
                          <td className="px-4 fw-medium">#{o.order_id}</td>
                          <td className="text-muted" style={{ fontSize: "13px" }}>
                            {o.order_date
                              ? new Date(o.order_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                              : "—"}
                          </td>
                          <td>{statusBadge(o.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
