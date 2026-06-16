import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./PharmacyInventory.css";

function getStatus(quantity) {
  if (quantity <= 0) return "Out Of Stock";
  if (quantity < 30) return "Low Stock";
  return "Available";
}

const STATUS_ALL = "all";
const STATUS_LOW = "low";
const STATUS_OUT = "out";

export default function PharmacyInventory() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState(STATUS_ALL);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");
    if (!userId) { navigate("/signin", { replace: true }); return; }
    if (role !== "pharmacy") { navigate("/signin", { replace: true }); return; }

    async function fetchInventory() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/pharm-inventory", {
          headers: { "Cache-Control": "no-cache" },
        });
        const all = Array.isArray(data) ? data : [];
        // Backend ignores query params — filter client-side
        const mine = all
          .filter((item) => String(item.pharm_id) === String(userId))
          .sort((a, b) => (a.medication_id || 0) - (b.medication_id || 0));
        setInventory(mine);
      } catch (err) {
        setError("Unable to load inventory. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  useEffect(() => {
    setDisplayCount(10);
  }, [searchTerm, statusFilter]);

  const filteredInventory = inventory.filter((item) => {
    const nameMatch = searchTerm
      ? (item.medication_name || "").toLowerCase().includes(searchTerm.trim().toLowerCase())
      : true;

    const status = getStatus(item.quantity);
    const statusMatch =
      statusFilter === STATUS_ALL ? true :
      statusFilter === STATUS_LOW ? status === "Low Stock" :
      statusFilter === STATUS_OUT ? status === "Out Of Stock" :
      true;

    return nameMatch && statusMatch;
  });

  const formatPrice = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "—";
    return `${Math.max(0, Number(value)).toFixed(2)} EGP`;
  };

  const formatExpiry = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString().slice(0, 10);
  };

  const isExpiringSoon = (value) => {
    if (!value) return false;
    const diff = new Date(value) - new Date();
    return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000; // within 90 days
  };

  const lowCount = inventory.filter((i) => getStatus(i.quantity) === "Low Stock").length;
  const outCount = inventory.filter((i) => getStatus(i.quantity) === "Out Of Stock").length;

  return (
    <section className="inventory-section py-5">
      <div className="container">
        <div className="inventory-card shadow-sm">

          {/* Header */}
          <div className="inventory-header d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 mb-4">
            <div>
              <h3 className="mb-1">Inventory</h3>
              <p className="mb-0 text-muted">
                {inventory.length} items total
                {outCount > 0 && <span className="badge bg-danger ms-2">{outCount} Out of Stock</span>}
                {lowCount > 0 && <span className="badge bg-warning text-dark ms-2">{lowCount} Low Stock</span>}
              </p>
            </div>

            <div className="d-flex gap-2 flex-column flex-sm-row w-100 w-lg-auto align-items-center">
              <div className="inventory-search-input input-group shadow-sm rounded-pill bg-white">
                <span className="input-group-text">🔍</span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="form-select rounded-pill"
                style={{ minWidth: "140px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value={STATUS_ALL}>All Status</option>
                <option value={STATUS_LOW}>Low Stock</option>
                <option value={STATUS_OUT}>Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="inventory-table-wrapper">
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover align-middle mb-0 rounded-4">
                <thead className="table-light">
                  <tr>
                    <th>Medicine ID</th>
                    <th>Medicine Name</th>
                    <th>Quantity</th>
                    <th>Price (EGP)</th>
                    <th>Expiry</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                        Loading inventory...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6" className="text-center text-danger py-5">{error}</td>
                    </tr>
                  ) : filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        {inventory.length === 0
                          ? "No inventory records found."
                          : "No items match the current filter."}
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredInventory.slice(0, displayCount).map((item) => {
                        const status = getStatus(item.quantity);
                        const badgeClass =
                          status === "Available" ? "bg-success" :
                          status === "Low Stock" ? "bg-warning text-dark" :
                          "bg-danger";
                        const expiringSoon = isExpiringSoon(item.date_expiry);

                        return (
                          <tr key={item.inventory_id ?? `${item.pharm_id}-${item.medication_id}`}>
                            <td>{item.medication_id ?? "—"}</td>
                            <td className="fw-medium">{item.medication_name}</td>
                            <td>
                              <span className={item.quantity <= 0 ? "text-danger fw-bold" : item.quantity < 30 ? "text-warning fw-bold" : ""}>
                                {Math.max(0, item.quantity)}
                              </span>
                            </td>
                            <td>{formatPrice(item.price_sell)}</td>
                            <td>
                              {expiringSoon
                                ? <span className="text-warning fw-semibold">⚠ {formatExpiry(item.date_expiry)}</span>
                                : formatExpiry(item.date_expiry)}
                            </td>
                            <td>
                              <span className={`badge ${badgeClass}`}>{status}</span>
                            </td>
                          </tr>
                        );
                      })}
                      {displayCount < filteredInventory.length && (
                        <tr>
                          <td colSpan="6" className="text-center py-3">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setDisplayCount((c) => c + 10)}
                            >
                              Show More ({filteredInventory.length - displayCount} remaining)
                            </button>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
