import React, { useState } from 'react';
import api from '../../utils/api';
import './OrderDashboard.css';

export default function OrderDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);

  // Order modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(10);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      setLoadingSearch(true);
      setError(null);
      setMedicines([]);
      setInventory([]);
      setSelectedMedication(null);

      const url = `/medications/search?query=${encodeURIComponent(searchTerm)}`;
      const response = await api.get(url);
      
      const results = response.data.results || [];
      setMedicines(results);
      
      if (results.length === 0) {
        setError('No medications found for this search.');
      } else if (results.length === 1) {
        // Auto-select if only 1 result
        handleSelectMedication(results[0]);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search medications');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectMedication = async (med) => {
  try {
    setSelectedMedication(med);
    setLoadingInventory(true);
    setError(null);
    setInventory([]);

    // Get inventory
    const inventoryRes = await api.get('/warehouse-inventory');

    const inventoryData = Array.isArray(inventoryRes.data)
      ? inventoryRes.data
      : inventoryRes.data.data || [];

    // Filter by selected medication
    const filteredInventory = inventoryData.filter(
      item =>
        Number(item.medication_id) === Number(med.medication_id) &&
        Number(item.quantity) > 0
    );

    // Get warehouses
    const warehouseRes = await api.get('/warehouses');

    const warehouses = Array.isArray(warehouseRes.data)
      ? warehouseRes.data
      : warehouseRes.data.data || [];

    // Join inventory + warehouses
    const joinedData = filteredInventory
      .map(inv => {
        const warehouse = warehouses.find(
          wh =>
            Number(wh.warehouse_id) ===
            Number(inv.warehouse_id)
        );

        return {
          w_inventory_id: inv.w_inventory_id,
          warehouse_id: inv.warehouse_id,
          warehouse_code:
            warehouse?.warehouse_code ||
            `WH-${inv.warehouse_id}`,
          area:
            warehouse?.area ||
            "Unknown Area",
          medication_id: inv.medication_id,
          medication_name: inv.medication_name,
          price_per_unit: Number(inv.price_per_unit || 0),
          quantity: Number(inv.quantity || 0)
        };
      })
      .filter(item => item.quantity > 0)
      .sort(
        (a, b) =>
          a.price_per_unit - b.price_per_unit
      );

    setInventory(joinedData);

    if (joinedData.length === 0) {
      setError(
        `No warehouses currently stock ${med.medication_name}`
      );
    }
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message ||
      "Failed to fetch warehouse inventory"
    );
  } finally {
    setLoadingInventory(false);
  }
};
  const getStatusInfo = (qty) => {
    if (qty <= 0) return { text: 'Out of Stock', class: 'status-out' };
    if (qty < 50) return { text: 'Low Stock', class: 'status-low' };
    return { text: 'Available', class: 'status-available' };
  };

  const openOrderModal = (inv) => {
    setSelectedInventory(inv);
    setOrderQuantity(10);
    setOrderSuccess(null);
    setError(null);
    setShowModal(true);
  };

  const closeOrderModal = () => {
    setShowModal(false);
    setSelectedInventory(null);
  };

  const submitOrder = async () => {
    if (orderQuantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    if (orderQuantity > selectedInventory.quantity) {
      setError(`Only ${selectedInventory.quantity} units available in stock`);
      return;
    }

    try {
      setOrderLoading(true);
      setError(null);
      
      // Use logged-in user ID
      const pharmId = localStorage.getItem("userId");
      
      // 1. Create order
      const orderPayload = {
        pharm_id: pharmId,
        order_date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      
      const orderRes = await api.post('/orders', orderPayload);
      const newOrder = Array.isArray(orderRes.data) ? orderRes.data[0] : orderRes.data;

      if (!newOrder?.order_id) throw new Error('Order creation failed');

      // 2. Create order details
      const detailPayload = {
        order_id:        newOrder.order_id,
        pharm_id:        pharmId,
        warehouse_id:    selectedInventory.warehouse_id,
        medication_id:   selectedMedication.medication_id,
        medication_name: selectedMedication.medication_name || null,
        quantity:        orderQuantity,
        unit_price:      selectedInventory.price_per_unit,
        line_total:      orderQuantity * selectedInventory.price_per_unit,
      };
      
      await api.post('/order-details', detailPayload);
      
      setOrderSuccess(`Order #${newOrder.order_id} placed successfully!`);
      
      // Refresh inventory
      handleSelectMedication(selectedMedication);
      
      setTimeout(() => {
        closeOrderModal();
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="order-dashboard-bg" dir="ltr">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="dashboard-header mb-2">Pharmacy Order Dashboard</h2>
          <p className="text-muted">Find medications in warehouses and place orders securely.</p>
        </div>

        {/* Search Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="d-flex gap-2">
              <div className="position-relative flex-grow-1 search-input-wrapper">
                <input
                  type="text"
                  className="form-control py-3 ps-5"
                  placeholder="Enter medication name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <i className="bi bi-search search-field-icon position-absolute"></i>
              </div>
              <button 
                className="btn btn-primary-gradient px-4 fw-bold" 
                onClick={handleSearch}
                disabled={loadingSearch}
              >
                {loadingSearch ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && !showModal && (
          <div className="alert alert-danger" role="alert">
             {error}
          </div>
        )}

        {/* Medication Selection */}
        {medicines.length > 1 && !selectedMedication && (
          <div className="mb-5">
            <h5 className="mb-3">Select Medication:</h5>
            <div className="d-flex flex-wrap gap-2">
              {medicines.map(med => (
                <button 
                  key={med.medication_id} 
                  className="btn btn-outline-primary"
                  onClick={() => handleSelectMedication(med)}
                >
                  {med.medication_name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Inventory */}
        {loadingInventory && (
           <div className="text-center py-5">
             <div className="spinner-border text-primary" role="status"></div>
             <p className="mt-2 text-muted">Loading warehouse inventory...</p>
           </div>
        )}

        {/* Inventory Results */}
        {selectedMedication && inventory.length > 0 && !loadingInventory && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-dark">
                Available Stock for <span className="text-primary">{selectedMedication.medication_name}</span>
              </h4>
            </div>
            
            <div className="row g-4">
              {inventory.map((inv, idx) => {
                const isBestPrice = idx === 0;
                const status = getStatusInfo(inv.quantity);
                
                return (
                  <div key={inv.w_inventory_id} className="col-12 col-md-6 col-lg-4">
                    <div className={`card inventory-card p-4 h-100 ${isBestPrice ? 'best-price' : ''}`}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        {isBestPrice ? (
                           <span className="best-price-badge"><i className="bi bi-star-fill me-1"></i> Best Price</span>
                        ) : (
                           <span></span>
                        )}
                        <span className={`status-badge ${status.class}`}>{status.text}</span>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="warehouse-code mb-1">
                          <i className="bi bi-building me-2"></i>
                          {inv.warehouse_code}
                        </h5>
                        <div className="area-text">
                          <i className="bi bi-geo-alt me-1"></i>
                          {inv.area}
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-end mt-auto">
                        <div>
                          <div className="quantity-text mb-1">
                            Stock: {inv.quantity} units
                          </div>
                          <div className="price-text">
                             <span className="currency-text">$</span>
                             {Number(inv.price_per_unit).toFixed(2)}
                          </div>
                        </div>
                        
                        <button 
                          className="btn btn-accent px-4 py-2 fw-semibold"
                          onClick={() => openOrderModal(inv)}
                          disabled={inv.quantity <= 0}
                        >
                          Request Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showModal && selectedInventory && (
        <div className="modal-overlay" onClick={closeOrderModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Place Order</h4>
              <button className="btn-close" onClick={closeOrderModal}></button>
            </div>
            
            {orderSuccess ? (
               <div className="alert alert-success text-center py-4">
                 <i className="bi bi-check-circle-fill fs-1 text-success d-block mb-2"></i>
                 <h5 className="mb-0">{orderSuccess}</h5>
               </div>
            ) : (
              <>
                {error && <div className="alert alert-danger">{error}</div>}
                
                <div className="bg-light p-3 rounded-3 mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Medication:</span>
                    <span className="fw-bold">{selectedMedication.medication_name}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Warehouse:</span>
                    <span className="fw-bold">{selectedInventory.warehouse_code}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Unit Price:</span>
                    <span className="fw-bold">${selectedInventory.price_per_unit}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Available Stock:</span>
                    <span className="fw-bold text-primary">{selectedInventory.quantity}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Order Quantity (max: {selectedInventory.quantity})</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    min="1"
                    max={selectedInventory.quantity}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  />
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fs-5 fw-bold text-muted">Total:</span>
                  <span className="fs-3 fw-bold text-dark">
                    ${(orderQuantity * selectedInventory.price_per_unit).toFixed(2)}
                  </span>
                </div>

                <button 
                  className="btn btn-primary-gradient w-100 py-3 fw-bold fs-5"
                  onClick={submitOrder}
                  disabled={orderLoading}
                >
                  {orderLoading ? 'Processing...' : 'Confirm Order'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
