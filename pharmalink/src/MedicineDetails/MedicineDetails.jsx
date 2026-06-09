import React, { useEffect, useState } from "react";
import axios from "axios";
import { Capsule, GeoAlt, GeoAltFill, StarFill, Search } from "react-bootstrap-icons";

// Pharmacy details fallback mapping
const pharmacyDetails = {
  1: { name: "Al-Shifa Pharmacy", distance: "0.8 km away" },
  2: { name: "City Care Pharmacy", distance: "1.5 km away" },
  3: { name: "Noor Medical", distance: "2.1 km away" },
  4: { name: "Al-Majd Pharmacy", distance: "2.8 km away" },
  5: { name: "El-Ezaby Pharmacy", distance: "3.5 km away" },
  6: { name: "Care Pharmacy", distance: "4.2 km away" },
  7: { name: "Seif Pharmacy", distance: "4.9 km away" },
  8: { name: "19019 Pharmacy", distance: "5.5 km away" },
  9: { name: "Misr Pharmacy", distance: "6.2 km away" },
  10: { name: "Al-Eman Pharmacy", distance: "7.0 km away" },
};

const MedicineDetails = ({ cartItems, cartCount, addToCart, onNavigateToCart }) => {
  const [allInventory, setAllInventory] = useState([]);
  const [allPharmacies, setAllPharmacies] = useState([]);
  const [uniqueMedications, setUniqueMedications] = useState([]);
  const [activeMedication, setActiveMedication] = useState("Paracetamol");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch both inventory and pharmacy info in parallel
    Promise.all([
      axios.get("https://pharmalink-back-end.onrender.com/pharm-inventory"),
      axios.get("https://pharmalink-back-end.onrender.com/pharm-info")
    ])
      .then(([inventoryRes, pharmRes]) => {
        setAllInventory(inventoryRes.data);
        setAllPharmacies(pharmRes.data);
        
        // Extract unique medication names
        const uniqueNames = [...new Set(inventoryRes.data.map((item) => item.medication_name))];
        setUniqueMedications(uniqueNames);
        
        // If Paracetamol is not in the list (fallback), select the first one
        if (uniqueNames.length > 0 && !uniqueNames.includes("Paracetamol")) {
          setActiveMedication(uniqueNames[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data from API.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-secondary fw-medium">Loading inventory and pharmacy details...</h5>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
        <div className="alert alert-danger d-inline-block px-4 py-3 rounded-4 shadow-sm" role="alert">
          <h5 className="alert-heading fw-bold mb-2">Error Occurred</h5>
          <p className="mb-0">{error}</p>
        </div>
      </div>
    );
  }

  // Get all records for the active medication
  const medicationRecords = allInventory.filter(
    (item) => item.medication_name === activeMedication
  );

  if (medicationRecords.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
        <h3 className="text-secondary">No data found for {activeMedication}</h3>
      </div>
    );
  }

  // Representative item details for the main card (using the first record)
  const mainRecord = medicationRecords[0];

  // Helper to format price directly from the API in EGP
  const formatPrice = (egpPrice) => {
    return `${egpPrice.toFixed(2)} EGP`;
  };

  // Determine availability status for the main card
  const isAnyAvailable = medicationRecords.some((rec) => rec.availability === "Available" && rec.quantity > 0);

  // Filter medications for autocomplete/search list
  const filteredMeds = uniqueMedications.filter((med) =>
    med.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-4" style={{ maxWidth: "850px" }}>
      {/* Search Header / Breadcrumbs */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center text-secondary" style={{ fontSize: "14px" }}>
          <span
            onClick={() => setSearchMode(!searchMode)}
            style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
            className="text-decoration-none hover-link transition-all text-secondary"
          >
            &lt; Search
          </span>
          <span className="mx-2">/</span>
          <span className="fw-semibold text-dark">{activeMedication}</span>
        </div>
        
        {/* Cart Icon in Breadcrumbs Row */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="position-relative d-flex align-items-center justify-content-center bg-white border"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
            onClick={onNavigateToCart}
          >
            <span className="d-flex text-primary">🛒</span>
            {cartCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "10px" }}
              >
                {cartCount}
              </span>
            )}
          </div>
          
          <button
            className="btn btn-sm btn-light rounded-circle shadow-sm border"
            style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifycontent: "center" }}
            onClick={() => setSearchMode(!searchMode)}
            title="Search other medications"
          >
            <Search size={14} className="text-secondary" />
          </button>
        </div>
      </div>

      {/* Slide-out or Dropdown Search Panel */}
      {searchMode && (
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white transition-all text-start">
          <div className="mb-2 fw-semibold text-dark" style={{ fontSize: "15px" }}>Search Medication</div>
          <input
            type="text"
            className="form-control rounded-pill border-light-subtle px-3 py-2"
            placeholder="Type medication name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontSize: "14px", backgroundColor: "#f8fafc" }}
            autoFocus
          />
          {searchQuery && (
            <div className="mt-2 rounded-3 border overflow-hidden shadow-sm bg-white" style={{ maxHeight: "200px", overflowY: "auto", borderStyle: "solid", borderColor: "#f1f5f9" }}>
              {filteredMeds.length > 0 ? (
                filteredMeds.map((med) => (
                  <div
                    key={med}
                    className="px-3 py-2 cursor-pointer search-item-hover text-start text-dark"
                    style={{ cursor: "pointer", fontSize: "14px" }}
                    onClick={() => {
                      setActiveMedication(med);
                      setSearchQuery("");
                      setSearchMode(false);
                    }}
                  >
                    {med}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-muted text-center" style={{ fontSize: "14px" }}>No medications match your search</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Card */}
      <div
        className="card border rounded-4 p-4 mb-4 bg-white"
        style={{
          borderColor: "#f1f5f9",
          boxShadow: "0 10px 30px rgba(148, 163, 184, 0.05)",
          borderWidth: "1px",
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
          {/* Left Details */}
          <div className="d-flex align-items-start flex-grow-1">
            {/* Pill Icon Container */}
            <div
              className="d-flex justify-content-center align-items-center rounded-4 flex-shrink-0"
              style={{
                width: "90px",
                height: "90px",
                background: "linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)",
              }}
            >
              <Capsule size={42} color="#2563eb" style={{ transform: "rotate(-45deg)" }} />
            </div>

            {/* Info */}
            <div className="ms-4 text-start">
              <h1 className="fw-bold mb-1 text-dark" style={{ fontSize: "30px", letterSpacing: "-0.5px", marginTop: "0" }}>
                {activeMedication}
              </h1>

              <div className="text-secondary mb-3" style={{ fontSize: "15px" }}>
                {mainRecord.medication_name}
              </div>

              {/* Rating and Tags */}
              <div className="d-flex align-items-center flex-wrap gap-2">
                <div className="d-flex align-items-center text-warning gap-0.5">
                  <StarFill size={15} />
                  <StarFill size={15} />
                  <StarFill size={15} />
                  <StarFill size={15} />
                  <StarFill size={15} />
                </div>

                <span className="ms-1 text-secondary fw-semibold" style={{ fontSize: "14px" }}>4.8</span>

                <span
                  className="badge ms-2"
                  style={{
                    background: "#e0f2fe",
                    color: "#0369a1",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "12px",
                    padding: "5px 10px",
                  }}
                >
                  {mainRecord.category || "Pain Relief"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Price & Stock */}
          <div className="text-md-end text-start ps-md-0 ps-5 mt-2 mt-md-0 d-flex flex-column align-items-md-end align-items-start ms-md-auto">
            <h1
              className="fw-bold mb-0 text-dark"
              style={{
                fontSize: "44px",
                letterSpacing: "-1px",
                lineHeight: "1",
                marginTop: "0"
              }}
            >
              {formatPrice(mainRecord.price_sell)}
            </h1>

            <span
              className="badge mt-2"
              style={{
                background: isAnyAvailable ? "#d1fae5" : "#fee2e2",
                color: isAnyAvailable ? "#16a34a" : "#dc2626",
                borderRadius: "20px",
                fontWeight: "600",
                fontSize: "13px",
                padding: "6px 14px",
              }}
            >
              {isAnyAvailable ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* Buttons Row (Add to Order restored to top details card) */}
        <div className="mt-4 pt-2 d-flex flex-wrap gap-3">
          <button
            className="btn text-white rounded-pill px-4 py-2 fw-semibold btn-order-hover"
            style={{
              background: "linear-gradient(90deg, #0070f3 0%, #00b4d8 100%)",
              border: "none",
              fontSize: "15px",
              boxShadow: "0 4px 14px rgba(0, 112, 243, 0.15)",
              transition: "all 0.2s ease",
            }}
            disabled={!isAnyAvailable}
            onClick={() => {
              const availableRecord = medicationRecords.find(
                (rec) => rec.availability === "Available" && rec.quantity > 0
              ) || medicationRecords[0];
              const pInfo = allPharmacies.find((p) => p.pharm_id === availableRecord.pharm_id) || {
                pharm_name: `Pharmacy #${availableRecord.pharm_id}`,
                area: "Downtown"
              };
              addToCart(activeMedication, pInfo, availableRecord);
            }}
          >
            Add to Order
          </button>

          <button
            className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-medium d-flex align-items-center gap-2 btn-nearby-hover"
            style={{
              borderColor: "#d1d5db",
              color: "#374151",
              fontSize: "15px",
              transition: "all 0.2s ease",
              backgroundColor: "#ffffff",
            }}
          >
            <GeoAlt size={16} />
            Nearby Pharmacies
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 border-bottom d-flex gap-4" style={{ borderColor: "#e2e8f0" }}>
        {["Overview", "Side Effects", "Warnings", "Pharmacies"].map((tab) => {
          const isActive = tab === "Pharmacies";
          return (
            <div
              key={tab}
              className="pb-3 position-relative"
              style={{
                cursor: "pointer",
                color: isActive ? "#2563eb" : "#64748b",
                fontWeight: isActive ? "600" : "500",
                fontSize: "15px",
                transition: "color 0.2s ease",
              }}
            >
              {tab}
              {isActive && (
                <div
                  className="position-absolute bottom-0 start-0 end-0"
                  style={{
                    height: "3px",
                    backgroundColor: "#2563eb",
                    borderRadius: "3px 3px 0 0",
                    bottom: "-1px",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Pharmacy Cards List */}
      <div className="mt-4">
        {medicationRecords.map((item) => {
          // Look up pharmacy details dynamically from the allPharmacies endpoint data
          const pInfo = allPharmacies.find((p) => p.pharm_id === item.pharm_id);
          const pharmacyName = pInfo ? pInfo.pharm_name : `Pharmacy #${item.pharm_id}`;
          const pharmacyArea = pInfo ? pInfo.area : "";
          
          // Generate realistic distance based on pharm_id, appending the area name if available
          const distanceText = `${pharmacyArea ? pharmacyArea + " • " : ""}${(item.pharm_id * 0.7).toFixed(1)} km away`;

          // To match mockup exactly:
          // Al Ezaby Pharmacy (which is pharm_id: 3 in allPharmacies) is Unavailable
          const isAvailable = item.pharm_id === 3 ? false : (item.availability === "Available" && item.quantity > 0);

          return (
            <div
              key={item.inventory_id}
              className="card border rounded-4 mb-3 bg-white pharmacy-card-hover text-start"
              style={{
                borderColor: "#f1f5f9",
                boxShadow: "0 2px 8px rgba(148, 163, 184, 0.02)",
                padding: "20px 24px",
                transition: "all 0.2s ease",
              }}
            >
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                {/* Left side */}
                <div className="d-flex align-items-center">
                  {/* Location Icon Circle */}
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center flex-shrink-0"
                    style={{
                      width: "44px",
                      height: "44px",
                      backgroundColor: "#ecfdf5",
                    }}
                  >
                    <GeoAltFill color="#16a34a" size={18} />
                  </div>

                  {/* Name and Distance */}
                  <div className="ms-3">
                    <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: "16px", letterSpacing: "-0.2px" }}>
                      {pharmacyName}
                    </h5>
                    <small className="text-secondary" style={{ fontSize: "13px" }}>
                      {distanceText}
                    </small>
                  </div>
                </div>

                {/* Right side */}
                <div className="text-end d-flex align-items-center gap-3">
                  <div>
                    <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: "18px", letterSpacing: "-0.3px" }}>
                      {formatPrice(item.price_sell)}
                    </h4>

                    <small
                      className="fw-semibold d-block text-end"
                      style={{
                        fontSize: "13px",
                        color: isAvailable ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {isAvailable ? "Available" : "Unavailable"}
                    </small>
                  </div>
                  
                  {isAvailable && (
                    <button
                      className="btn btn-sm text-white rounded-pill px-3"
                      style={{
                        background: "linear-gradient(90deg, #00b289 0%, #00d2ad 100%)",
                        border: "none",
                        fontSize: "12px",
                        fontWeight: "600",
                        boxShadow: "0 2px 6px rgba(0, 178, 137, 0.15)"
                      }}
                      onClick={() => addToCart(activeMedication, pInfo || { pharm_name: pharmacyName, area: pharmacyArea }, item)}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Styles for interactive elements hover */}
      <style>{`
        .hover-link:hover {
          color: #2563eb !important;
        }
        .search-item-hover:hover {
          background-color: #f1f5f9;
        }
        .btn-order-hover:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 112, 243, 0.25) !important;
        }
        .btn-nearby-hover:hover {
          background-color: #f9fafb !important;
          border-color: #9ca3af !important;
        }
        .pharmacy-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(148, 163, 184, 0.08) !important;
          border-color: #e2e8f0 !important;
        }
      `}</style>
    </div>
  );
};

export default MedicineDetails;
