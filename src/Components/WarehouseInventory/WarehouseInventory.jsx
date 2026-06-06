import { useEffect, useState } from "react";
import axios from "axios";
import "./WarehouseInventory.css";

export default function WarehouseInventory() {
  const [warehouse, setWarehouse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    async function fetchWarehouseInventory() {
      setLoading(true);
      setError("");

      try {
        const apiUrl = import.meta.env.VITE_API_WAREHOUSE_INVENTORY;
      const response = await axios.get(apiUrl);

        if (Array.isArray(response.data)) {
          const currentWarehouseId = 85505; // show only this warehouse for now
          // Sort by medication_id and filter by the active warehouse
          const sorted = response.data
            .filter((item) => item.warehouse_id == currentWarehouseId)
            .sort((a, b) => (a.medication_id || 0) - (b.medication_id || 0));
          
          setWarehouse(sorted);
        } else {
          setError("Invalid warehouse response from the server.");
        }
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to load warehouse data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchWarehouseInventory();
  }, []);

  // Reset displayCount when search changes
  useEffect(() => {
    setDisplayCount(10);
  }, [searchTerm]);

  const filteredWarehouse = warehouse.filter((item) => {
    const searchMatch = searchTerm
      ? item.medication_name
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      : true;

    return searchMatch;
  });

  const formatPrice = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "-";
    return `$${Number(value).toFixed(2)}`;
  };

  return (
    <section className="warehouse-section py-5">
      <div className="container">
        <div className="warehouse-card shadow-sm">
          <div className="warehouse-header d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h3 className="mb-1">Warehouse Inventory</h3>
              <p className="mb-0">Manage warehouse stock levels</p>
            </div>

            <div className="d-flex gap-2 flex-column flex-sm-row w-100 w-lg-auto align-items-center">
              <div className="warehouse-search-input input-group shadow-sm rounded-pill bg-white">
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
            </div>
          </div>

          <div className="warehouse-table-wrapper">
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover align-middle mb-0 rounded-4">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Medicine Id</th>
                    <th scope="col">Medicine Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="text-center text-danger py-5">
                        Error loading data
                      </td>
                    </tr>
                  ) : filteredWarehouse.length > 0 ? (
                    <>
                      {filteredWarehouse.slice(0, displayCount).map((item, index) => (
                        <tr key={index}>
                          <td>{item.medication_id || "N/A"}</td>
                          <td>{item.medication_name}</td>
                          <td>{item.category || "N/A"}</td>
                          <td>{formatPrice(item.price_per_unit)}</td>
                          <td>{item.quantity}</td>
                        </tr>
                      ))}
                      {displayCount < filteredWarehouse.length && (
                        <tr>
                          <td colSpan="5" className="text-center py-3">
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
                      <td colSpan="5" className="text-center py-5">
                        No data available.
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
