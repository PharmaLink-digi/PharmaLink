import { useEffect, useState } from "react";
import axios from "axios";
import "./PharmacyInventory.css";

function getStatus(quantity) {
  if (quantity <= 4) {
    return "Out Of Stock";
  }

  if (quantity < 30) {
    return "Low Stock";
  }

  return "Available";
}

export default function PharmacyInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      setError("");

      try {
        const apiUrl = import.meta.env.VITE_API_PHARMACY_INVENTORY;
      const response = await axios.get(apiUrl);

        if (Array.isArray(response.data)) {
          // Filter for logged-in pharmacy only
          const currentUserId = localStorage.getItem("userId");
          const filteredByPharmacy = response.data.filter(
            (item) => String(item.pharm_id) === String(currentUserId)
          );
          
          // Sort by medication_id
          const sorted = filteredByPharmacy.sort(
            (a, b) => (a.medication_id || 0) - (b.medication_id || 0)
          );
          
          setInventory(sorted);
        } else {
          setError("Invalid inventory response from the server.");
        }
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to load inventory data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  // Reset displayCount when search or filter changes
  useEffect(() => {
    setDisplayCount(10);
  }, [searchTerm, lowStockOnly]);

  const filteredInventory = inventory.filter((item) => {
    const searchMatch = searchTerm
      ? item.medication_name
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      : true;

    const lowStockMatch = lowStockOnly
      ? getStatus(item.quantity) === "Low Stock"
      : true;

    return searchMatch && lowStockMatch;
  });

  const formatPrice = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "-";
    return `$${Number(value).toFixed(2)}`;
  };

  const formatExpiry = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString().slice(0, 10);
  };

  return (
    <section className="inventory-section py-5">
      <div className="container">
        <div className="inventory-card shadow-sm">
          <div className="inventory-header d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h3 className="mb-1">Inventory</h3>
              <p className="mb-0">Manage your medicine inventory</p>
            </div>

            <div className="d-flex gap-2 flex-column flex-sm-row w-100 w-lg-auto align-items-center">
              <div className="inventory-search-input input-group shadow-sm rounded-pill bg-white">
                <span className="input-group-text">
                  🔍
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                type="button"
                className={`btn inventory-status-button ${
                  lowStockOnly ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setLowStockOnly((value) => !value)}
              >
                Low Stock
              </button>
            </div>
          </div>

          <div className="inventory-table-wrapper">
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover align-middle mb-0 rounded-4">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Medicine Id</th>
                    <th scope="col">Medicine Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Price</th>
                    <th scope="col">Expiry</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        Loading inventory...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6" className="text-center text-danger py-5">
                        {error}
                      </td>
                    </tr>
                  ) : filteredInventory.length > 0 ? (
                    <>
                      {filteredInventory.slice(0, displayCount).map((item, index) => {
                        const itemStatus = getStatus(item.quantity);
                        const statusBadgeClass =
                          itemStatus === "Available"
                            ? "bg-success"
                            : itemStatus === "Low Stock"
                            ? "bg-warning text-dark"
                            : "bg-danger";

                        return (
                          <tr key={index}>
                            <td>{item.medication_id || "N/A"}</td>
                            <td>{item.medication_name}</td>
                            <td>{item.quantity}</td>
                            <td>{formatPrice(item.price_sell)}</td>
                            <td>{formatExpiry(item.date_expiry)}</td>
                            <td>
                              <span className={`badge ${statusBadgeClass}`}>
                                {itemStatus}
                              </span>
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
                              onClick={() => setDisplayCount(displayCount + 10)}
                            >
                              Show More
                            </button>
                          </td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        {lowStockOnly
                          ? "No low stock medicines found."
                          : "No medicines match the current search."}
                      </td>
                    </tr>
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
