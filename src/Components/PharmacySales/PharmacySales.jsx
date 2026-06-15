import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRepeat } from "react-bootstrap-icons";
import api from "../../utils/api";
import SalesTable from "../Sales/SalesTable";
import TopStats from "../Sales/TopStats";

export default function PharmacySales() {
  const navigate   = useNavigate();
  const pharmacyId = localStorage.getItem("userId");

  const [sales,   setSales]   = useState([]);
  const [stats,   setStats]   = useState({ today: 0, month: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    if (!pharmacyId) { navigate("/signin", { replace: true }); return; }
    loadSales();
  }, []);

  async function loadSales() {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, detailsRes, invRes] = await Promise.all([
        api.get("/orders",        { headers: { "Cache-Control": "no-cache" } }),
        api.get("/order-details", { headers: { "Cache-Control": "no-cache" } }),
        api.get("/pharm-inventory", { headers: { "Cache-Control": "no-cache" } }),
      ]);

      const allOrders  = Array.isArray(ordersRes.data)  ? ordersRes.data  : [];
      const allDetails = Array.isArray(detailsRes.data) ? detailsRes.data : [];
      const allInv     = Array.isArray(invRes.data)     ? invRes.data     : [];

      // Only orders where this pharmacy is the supplier (pharm_id)
      const myOrders   = allOrders.filter((o) => String(o.pharm_id) === String(pharmacyId));
      const myOrderIds = new Set(myOrders.map((o) => o.order_id));
      const myDetails  = allDetails.filter((d) => myOrderIds.has(d.order_id));

      // Build inventory map for stock status & cost price
      const invMap = {};
      allInv
        .filter((i) => String(i.pharm_id) === String(pharmacyId))
        .forEach((i) => { invMap[i.medication_id] = i; });

      // Build one row per order-detail line
      const rows = myDetails.map((d) => {
        const order      = myOrders.find((o) => o.order_id === d.order_id);
        const inv        = invMap[d.medication_id];
        const unitPrice  = Number(d.unit_price  || d.price_sell || 0);
        const costPrice  = Number(inv?.price_buy || inv?.price_cost || unitPrice * 0.7); // fallback 70% cost
        const qty        = Number(d.quantity || 0);
        const totalPrice = Number(d.line_total || unitPrice * qty);
        const netProfit  = totalPrice - costPrice * qty;
        const profitPct  = totalPrice > 0 ? Math.round((netProfit / totalPrice) * 100) : 0;

        const invQty     = Number(inv?.quantity || 0);
        const stockStatus =
          invQty <= 0   ? "ناقص"   :
          invQty < 30   ? "منخفض"  :
                          "كافٍ";

        return {
          order_id:       d.order_id,
          medicine_name:  d.medication_name || inv?.medication_name || `#${d.medication_id}`,
          quantity:       qty,
          total_price:    totalPrice,
          net_profit:     netProfit,
          profit_percent: profitPct,
          stock_status:   stockStatus,
          order_date:     order?.order_date || null,
          status:         order?.status || "pending",
        };
      });

      // Sort newest first
      rows.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
      setSales(rows);

      // Calculate stats
      const today = new Date().toISOString().slice(0, 10);
      const monthPrefix = new Date().toISOString().slice(0, 7);

      const todayRevenue = rows
        .filter((r) => r.order_date?.slice(0, 10) === today)
        .reduce((s, r) => s + r.total_price, 0);

      const monthRevenue = rows
        .filter((r) => r.order_date?.slice(0, 7) === monthPrefix)
        .reduce((s, r) => s + r.total_price, 0);

      setStats({
        today:  todayRevenue,
        month:  monthRevenue,
        orders: myOrders.length,
      });
    } catch (err) {
      setError("Failed to load sales data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = sales.filter((s) =>
    search
      ? (s.medicine_name || "").toLowerCase().includes(search.trim().toLowerCase())
      : true
  );

  return (
    <div className="p-4" dir="rtl">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">المبيعات</h2>
          <p className="text-muted mb-0">تقرير مبيعات الصيدلية من الطلبات المكتملة</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadSales}>
          <ArrowRepeat size={15} className="me-1" /> تحديث
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">جاري تحميل البيانات...</p>
        </div>
      ) : (
        <>
          {/* Top Stats */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <TopStats title="مبيعات اليوم" value={stats.today} trend="" trendColor="green" />
            </div>
            <div className="col-12 col-md-4">
              <TopStats title="مبيعات الشهر" value={stats.month} trend="" trendColor="blue" />
            </div>
            <div className="col-12 col-md-4">
              <TopStats title="إجمالي الطلبات" value={stats.orders} trend="" trendColor="orange" />
            </div>
          </div>

          {/* Search */}
          <div className="mb-3">
            <input
              type="search"
              className="form-control rounded-pill"
              placeholder="ابحث عن دواء..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 300, direction: "rtl" }}
            />
          </div>

          {/* Sales Table */}
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <SalesTable sales={filtered} />
          </div>
        </>
      )}
    </div>
  );
}
