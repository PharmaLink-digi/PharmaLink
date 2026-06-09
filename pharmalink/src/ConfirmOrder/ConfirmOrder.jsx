import React, { useState } from "react";
import { ArrowLeft, CheckCircleFill, CreditCard, Cash, ShieldCheck } from "react-bootstrap-icons";

const ConfirmOrder = ({ cartItems, orderDetails, setOrderDetails, onNavigateBack, onOrderPlaced }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const formatPrice = (price) => {
    return `${price.toFixed(0)} EGP`;
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price_sell * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 50 : 0; // matching confirm order mockup screenshot (50 EGP)
  const total = subtotal + deliveryFee;

  const handleInputChange = (field, val) => {
    setOrderDetails((prev) => ({
      ...prev,
      [field]: val
    }));
    
    // Clear error
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleVisaChange = (field, val) => {
    setOrderDetails((prev) => ({
      ...prev,
      visaDetails: {
        ...prev.visaDetails,
        [field]: val
      }
    }));

    if (formErrors[`visa_${field}`]) {
      setFormErrors((prev) => ({ ...prev, [`visa_${field}`]: null }));
    }
  };

  // Helper formatting for visa card
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const validateForm = () => {
    const errors = {};
    if (!orderDetails.address.trim()) errors.address = "Delivery address is required";
    if (!orderDetails.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(orderDetails.phone.trim())) {
      errors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    if (orderDetails.paymentMethod === "visa") {
      const { cardholderName, cardNumber, expiryDate, cvv } = orderDetails.visaDetails;
      if (!cardholderName.trim()) errors.visa_cardholderName = "Cardholder name is required";
      if (!cardNumber.trim()) {
        errors.visa_cardNumber = "Card number is required";
      } else if (cardNumber.replace(/\s/g, "").length !== 16) {
        errors.visa_cardNumber = "Card number must be 16 digits";
      }
      
      if (!expiryDate.trim()) {
        errors.visa_expiryDate = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        errors.visa_expiryDate = "Format must be MM/YY";
      }

      if (!cvv.trim()) {
        errors.visa_cvv = "CVV is required";
      } else if (cvv.trim().length !== 3) {
        errors.visa_cvv = "CVV must be 3 digits";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1200);
  };

  return (
    <div className="container py-4 text-start" style={{ maxWidth: "700px" }}>
      {/* Back navigation */}
      <div className="mb-4">
        <span
          onClick={onNavigateBack}
          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", fontSize: "14px" }}
          className="text-secondary hover-link text-decoration-none transition-all fw-semibold"
        >
          <ArrowLeft size={16} className="me-2" /> Back to Cart
        </span>
      </div>

      <h1 className="fw-bold mb-4 text-dark" style={{ fontSize: "32px", color: "#08060d" }}>
        Confirm order
      </h1>

      <form onSubmit={handleSubmit}>
        <div
          className="card border rounded-4 p-4 mb-4 bg-white shadow-sm"
          style={{
            borderColor: "#e5e4e7"
          }}
        >
          {/* Delivery Address */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary" style={{ fontSize: "15px" }}>
              Delivery address
            </label>
            <textarea
              className={`form-control rounded-3 p-3 ${formErrors.address ? "is-invalid" : ""}`}
              rows="3"
              style={{
                backgroundColor: "#fafbfc",
                borderColor: "#e5e4e7",
                fontSize: "15px",
                resize: "none"
              }}
              placeholder="Enter your street address, apartment, floor, building..."
              value={orderDetails.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
          </div>

          {/* Phone Number */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary" style={{ fontSize: "15px" }}>
              Phone number
            </label>
            <input
              type="tel"
              className={`form-control rounded-3 p-3 ${formErrors.phone ? "is-invalid" : ""}`}
              style={{
                backgroundColor: "#fafbfc",
                borderColor: "#e5e4e7",
                fontSize: "15px"
              }}
              placeholder="e.g. 01012345678"
              value={orderDetails.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="form-label fw-semibold text-secondary" style={{ fontSize: "15px" }}>
              Notes
            </label>
            <textarea
              className="form-control rounded-3 p-3"
              rows="2"
              style={{
                backgroundColor: "#fafbfc",
                borderColor: "#e5e4e7",
                fontSize: "15px",
                resize: "none"
              }}
              placeholder="Any instructions for delivery or pharmacy..."
              value={orderDetails.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </div>

          {/* Payment Method Section (طريقة الدفع) */}
          <div className="mb-4 pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "17px" }}>
              طريقة الدفع (Payment Method)
            </h5>
            
            <div className="row g-3">
              {/* Cash On Delivery Card */}
              <div className="col-md-6">
                <div
                  className="card rounded-3 p-3 text-start transition-all cursor-pointer h-100 position-relative"
                  style={{
                    border: orderDetails.paymentMethod === "cash" ? "2px solid #2563eb" : "1.5px solid #e5e4e7",
                    backgroundColor: orderDetails.paymentMethod === "cash" ? "#f0fdf4" : "#ffffff",
                    cursor: "pointer"
                  }}
                  onClick={() => handleInputChange("paymentMethod", "cash")}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle p-2 bg-light text-secondary d-flex align-items-center justify-content-center me-3">
                        <Cash size={20} className={orderDetails.paymentMethod === "cash" ? "text-success" : ""} />
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: "15px" }}>الدفع عند الاستلام</div>
                        <small className="text-secondary" style={{ fontSize: "12px" }}>ادفع نقداً عند وصول طلبك</small>
                      </div>
                    </div>
                    {orderDetails.paymentMethod === "cash" && (
                      <span className="badge rounded-circle p-1 bg-success d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px" }}>
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Visa Payment Card */}
              <div className="col-md-6">
                <div
                  className="card rounded-3 p-3 text-start transition-all cursor-pointer h-100 position-relative"
                  style={{
                    border: orderDetails.paymentMethod === "visa" ? "2px solid #00b289" : "1.5px solid #e5e4e7",
                    backgroundColor: orderDetails.paymentMethod === "visa" ? "#f0fdf4" : "#ffffff",
                    cursor: "pointer"
                  }}
                  onClick={() => handleInputChange("paymentMethod", "visa")}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle p-2 bg-light text-secondary d-flex align-items-center justify-content-center me-3">
                        <CreditCard size={20} className={orderDetails.paymentMethod === "visa" ? "text-success" : ""} />
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: "15px" }}>الدفع بالفيزا</div>
                        <small className="text-secondary" style={{ fontSize: "12px" }}>ادفع إلكترونياً ببطاقة الائتمان</small>
                      </div>
                    </div>
                    {orderDetails.paymentMethod === "visa" && (
                      <span className="badge rounded-circle p-1 bg-success d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px" }}>
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visa Form Fields - Expandable */}
            {orderDetails.paymentMethod === "visa" && (
              <div className="mt-4 p-4 rounded-3 border bg-light-subtle transition-all card-fields-animation" style={{ borderStyle: "dashed", borderColor: "#00b289" }}>
                <h6 className="fw-bold text-dark mb-3">Card Details</h6>
                
                {/* Cardholder Name */}
                <div className="mb-3">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: "13px" }}>Cardholder Name</label>
                  <input
                    type="text"
                    className={`form-control rounded-3 p-2 bg-white ${formErrors.visa_cardholderName ? "is-invalid" : ""}`}
                    placeholder="e.g. John Doe"
                    style={{ fontSize: "14px" }}
                    value={orderDetails.visaDetails.cardholderName}
                    onChange={(e) => handleVisaChange("cardholderName", e.target.value)}
                  />
                  {formErrors.visa_cardholderName && <div className="invalid-feedback">{formErrors.visa_cardholderName}</div>}
                </div>

                {/* Card Number */}
                <div className="mb-3">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: "13px" }}>Card Number</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className={`form-control rounded-3 p-2 bg-white ${formErrors.visa_cardNumber ? "is-invalid" : ""}`}
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength="19"
                      style={{ fontSize: "14px", paddingRight: "40px" }}
                      value={orderDetails.visaDetails.cardNumber}
                      onChange={(e) => handleVisaChange("cardNumber", formatCardNumber(e.target.value))}
                    />
                    <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-secondary">
                      <CreditCard size={18} />
                    </span>
                  </div>
                  {formErrors.visa_cardNumber && <div className="invalid-feedback">{formErrors.visa_cardNumber}</div>}
                </div>

                <div className="row">
                  {/* Expiry Date */}
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary fw-semibold" style={{ fontSize: "13px" }}>Expiry Date</label>
                      <input
                        type="text"
                        className={`form-control rounded-3 p-2 bg-white ${formErrors.visa_expiryDate ? "is-invalid" : ""}`}
                        placeholder="MM/YY"
                        maxLength="5"
                        style={{ fontSize: "14px" }}
                        value={orderDetails.visaDetails.expiryDate}
                        onChange={(e) => handleVisaChange("expiryDate", formatExpiryDate(e.target.value))}
                      />
                      {formErrors.visa_expiryDate && <div className="invalid-feedback">{formErrors.visa_expiryDate}</div>}
                    </div>
                  </div>

                  {/* CVV */}
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary fw-semibold" style={{ fontSize: "13px" }}>CVV</label>
                      <input
                        type="password"
                        className={`form-control rounded-3 p-2 bg-white ${formErrors.visa_cvv ? "is-invalid" : ""}`}
                        placeholder="***"
                        maxLength="3"
                        style={{ fontSize: "14px" }}
                        value={orderDetails.visaDetails.cvv}
                        onChange={(e) => handleVisaChange("cvv", e.target.value.replace(/[^0-9]/g, ""))}
                      />
                      {formErrors.visa_cvv && <div className="invalid-feedback">{formErrors.visa_cvv}</div>}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center text-muted mt-2" style={{ fontSize: "12px" }}>
                  <ShieldCheck size={16} className="text-success me-2" />
                  <span>معاملاتك محمية وبياناتك آمنة معنا.</span>
                </div>
              </div>
            )}
          </div>

          {/* Pricing breakdown inside form card */}
          <div className="pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
            <div className="d-flex justify-content-between mb-2 text-secondary" style={{ fontSize: "14px" }}>
              <span>Subtotal</span>
              <span className="fw-semibold text-dark">{formatPrice(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-secondary" style={{ fontSize: "14px" }}>
              <span>Delivery</span>
              <span className="fw-semibold text-dark">{formatPrice(deliveryFee)}</span>
            </div>
            
            <hr style={{ borderTop: "1px solid #f1f5f9", margin: "10px 0" }} />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold text-dark" style={{ fontSize: "16px" }}>Total</span>
              <span className="fw-extrabold" style={{ color: "#00b289", fontSize: "20px" }}>
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="submit"
              className="btn text-white w-100 rounded-pill py-3 fw-bold btn-order-hover"
              disabled={isSubmitting}
              style={{
                background: "#00b289",
                border: "none",
                fontSize: "16px",
                boxShadow: "0 4px 12px rgba(0, 178, 137, 0.15)",
                transition: "all 0.2s ease"
              }}
            >
              {isSubmitting ? (
                <div className="spinner-border spinner-border-sm text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Place order"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(8, 6, 13, 0.6)",
            zIndex: 1050,
            backdropFilter: "blur(4px)"
          }}
        >
          <div className="card border-0 rounded-4 p-5 text-center bg-white shadow-lg mx-3" style={{ maxWidth: "450px" }}>
            <div className="text-success mb-4 text-center">
              <CheckCircleFill size={65} className="success-pulse" />
            </div>
            
            <h3 className="fw-bold text-dark mb-2">Order Confirmed!</h3>
            <p className="text-secondary mb-4" style={{ fontSize: "15px" }}>
              Thank you for your order. Your medications are being prepared and will be delivered shortly.
            </p>
            
            <div className="rounded-3 p-3 bg-light text-start mb-4" style={{ fontSize: "14px" }}>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Delivery to:</span>
                <strong className="text-dark truncate-text" style={{ maxWidth: "200px" }}>{orderDetails.address}</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Phone number:</span>
                <strong className="text-dark">{orderDetails.phone}</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Payment Mode:</span>
                <strong className="text-dark">{orderDetails.paymentMethod === "visa" ? "Visa Card" : "Cash on Delivery"}</strong>
              </div>
              <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                <span className="text-secondary fw-semibold">Total Paid:</span>
                <strong className="text-success fw-bold">{formatPrice(total)}</strong>
              </div>
            </div>

            <button
              className="btn text-white rounded-pill w-100 py-2.5 fw-bold"
              style={{
                backgroundColor: "#00b289",
                border: "none"
              }}
              onClick={onOrderPlaced}
            >
              Back to Store
            </button>
          </div>
        </div>
      )}

      {/* Embedded CSS for animations and layout tweaks */}
      <style>{`
        .btn-order-hover:hover {
          background-color: #009e79 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 178, 137, 0.25) !important;
        }
        .card-fields-animation {
          animation: slideDown 0.3s ease-out forwards;
        }
        .success-pulse {
          animation: pulse 1s infinite alternate;
        }
        .truncate-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default ConfirmOrder;
