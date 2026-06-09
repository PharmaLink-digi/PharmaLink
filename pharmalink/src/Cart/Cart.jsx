import React from "react";
import { Trash, Plus, Dash, ArrowLeft, Capsule } from "react-bootstrap-icons";

const Cart = ({ cartItems, updateCartQuantity, removeFromCart, onNavigateBack, onCheckout }) => {
  // Helper to format price
  const formatPrice = (price) => {
    return `${price.toFixed(0)} EGP`;
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price_sell * item.quantity, 0);
  
  // Delivery fee is 70 EGP (matching the cart mockup screenshot) if there are items, otherwise 0
  const deliveryFee = cartItems.length > 0 ? 70 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="container py-4 text-start" style={{ maxWidth: "950px" }}>
      {/* Back to Medicine details */}
      <div className="mb-4">
        <span
          onClick={onNavigateBack}
          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", fontSize: "14px" }}
          className="text-secondary hover-link text-decoration-none transition-all fw-semibold"
        >
          <ArrowLeft size={16} className="me-2" /> Back to Medication
        </span>
      </div>

      <h1 className="fw-bold mb-4 text-dark" style={{ fontSize: "32px", color: "#08060d" }}>
        Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div className="mb-3" style={{ fontSize: "50px" }}>🛒</div>
          <h4 className="fw-bold text-dark mb-2">Your cart is empty</h4>
          <p className="text-secondary mb-4">You haven't added any medications to your cart yet.</p>
          <button
            className="btn text-white rounded-pill px-4 py-2"
            style={{
              background: "#00b289",
              border: "none",
              fontWeight: "600"
            }}
            onClick={onNavigateBack}
          >
            Browse Medications
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => (
                <div
                  key={item.inventory_id}
                  className="card border rounded-4 bg-white"
                  style={{
                    borderColor: "#e5e4e7",
                    padding: "16px 20px"
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between flex-wrap flex-md-nowrap gap-3">
                    {/* Item Details */}
                    <div className="d-flex align-items-center flex-grow-1">
                      {/* Image container */}
                      <div
                        className="rounded-3 flex-shrink-0 overflow-hidden d-flex align-items-center justify-content-center border"
                        style={{
                          width: "70px",
                          height: "70px",
                          backgroundColor: "#f8fafc"
                        }}
                      >
                        {/* Fallback to generated image or icon */}
                        <img
                          src="/congestal.jpg"
                          alt={item.medication_name}
                          onError={(e) => {
                            // If image is missing, render an SVG icon fallback
                            e.target.style.display = "none";
                            const parent = e.target.parentElement;
                            const fallback = document.createElement("div");
                            fallback.className = "d-flex justify-content-center align-items-center h-100 w-100";
                            fallback.style.background = "linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)";
                            fallback.innerHTML = `<svg viewBox="0 0 16 16" width="30" height="30" fill="#2563eb" style="transform: rotate(-45deg)"><path d="M1.828 8.9 8.9 1.828a4 4 0 1 1 5.656 5.656L7.485 14.556a4 4 0 1 1-5.656-5.656zM2.535 9.61l5.657 5.656a3 3 0 1 0 4.242-4.242L6.879 5.366 2.535 9.61zm8.485-8.486L5.464 6.78l4.243 4.243 5.556-5.556a3 3 0 1 0-4.242-4.243z"/></svg>`;
                            parent.appendChild(fallback);
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      </div>

                      {/* Title & Pharmacy */}
                      <div className="ms-3 text-start">
                        <h5 className="mb-1 fw-bold text-dark" style={{ fontSize: "16px", margin: "0" }}>
                          {item.medication_name}
                        </h5>
                        <p className="text-secondary mb-0" style={{ fontSize: "13px" }}>
                          {item.pharmacy_name} - {item.pharmacy_area}
                        </p>
                        
                        {/* Quantity Counter (Mobile) */}
                        <div className="d-flex d-md-none align-items-center mt-2 border rounded-pill px-2 py-1 bg-light" style={{ width: "fit-content" }}>
                          <button
                            className="btn btn-link p-0 text-secondary d-flex align-items-center"
                            onClick={() => updateCartQuantity(item.inventory_id, -1)}
                            style={{ border: "none", textDecoration: "none" }}
                          >
                            <Dash size={16} />
                          </button>
                          <span className="mx-3 fw-semibold text-dark" style={{ fontSize: "14px" }}>
                            {item.quantity}
                          </span>
                          <button
                            className="btn btn-link p-0 text-secondary d-flex align-items-center"
                            onClick={() => updateCartQuantity(item.inventory_id, 1)}
                            style={{ border: "none", textDecoration: "none" }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Counter, Price & Delete */}
                    <div className="d-flex align-items-center justify-content-between justify-content-md-end w-100 w-md-auto gap-4 mt-2 mt-md-0">
                      {/* Quantity Counter (Desktop) */}
                      <div className="d-none d-md-flex align-items-center border rounded-pill px-2 py-1 bg-light">
                        <button
                          className="btn btn-link p-0 text-secondary d-flex align-items-center hover-link"
                          onClick={() => updateCartQuantity(item.inventory_id, -1)}
                          style={{ border: "none", textDecoration: "none" }}
                        >
                          <Dash size={16} />
                        </button>
                        <span className="mx-3 fw-semibold text-dark" style={{ fontSize: "14px", minWidth: "12px", textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-link p-0 text-secondary d-flex align-items-center hover-link"
                          onClick={() => updateCartQuantity(item.inventory_id, 1)}
                          style={{ border: "none", textDecoration: "none" }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-end" style={{ minWidth: "80px" }}>
                        <span className="fw-bold" style={{ color: "#00b289", fontSize: "18px" }}>
                          {formatPrice(item.price_sell * item.quantity)}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        className="btn btn-link p-0 text-danger hover-link"
                        onClick={() => removeFromCart(item.inventory_id)}
                        style={{ border: "none", textDecoration: "none" }}
                        title="Remove item"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="col-lg-4">
            <div
              className="card border rounded-4 p-4 bg-white shadow-sm"
              style={{
                borderColor: "#e5e4e7"
              }}
            >
              <div className="d-flex justify-content-between mb-2 text-secondary" style={{ fontSize: "15px" }}>
                <span>Subtotal</span>
                <span className="fw-semibold text-dark">{formatPrice(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-secondary" style={{ fontSize: "15px" }}>
                <span>Delivery</span>
                <span className="fw-semibold text-dark">{formatPrice(deliveryFee)}</span>
              </div>
              
              <hr style={{ borderTop: "1px solid #e5e4e7", margin: "15px 0" }} />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold text-dark" style={{ fontSize: "18px" }}>Total</span>
                <span className="fw-extrabold" style={{ color: "#00b289", fontSize: "22px" }}>
                  {formatPrice(total)}
                </span>
              </div>

              <button
                className="btn text-white w-100 rounded-pill py-3 fw-bold btn-checkout-hover"
                style={{
                  background: "#00b289",
                  border: "none",
                  fontSize: "16px",
                  boxShadow: "0 4px 12px rgba(0, 178, 137, 0.15)",
                  transition: "all 0.2s ease"
                }}
                onClick={onCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Styles for hover effect */}
      <style>{`
        .btn-checkout-hover:hover {
          background-color: #009e79 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 178, 137, 0.25) !important;
        }
        .hover-link:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default Cart;
